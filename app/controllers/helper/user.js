const errors = require('../../lib/errors');
const U = require('../../lib/utils');

/** 读取session */
const session = (statusCode = 200) => (
  (req, res, next) => {
    res.send(statusCode, req.user);
    next();
  }
);

/** 退出 */
const logout = () => {
  const Auth = U.model('auth');

  return (req, res, next) => {
    const token = U.getToken(req);
    const done = () => {
      res.send(204);
      if (Auth.readUserByToken.removeKey) {
        Auth.readUserByToken.removeKey(token, U.noop);
      }
      next();
    };

    Auth.findOne({ where: { token } }).then((auth) => {
      /** 如果 auth 不存在则之简单的del cache */
      if (!auth) return done();
      return auth.destroy().then(done).catch(next);
    }).catch(next);
  };
};

/** 登陆 */
const login = () => {
  const User = U.model('user');
  const Auth = U.model('auth');

  return (req, res, next) => {
    const { email, password } = req.params;
    /**
     * 这里将 req 全部给进去，他会自由的判断
     * req._remoteIp 是必须的，要根据ip来控频，放置暴力密码
     * 这里返回的 user 是去掉 salt, password 的纯数据，而非 User 的实例
     */
    U.async.waterfall([
      (callback) => User.checkPass(req, email, password, callback),
      (user, callback) => Auth.addAuth(user, req._realIp, callback),
      (auth, callback) => Auth.readUserByToken(auth.token, callback),
    ], (error, user) => {
      if (error) return next(errors.notAuth(error.message));
      req.user = user;
      return next();
    });
  };
};

/**
 * 密码验证
 * 这个helper的目的是在用户修改自身信息的时候校验原密码
 * 这样能更安全
 * params
 *   cols: Array 要修改的列 e.g ['password', 'email'] 代表在修改 密码或者Email的时候要验证
 *   ignoreAdmin: Boolean 当用户是管理员是否要忽略,
 *   modifyUser: Boolean 是否是修改用户信息 此时仅当管理员要修改别人的信息才生效，修改自己的信息，任何人都要验证
 */
const checkPass = (cols, ignoreAdmin, modifyUser) => {
  const User = U.model('user');

  return (req, res, next) => {
    const user = req.user;
    const { origPass } = req.params;
    if (!user) return next(errors.notFound());
    if (ignoreAdmin && (req.isAdmin === true)) {
      if (!(modifyUser && (req.user.id === +req.params.id))) {
        return next();
      }
    }
    /** 判断如果没有必要的字段修改则不进行验证 */
    const dangers = U._.filter(cols, (x) => U.hasOwnProperty.call(req.params, x));
    if (!dangers.length) return next();
    if (!origPass) return next(errors.notAuth());
    return User.checkPass(req, user.email, origPass, (error) => {
      if (!error) return next();
      return next(errors.notAuth(error.message));
    });
  };
};

/** 查找用户或者创建用户 */
const findOrCreate = (hook) => {
  const User = U.model('user');
  const emailMissing = errors.missingParameter('Email 必须指定', ['email']);
  const beforeAdd = U.rest.helper.rest.beforeAdd(User, null, hook);

  return (req, res, next) => {
    const { email, name } = req.params;
    if (req.hooks[hook]) return next();
    if (!email) return next(emailMissing);
    return User.findOne({ where: { email } }).then((user) => {
      if (user) {
        req.params.userId = user.id;
        req.hooks[hook] = user;
        res.header('X-Content-System-User', 'exists');
        return next();
      }
      if (!name) req.params.name = email.split('@')[0];
      return beforeAdd(req, res, (error) => {
        if (error) return next(error);
        req.params.userId = req.hooks[hook].id;
        res.header('X-Content-System-User', 'added');
        return next();
      });
    }).catch(next);
  };
};

module.exports = { session, login, logout, checkPass, findOrCreate };
