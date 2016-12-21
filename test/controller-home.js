const assert = require('assert');
const home = require('../app/controllers/home');

describe('controllers home', () => {
  describe('#index', () => {
    it('req.username', (done) => {
      const req = {
        user: {
          id: 1,
          username: 'Redstone Zhao',
        },
        _clientIp: '192.168.199.188',
        _realIp: '192.168.199.199',
        _remoteIp: '127.0.0.1',
        privateSwitchs: '*',
      };
      const res = {
        send: (data) => {
          assert.deepEqual([
            'GET /users',
          ], data[1]);
        },
      };
      home.index(req, res, (error) => {
        assert.equal(null, error);

        done();
      });
    });

    it('Guest', (done) => {
      const req = {
        user: {
          id: 0,
        },
        _clientIp: '192.168.199.188',
        _realIp: '192.168.199.199',
        _remoteIp: '127.0.0.1',
        privateSwitchs: [
          'users',
        ],
      };
      const res = {
        send: (data) => {
          assert.deepEqual([
            'GET /users',
          ], data[1]);
        },
      };
      home.index(req, res, (error) => {
        assert.equal(null, error);

        done();
      });
    });
  });
});
