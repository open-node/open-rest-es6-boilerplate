import U            from '../lib/utils';
import config       from '../configs';
import writeLogger  from './write-logger';
import privateCheck from './private-client-check';
import user         from './user';
import i18n         from './i18n';

const { accessLog, dateTimeFormat, languages, defaultLanguage } = config;

export default [
  U.openRestAccessLog(accessLog, dateTimeFormat),
  writeLogger(),
  privateCheck(config.proxyIps, config.privateIps),
  user(config.allowGuestAccessPaths),
  i18n(languages, defaultLanguage)
]
