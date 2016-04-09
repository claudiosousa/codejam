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
    .sort((a, b) => a.time < b.time)[0];

if (!lastInFile.local)
    fs.copySync(lastInFile.fd, lastInFile.f);
lastInFile = lastInFile.f;

var datastr = fs.readFileSync(lastinfile, "utf8").split('\n');
var outputLines = [];


/*
var size = datastr[0].split(' ');
var cols = Number(size[1]);
var rows = Number(size[0]);
*/
//var data = datastr.slice(1).map(l=> l.split(''));
var data = datastr.slice(1).filter(d => d != '').map(Number);



data.forEach(processScenario);


function processScenario(n, ni) {
    var digits2found = [];
    for (var i = 0; i < 10; i++)
        digits2found.push(i + '');

    var found = false;
    var checkDigits = function(n) {
        var str = n.toString().split('');
        var i = 0;
        while (i < digits2found.length) {
            if (str.indexOf(digits2found[i]) !== -1)
                digits2found.splice(i, 1);
            else
                i++;
        }
        return digits2found.length == 0;
    }
    for (var i = 1; i < 100; i++) {
        if (checkDigits(n * i)) {
            found = true;
            break;
        }
    }
    outputLines.push('Case #' + (ni + 1) + ': ' + (found ? n * i : 'INSOMNIA'));
}


fs.writeFileSync(lastinfile.replace(/\.in$/, '.out'), outputLines.join('\n'));

process.exit(0);

