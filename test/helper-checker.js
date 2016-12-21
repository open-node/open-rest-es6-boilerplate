const assert = require('assert');
const checker = require('../app/controllers/helper/checker');

describe('helper.checker', () => {
  describe('#sysAdmin', () => {
    it('未指定错误', (done) => {
      const req = {
        isAdmin: false,
      };
      const res = {};
      const check = checker.sysAdmin();
      check(req, res, (error) => {
        assert.ok(error instanceof Error);
        assert.equal('Resource not found.', error.message);
        assert.equal(404, error.statusCode);
        assert.deepEqual({
          code: 'ResourceNotFound',
          message: 'Resource not found.',
        }, error.body);
        assert.equal('ResourceNotFound', error.restCode);
      });

      req.isAdmin = true;
      check(req, res, (error) => {
        assert.equal(null, error);
      });

      done();
    });

    it('指定错误', (done) => {
      const req = {
        isAdmin: false,
      };
      const res = {};
      const err = Error('您不是管理员，不能执行该操作');
      const check = checker.sysAdmin(err);
      check(req, res, (error) => {
        assert.equal(err, error);
      });

      req.isAdmin = true;
      check(req, res, (error) => {
        assert.equal(null, error);
      });

      done();
    });
  });

  describe('#ownSelf', () => {
    it('未指定错误, allowEmpty = false', (done) => {
      const req = {
        params: {
          userId: '88',
        },
        user: { id: 78 },
      };
      const res = {};
      const ownSelf = checker.ownSelf('params.userId', false);
      ownSelf(req, res, (error) => {
        assert.ok(error instanceof Error);
        assert.equal('Resource not found.', error.message);
        assert.equal(404, error.statusCode);
        assert.deepEqual({
          code: 'ResourceNotFound',
          message: 'Resource not found.',
        }, error.body);
        assert.equal('ResourceNotFound', error.restCode);
      });

      req.params.userId = '78';
      ownSelf(req, res, (error) => {
        assert.equal(null, error);
      });

      done();
    });

    it('指定错误, allowEmpty = true', (done) => {
      const req = {
        params: {
          userId: 88,
        },
        user: { id: 78 },
      };
      const res = {};
      const err = Error('不是您的资源，不能执行该操作');
      const ownSelf = checker.ownSelf('params.userId', true, err);
      ownSelf(req, res, (error) => {
        assert.equal(err, error);
      });

      req.params.userId = 78;
      ownSelf(req, res, (error) => {
        assert.equal(null, error);
      });

      req.params.userId = '';
      ownSelf(req, res, (error) => {
        assert.equal(null, error);
      });

      done();
    });
  });

  describe('#privateSwitch', () => {
    it('未指定错误', (done) => {
      const req = {
        allowPrivateSwitch() { return false; },
      };
      const res = {};
      const privateSwitch = checker.privateSwitch('users');
      privateSwitch(req, res, (error) => {
        assert.ok(error instanceof Error);
        assert.equal('Resource not found.', error.message);
        assert.equal(404, error.statusCode);
        assert.deepEqual({
          code: 'ResourceNotFound',
          message: 'Resource not found.',
        }, error.body);
        assert.equal('ResourceNotFound', error.restCode);
      });

      req.allowPrivateSwitch = () => true;
      privateSwitch(req, res, (error) => {
        assert.equal(null, error);
      });

      done();
    });

    it('指定错误', (done) => {
      const req = {
        allowPrivateSwitch() { return false; },
      };
      const res = {};
      const err = Error('您没有得到私有客户端授权，不能执行该操作');
      const privateSwitch = checker.privateSwitch('users', err);
      privateSwitch(req, res, (error) => {
        assert.equal(err, error);
      });

      req.allowPrivateSwitch = () => true;
      privateSwitch(req, res, (error) => {
        assert.equal(null, error);
      });

      done();
    });
  });
});
