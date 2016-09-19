#!/usr/bin/env node

var _           = require("lodash")
  , fs          = require("fs");

var po2json = function(str) {
  var translate = {};
  var regxp = /\nmsgid "([^\n]+)"\nmsgstr "([^\n]+)"/g;
  str.replace(regxp, function(txt, key, value) {
    translate[key] = value;
  });
  return JSON.stringify(translate, null, 2);
};

var write = function(poFile, lang, destFile) {
  if (!destFile) destFile = __dirname + '/../locale/' + lang + '.json';
  var str = fs.readFileSync(poFile).toString();
  var json = po2json(str);
  fs.writeFileSync(destFile, json);
};

write.apply(null, process.argv.slice(2));
