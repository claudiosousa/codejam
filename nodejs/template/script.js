var fs = require('fs');

var processCase = function (acase) {
    debugger;
    var val = Math.pow(3 + Math.sqrt(5), acase.input[0][0]);
    var to1000 = Math.floor(val) % 1000 + "";
    while (to1000.length < 3)
        to1000 = "0" + to1000;
    acase.output = to1000;
}




var cases = [];
var parseCases = function (linesPerCase) {
    var inputFile = process.argv[2];
    var inputStr = fs.readFileSync(inputFile, { encoding: 'utf8' });

    var lines = inputStr.trim().split('\n');
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
}

var printCasesOutput = function () {
    for (var i = 0; i < cases.length; i++) {
        console.log("Case #" + (i + 1) + ": " + cases[i].output);
    }
}


parseCases();
cases.forEach(function (acase) { processCase(acase) });
printCasesOutput();