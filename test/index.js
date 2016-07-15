#! /usr/bin/env node

var cp    = require('child_process');

process.env.NODE_ENV = 'apitest';

var service = (function() {

  var child = null;

  return {
    start: function(callback) {
      child = cp.spawn(__dirname + '/../build/index.js');
      console.log("service process pid: %d",  child.pid);
      child.stdout.on('data', function(out) {
        if (process.env.output === 'yes') process.stdout.write(out);
        if (/listening/.test(out)) callback(null, 'started');
      });
      child.on('error', console.error.bind(console));
      child.stderr.on('data', process.stderr.write.bind(process.stderr));
      child.on('close', function(code) {
        console.log("Service stopped");
      });
      child.on('message', function(message) {
        callback(null, message);
      });
    },
    stop: function(callback) {
      console.log("service.stop called");
      child.kill();
      if (callback) setTimeout(callback, 2000);
    }
  };
})();

var exec = function(cmd, callback) {
  var child = cp.exec(cmd);
  child.stdout.on('data', process.stdout.write.bind(process.stdout));
  child.stderr.on('data', process.stderr.write.bind(process.stderr));
  child.on('error', callback);
  child.on('close', function(code) { callback(null, code); });
};

var testBeforeCmds = [
  "npm install"
].join(" && ")

exec(testBeforeCmds, function(error, code) {
  if (error) throw error;
  var cmds = [
    "mocha test/units/",
    "./bin/apitest-init.js && node test/specs/api_spec.js"
  ].join(" && ");
  service.start(function(error, message) {
    if (error) throw error;
    if (message !== 'started') return console.log(message);
    exec(cmds, function(error, code) {
      if (error) throw error;
      service.stop(process.exit);
    });
  });
});
