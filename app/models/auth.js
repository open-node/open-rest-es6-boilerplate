const U         = require('../lib/utils');
const ModelBase = require('./base');

const Sequelize = U.rest.Sequelize;
const TOKEN_ERROR = Error('Token error.');
const USER_NO_EXISTS = Error('User dont exists.');
const USER_STATUS_ERROR = Error('User had disabled.');
const USER_DELETED_ERROR = Error('User had deleted.');

let readUserByToken = (token, callback) => {
  U.model('auth').findByToken(token).catch(callback).then((auth) => {
    if (!auth) return callback(TOKEN_ERROR);
    U.model('user').findById(auth.creatorId).catch(callback).then((user) => {
      if (!user) return callback(USER_NO_EXISTS);
      if (user.status === 'disabled') return callback(USER_STATUS_ERROR);
      if (user.isDelete === 'yes') return callback(USER_DELETED_ERROR);
      let json = user.toJSON();
      json.auth = auth.toJSON();
      callback(null, json);
    });
  });
};

/** open-cache 是否初始化了 */
if (U.cached.inited) {
  /** 让这个函数具有cache的能力,减少对token和user表的读取 */
  readUserByToken = U.cached("Token::{0}", readUserByToken, 300);
}

module.exports = (sequelize) => {
  const Auth = U._.extend(sequelize.define('auth', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: Sequelize.STRING(32),
      allowNull: false,
      unique: true,
      comment: '存放 token'
    },
    refreshToken: {
      type: Sequelize.STRING(32),
      allowNull: false,
      unique: true,
      comment: 'refreshToken'
    },
    expiredAt: {
      type: Sequelize.DATE,
      allowNull: false,
      comment: '过期时间'
    },
    onlineIp: {
      type: Sequelize.STRING(15),
      allowNull: false,
      comment: '创建者即登陆者IP'
    },
    creatorId: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '创建者，即关联用户'
    }
  }, {
    comment: '登陆授权表',
    freezeTableName: true,
    instanceMethods: {},
    classMethods: {
      findByToken: function(token) {
        /** 常规模式，到 auth 表根据 token 查询 */
        if (!(U.isApiTest && (token.substr(0, 6) === 'MOCK::'))) {
          return this.findOne({
            where: {
              token: token,
              expiredAt: {$gte: new Date}
            }
          });
        }

        /** 用户信息的mock, 方便apitest模式下对各种身份用户的mock */
        return new Promise((reslove, reject) => {
          U.model('user').findById(token.substr(6)).then((user) => {
            if (!user) return reject(USER_NO_EXISTS);
            if (user.status === 'disabled') return reject(USER_NO_EXISTS);
            if (user.isDelete === 'yes') return reject(USER_NO_EXISTS);
            reslove(Auth.generator(user, '127.0.0.1'));
          }).catch(reject);
        });
      },

      /** 让这个函数具有cache的能力,减少对token和user表的读取 */
      readUserByToken: readUserByToken,
      addAuth: function(user, onlineIp, callback) {
        U.callback(Auth.generator(user, onlineIp), callback);
      },

      /** 生成一条新的数据 */
      generator: function(user, onlineIp) {
        return Auth.create({
          token: U.randStr(32),
          refreshToken: U.randStr(32),
          expiredAt: U.moment().add(1, 'days'),
          onlineIp: onlineIp,
          creatorId: user.id
        });
      }
    },

    hooks: {
      afterDestroy: function(auth) {
        /** 清楚cache，这样禁用用户，或者修改密码后可以使得之前的token立即失效 */
        if (Auth.readUserByToken.removeKey) {
          Auth.readUserByToken.removeKey(auth.token, U.noop);
        }
      }
    }
  }), ModelBase, {
    sort: {
      default: 'id',
      allow: ['id', 'name', 'updatedAt', 'createdAt']
    }
  });

  return Auth;
};
