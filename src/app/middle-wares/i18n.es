import U from '../lib/utils';
import i18n from 'open-i18n';

const locales = [
  ['params', '_locale'],
  ['user', 'language'],
  [
    'headers',
    'accept-language',
    (v) => {
      if (!U._.isString(v)) return;
      v.split(';')[0].split(',')[1]
    }
  ]
];

export default (languages, defaultLanguage) => {
  const LANGS = U.getModules(`${__dirname}/../../../locale`, ['json']);
  return (req, res, next) => {
    req._locale = defaultLanguage;
    for (let x of locales) {
      let v = req[x[0]][x[1]];
      if (x[2]) v = x[2](v);
      if (languages.indexOf(v) < 0) continue;
      req._locale = v;
      break;
    }

    /** 改写默认的 res.send 为了处理 message */
    var send = res.send;
    res.send = function (code, body, headers) {
      var error, t, translate;
      if (!arguments.length) return send.apply(res, arguments);
      if (typeof code !== 'number') body = code;
      if (!(body instanceof Error)) return send.apply(res, arguments);
      error = body.body;
      if (!error) return send.apply(res, arguments);

      t = i18n(languages, req._locale, LANGS).t
      translate = (x) => {
        if (x.value != null) {
          return t(x.message, x.value.value || x.value);
        } else {
          return t(x.message);
        }
      };

      if (U._.isArray(error.message)) {
        error.message = U._.map(error.message, (x) => {
          x.message = translate(x);
          return x;
        });
      } else if (U._.isString(error.message)) {
        error.message = translate(error);
      }

      return send.apply(res, arguments);
    };

    return next();
  };
};
