#! /usr/bin/env node

import U from './app/lib/utils';
import config from './app/configs';

const cache = config.cache || {};

U.cached.init(cache.port, cache.host, cache.opts);


U.rest.utils.logger = U.logger = U.bunyan.createLogger(config.logger);

// open-rest 插件
require('open-rest-helper-getter')(U.rest);
require('open-rest-helper-assert')(U.rest);
require('open-rest-helper-rest')(U.rest);
require('open-rest-helper-params')(U.rest);

U.rest(`${__dirname}/app`, (error, server) => {
  if (error) throw Error;
  console.log('service startedAt: %s', new Date);
});
