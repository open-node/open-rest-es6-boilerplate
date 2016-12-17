import U          from '../lib/utils';

const PRIVATEIPGUEST = {
  id: 0,
  name: "Private client"
};

const GUEST = {
  id: 0,
  name: 'Guest'
};

const NOTAUTHORIZEDERROR = U.rest.errors.notAuth();

export default (allowGuestAccessPaths) => {
  const Auth = U.model('auth');
  const checkGuestAccess = U._.memoize((apiPath) => {
    return allowGuestAccessPaths.indexOf(apiPath) > -1;
  });

  return (req, res, next) => {
    var token = U.getToken(req);
    if (!token) {
      /** 游客允许访问处理逻辑 */
      if (checkGuestAccess(`${req.method} ${req.route.path}`)) {
        req.user = GUEST;
        return next();
      }

      /** 私有IP客户端处理逻辑 */
      if (!req.privateSwitchs) return next(NOTAUTHORIZEDERROR);
      req.user = PRIVATEIPGUEST;
      return next();
    }

    Auth.readUserByToken(token, (error, user) => {
      if (error) return next(U.rest.errors.notAuth(error.message));
      req.user = user;
      /** 这个是必须的，open-rest 会有判断这个的逻辑 */
      req.isAdmin = user.role === 'admin';
      next();
    });
  };
};
