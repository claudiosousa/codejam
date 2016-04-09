var fs = require('fs-extra')
var path = require('path');
var downloadsPath = path.join(process.env.USERPROFILE, 'Downloads');
var lastInFile = fs.readdirSync(downloadsPath)
    .map(f => ({ f: f, d: downloadsPath, local: false }))
    .concat(fs.readdirSync('./')
        .map(f => ({ f: f, d: './', local: true })))
    .map(f => ((f.fd = path.join(f.d, f.f)) && f))
    .filter(f => f.f.match(/\.in$/))
    .map(f => ((f.time = fs.statSync(f.fd).mtime) && f))
    .sort((a, b) => a.time > b.time ? -1 : 1)[0];

if (!lastInFile.local)
    fs.copySync(lastInFile.fd, lastInFile.f);
lastInFile = lastInFile.f;

var outputLines = [];

var datastr = fs.readFileSync(lastInFile, "utf8").split('\n');

/*
var size = datastr[0].split(' ');
var cols = Number(size[1]);
var rows = Number(size[0]);
*/
//var data = datastr.slice(1).map(l=> l.split(''));
//var data = datastr.slice(1).filter(d => d != '').map(Number);
var data = datastr.slice(1).filter(d => d != '')

data.forEach((s, i) => {
    outputLines.push('Case #' + (i + 1) + ': ' + processScenario.apply(processScenario, s.split(' ').map(Number)));
});


function processScenario(k, c, s) {
    if (s < k - 1 || s == k - 1 && c == 1)
        return "IMPOSSIBLE";
    var res = [];
    for (var i = (c > 2 && k > 1 ? 2 : 1); i <= k; i++)
        res.push(i);
    return res.join(' ');
}


fs.writeFileSync(lastInFile.replace(/\.in$/, '.out'), outputLines.join('\n'));

process.exit(0);
