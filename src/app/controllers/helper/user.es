import errors from '../../lib/errors';
import U      from '../../lib/utils';
import config from '../../configs';

const User = U.model('user');
const Auth = U.model('auth');

/** 读取session */
export const session = (statusCode = 200) => {
  return (req, res, next) => {
    res.send(statusCode, req.user)
    next();
  };
};

/** 退出 */
export const logout = () => {
  return (req, res, next) => {
    const token = U.getToken(req);
    const done = () => {
      res.send(204);
      if (Auth.readUserByToken.removeKey) {
        Auth.readUserByToken.removeKey(token, U.noop);
      }
      next();
    };

    Auth.findOne({where: {token}}).then((auth) => {
      /** 如果 auth 不存在则之简单的del cache */
      if (!auth) return done();
      auth.destroy().then(done).catch(next);
    }).catch(next);
  };
};

/** 登陆 */
export const login = () => {
  return (req, res, next) => {
    const {email, password} = req.params;
    /**
     * 这里将 req 全部给进去，他会自由的判断
     * req._remoteIp 是必须的，要根据ip来控频，放置暴力密码
     * 这里返回的 user 是去掉 salt, password 的纯数据，而非 User 的实例
     */
    User.checkPass(req, email, password, (error, user) => {
      if (error) return next(errors.notAuth(error.message));
      Auth.addAuth(user, req._realIp, (error, auth) => {
        if (error) return next(error);
        U.model('auth').readUserByToken(auth.token, (error, user) => {
          if(error) return next(U.rest.errors.notAuth(error.message));
          req.user = user;
          next();
        });
      });
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
export const checkPass = (cols, ignoreAdmin, modifyUser) => {
  return (req, res, next) => {
    var user = req.user;
    const { origPass } = req.params;
    if (!user) return next(errors.notFound());
    if (ignoreAdmin && (req.isAdmin === true)) {
      if (!(modifyUser && (req.user.id === +req.params.id))) {
        return next();
      }
    }
    /** 判断如果没有必要的字段修改则不进行验证 */
    var dangers = U._.filter(cols, (x) => req.params.hasOwnProperty(x))
    if (!dangers.length) return next();
    if (!origPass) return next(errors.notAuth());
    User.checkPass(req, user.email, origPass, (error) => {
      if (!error) return next();
      next(errors.notAuth(error.message));
    });
  };
};

/** 查找用户或者创建用户 */
export const findOrCreate = (hook) => {
  const emailMissing = errors.missingParameter('Email 必须指定', ['email']);
  return (req, res, next) => {
    const { email, name } = req.params;
    if (req.hooks[hook]) return next();
    if (!email) return next(emailMissing);
    User.findOne({ where: { email } }).then((user) => {
      if (user) {
        req.params.userId = user.id;
        req.hooks[hook] = user;
        res.header("X-Content-System-User", 'exists');
        return next();
      }
      if (!name) req.params.name = email.split('@')[0];
      U.rest.helper.rest.beforeAdd(User, null, hook)(req, res, (error) => {
        if (error) return next(error);
        req.params.userId = req.hooks[hook].id;
        res.header("X-Content-System-User", 'added');
        next();
      });
    }).catch(next);
  };
};
