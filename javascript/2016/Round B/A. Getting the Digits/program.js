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

var data = datastr.slice(1);


var uniq = ['Z', 0, 'W', 2, 'G', 8, 'X', 6, 'S', 7, 'V', 5, 'H', 3, 'F', 4, 'O', 1, 'E', 9];
var words = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];


data.forEach((s, i) => {
    outputLines.push('Case #' + (i + 1) + ': ' + processScenario(s));
});

function processScenario(s) {
    var letters = {};
    s.split('').forEach(function (c) {
        if (letters[c])
            letters[c]++;
        else
            letters[c] = 1;
    });

    var nbs = [];
    for (var i = 0; i <= 9; i++) {
        var uniqnb = uniq[i * 2 + 1];
        var word = words[uniqnb];
        var uniqletter = uniq[i * 2];
        while (letters[uniqletter]) {
            nbs.push(uniqnb);
            for (c of word)
                letters[c]--;
        }
    }

    nbs = nbs.sort();

    return nbs.join('');
}


var resfile = lastInFile.replace(/\.in$/, '.out');
fs.writeFileSync(resfile, outputLines.join('\n'));
console.log('Result: ' + resfile);
process.exit(0);
