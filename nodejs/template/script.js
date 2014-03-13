var fs = require('fs');

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

var lines = inputStr.split('\n');
var nbCases = Number(lines[0]);
var linesPerCase = (lines.length - 1) / nbCases;
for (var i = 0; i < nbCases; i++) {
    var caseLine = i * linesPerCase + 1;
    var newcase = {
        input: []
    }
    for (var iLine = 0; iLine < linesPerCase; iLine++) {
        var lineStr = lines[caseLine + iLine];
        var lineValues = lineStr.split(' ');
        lineValues = lineValues.map(function (nb) { 
            return Number(nb);
        });
        newcase.input.push(lineValues);
    }
    cases.push(newcase);
}

var printCasesOutput = function () {
    for (var i = 0; i < cases.length; i++) {
        console.log("Case #" + (i + 1) + ": " + cases[i].output);
    }
}


parseCases();
cases.forEach(function (acase) { processCase(acase) });
printCasesOutput();