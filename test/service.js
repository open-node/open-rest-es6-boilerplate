const assert      = require('assert');
const specs       = require('../specs/api_spec');

require('../');

describe('apitest', function() {

  describe('#run api test case', function() {

    let stats = {};
    specs(function(s) {
      Object.assign(stats, s);
    });

    it("测试运行完成后的测试用例统计信息", function(done) {
      assert.deepEqual({
        tests: 14,
        assertions: 70,
        failures: 0,
        skipped: 0
      }, stats);

      done();
    });

  });

});
