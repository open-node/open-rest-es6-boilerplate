const path = require('path');

module.exports = {
  /** 服务器端存储的路径 */
  path: path.resolve(`${__dirname}/../../../avatar`),

  /** 头像的访问地址 */
  uri: '/_avatar',
};
