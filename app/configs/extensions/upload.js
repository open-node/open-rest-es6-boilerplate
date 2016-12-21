module.exports = {
  /** 是否允许直接解压zip包 */
  allowUnzip: false,

  /** 文件存储路径 */
  dir: '/data/upload',

  /** 解压缩包文件最多限制 */
  unzipMaxFileNum: 100,

  /**
   * 不允许的后缀，包括压缩包里的，如果要求解压的时候也要判断
   * 一旦有不和发的直接报错
   */
  blackList: ['.php'],

  /** 文件下载路径 */
  accessUrl: './access-files',
};
