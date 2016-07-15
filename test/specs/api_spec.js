#! /usr/bin/env node

var Restspec = require('restspec')
  , config   = require('../../build/app/configs/config.apitest').default
  , options  = require('./options');

new Restspec(options(config));
