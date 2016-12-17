#!/usr/bin/env node

const U         = require('../app/lib/utils');
const exec      = require('child_process').exec;
const db        = require('../app/configs/config.apitest').db || {};
const cache     = require('../app/configs/config.apitest').cache || {};
const strfile   = `${__dirname}/../app/configs/table.sql`;
const datafile  = `${__dirname}/../app/configs/test-data.sql`;
let mysqlAuth   = `mysql -h${db.host} -u${db.user} -P ${db.port}`;

if (db.pass) mysqlAuth += ` -p'${db.pass}'`;
const command = [
  `${mysqlAuth} ${db.name} < ${strfile}`,
  `${mysqlAuth} ${db.name} < ${datafile}`
].join('\n');

// flushRedis
U.cached.init(cache.port, cache.host, cache.opts);
U.cached.flush('*', function(error) {
  if (error) {
    console.error(error, error.stack);
    return process.exit(0);
  }
  exec(command, function(error, stdout, stderr) {
    if (error) throw error;
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    process.exit(0);
  });
});
