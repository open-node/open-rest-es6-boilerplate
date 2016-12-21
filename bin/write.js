#!/usr/bin/env node

const fs = require('fs');

const po2json = (str) => {
  const translate = {};
  const regxp = /\nmsgid "([^\n]+)"\nmsgstr "([^\n]+)"/g;
  str.replace(regxp, (txt, key, value) => {
    translate[key] = value;
  });
  return JSON.stringify(translate, null, 2);
};

const write = (po, lang, dest = `${__dirname}/../locale/${lang}.json`) => {
  const str = fs.readFileSync(po).toString();
  const json = po2json(str);
  fs.writeFileSync(dest, json);
};

write.apply(null, ...process.argv.slice(2));
