#! /usr/bin/env node

const Restspec = require('restspec');
const config = require('../app/configs/config.test');
const options = require('./options');

module.exports = (done) => {
  const opts = options(config);
  opts.hooks.done = done;
  return new Restspec(opts);
};
