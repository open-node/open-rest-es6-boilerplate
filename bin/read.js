#!/usr/bin/env node

const _ = require('lodash');
const fs = require('fs');

let stdin = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk === null) return;
  stdin += chunk;
});

const read = () => {
  const files = stdin.trim().split('\n');
  const translations = {};
  const regxps = {
    eco: [
      /@t\s(["'])([^\n]*?)\1.*/,
      2,
    ],
    js: [
      /error[( ](['"])([^\n]*?)\1/i,
      2,
    ],
  };
  let outPut = '';

  _.each(files, (file) => {
    const ext = file.split('.').pop();
    const lines = fs.readFileSync(file).toString().trim().split('\n');
    const reg = regxps[ext];
    if (!reg) return;
    _.each(lines, (line, lineCounter) => {
      const found = line.match(reg[0]);
      if (!found) return;
      const key = found[reg[1]];
      if (!key) return;
      if (!translations[key]) translations[key] = [];
      translations[key].push(`#: ${file}: ${(lineCounter + 1)}`);
    });
  });


  // Write the POT file out of the _translation hash
  _.each(translations, (value, key) => {
    outPut += `${value.join('\n')}\n`;
    outPut += `msgid "${key.replace(/"/g, '\\"')}"\n`;
    outPut += 'msgstr ""\n\n';
  });

  process.stdout.write(outPut);
};

process.stdin.on('end', read);
