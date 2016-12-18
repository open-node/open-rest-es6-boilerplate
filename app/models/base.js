module.exports = {
  /** 分页设定 */
  pagination: {
    maxResults: 10,
    maxResultsLimit: 5000,
    maxStartIndex: 500000,
  },

  /** sort 设定 */
  sort: {
    default: 'id',
    allow: ['id', 'createdAt', 'updatedAt'],
  },
};
