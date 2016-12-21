const errors = require('../../lib/errors');
const U = require('../../lib/utils');

/**
 * checker 所有的方法都可能随时会调用next error
 * checker 的思路就是检测，遇到不合法的直接就返回异常
 */

/** 检测当前用户是否为管理员 */
const sysAdmin = (msg) => {
  const error = (msg instanceof Error) ? msg : errors.notFound(msg);
  return (req, res, next) => {
    if (req.isAdmin === true) return next();
    return next(error);
  };
};

/**  检测资源是否属于自己 */
const ownSelf = (keyPath, allowEmpty, msg) => {
  const error = (msg instanceof Error) ? msg : errors.notFound(msg);
  return (req, res, next) => {
    const id = +U._.get(req, keyPath) || 0;
    if (allowEmpty && (id === 0)) return next();
    if (req.user.id === id) return next();
    return next(error);
  };
};

/** 检测私有客户端功能 */
const privateSwitch = (name, msg) => {
  const error = (msg instanceof Error) ? msg : errors.notFound(msg);
  return (req, res, next) => {
    /** 判断是否是私有ip客户端，并且允许私有客户端直接访问 */
    if (req.allowPrivateSwitch(name)) return next();
    return next(error);
  };
};

module.exports = { sysAdmin, ownSelf, privateSwitch };
