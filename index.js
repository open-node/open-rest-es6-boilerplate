#! /usr/bin/env node

const U = require('./app/lib/utils');
const config = require('./app/configs');
const routes = require('./app/routes');

const requireModel = require;
const cache = config.cache || {};
U.cached.init(cache.port, cache.host, cache.opts);

if (U.isProd) {
  U.rest.utils.logger = U.logger = U.bunyan.createLogger(config.logger);
}

// 初始化Model，且将获取Model定义的函数注册到 U 上面
U.model = U.openRestWithMysql(U.rest, `${__dirname}/app/models`, config.db);

const middleWares = requireModel('./app/middle-wares');
const controllers = U.getModules(`${__dirname}/app/controllers`, 'js');
const service = config.service;

const server = U.rest({ routes, controllers, middleWares, service });
server.listen(service.port, service.ip, (error) => {
  if (error) throw Error;
  U.logger.info('service startedAt: %s', new Date());
});
