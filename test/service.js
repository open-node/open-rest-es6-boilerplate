const assert = require('assert');
const specs = require('../specs/api_spec');

require('../');

describe('apitest', () => {
  describe('#run api test case', () => {
    const stats = {};
    specs((s) => Object.assign(stats, s));

    it('测试运行完成后的测试用例统计信息', (done) => {
      assert.deepEqual({
        tests: 17,
        assertions: 79,
        failures: 0,
        skipped: 0,
      }, stats);

      done();
    });
  });
});
