const utils = require('../../lib/utils');

/**
 * 这里将IP私有客户端的权限大概归类为一下几种，
 * 为了更好的控制权限，避免多地修改
 * groupName: [switch1, switch2]
 */
const switchs = {
  local: ['users'],
};

/** groupName: [ip1, ip2] */
module.exports = utils.privateIpMerge(switchs, {
  /**
   * 范例，同时做测试用
   * @zhaoxiongfei
   */
  local: [
    '192.168.199.188',
  ],
});
