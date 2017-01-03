#!/usr/bin/env node

const U = require('../app/lib/utils');
const { exec } = require('child_process');
const config = require('../app/configs/config.test');

const strfile = `${__dirname}/../app/configs/table.sql`;
const datafile = `${__dirname}/../app/configs/test-data.sql`;
const db = config.db || {};
const cache = config.cache || {};

let mysqlAuth = `mysql -h${db.host} -u${db.user} -P ${db.port}`;

if (db.pass) mysqlAuth += ` -p'${db.pass}'`;
const command = [
  `${mysqlAuth} ${db.name} < ${strfile}`,
  `${mysqlAuth} ${db.name} < ${datafile}`,
].join('\n');

const execSQL = () => (
  exec(command, (error, stdout, stderr) => {
    if (error) throw error;
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    process.exit(0);
  })
);

// flushRedis
U.cached.init(cache.port, cache.host, cache.opts);
U.cached.flush('*', (error) => {
  if (error) {
    console.error(error, error.stack);
    return process.exit(0);
  }
  return execSQL();
});
