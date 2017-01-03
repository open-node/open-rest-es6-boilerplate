/**
 * 以下是项目所依赖的库包
 * 第三方库包禁止直接使用
 * 必须通过ut["xxxx"]的方式引用，这样有以下几个好处
 * 1. 避免其他模块头部大量的 require
 * 2. 当某个模块需要替换的时候不至于要替换n个地方
 * 3. 未完待续
 */
const U = {};

U.rest = require('open-rest');
U._ = require('lodash');
U.cached = require('open-cache');
U.md5 = require('md5');
U.moment = require('moment');
U.async = require('async');
U.path = require('path');
U.fs = require('fs');
U.openRestAccessLog = require('open-rest-access-log');
U.openRestWithMysql = require('open-rest-with-mysql');
U.onFinished = require('on-finished');

let utils = {

  model: U.rest.model,

  hasOwnProperty: Object.prototype.hasOwnProperty,

  /**
   * 将私有ip和权限组的对应关系合并之后转换成需要的格式
   * "xxx.xxx.xxx.xxx": [Array] switchs
   */
  privateIpMerge: (switchs, obj) => {
    const ret = {};
    U._.each(obj, (ips, key) => {
      /**
       * 全部功能的暂时先跳过，后续单独处理
       *  因为担心其被其他的权限覆盖
       */
      if (key === '*') return;
      for (const ip of ips) {
        ret[ip] = ret[ip] ? ret[ip].concat(switchs[key]) : switchs[key];
      }
    });
    U._.each(ret, (v, k) => {
      ret[k] = U._.uniq(v);
    });
    if (obj['*']) {
      for (const ip of obj['*']) {
        ret[ip] = '*';
      }
    }
    return ret;
  },

  /** 一个空函数 */
  noop: () => {},

  /** 解码base64的图片 */
  decodeBase64Image: (dataString) => {
    if (!dataString) return null;
    const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches) return null;
    return {
      type: matches[1],
      data: new Buffer(matches[2], 'base64'),
    };
  },

  mkdirp: (dir) => {
    if (U.fs.existsSync(dir)) return null;
    const parent = U.path.dirname(dir);
    if (!U.fs.existsSync(parent)) utils.mkdirp(parent);
    return U.fs.mkdirSync(dir);
  },
};

module.exports = utils = Object.assign({}, U.rest.utils, utils, U);
