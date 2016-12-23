const errors = require('../lib/errors');
const U = require('../lib/utils');

const PRIVATEIPGUEST = Object.freeze({
  id: 0,
  name: 'Private client',
});

const GUEST = Object.freeze({
  id: 0,
  name: 'Guest',
});

const NOTAUTHORIZEDERROR = U.rest.errors.notAuth();

module.exports = (guestAllowPaths) => {
  const Auth = U.model('auth');
  const checkGuest = U._.memoize(apiPath => guestAllowPaths.has(apiPath));

  return (req, res, next) => {
    const token = U.getToken(req);
    if (!token) {
      /** 游客允许访问处理逻辑 */
      if (checkGuest(`${req.method} ${req.route.path}`)) {
        req.user = GUEST;
        return next();
      }

      /** 私有IP客户端处理逻辑 */
      if (!req.privateSwitchs) return next(NOTAUTHORIZEDERROR);
      req.user = PRIVATEIPGUEST;
      return next();
    }

    return Auth.readUserByToken(token, (error, user) => {
      if (error) return next(errors.notAuth(error.message));
      req.user = user;
      /** 这个是必须的，open-rest 会有判断这个的逻辑 */
      req.isAdmin = user.role === 'admin';
      return next();
    });
  };
};
