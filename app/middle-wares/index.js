const U = require('../lib/utils');
const config = require('../configs');
const writeLogger = require('./write-logger');
const privateCheck = require('./private-client-check');
const user = require('./user');
const i18n = require('open-i18n');

const { accessLog, dateTimeFormat, languages, defaultLanguage } = config;
const LANGS = U.getModules(`${__dirname}/../../locale`, ['json']);

module.exports = [
  U.openRestAccessLog(accessLog, dateTimeFormat),
  writeLogger(),
  privateCheck(config.proxyIps, config.privateIps),
  user(new Set(config.allowGuestAccessPaths)),
  i18n.middleWare(languages, defaultLanguage, LANGS),
];
