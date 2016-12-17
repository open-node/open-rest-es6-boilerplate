const U       = require('../lib/utils');
const config  = require('../configs');

const sayHi = (name, service, ip, now) => {
  return "Hello " + name + ", This is " + service + ", Your ip: " + ip + ", Now: " + now + ".";
};

const service = config.service.name;

const index = (req, res, next) => {
  let userName = req.user.name || req.user.username || 'guest';
  let ip = [
    req._clientIp,
    req._realIp,
    req._remoteIp
  ].join(' - ');
  let hi = sayHi(userName, service, ip, new Date);
  let switchs = req.privateSwitchs;
  if (switchs) {
    let apis = U._.chain(config.privateSwitchs)
      .filter((x, k) => ((switchs === '*') || (switchs.indexOf(k) > -1)) && x)
      .compact()
      .flatten()
      .value();
    res.send([hi, apis]);
  } else {
    res.send([hi]);
  }
  next();
};

module.exports = {index};
