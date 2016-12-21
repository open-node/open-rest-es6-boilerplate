const U = require('../lib/utils');
const helper = require('./helper');

const User = U.model('user');
const CHECK_PASS_COLS = [
  'email', 'password',
];

/**
 * @api {GET} /session 查询 Session
 * @apiName user_session
 * @apiPermission owner
 * @apiGroup User
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *
 *   Body:
 *   {
 *     id: 1
 *     name: 'Redstone Zhao'
 *     email: '13740080@qq.com'
 *     role: 'admin'
 *     status: 'enabled'
 *     isDelete: 'no'
 *     auth: {
 *       id: 1
 *       token: '18ncomhx9npwhf'
 *       refreshToken: '92asdxni28sxshdms'
 *       expiredAt: '2016-05-27T12:00:01.000Z',
 *       onlineIp: '199.199.0.199'
 *     }
 *   }
 * @apiVersion 1.0.0
 */
const session = [
  helper.user.session(),
];

/**
 * @api {POST} /session 登陆
 * @apiName user_login
 * @apiPermission owner
 * @apiGroup User
 * @apiParam (body) {String} email 登陆的 Email 地址
 * @apiParam (body) {String} password 登陆的密码
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 Created

 *   Body:
 *   {
 *     id: 1
 *     name: 'Redstone Zhao'
 *     email: '13740080@qq.com'
 *     role: 'admin'
 *     status: 'enabled'
 *     isDelete: 'no'
 *     auth: {
 *       id: 1
 *       token: '18ncomhx9npwhf'
 *       refreshToken: '92asdxni28sxshdms'
 *       expiredAt: '2016-05-27T12:00:01.000Z',
 *       onlineIp: '199.199.0.199'
 *     }
 *   }
 * @apiVersion 1.0.0
 */
const login = [
  helper.user.login(),
  helper.user.session(201),
];

/**
 * @api {DELETE} /session 退出
 * @apiName user_logout
 * @apiPermission owner
 * @apiGroup User
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 204 No Content

 * @apiVersion 1.0.0
 */
const logout = [
  helper.user.logout(),
];

/**
 * @api {GET} /users 系统用户列表
 * @apiName user_list
 * @apiGroup User
 * @apiPermission admin
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   Headers:
 *   {
 *     "X-Content-Record-Total": 1 // 符合条件的记录总条数，并非当前返回数组的长度
 *   }
 *   Body:
 *   [{
 *     id: 2,
 *     name: 'StonePHP',
 *     role: 'member',
 *     avatar: 'users/a2/21/1.png',
 *     email: '269718799@qq.com',
 *     status: 'enabled',
 *     language: 'zh',
 *     isDelete: 'no',
 *     createdAt: '2014-09-03T03:15:16.000Z',
 *     updatedAt: '2014-09-03T03:15:16.000Z'
 *   }]
 * @apiVersion 1.0.0
 */
const list = [
  helper.checker.sysAdmin(),
  helper.rest.list(User),
];

/**
 * @api {PUT/PATCH} /users/:id 编辑用户
 * @apiName user_modify
 * @apiPermission admin | owner
 * @apiGroup User
 * @apiParam (query) {Number} id 用户 ID
 * @apiParam (body) {String} [name] 用户语言设置
 * @apiParam (body) {String} [language] 用户语言设置
 * @apiParam (body) {Enum} [status] 用户状态`disabled` or `enabled` 仅管理员可用
 * @apiParam (body) {Enum} [role] 用户角色，`admin` or `number`, 仅管理员可用
 * @apiParam (body) {String} [password] 设置的新密码
 * @apiParam (body) {String} [origPass] 原密码，在设置新密码的时候必须要携带原始密码
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   Body:
 *   {
 *     id: 2,
 *     name: 'StonePHP',
 *     role: 'member',
 *     avatar: 'users/a2/21/1.png',
 *     email: '269718799@qq.com',
 *     status: 'enabled',
 *     language: 'zh',
 *     isDelete: 'no',
 *     createdAt: '2014-09-03T03:15:16.000Z',
 *     updatedAt: '2014-09-03T03:15:16.000Z'
 *   }
 * @apiVersion 1.0.0
 */
const modify = [
  helper.getter(User, 'user'),
  helper.assert.exists('hooks.user'),
  [
    helper.checker.ownSelf('id', 'user'),
    helper.checker.sysAdmin(),
  ],
  helper.user.checkPass(CHECK_PASS_COLS, true, true),
  helper.rest.modify(User, 'user'),
];

/**
 * @api {DELETE} /users/:id 删除用户
 * @apiName user_del
 * @apiPermission admin
 * @apiGroup User
 * @apiParam {Number} id 用户 ID
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 204 No Content
 * @apiVersion 1.0.0
 */
const remove = [
  helper.checker.sysAdmin(),
  helper.getter(User, 'user'),
  helper.assert.exists('hooks.user'),
  helper.rest.remove.hook('user').exec(),
];

/**
 * @api {GET} /users/:id 查看用户
 * @apiName user_detail
 * @apiPermission admin | owner
 * @apiGroup User
 * @apiParam (query) {Number} id 用户 ID
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   Body:
 *   {
 *     id: 2,
 *     name: 'StonePHP',
 *     role: 'member',
 *     avatar: 'users/a2/21/1.png',
 *     email: '269718799@qq.com',
 *     status: 'enabled',
 *     language: 'zh',
 *     isDelete: 'no',
 *     createdAt: '2014-09-03T03:15:16.000Z',
 *     updatedAt: '2014-09-03T03:15:16.000Z'
 *   }
 * @apiVersion 1.0.0
 */
const detail = [
  helper.getter(User, 'user'),
  helper.assert.exists('hooks.user'),
  helper.rest.detail('user'),
];

/**
 * @api {POST} /users 添加用户
 * @apiName user_add
 * @apiPermission admin
 * @apiGroup User
 * @apiParam (body) {String} name 用户语言设置
 * @apiParam (body) {String} email Email 地址
 * @apiParam (body) {String} password 密码
 * @apiParam (body) {String} [language] 用户语言设置
 * @apiParam (body) {Enum} [status] 用户状态`disabled` or `enabled`
 * @apiParam (body) {Enum} [role] 用户角色，`admin` or `number`
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 201 Created
 *
 *   Body:
 *   {
 *     id: 2,
 *     name: 'StonePHP',
 *     role: 'member',
 *     avatar: 'users/a2/21/1.png',
 *     email: '269718799@qq.com',
 *     status: 'enabled',
 *     language: 'zh',
 *     isDelete: 'no',
 *     createdAt: '2014-09-03T03:15:16.000Z',
 *     updatedAt: '2014-09-03T03:15:16.000Z'
 *   }
 * @apiVersion 1.0.0
 */
const add = [
  helper.checker.sysAdmin(),
  helper.rest.add(User),
];

module.exports = {
  session, login, logout, list, detail, modify, remove, add,
};
