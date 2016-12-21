module.exports = {
  host: '127.0.0.1',
  port: 3306,
  name: 'openrest',
  encode: {
    set: 'utf8',
    collation: 'utf8_general_ci',
  },
  user: 'root',
  pass: '^7s*@asf21home($YUw',
  dialect: 'mysql',
  dialectOptions: {
    /** 支持大数的计算 */
    supportBigNumbers: true,
  },
  logging: false,
  define: {
    underscored: false,
    freezeTableName: true,
    syncOnAssociation: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    engine: 'InnoDB',
  },
  syncOnAssociation: true,
  pool: {
    min: 2,
    max: 10,
    /** 单位毫秒 */
    idle: 300 * 1000,
  },
};
