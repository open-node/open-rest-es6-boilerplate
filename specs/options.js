var _ = require('lodash');

module.exports = function(config) {
  return {
    name: '这是一个初始化测试',
    urlRoot: "http://127.0.0.1:" + config.service.port,
    cases: require('./cases'),
    hooks: {
      done: function() {
        _.delay(function() {
          console.log("Done at: %s", new Date);
          process.exit();
        }, 100);
      }
    },
    globals: {
      request: {
        timeout: 5 * 1000,
        headers: {
          'X-Real-IP': '199.199.199.199'
        }
      }
    }
  };
};
