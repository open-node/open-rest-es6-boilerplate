var assert    = require('assert')
  , rest      = require('open-rest')
  , U         = require('../build/app/lib/utils').default
  , middle    = require('../build/app/middle-wares/user').default;

describe('middle user', function() {

  describe('#noraml', function() {

    it('req.privateSwitchs undefined', function(done) {
      var req = {
        headers: {
          'x-auth-token': undefined
        },
        connection: {
          remoteAddress: '192.168.199.188'
        },
        privateSwitchs: undefined,
        params: {},
        method: 'GET',
        route: {
          path: '/users/:id'
        }
      };

      var res = {};

      var allowGuestAccessPaths = [
        'GET /users'
      ];

      middle(allowGuestAccessPaths)(req, res, function(error) {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.deepEqual({
          message: 'Not authorized error.',
          statusCode: 403,
          restCode: 'NotAuthorized',
          body: {
            code: 'NotAuthorized',
            message: 'Not authorized error.'
          }
        }, U._.pick(error, ['message', 'statusCode', 'body', 'restCode']));

        done();
      });

    });

    it('req.privateSwitchs defined', function(done) {
      var req = {
        headers: {
          'x-auth-token': undefined
        },
        connection: {
          remoteAddress: '192.168.199.188'
        },
        privateSwitchs: ['users'],
        params: {},
        method: 'GET',
        route: {
          path: '/users/:id'
        }
      };

      var res = {};

      var allowGuestAccessPaths = [
        'GET /users'
      ];

      middle(allowGuestAccessPaths)(req, res, function(error) {
        assert.equal(null, error);
        assert.deepEqual({
          id: 0,
          name: 'Private client'
        }, req.user);

        done();
      });

    });

  });

});


