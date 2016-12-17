const assert    = require('assert');
const rest      = require('open-rest');
const U         = require('../app/lib/utils');
const Sequelize = rest.Sequelize;
const user      = require('../app/controllers/helper/user');

let sequelize = new Sequelize();

let checkPassSuccess = function(user) {
  return function(req, email, password, callback) {
    setTimeout(function() {
      callback(null, user);
    }, 10);
  };
};

let checkPassError = function(message) {
  return function(req, email, password, callback) {
    setTimeout(function() {
      callback(Error(message));
    }, 10);
  };
};

let addAuthError = function(message) {
  return function(user, realIp, callback) {
    setTimeout(function() {
      callback(Error(message));
    }, 10);
  };
};

let addAuthSuccess = function(auth) {
  return function(user, realIp, callback) {
    setTimeout(function() {
      callback(null, auth);
    }, 10);
  };
};

let readUserByTokenError = function(message) {
  return function(token, callback) {
    setTimeout(function() {
      callback(Error(message));
    }, 10);
  };
};

let findOnePromiseError = function(message) {
  return function() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(Error(message));
      }, 10);
    });
  };
};

let findOnePromiseSuccess = function(user) {
  return function() {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(user);
      }, 10);
    });
  };
};

let models = {
  auth: sequelize.define('book', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING(100)
  }),
  user: sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING(100)
  })
};

models.auth.readUserByToken = {
  removeKey: false
};

models.auth.findOne = function() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      return resolve();
    }, 10);
  });
};

describe('helper.user', function() {

  describe('#logout', function() {

    it("Auth.readUserByToken.removeKey non-exists", function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };

      let req = {
        headers: {
          'X-Auth-Token': 'THIS IS A TEST TOKEN'
        },
        params: {}
      };
      let res = {
        send: function(statusCode) {
          assert.equal(204, statusCode);
        }
      };

      let logout = user.logout();

      logout(req, res, function(error) {
        assert.equal(null, error);

        U.model = uModel;
        done();
      });

    });

  });

  describe('#login', function() {

    it("User.checkPass error", function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };

      models.user.checkPass = checkPassError('Hello, error');

      let req = {params: {}};
      let res = {};

      let login = user.login();

      login(req, res, function(error) {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Hello, error', error.message);
        assert.equal(403, error.statusCode);
        assert.deepEqual({
          code: 'NotAuthorized',
          message: 'Hello, error'
        }, error.body);
        assert.equal('NotAuthorized', error.restCode);

        U.model = uModel;
        done();
      });

    });

    it("Auth.addAuth error", function(done) {
      let uModel = U.model;
      let _user = {
        id: 1,
        name: 'Redstone Zhao'
      };
      U.model = function(name) {
        return models[name];
      };

      models.user.checkPass = checkPassSuccess(_user);
      models.auth.addAuth = addAuthError('Hello, add auth error');

      let req = {params: {}};
      let res = {};

      let login = user.login();

      login(req, res, function(error) {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Hello, add auth error', error.message);

        U.model = uModel;
        done();
      });

    });

    it("Auth.readUserByToken error", function(done) {
      let uModel = U.model;
      let _user = {
        id: 1,
        name: 'Redstone Zhao'
      };
      let _auth = {};
      U.model = function(name) {
        return models[name];
      };

      models.user.checkPass = checkPassSuccess(_user);
      models.auth.addAuth = addAuthSuccess(_auth);
      models.auth.readUserByToken = readUserByTokenError('Hi, read user by token error');

      let req = {params: {}};
      let res = {};

      let login = user.login();

      login(req, res, function(error) {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Hi, read user by token error', error.message);

        U.model = uModel;
        done();
      });

    });

  });

  describe('#checkPass', function() {

    it("req.user undefined", function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };

      let req = {params: {}};
      let res = {};

      let checkPass = user.checkPass(['email', 'password'], false, true);

      checkPass(req, res, function(error) {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Resource not found.', error.message);
        assert.equal(404, error.statusCode);

        U.model = uModel;
        done();
      });

    });

    it("req.user undefined, ignoreAdmin = true, modifyUser = true", function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };

      let req = {
        params: {
          id: '998'
        },
        isAdmin: true,
        user: {
          id: 999
        }
      };
      let res = {};

      let checkPass = user.checkPass(['email', 'password'], true, true);

      checkPass(req, res, function(error) {
        assert.equal(null, error);

        U.model = uModel;
        done();
      });

    });

    it("req.user undefined, ignoreAdmin = true, modifyUser = true, ownSelf", function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };

      let req = {
        params: {
          id: '999'
        },
        isAdmin: true,
        user: {
          id: 999
        }
      };
      let res = {};

      let checkPass = user.checkPass(['email', 'password'], true, true);

      checkPass(req, res, function(error) {
        assert.equal(null, error);

        U.model = uModel;
        done();
      });

    });

    it("req.user undefined, ignoreAdmin = false, modifyUser = true, ownSelf", function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };

      let req = {
        params: {
          id: '999'
        },
        isAdmin: true,
        user: {
          id: 999
        }
      };
      let res = {};

      let checkPass = user.checkPass(['email', 'password'], false, true);

      checkPass(req, res, function(error) {
        assert.equal(null, error);

        U.model = uModel;
        done();
      });

    });

    it("req.user undefined, ignoreAdmin = false, modifyUser = true, origPass unset", function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };

      let req = {
        params: {
          id: '999',
          email: '13740080@qq.com'
        },
        isAdmin: true,
        user: {
          id: 999
        }
      };
      let res = {};

      let checkPass = user.checkPass(['email', 'password'], false, true);

      checkPass(req, res, function(error) {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Not authorized error.', error.message);
        assert.equal(403, error.statusCode);
        assert.deepEqual({
          code: 'NotAuthorized',
          message: 'Not authorized error.'
        }, error.body);
        assert.equal('NotAuthorized', error.restCode);

        U.model = uModel;
        done();
      });

    });

    it("origPass set, User.checkPass error", function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };

      let req = {
        params: {
          id: '999',
          email: '13740080@qq.com',
          origPass: 'hello world'
        },
        isAdmin: true,
        user: {
          id: 999
        }
      };
      let res = {};

      let checkPass = user.checkPass(['email', 'password'], false, true);
      models.user.checkPass = checkPassError('Hello, error');

      checkPass(req, res, function(error) {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Hello, error', error.message);
        assert.equal(403, error.statusCode);
        assert.deepEqual({
          code: 'NotAuthorized',
          message: 'Hello, error'
        }, error.body);
        assert.equal('NotAuthorized', error.restCode);
        U.model = uModel;

        done();
      });

    });

    it("origPass set, User.checkPass success", function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };
      let _user = {
        id: 1,
        name: 'Redstone Zhao'
      };
      let req = {
        params: {
          id: '999',
          email: '13740080@qq.com',
          origPass: 'hello world'
        },
        isAdmin: true,
        user: {
          id: 999
        }
      };
      let res = {};

      let checkPass = user.checkPass(['email', 'password'], false, true);
      models.user.checkPass = checkPassSuccess(_user);

      checkPass(req, res, function(error) {

        assert.equal(null, error);

        U.model = uModel;
        done();
      });

    });

  });

  describe('#findOrCreate', function() {

    it('req.hooks.user exists', function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };
      let req = {
        hooks: {user: {}},
        params: {}
      };
      let res = {};
      let findOrCreate = user.findOrCreate('user');
      findOrCreate(req, res, function(error) {
        assert.equal(null, error);

        U.model = uModel;
        done();
      });

    });

    it('req.hooks.user non-exists', function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };
      let req = {
        hooks: {user: undefined},
        params: {}
      };
      let res = {};
      let findOrCreate = user.findOrCreate('user');
      findOrCreate(req, res, function(error) {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Email 必须指定', error.message);
        assert.equal(409, error.statusCode);
        assert.deepEqual({
          code: 'MissingParameter',
          message: 'Email 必须指定',
          value: ['email']
        }, error.body);
        assert.equal('MissingParameter', error.restCode);

        U.model = uModel;
        done();
      });
    });

    it('req.hooks.user non-exists User.findOne error', function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };
      let req = {
        hooks: {user: undefined},
        params: {
          email: '13740080@qq.com'
        }
      };
      let res = {};
      let findOrCreate = user.findOrCreate('user');
      models.user.findOne = findOnePromiseError('Hi, user find one error');
      findOrCreate(req, res, function(error) {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Hi, user find one error', error.message);

        U.model = uModel;
        done();
      });
    });

    it('req.hooks.user non-exists User.findOne success, user exists', function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };
      let req = {
        hooks: {user: undefined},
        params: {
          email: '13740080@qq.com'
        }
      };
      let _user = {
        id: 1,
        name: 'Redstone Zhao'
      };
      let res = {
        header: function(key, value) {
          assert.equal('X-Content-System-User', key);
          assert.equal('exists', value);
        }
      };
      let findOrCreate = user.findOrCreate('user');
      models.user.findOne = findOnePromiseSuccess(_user);
      findOrCreate(req, res, function(error) {
        assert.equal(null, error);
        assert.equal(1, req.params.userId);
        assert.equal(_user, req.hooks.user);

        U.model = uModel;
        done();
      });
    });

    it('req.hooks.user non-exists User.findOne success, user non-exists, name exists, beforeAdd error', function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };
      let req = {
        hooks: {user: undefined},
        params: {
          email: '13740080@qq.com'
        }
      };
      let res = {
        header: function(key, value) {
          assert.equal('X-Content-System-User', key);
          assert.equal('exists', value);
        }
      };
      let findOrCreate = user.findOrCreate('user');
      models.user.findOne = findOnePromiseSuccess(null);
      U.rest.helper.rest = {};
      U.rest.helper.rest.beforeAdd = function() {
        return function(req, res, next) {
          return next(Error('Before add error'));
        };
      };
      findOrCreate(req, res, function(error) {
        assert.ok(error);
        assert.ok(error instanceof Error);
        assert.equal('Before add error', error.message);

        U.model = uModel;
        done();
      });
    });

    it('req.hooks.user non-exists User.findOne success, user non-exists, name non-exists, beforeAdd success', function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };
      let req = {
        hooks: {user: undefined},
        params: {
          email: '13740080@qq.com'
        }
      };
      let res = {
        header: function(key, value) {
          assert.equal('X-Content-System-User', key);
          assert.equal('added', value);
        }
      };
      let findOrCreate = user.findOrCreate('user');
      models.user.findOne = findOnePromiseSuccess(null);
      U.rest.helper.rest = {};
      U.rest.helper.rest.beforeAdd = function() {
        return function(req, res, next) {
          req.hooks.user = {
            id: 9999,
            name: 'Redstone Zhao'
          };
          return next();
        };
      };
      findOrCreate(req, res, function(error) {
        assert.equal(null, error);
        assert.equal(9999, req.params.userId);
        assert.deepEqual({
          id: 9999,
          name: 'Redstone Zhao'
        }, req.hooks.user);

        U.model = uModel;
        done();
      });
    });

    it('req.hooks.user non-exists User.findOne success, user non-exists, name exists, beforeAdd success', function(done) {
      let uModel = U.model;
      U.model = function(name) {
        return models[name];
      };
      let req = {
        hooks: {user: undefined},
        params: {
          email: '13740080@qq.com',
          name: 'Redstone Zhao'
        }
      };
      let res = {
        header: function(key, value) {
          assert.equal('X-Content-System-User', key);
          assert.equal('added', value);
        }
      };
      let findOrCreate = user.findOrCreate('user');
      models.user.findOne = findOnePromiseSuccess(null);
      U.rest.helper.rest = {};
      U.rest.helper.rest.beforeAdd = function() {
        return function(req, res, next) {
          req.hooks.user = {
            id: 9999,
            name: 'Redstone Zhao'
          };
          return next();
        };
      };
      findOrCreate(req, res, function(error) {
        assert.equal(null, error);
        assert.equal(9999, req.params.userId);
        assert.deepEqual({
          id: 9999,
          name: 'Redstone Zhao'
        }, req.hooks.user);

        U.model = uModel;
        done();
      });
    });

  });

});
