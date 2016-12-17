const assert    = require('assert');
const U         = require('../app/lib/utils');
const middle    = require('../app/middle-wares/user');

describe('middle user', function() {

  describe('#noraml', function() {

    it('req.privateSwitchs undefined', function(done) {
      let req = {
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

      let res = {};

      let allowGuestAccessPaths = [
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
      let req = {
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

      let res = {};

      let allowGuestAccessPaths = [
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
