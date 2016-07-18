#!/usr/bin/env node

var U     = require('../build/app/lib/utils').default
  , exec  = require('child_process').exec
  , db    = require('../build/app/configs/config.apitest').default.db
  , cache = require('../build/app/configs/config.apitest').default.cache
  , strfile = __dirname + "/../src/app/configs/table.sql"
  , datafile = __dirname + "/../src/app/configs/test-data.sql";

var command = [
  "mysql -h" + db.host + " -u" + db.user + " -P " + db.port + " -p'" + db.pass + "' " + db.name + " < " + strfile,
  "mysql -h" + db.host + " -u" + db.user + " -P " + db.port + " -p'" + db.pass + "' " + db.name + " < " + datafile
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
