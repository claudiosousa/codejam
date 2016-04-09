var fs = require('fs');
var datastr = fs.readFileSync('learn_and_teach.in', "utf8").split('\n');

var size = datastr[0].split(' ');
var cols = Number(size[1]);
var rows = Number(size[0]);

var data = datastr.slice(1).map(l=> l.split(''));





commands.splice(0, 0, commands.length);
fs.writeFileSync('output.out', commands.join('\n'));

process.exit(0);
