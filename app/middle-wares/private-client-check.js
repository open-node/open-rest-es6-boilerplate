const U = require('../lib/utils');

/** 直接拒绝 */
const noAllow = () => false;

/** 根据开关判断 */
const checker = (switchs) => (
  (name) => {
    if (!switchs) return false;
    if (!name) return false;
    /** 星号通配所有允许的接口 */
    if (switchs === '*') return true;
    return switchs.indexOf(name) > -1;
  }
);

module.exports = (proxyIps, privateIps) => (
  (req, res, next) => {
    req._remoteIp = U.remoteIp(req);
    req._clientIp = U.clientIp(req);
    req._realIp = U.realIp(req, proxyIps);
    if (U.getToken(req)) {
      req.allowPrivateSwitch = noAllow;
    } else {
      req.privateSwitchs = privateIps[req._realIp];
      req.allowPrivateSwitch = checker(req.privateSwitchs);
    }
    next();
  }
);
