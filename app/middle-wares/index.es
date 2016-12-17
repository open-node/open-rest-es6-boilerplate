import U            from '../lib/utils';
import config       from '../configs';
import writeLogger  from './write-logger';
import privateCheck from './private-client-check';
import user         from './user';
import i18n         from 'open-i18n';

const { accessLog, dateTimeFormat, languages, defaultLanguage } = config;
const LANGS = U.getModules(`${__dirname}/../../../locale`, ['json']);

export default [
  U.openRestAccessLog(accessLog, dateTimeFormat),
  writeLogger(),
  privateCheck(config.proxyIps, config.privateIps),
  user(config.allowGuestAccessPaths),
  i18n.middleWare(languages, defaultLanguage, LANGS)
]
