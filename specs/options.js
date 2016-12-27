const cases = require('./cases');

module.exports = (config) => ({
  name: '这是一个初始化测试',
  urlRoot: `http://127.0.0.1:${config.service.port}`,
  cases,
  hooks: {
  },
  globals: {
    request: {
      timeout: 5 * 1000,
      headers: {
        'X-Real-IP': '199.199.199.199',
      },
    },
  },
});
