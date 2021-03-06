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
    parts[0];
    var K = parts.splice(3)[0];

    var possibilities = [];
    var combi = [{}, {}, {}];

    var testCombi = function (i, a, b) {
        var add = a + "_" + b;
        return combi[i][add] == undefined || combi[i][add] < K;
    }
    var addCombi = function (i, a, b) {
        var add = a + "_" + b;
        if (combi[i][add] == undefined)
            combi[i][add] = 1;
        else
            combi[i][add]++;
    }
    for (var j1 = 0; j1 < parts[0]; j1++) {
        for (var j2 = 0; j2 < parts[1]; j2++) {
            for (var j3 = 0; j3 < parts[2]; j3++) {
                var j2_ = j1 % 2 == 0 ? j2 : parts[1] - j2 - 1;
                var j3_ = j1 >= 2 == 0 ? j3 : parts[2] - j3 - 1;
                if (testCombi(0, j1, j2_) && testCombi(1, j1, j3_) && testCombi(2, j2_, j3_)) {
                    addCombi(0, j1, j2_);
                    addCombi(1, j1, j3_);
                    addCombi(2, j2_, j3_);
                    possibilities.push("\n" + (j1 + 1) + " " + (j2_ + 1) + " " + (j3_ + 1));
                }
            }
        }
    }

    res = possibilities.length + possibilities.join('');

    return res;
}

var resfile = lastInFile.replace(/\.in$/, '.out');
fs.writeFileSync(resfile, outputLines.join('\n'));
console.log('Result: ' + resfile);
process.exit(0);
