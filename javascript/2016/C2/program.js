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

var datastr = fs.readFileSync(lastInFile, "utf8")
    .split('\n')
    .filter(d => d != '')
    .map(s => s.replace(/\r/, ''));

/*
var size = datastr[0].split(' ');
var cols = Number(size[1]);
var rows = Number(size[0]);
*/
//var data = datastr.slice(1).map(l=> l.split(''));
//var data = datastr.slice(1).filter(d => d != '').map(Number);


var facts = {};
facts[0] = 1;
var fact = function (n) {
    if (facts[n] == undefined)
        facts[n] = n * fact(n - 1);
    return facts[n];
}


var data = datastr.slice(1);

for (var i = 0; i < data.length; i++)
    outputLines.push('Case #' + (i + 1) + ': ' + processScenario(data[i]));

function processScenario(s) {
    var parts = s.split(' ').map(Number);
    var B = parts[0];
    var M = parts[1];

    var inBetween = B - 2;
    var possiblePaths = 0;
    var inBetweenFact = fact(inBetween);
    for (var i = 0; i <= inBetween; i++)
        possiblePaths += inBetweenFact / fact(inBetween - i);
    var possible = possiblePaths >= M;
    var res = possible ? "POSSIBLE" : "IMPOSSIBLE";
    if (possible) {
        var matrix = [];
        var line = Array(B).fill(1);

        for (var i = 0; i < B; i++)
            matrix.push(line.slice(0));
        for (var i = 0; i < B; i++) {
            matrix[B - 1][i] = 0;
            matrix[i][i] = 0;
            matrix[i][0] = 0;
        }

        /*
                matrix[0][B - 1] = 1;
                for (var i = 0; i < M - 1; i++) {
                
                }*/
        res += matrix.map(l => "\n" + l.join('')).join('');
    }
    return res;
}

var resfile = lastInFile.replace(/\.in$/, '.out');
fs.writeFileSync(resfile, outputLines.join('\n'));
console.log('Result: ' + resfile);
process.exit(0);
