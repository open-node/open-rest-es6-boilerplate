var assert  = require('assert')
  , checker = require('../build/app/controllers/helper/checker');

describe('helper.checker', function() {

  describe('#sysAdmin', function() {

    it("未指定错误", function(done) {
      var req = {
        isAdmin: false
      };
      var res = {};
      var check = checker.sysAdmin();
      check(req, res, function(error) {
        assert.ok(error instanceof Error);
        assert.equal('Resource not found.', error.message);
        assert.equal(404, error.statusCode);
        assert.deepEqual({
          code: 'ResourceNotFound',
          message: 'Resource not found.'
        }, error.body);
        assert.equal('ResourceNotFound', error.restCode);
      });

      req.isAdmin = true;
      check(req, res, function(error) {
        assert.equal(null, error);
      });

      done();

    });

    it("指定错误", function(done) {
      var req = {
        isAdmin: false
      };
      var res = {};
      var err = Error('您不是管理员，不能执行该操作');
      var check = checker.sysAdmin(err);
      check(req, res, function(error) {
        assert.equal(err, error);
      });

      req.isAdmin = true;
      check(req, res, function(error) {
        assert.equal(null, error);
      });

      done();

    });

  });

  describe('#ownSelf', function() {

    it("未指定错误, allowEmpty = false", function(done) {
      var req = {
        params: {
          userId: '88'
        },
        user: {id: 78}
      };
      var res = {};
      var ownSelf = checker.ownSelf('params.userId', false);
      ownSelf(req, res, function(error) {
        assert.ok(error instanceof Error);
        assert.equal('Resource not found.', error.message);
        assert.equal(404, error.statusCode);
        assert.deepEqual({
          code: 'ResourceNotFound',
          message: 'Resource not found.'
        }, error.body);
        assert.equal('ResourceNotFound', error.restCode);
      });

      req.params.userId = '78';
      ownSelf(req, res, function(error) {
        assert.equal(null, error);
      });

      done();

    });

    it("指定错误, allowEmpty = true", function(done) {
      var req = {
        params: {
          userId: 88
        },
        user: {id: 78}
      };
      var res = {};
      var err = Error('不是您的资源，不能执行该操作');
      var ownSelf = checker.ownSelf('params.userId', true, err);
      ownSelf(req, res, function(error) {
        assert.equal(err, error);
      });

      req.params.userId = 78;
      ownSelf(req, res, function(error) {
        assert.equal(null, error);
      });

      req.params.userId = '';
      ownSelf(req, res, function(error) {
        assert.equal(null, error);
      });

      done();
    });

  });

  describe('#privateSwitch', function() {

    it("未指定错误", function(done) {
      var req = {
        allowPrivateSwitch: function() { return false; }
      };
      var res = {};
      var privateSwitch = checker.privateSwitch('users');
      privateSwitch(req, res, function(error) {
        assert.ok(error instanceof Error);
        assert.equal('Resource not found.', error.message);
        assert.equal(404, error.statusCode);
        assert.deepEqual({
          code: 'ResourceNotFound',
          message: 'Resource not found.'
        }, error.body);
        assert.equal('ResourceNotFound', error.restCode);
      });

      req.allowPrivateSwitch = function() { return true; };
      privateSwitch(req, res, function(error) {
        assert.equal(null, error);
      });

      done();

    });

    it("指定错误", function(done) {
      var req = {
        allowPrivateSwitch: function() { return false; }
      };
      var res = {};
      var err = Error('您没有得到私有客户端授权，不能执行该操作');
      var privateSwitch = checker.privateSwitch('users', err);
      privateSwitch(req, res, function(error) {
        assert.equal(err, error);
      });

      req.allowPrivateSwitch = function() { return true; };
      privateSwitch(req, res, function(error) {
        assert.equal(null, error);
      });

      done();

    });

  });

});
