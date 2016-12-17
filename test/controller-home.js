const assert    = require('assert');
const home      = require('../app/controllers/home');

describe('controllers home', function() {

  describe('#index', function() {

    it('req.username', function(done) {
      let req = {
        user: {
          id: 1,
          username: 'Redstone Zhao'
        },
        _clientIp: '192.168.199.188',
        _realIp: '192.168.199.199',
        _remoteIp: '127.0.0.1',
        privateSwitchs: '*'
      };
      let res = {
        send: function(data) {
          assert.deepEqual([
            'GET /users'
          ], data[1]);
        }
      };
      home.index(req, res, function(error) {
        assert.equal(null, error);

        done();
      });
    });

    it('Guest', function(done) {
      let req = {
        user: {
          id: 0
        },
        _clientIp: '192.168.199.188',
        _realIp: '192.168.199.199',
        _remoteIp: '127.0.0.1',
        privateSwitchs: [
          'users'
        ]
      };
      let res = {
        send: function(data) {
          assert.deepEqual([
            'GET /users'
          ], data[1]);
        }
      };
      home.index(req, res, function(error) {
        assert.equal(null, error);

        done();
      });
    });

  });

});
