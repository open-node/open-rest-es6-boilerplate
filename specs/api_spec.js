#! /usr/bin/env node

var Restspec = require('restspec')
  , config   = require('../build/app/configs/config.apitest').default
  , options  = require('./options');

module.exports = function(done) {
  var opts = options(config);
  opts.hooks.done = done;
  return new Restspec(opts);
};
