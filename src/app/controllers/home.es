import U from '../lib/utils';
import config from '../configs';

const sayHi = (name, service, ip, now) => {
  "Hello #{name}, This is #{service}, Your ip: #{ip}, Now: #{now}."
};

const service = config.service.name;

export const index = (req, res, next) => {
  var userName = req.user.name || req.user.username || 'guest';
  var ip = [
    req._clientIp,
    req._realIp,
    req._remoteIp
  ].join(' - ');
  var hi = sayHi(userName, service, ip, new Date);
  var switchs = req.privateSwitchs;
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
