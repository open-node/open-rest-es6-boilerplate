import config  from './base';

/** web service 的一些信息,主要提供给 restify.createServer 使用 */
config.service.port = 9038

/** 单独设置数据库 */
config.db.name = process.env.TESTDB || 'openrest_apitest';
config.db.port = 3306;
config.db.logging = false;

export default config;
