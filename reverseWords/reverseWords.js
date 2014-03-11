var fs = require('fs');

var inputFile = process.argv[2];

var inputStr = fs.readFileSync(inputFile, { encoding: 'utf8' });

var lines = inputStr.split('\n');
var nbCases = Number(lines[0]);
var cases = [];
for (var i = 0; i < nbCases; i++) {
    var lineI = i  + 1;
    var newcase = {
        input: lines[lineI]
    }
    cases.push(newcase);
}

for (var i = 0; i < cases.length; i++) {
    var currentCase = cases[i];
    currentCase.output = currentCase.input.split(' ');
    currentCase.output.reverse();
}
for (var i = 0; i < cases.length; i++) {
    console.log("Case #" + (i + 1) + ": " + cases[i].output.join(' '));
}
