import U from '../lib/utils';

export default () => {
  return (req, res, next) => {
    /** log的记录不影响正常的访问，所以先直接调用next */
    next()
    /** 读操作略过 */
    if (req.method === 'GET') return;

    var log = {
      params: JSON.stringify(req.params),
      uri: req.url,
      verb: req.method
    };

    U.onFinished(res, () => {
      if (res.header("X-Content-Resource-Status") === 'Unchanged') return;
      if (res.statusCode >= 400) return;

      log.statusCode = res.statusCode;
      log.clientIp = req._clientIp;
      log.userId = req.user ? req.user.id : 0;
      log.response = res._data;

      U.model('log').create(log);
    });
  };
};
