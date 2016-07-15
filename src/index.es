#! /usr/bin/env node

import U from './app/lib/utils';
import config from './app/configs';

const cache = config.cache || {};

U.cached.init(cache.port, cache.host, cache.opts);
U.rest(`${__dirname}/app`);
