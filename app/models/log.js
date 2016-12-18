const U = require('../lib/utils');
const ModelBase = require('./base');

const Sequelize = U.rest.Sequelize;

module.exports = (sequelize) => {
  const Log = U._.extend(sequelize.define('log', {
    id: {
      type: Sequelize.type('integer.unsigned'),
      primaryKey: true,
      autoIncrement: true,
    },
    verb: {
      type: Sequelize.type('string', 10),
      allowNull: false,
      comment: '请求动作',
    },
    uri: {
      type: Sequelize.type('string', 1024),
      allowNull: false,
      comment: '请求的路径',
    },
    userId: {
      type: Sequelize.type('uuid'),
      allowNull: false,
      defaultValue: 0,
      comment: '请求用户id',
    },
    statusCode: {
      type: Sequelize.type('integer'),
      allowNull: false,
      comment: '请求状态， 2xx， 4xx, 5xx',
    },
    clientIp: {
      type: Sequelize.type('string', 15),
      allowNull: false,
      comment: '请求来源IP',
    },
    params: {
      type: Sequelize.type('text'),
      comment: '请求的参数数据',
    },
    response: {
      type: Sequelize.type('text'),
      comment: '请求返回的内容',
    },
  }, {
    comment: '写操作日志表',
    freezeTableName: true,
    instanceMethods: {},
    classMethods: {},
    /** 禁止更新日志的记录，因为日志不需要更新操作 */
    updatedAt: false,
  }), ModelBase, {
    sort: {
      default: 'id',
      allow: [
        'id', 'verb', 'userId', 'statusCode', 'createdAt',
      ],
    },
    writableCols: [],
  });

  return Log;
};
