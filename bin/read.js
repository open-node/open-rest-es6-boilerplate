#!/usr/bin/env node

var _           = require("lodash")
  , fs          = require("fs")
  , stdin       = ''

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk === null) return;
  stdin += chunk;
});

var read = function() {
  var files = stdin.trim().split('\n');
  var translations = {};
  var outPut = "";
  var regxps = {
    eco: [
      /\@t\s(["'])([^\n]*?)\1.*/,
      2
    ],
    hbs: [
      /{{\s*t\s(["'])([^\n]*?)\1.*}}/,
      2
    ],
    es: [
      /error[\( ](['"])([^\n]*?)\1/i,
      2
    ]
  };
  _.each(files, function(file) {
    var ext = file.split('.').pop();
    var lines = fs.readFileSync(file).toString().trim().split('\n');
    var reg = regxps[ext];
    if (!reg) return;
    _.each(lines, function(line, lineCounter) {
      var found = line.match(reg[0]);
      if (!found) return;
      var key = found[reg[1]];
      if (!key) return;
      if (!translations[key]) translations[key] = [];
      translations[key].push("#: " + file + ": " + (lineCounter + 1));
    });
  });


  // Write the POT file out of the _translation hash
  _.each(translations, function(value, key) {
    outPut += value.join('\n') + "\n";
    outPut += "msgid \"" + key.replace(/"/g, '\\"') + "\"\n";
    outPut += 'msgstr ""\n\n';
  });

  process.stdout.write(outPut);
};

process.stdin.on('end', read);
