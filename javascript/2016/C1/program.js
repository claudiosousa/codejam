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

for (var i = 0; i < data.length / 2; i++)
    outputLines.push('Case #' + (i + 1) + ': ' + processScenario(data[i * 2 + 1]));

function processScenario(s) {
    var parties = s.split(' ')
        .map(Number)
        .map((n, i) => { return { n: n, c: String.fromCharCode(65 + i) } });

    var sumPeolple;

    res = [];

    function testInstruction(moves) {
        var clonedParties = JSON.parse(JSON.stringify(parties));
        var tempRes = "";
        for (var i = 0; i < moves.length; i++) {
            var m = moves[i];
            var p = clonedParties[m];
            if (!p)
                return false;
            tempRes += p.c;
            p.n--;
            if (p.n == 0)
                clonedParties.splice(m, 1);
        }
        if (clonedParties.length > 0) {
            clonedParties = clonedParties.sort((a, b) => b.n - a.n);
            var sum = 0;
            clonedParties.forEach(p => sum += p.n);
            if (clonedParties[0].n > sum/2)
                return false;
        }
        parties = clonedParties;
        res.push(tempRes);
        return true;
    }

    var sortParties = function () {
        parties = parties.sort((a, b) => b.n - a.n);
        sumPeolple = 0;
        parties.forEach(p => sumPeolple += p.n);
    }
    sortParties();

    do {
        testInstruction([0, 0]) || testInstruction([0, 1]) || testInstruction([0]);
        sortParties();
    } while (sumPeolple > 0);

    return res.join(' ');
}

var resfile = lastInFile.replace(/\.in$/, '.out');
fs.writeFileSync(resfile, outputLines.join('\n'));
console.log('Result: ' + resfile);
process.exit(0);
