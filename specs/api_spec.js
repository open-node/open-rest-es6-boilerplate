#! /usr/bin/env node

const Restspec = require('restspec');
const config   = require('../app/configs/config.apitest');
const options  = require('./options');

module.exports = function(done) {
  var opts = options(config);
  opts.hooks.done = done;
  return new Restspec(opts);
};
