#! /usr/bin/env node

const U = require('./app/lib/utils');
const config = require('./app/configs');
const getter = require('open-rest-helper-getter');
const assert = require('open-rest-helper-assert');
const rest = require('open-rest-helper-rest');
const params = require('open-rest-helper-params');

const cache = config.cache || {};
U.cached.init(cache.port, cache.host, cache.opts);

if (U.isProd) U.rest.utils.logger = U.logger = U.bunyan.createLogger(config.logger);

U.rest
 .plugin(U.openRestWithMysql)
 .plugin(getter, assert, rest, params)
 .plugin(() => {
   U.model = U.rest.utils.model;
 })
 .start(`${__dirname}/app`, (error) => {
   if (error) {
     U.logger.error(error);
     process.exit();
   }
   U.logger.info(`Service started at: ${new Date()}`);
 });
