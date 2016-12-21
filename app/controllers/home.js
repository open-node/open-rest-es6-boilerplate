const U = require('../lib/utils');
const config = require('../configs');

const sayHi = (name, service, ip, now) => (
  `Hello ${name}, This is ${service}, Your ip: ${ip}, Now: ${now}.`
);

const service = config.service.name;

const index = (req, res, next) => {
  const userName = req.user.name || req.user.username || 'guest';
  const ip = [
    req._clientIp,
    req._realIp,
    req._remoteIp,
  ].join(' - ');
  const hi = sayHi(userName, service, ip, new Date());
  const switchs = req.privateSwitchs;
  if (switchs) {
    const apis = U._.chain(config.privateSwitchs)
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

module.exports = { index };
