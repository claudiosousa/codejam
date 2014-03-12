var fs = require('fs');
var LINES_PER_CASE = 3;

var processCase = function (acase) {

    acase.input[1].sort(function (a, b) { return b - a });
    acase.input[2].sort(function (a, b) { return a - b });
    var nElements = acase.input[0];
    var multiplication = 0;
    for (var i = 0; i < nElements ; i++) {
        multiplication += acase.input[1][i] * acase.input[2][i];
    }
    acase.output = multiplication;
    debugger;
}

var cases = [];
var parseCases = function () {
    var inputFile = process.argv[2];
    var inputStr = fs.readFileSync(inputFile, { encoding: 'utf8' });

    var lines = inputStr.split('\n');
    var nbCases = Number(lines[0]);
    for (var i = 0; i < nbCases; i++) {
        var caseLine = i * LINES_PER_CASE + 1;
        var newcase = {
            input: []
        }
        for (var iLine = 0; iLine < LINES_PER_CASE; iLine++) {
            newcase.input.push(lines[caseLine + iLine].split(' ').map(function (nb) { return Number(nb) }));
        }
        cases.push(newcase);
    }
}

var printCasesOutput = function () {
    for (var i = 0; i < cases.length; i++) {
        console.log("Case #" + (i + 1) + ": " + cases[i].output);
    }
}


parseCases();
cases.forEach(function (acase) { processCase(acase) });
printCasesOutput();