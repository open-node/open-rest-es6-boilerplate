const _ = require('lodash');

module.exports = _.flatten([
  require('./home'),

  // 用户认证、登陆相关所有接口
  require('./session'),

  // 用户相关接口测试用例
  require('./user')

]);
