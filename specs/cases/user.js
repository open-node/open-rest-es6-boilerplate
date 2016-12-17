const U = require('../../app/lib/utils');

module.exports = [{
  name: '管理员添加一个用户',
  uri: '/users',
  verb: 'post',
  headers: {
    'X-Auth-Token': 'MOCK::1'
  },
  data: {
    name: 'StonePHP',
    email: '269718799@qq.com',
    password: '123457'
  },
  expects: {
    Status: 201,
    JSON: {
      id: 2,
      name: 'StonePHP',
      email: '269718799@qq.com',
      status: 'enabled',
      isDelete: 'no',
      role: 'member'
    }
  }
}, {
  name: '刚才添加的用户可以登陆',
  uri: '/session',
  verb: 'post',
  data: {
    email: '269718799@qq.com',
    password: '123457'
  },
  expects: {
    Status: 201,
    JSON: {
      id: 2,
      name: 'StonePHP',
      email: '269718799@qq.com',
      status: 'enabled',
      isDelete: 'no',
      role: 'member',
      auth: {
        id: function(v, assert) {
          assert.equal(typeof v, 'number');
        },
        token: function(v, assert) {
          assert.equal(v.length, 32);
          assert.equal(typeof v, 'string');
        },
        refreshToken: function(v, assert) {
          assert.equal(v.length, 32);
          assert.equal(typeof v, 'string');
        },
        expiredAt: function(v, assert) {
          assert.ok(U.moment(v) > U.moment());
        },
        creatorId: 2
      }
    }
  }
}, {
  name: '游客无法访问注册',
  uri: '/users',
  verb: 'post',
  data: {
    name: 'StonePHP',
    email: '269718799@qq.com',
    password: '123457'
  },
  expects: {
    Status: 404,
    JSON: {
      code: 'ResourceNotFound',
      message: 'Resource not found.'
    }
  }
}, {
  name: '普通用户无法访问注册',
  uri: '/users',
  verb: 'post',
  headers: {
    'X-Auth-Token': 'MOCK::2'
  },
  data: {
    name: 'StonePHP',
    email: '269718799@qq.com',
    password: '123457'
  },
  expects: {
    Status: 404,
    JSON: {
      code: 'ResourceNotFound',
      message: 'Resource not found.'
    }
  }
}];
