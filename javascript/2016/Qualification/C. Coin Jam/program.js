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


function processScenario(length, nb2find) {
    jamCoins = [];

    var max = Math.pow(2, length - 2);
    for (var i = 0; i < max; i++) {
        var dividors = [];
        for (var b = 2; b <= 10; b++) {
            //var nb = Math.pow(b, i) + 1 + Math.pow(b, length - 1);
            var nb = parseInt('1' + padLeft(i.toString(2), length - 2) + '1', b)
            var div = leastFactor(nb);
            if (!div)
                break;
            dividors.push(div);
        }
        if (dividors.length == 9) {
            jamCoins.push('1' + padLeft(i.toString(2), length - 2) + '1 ' + dividors.join(' '));
            if (jamCoins.length == nb2find)
                break;
        }
    }
    return '\n' + jamCoins.join('\n');
}


fs.writeFileSync(lastInFile.replace(/\.in$/, '.out'), outputLines.join('\n'));

process.exit(0);

function padLeft(nr, n) {
    return Array(n - nr.length + 1).join('0') + nr;
}

function leastFactor(n, max) {
    if (n % 2 == 0) return 2;
    if (n % 3 == 0) return 3;
    if (n % 5 == 0) return 5;
    var m = Math.sqrt(n);
    for (var i = 7; i <= m; i += 30) {
        if (n % i == 0) return i;
        if (n % (i + 4) == 0) return i + 4;
        if (n % (i + 6) == 0) return i + 6;
        if (n % (i + 10) == 0) return i + 10;
        if (n % (i + 12) == 0) return i + 12;
        if (n % (i + 16) == 0) return i + 16;
        if (n % (i + 22) == 0) return i + 22;
        if (n % (i + 24) == 0) return i + 24;
    }
    return false;
}