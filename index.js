#! /usr/bin/env node

const U = require('./app/lib/utils');
const config = require('./app/configs');

const cache = config.cache || {};
U.cached.init(cache.port, cache.host, cache.opts);

if (U.isProd) {
  U.rest.utils.logger = U.logger = U.bunyan.createLogger(config.logger);
}

// open-rest 插件
require('open-rest-helper-getter')(U.rest);
require('open-rest-helper-assert')(U.rest);
require('open-rest-helper-rest')(U.rest);
require('open-rest-helper-params')(U.rest);

U.rest(`${__dirname}/app`, (error) => {
  if (error) throw Error;
  console.log('service startedAt: %s', new Date());
});
