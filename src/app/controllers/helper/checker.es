import errors from '../../lib/errors';
import U      from '../../lib/utils';

/**
 * checker 所有的方法都可能随时会调用next error
 * checker 的思路就是检测，遇到不合法的直接就返回异常
 */

/** 检测当前用户是否为管理员 */
export const sysAdmin = (error) => {
  if (!error instanceof Error) error = errors.notFound(error);
  return (req, res, next) => {
    if (req.isAdmin === true) return next();
    return next(error);
  };
};

/**  检测资源是否属于自己 */
export const ownSelf = (_id = 'id', obj, allowEmpty, error) => {
  if (!error instanceof Error) error = errors.notFound(error);
  return (req, res, next) => {
    let id = U.getId(req, _id, obj)
    if (allowEmpty && (id === '')) return next();
    if (req.user.id === id) return next();
    return next(error);
  };
};

/** 检测私有客户端功能 */
export const privateSwitch = (privateSwitch, error) => {
  if (!error instanceof Error) error = errors.notFound(error);
  return (req, res, next) => {
    /** 判断是否是私有ip客户端，并且允许私有客户端直接访问 */
    if (req.allowPrivateSwitch(privateSwitch)) return next();
    return next(error);
  };
};
