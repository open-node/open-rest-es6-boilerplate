const U = require('../lib/utils');

module.exports = () => {
  const Log = U.model('log');

  return (req, res, next) => {
    /** log的记录不影响正常的访问，所以先直接调用next */
    next();
    /** 读操作略过 */
    if (req.method === 'GET') return;

    const log = {
      params: JSON.stringify(req.params),
      uri: req.url,
      verb: req.method,
    };

    U.onFinished(res, () => {
      if (res.header('X-Content-Resource-Status') === 'Unchanged') return;
      if (res.statusCode >= 400) return;

      log.statusCode = res.statusCode;
      log.clientIp = req._clientIp;
      log.userId = req.user ? req.user.id : 0;
      log.response = res._data;

      Log.create(log);
    });
  };
};
