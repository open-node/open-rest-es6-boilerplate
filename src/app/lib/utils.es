import pkg     from  '../../../package'
import path    from  'path'
import fs      from  'fs'

/**
 * 以下是项目所依赖的库包
 * 第三方库包禁止直接使用
 * 必须通过ut["xxxx"]的方式引用，这样有以下几个好处
 * 1. 避免其他模块头部大量的 require
 * 2. 当某个模块需要替换的时候不至于要替换n个地方
 * 3. 未完待续
 */
var U = {};
for (let k in pkg.dependencies) {
  /** 包名的中划线转成驼峰，方便通过点(.)来操作 */
  U[k.replace(/(\-\w)/g, (m) => m[1].toUpperCase())] = require(k);
}

/** 个别特殊处理的库包 alias */
U.rest    = U.openRest;
U._       = U.lodash;
U.cached  = U.openCache;

var utils = {

  isApiTest: process.env.NODE_ENV === 'apitest',

  model: U.rest.model,

  path: path,

  fs: fs,

  /**
   * 将私有ip和权限组的对应关系合并之后转换成需要的格式
   * "xxx.xxx.xxx.xxx": [Array] switchs
   */
  privateIpMerge: (switchs, obj) => {
    var ret = {};
    U._.each(obj, (ips, key) => {
      /**
       * 全部功能的暂时先跳过，后续单独处理
       *  因为担心其被其他的权限覆盖
       */
      if (key === '*') return;
      for (let ip of ips) {
        ret[ip] = ret[ip] ? ret[ip].concat(switchs[key]) : switchs[key]
      }
    });
    U._.each(ret, (v, k) => ret[k] = U._.uniq(v))
    if (obj['*']) {
      for (let ip of obj['*']) {
        ret[ip] = '*';
      }
    }
    return ret;
  },

  /** 一个空函数 */
  noop: () => {
    return
  },

  /** 解码base64的图片 */
  decodeBase64Image: (dataString) => {
    if (!dataString) return;
    let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    if (!matches) return;
    return {
      type: matches[1],
      data: new Buffer(matches[2], 'base64')
    }
  },

  mkdirp: (dir) => {
    if (fs.existsSync(dir)) return;
    var parent = path.dirname(dir)
    if (!fs.existsSync(parent)) utils.mkdirp(parent);
    return fs.mkdirSync(dir)
  }
};

utils = Object.assign({}, U.rest.utils, utils, U);

export default utils;
