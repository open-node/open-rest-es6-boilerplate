const assert = require('assert');
const U = require('../app/lib/utils');
const openRestWithMysql = require('open-rest-with-mysql');
const user = require('../app/controllers/helper/user');
const getter = require('open-rest-helper-getter');
const rest = require('open-rest-helper-rest');
const params = require('open-rest-helper-params');

U.model = openRestWithMysql(U.rest);
getter(U.rest);
rest(U.rest);
params(U.rest);

const Sequelize = openRestWithMysql.Sequelize;

const sequelize = new Sequelize();

const checkPassSuccess = (u) => (
  (req, email, password, callback) => {
    setTimeout(() => {
      callback(null, u);
    }, 10);
  }
);

const checkPassError = (message) => (
  (req, email, password, callback) => {
    setTimeout(() => {
      callback(Error(message));
    }, 10);
  }
);

const addAuthError = (message) => (
  (u, realIp, callback) => {
    setTimeout(() => {
      callback(Error(message));
    }, 10);
  }
);

const addAuthSuccess = (auth) => (
  (u, realIp, callback) => {
    setTimeout(() => {
      callback(null, auth);
    }, 10);
  }
);

const readUserByTokenError = (message) => (
  (token, callback) => {
    setTimeout(() => {
      callback(Error(message));
    }, 10);
  }
);

const findOnePromiseError = (message) => (
  () => (
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(Error(message));
      }, 10);
    })
  )
);

const findOnePromiseSuccess = (u) => (
  () => (
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(u);
      }, 10);
    })
  )
);

const models = {
  auth: sequelize.define('book', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
  }),
  user: sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
  }),
};

models.auth.readUserByToken = {
  removeKey: false,
};

models.auth.findOne = () => new Promise((resolve) => setTimeout(resolve, 10));

describe('helper.user', () => {
  describe('#logout', () => {
    it('Auth.readUserByToken.removeKey non-exists', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];

      const req = {
        headers: {
          'X-Auth-Token': 'THIS IS A TEST TOKEN',
        },
        params: {},
      };
      const res = {
        send: (statusCode) => {
          assert.equal(204, statusCode);
        },
      };

      const logout = user.logout();

      logout(req, res, (error) => {
        assert.equal(null, error);

        U.model = uModel;
        done();
      });
    });
  });

  describe('#login', () => {
    it('User.checkPass error', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];

      models.user.checkPass = checkPassError('Hello, error');

      const req = { params: {} };
      const res = {};
      const login = user.login();

      login(req, res, (error) => {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Hello, error', error.message);
        assert.equal(403, error.statusCode);
        assert.deepEqual({
          code: 'NotAuthorized',
          message: 'Hello, error',
        }, error.body);
        assert.equal('NotAuthorized', error.restCode);

        U.model = uModel;
        done();
      });
    });

    it('Auth.addAuth error', (done) => {
      const uModel = U.model;
      const _user = {
        id: 1,
        name: 'Redstone Zhao',
      };
      U.model = (name) => models[name];

      models.user.checkPass = checkPassSuccess(_user);
      models.auth.addAuth = addAuthError('Hello, add auth error');

      const req = { params: {} };
      const res = {};
      const login = user.login();

      login(req, res, (error) => {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Hello, add auth error', error.message);

        U.model = uModel;
        done();
      });
    });

    it('Auth.readUserByToken error', (done) => {
      const uModel = U.model;
      const _user = {
        id: 1,
        name: 'Redstone Zhao',
      };
      const _auth = {};
      U.model = (name) => models[name];

      models.user.checkPass = checkPassSuccess(_user);
      models.auth.addAuth = addAuthSuccess(_auth);
      models.auth.readUserByToken = readUserByTokenError('Hi, read user by token error');

      const req = { params: {} };
      const res = {};
      const login = user.login();

      login(req, res, (error) => {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Hi, read user by token error', error.message);

        U.model = uModel;
        done();
      });
    });
  });

  describe('#checkPass', () => {
    it('req.user undefined', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];

      const req = { params: {} };
      const res = {};
      const checkPass = user.checkPass(['email', 'password'], false, true);

      checkPass(req, res, (error) => {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Resource not found.', error.message);
        assert.equal(404, error.statusCode);

        U.model = uModel;
        done();
      });
    });

    it('req.user undefined, ignoreAdmin = true, modifyUser = true', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];

      const req = {
        params: {
          id: '998',
        },
        isAdmin: true,
        user: {
          id: 999,
        },
      };
      const res = {};
      const checkPass = user.checkPass(['email', 'password'], true, true);
      checkPass(req, res, (error) => {
        assert.equal(null, error);

        U.model = uModel;
        done();
      });
    });

    it('req.user undefined, ignoreAdmin = true, modifyUser = true, ownSelf', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];

      const req = {
        params: {
          id: '999',
        },
        isAdmin: true,
        user: {
          id: 1000,
        },
      };
      const res = {};

      const checkPass = user.checkPass(['email', 'password'], true, true);

      checkPass(req, res, (error) => {
        assert.equal(null, error);

        U.model = uModel;
        done();
      });
    });

    it('req.user undefined, ignoreAdmin = false, modifyUser = true, ownSelf', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];

      const req = {
        params: {
          id: '999',
        },
        isAdmin: true,
        user: {
          id: 999,
        },
      };
      const res = {};
      const checkPass = user.checkPass(['email', 'password'], false, true);

      checkPass(req, res, (error) => {
        assert.equal(null, error);

        U.model = uModel;
        done();
      });
    });

    it('req.user undefined, ignoreAdmin = false, modifyUser = true, origPass unset', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];
      const req = {
        params: {
          id: '999',
          email: '13740080@qq.com',
        },
        isAdmin: true,
        user: {
          id: 999,
        },
      };
      const res = {};
      const checkPass = user.checkPass(['email', 'password'], false, true);

      checkPass(req, res, (error) => {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Not authorized error.', error.message);
        assert.equal(403, error.statusCode);
        assert.deepEqual({
          code: 'NotAuthorized',
          message: 'Not authorized error.',
        }, error.body);
        assert.equal('NotAuthorized', error.restCode);

        U.model = uModel;
        done();
      });
    });

    it('origPass set, User.checkPass error', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];

      const req = {
        params: {
          id: '999',
          email: '13740080@qq.com',
          origPass: 'hello world',
        },
        isAdmin: true,
        user: {
          id: 999,
        },
      };
      const res = {};

      const checkPass = user.checkPass(['email', 'password'], false, true);
      models.user.checkPass = checkPassError('Hello, error');

      checkPass(req, res, (error) => {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Hello, error', error.message);
        assert.equal(403, error.statusCode);
        assert.deepEqual({
          code: 'NotAuthorized',
          message: 'Hello, error',
        }, error.body);
        assert.equal('NotAuthorized', error.restCode);
        U.model = uModel;

        done();
      });
    });

    it('origPass set, User.checkPass success', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];
      const _user = {
        id: 1,
        name: 'Redstone Zhao',
      };
      const req = {
        params: {
          id: '999',
          email: '13740080@qq.com',
          origPass: 'hello world',
        },
        isAdmin: true,
        user: {
          id: 999,
        },
      };
      const res = {};
      const checkPass = user.checkPass(['email', 'password'], false, true);
      models.user.checkPass = checkPassSuccess(_user);

      checkPass(req, res, (error) => {
        assert.equal(null, error);

        U.model = uModel;
        done();
      });
    });
  });

  describe('#findOrCreate', () => {
    it('req.hooks.user exists', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];
      const req = {
        hooks: { user: {} },
        params: {},
      };
      const res = {};
      const findOrCreate = user.findOrCreate('user');
      findOrCreate(req, res, (error) => {
        assert.equal(null, error);

        U.model = uModel;
        done();
      });
    });

    it('req.hooks.user non-exists', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];
      const req = {
        hooks: { user: undefined },
        params: {},
      };
      const res = {};
      const findOrCreate = user.findOrCreate('user');
      findOrCreate(req, res, (error) => {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Email 必须指定', error.message);
        assert.equal(409, error.statusCode);
        assert.deepEqual({
          code: 'MissingParameter',
          message: 'Email 必须指定',
          value: ['email'],
        }, error.body);
        assert.equal('MissingParameter', error.restCode);

        U.model = uModel;
        done();
      });
    });

    it('req.hooks.user non-exists User.findOne error', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];
      const req = {
        hooks: { user: undefined },
        params: {
          email: '13740080@qq.com',
        },
      };
      const res = {};
      const findOrCreate = user.findOrCreate('user');
      models.user.findOne = findOnePromiseError('Hi, user find one error');
      findOrCreate(req, res, (error) => {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Hi, user find one error', error.message);

        U.model = uModel;
        done();
      });
    });

    it('req.hooks.user non-exists User.findOne success, user exists', (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];
      const req = {
        hooks: { user: undefined },
        params: {
          email: '13740080@qq.com',
        },
      };
      const _user = {
        id: 1,
        name: 'Redstone Zhao',
      };
      const res = {
        header: (key, value) => {
          assert.equal('X-Content-System-User', key);
          assert.equal('exists', value);
        },
      };
      const findOrCreate = user.findOrCreate('user');
      models.user.findOne = findOnePromiseSuccess(_user);
      findOrCreate(req, res, (error) => {
        assert.equal(null, error);
        assert.equal(1, req.params.userId);
        assert.equal(_user, req.hooks.user);

        U.model = uModel;
        done();
      });
    });

    it([
      'req.hooks.user non-exists User.findOne success,',
      'user non-exists, name exists, beforeAdd error',
    ].join(' '), (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];
      const req = {
        hooks: { user: undefined },
        params: {
          email: '13740080@qq.com',
        },
      };
      const res = {
        header: (key, value) => {
          assert.equal('X-Content-System-User', key);
          assert.equal('exists', value);
        },
      };
      models.user.findOne = findOnePromiseSuccess(null);
      U.rest.helper.rest = {};
      U.rest.helper.rest.beforeAdd = () => (r, s, next) => next(Error('Before add error'));
      const findOrCreate = user.findOrCreate('user');
      findOrCreate(req, res, (error) => {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Before add error', error.message);

        U.model = uModel;
        done();
      });
    });

    it([
      'req.hooks.user non-exists User.findOne success,',
      'user non-exists, name non-exists, beforeAdd success',
    ].join(' '), (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];
      const req = {
        hooks: { user: undefined },
        params: {
          email: '13740080@qq.com',
        },
      };
      const res = {
        header: (key, value) => {
          assert.equal('X-Content-System-User', key);
          assert.equal('added', value);
        },
      };
      models.user.findOne = findOnePromiseSuccess(null);
      U.rest.helper.rest = {};
      U.rest.helper.rest.beforeAdd = () => (
        (request, response, next) => {
          request.hooks.user = {
            id: 9999,
            name: 'Redstone Zhao',
          };
          return next();
        }
      );
      const findOrCreate = user.findOrCreate('user');
      findOrCreate(req, res, (error) => {
        assert.equal(null, error);
        assert.equal(9999, req.params.userId);
        assert.deepEqual({
          id: 9999,
          name: 'Redstone Zhao',
        }, req.hooks.user);

        U.model = uModel;
        done();
      });
    });

    it([
      'req.hooks.user non-exists User.findOne success,',
      'user non-exists, name exists, beforeAdd success',
    ].join(' '), (done) => {
      const uModel = U.model;
      U.model = (name) => models[name];
      const req = {
        hooks: { user: undefined },
        params: {
          email: '13740080@qq.com',
          name: 'Redstone Zhao',
        },
      };
      const res = {
        header: (key, value) => {
          assert.equal('X-Content-System-User', key);
          assert.equal('added', value);
        },
      };
      models.user.findOne = findOnePromiseSuccess(null);
      U.rest.helper.rest = {};
      U.rest.helper.rest.beforeAdd = () => (
        (r, rs, next) => {
          r.hooks.user = {
            id: 9999,
            name: 'Redstone Zhao',
          };
          return next();
        }
      );
      const findOrCreate = user.findOrCreate('user');

      findOrCreate(req, res, (error) => {
        assert.equal(null, error);
        assert.equal(9999, req.params.userId);
        assert.deepEqual({
          id: 9999,
          name: 'Redstone Zhao',
        }, req.hooks.user);

        U.model = uModel;
        done();
      });
    });
  });
});
