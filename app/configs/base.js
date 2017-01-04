const upload = require('./extensions/upload');
const db = require('./extensions/db');
const privateSwitchs = require('./extensions/private-switchs');
const privateIps = require('./extensions/private-ips');
const avatar = require('./extensions/avatar');

module.exports = {
  /** web service 的一些信息,主要提供给 restify.createServer 使用 */
  service: {
    name: 'open-rest boilerplate service',
    version: '0.0.1',
    ip: '127.0.0.1',
    port: 9988,
    /** 路由相关设置 */
    route: {
      /**
       * 是否提供 apis 查询，如果提供这里设置为 apis 的请求路径
       * 不设置此属性，或者设置为 null 则不提供 apis 的查询服务
       */
      apis: '/apis',
    },
  },

  logger: {
    name: 'open-rest-es-boilerplate',
    streams: [{
      level: 'info',
      path: `${__dirname}/../../storage/logs/info.log`,
    }, {
      level: 'error',
      path: `${__dirname}/../../storage/logs/error.log`,
    }, {
      level: 'warn',
      path: `${__dirname}/../../storage/logs/warn.log`,
    }],
  },

  /** body 解析参数控制 */
  bodyParser: {
    multiples: false,
    uploadDir: '/data/upload_tmp',
  },

  /** 文件上传的若干设定 */
  upload,

  /** 数据库配置 */
  db,

  /** cache 配置信息 */
  cache: {
    host: '127.0.0.1',
    port: 6379,
    opts: {
      namespace: 'ORB',
    },
  },

  /**
   * proxy ips
   * 只有这两个服务器过来的请求真实ip才会去获取
   * 用来获取真实的ip，用来控制私有ip的真实性
   */
  proxyIps: [
    '127.0.0.1',
    '172.17.42.1',
  ],

  /**
   * 私有接口允许的IP地址白名单
   * 私有IP需要严格限制允许请求的接口, 一般都是只读接口, 禁止开放写接口给私有IP客户端
   * 私有接口开关名称，每个对应一个或多个具体的接口
  */
  privateSwitchs,
  privateIps,

  /** 日期格式化的格式 */
  dateFormat: 'YYYY-MM-DD',

  /** 时间格式化的格式 */
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',

  /** 头像相关设定 */
  avatar,

  /** accessLog 路径 */
  accessLog: `${__dirname}/../../storage/logs/access.log`,

  /** 允许游客访问的路由路径 */
  allowGuestAccessPaths: [
    // 允许登陆
    'POST /session',
    // 允许注册
    'POST /users',
  ],

  /** 允许的语言 */
  languages: ['zh', 'en', 'zh-tw'],
  defaultLanguage: 'zh',
};
