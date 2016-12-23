const config = require('./base');

config.service.port = '8099';
config.db.host = '127.0.0.1';
config.db.port = '3306';
config.db.user = 'root';
config.db.pass = 'a1d2m3a4s5t6e7rQ!@$';
config.db.name = 'or_dev';
config.cache.host = '127.0.0.1';
config.cache.port = '6379';
config.cache.opts.namespace = 'ORB';

module.exports = config;
