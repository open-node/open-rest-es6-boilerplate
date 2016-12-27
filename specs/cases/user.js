const U = require('../../app/lib/utils');

const imageData = 'R0lGODdhBQAFAIACAAAAAP/eACwAAAAABQAFAAACCIwPkWerClIBADs=';
const base64image = `data:image/gif;base64,${imageData}`;
const unBase64image = 'data:image/gif;base64,';

module.exports = [{
  name: '管理员添加一个用户',
  uri: '/users',
  verb: 'post',
  headers: {
    'X-Auth-Token': 'MOCK::1',
  },
  data: {
    name: 'StonePHP',
    email: '269718799@qq.com',
    password: '123457',
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
    },
  },
}, {
  name: '刚才添加的用户可以登陆',
  uri: '/session',
  verb: 'post',
  data: {
    email: '269718799@qq.com',
    password: '123457',
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
        id: (v, assert) => {
          assert.equal(typeof v, 'number');
        },
        token: (v, assert) => {
          assert.equal(v.length, 32);
          assert.equal(typeof v, 'string');
        },
        refreshToken: (v, assert) => {
          assert.equal(v.length, 32);
          assert.equal(typeof v, 'string');
        },
        expiredAt: (v, assert) => {
          assert.ok(U.moment(v) > U.moment());
        },
        creatorId: 2,
      },
    },
  },
}, {
  name: '游客无法访问注册',
  uri: '/users',
  verb: 'post',
  data: {
    name: 'StonePHP',
    email: '269718799@qq.com',
    password: '123457',
  },
  expects: {
    Status: 404,
    JSON: {
      code: 'ResourceNotFound',
      message: 'Resource not found.',
    },
  },
}, {
  name: '普通用户无法访问注册',
  uri: '/users',
  verb: 'post',
  headers: {
    'X-Auth-Token': 'MOCK::2',
  },
  data: {
    name: 'StonePHP',
    email: '269718799@qq.com',
    password: '123457',
  },
  expects: {
    Status: 404,
    JSON: {
      code: 'ResourceNotFound',
      message: 'Resource not found.',
    },
  },
}, {
  name: '普通用户可以设置头像',
  uri: '/users/2',
  verb: 'put',
  headers: {
    'X-Auth-Token': 'MOCK::2',
  },
  data: {
    avatar: base64image,
  },
  expects: {
    Status: 200,
    JSON: {
      id: 2,
      avatar: (v, assert) => {
        const avatarPath = v.substr(9);
        assert.equal(0, v.indexOf('/_avatar/'));
        assert.ok(U.fs.existsSync(`${__dirname}/../../avatar/${avatarPath}`));
      },
    },
  },
}, {
  name: '普通用户再次设置头像',
  uri: '/users/2',
  verb: 'put',
  headers: {
    'X-Auth-Token': 'MOCK::2',
  },
  data: {
    avatar: base64image,
  },
  expects: {
    Status: 200,
    JSON: {
      id: 2,
      avatar: (v, assert) => {
        const avatarPath = v.substr(9);
        assert.equal(0, v.indexOf('/_avatar/'));
        assert.ok(U.fs.existsSync(`${__dirname}/../../avatar/${avatarPath}`));
      },
    },
  },
}, {
  name: '普通用户再次设置头像, 图片不存在',
  uri: '/users/2',
  verb: 'put',
  headers: {
    'X-Auth-Token': 'MOCK::2',
  },
  data: {
    avatar: unBase64image,
  },
  expects: {
    Status: 200,
    JSON: {
      id: 2,
      avatar: (v, assert) => {
        const avatarPath = v.substr(9);
        assert.equal(0, v.indexOf('/_avatar/'));
        assert.ok(U.fs.existsSync(`${__dirname}/../../avatar/${avatarPath}`));
      },
    },
  },
}];
