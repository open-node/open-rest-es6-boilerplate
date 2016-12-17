const assert    = require('assert');
const middle    = require('../app/middle-wares/private-client-check');

describe('middle private-cient-check', function() {

  describe('#noraml', function() {

    it('token exists', function(done) {
      let req = {
        headers: {
          'x-auth-token': 'Test token'
        },
        connection: {
          remoteAddress: '192.168.199.188'
        },
        params: {}
      };

      let res = {};

      let proxyIps = [
        '127.0.0.1'
      ];

      let privateIps = {
        '192.168.199.188': ['users']
      };

      middle(proxyIps, privateIps)(req, res, function(error) {
        assert.equal(null, error);
        assert.equal(false, req.allowPrivateSwitch('users'));

        done();
      });

    });

    it('token non-exists', function(done) {
      let req = {
        headers: {},
        connection: {
          remoteAddress: '192.168.199.188'
        },
        params: {}
      };

      let res = {};

      let proxyIps = [
        '127.0.0.1'
      ];

      let privateIps = {
        '192.168.199.188': ['users']
      };

      middle(proxyIps, privateIps)(req, res, function(error) {
        assert.equal(null, error);
        assert.equal(true, req.allowPrivateSwitch('users'));
        assert.equal(false, req.allowPrivateSwitch('user'));

        done();
      });

    });

    it('token non-exists, switchs unset', function(done) {
      let req = {
        headers: {},
        connection: {
          remoteAddress: '192.168.199.188'
        },
        params: {}
      };

      let res = {};

      let proxyIps = [
        '127.0.0.1'
      ];

      let privateIps = {
        '192.168.199.188': undefined
      };

      middle(proxyIps, privateIps)(req, res, function(error) {
        assert.equal(null, error);
        assert.equal(false, req.allowPrivateSwitch('users'));
        assert.equal(false, req.allowPrivateSwitch('user'));
        assert.equal(false, req.allowPrivateSwitch(''));
        assert.equal(false, req.allowPrivateSwitch(0));
        assert.equal(false, req.allowPrivateSwitch(undefined));
        assert.equal(false, req.allowPrivateSwitch(null));

        done();
      });
    });

    it('token non-exists, switchs *', function(done) {
      let req = {
        headers: {},
        connection: {
          remoteAddress: '192.168.199.188'
        },
        params: {}
      };

      let res = {};

      let proxyIps = [
        '127.0.0.1'
      ];

      let privateIps = {
        '192.168.199.188': '*'
      };

      middle(proxyIps, privateIps)(req, res, function(error) {
        assert.equal(null, error);
        assert.equal(true, req.allowPrivateSwitch('users'));
        assert.equal(true, req.allowPrivateSwitch('user'));
        assert.equal(false, req.allowPrivateSwitch(''));
        assert.equal(false, req.allowPrivateSwitch(0));
        assert.equal(false, req.allowPrivateSwitch(undefined));
        assert.equal(false, req.allowPrivateSwitch(null));

        done();
      });

    });

  });

});
