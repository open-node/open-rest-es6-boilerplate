const assert = require('assert');
const middle = require('../app/middle-wares/private-client-check');

describe('middle private-cient-check', () => {
  describe('#noraml', () => {
    it('token exists', (done) => {
      const req = {
        headers: {
          'x-auth-token': 'Test token',
        },
        connection: {
          remoteAddress: '192.168.199.188',
        },
        params: {},
      };

      const res = {};

      const proxyIps = [
        '127.0.0.1',
      ];

      const privateIps = {
        '192.168.199.188': ['users'],
      };

      middle(proxyIps, privateIps)(req, res, (error) => {
        assert.equal(null, error);
        assert.equal(false, req.allowPrivateSwitch('users'));

        done();
      });
    });

    it('token non-exists', (done) => {
      const req = {
        headers: {},
        connection: {
          remoteAddress: '192.168.199.188',
        },
        params: {},
      };

      const res = {};

      const proxyIps = [
        '127.0.0.1',
      ];

      const privateIps = {
        '192.168.199.188': ['users'],
      };

      middle(proxyIps, privateIps)(req, res, (error) => {
        assert.equal(null, error);
        assert.equal(true, req.allowPrivateSwitch('users'));
        assert.equal(false, req.allowPrivateSwitch('user'));

        done();
      });
    });

    it('token non-exists, switchs unset', (done) => {
      const req = {
        headers: {},
        connection: {
          remoteAddress: '192.168.199.188',
        },
        params: {},
      };

      const res = {};

      const proxyIps = [
        '127.0.0.1',
      ];

      const privateIps = {
        '192.168.199.188': undefined,
      };

      middle(proxyIps, privateIps)(req, res, (error) => {
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

    it('token non-exists, switchs *', (done) => {
      const req = {
        headers: {},
        connection: {
          remoteAddress: '192.168.199.188',
        },
        params: {},
      };

      const res = {};

      const proxyIps = [
        '127.0.0.1',
      ];

      const privateIps = {
        '192.168.199.188': '*',
      };

      middle(proxyIps, privateIps)(req, res, (error) => {
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
