var fs = require('fs');

var a = "nwlrbbmqbh".match(/(i|j|k|l|m|o|p|q|r|s|t|u|v|y|z|a|b|c|e|f|g|h)(q|r|t|u|v|w|x|y|z|a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p)(i|j|m|n|o|p|q|s|u|v|w|x|y|a|b|c|d|e|f|g|h)(f|g|h|i|j|k|l|m|o|p|q|r|s|t|u|v|x|y|z|b|c|d|e)(p|q|r|s|t|u|v|w|x|y|z|b|c|d|e|f|g|h|i|j|k|n|o)(g|h|i|j|l|p|q|s|u|v|w|x|y|z|a|b|c|d|e|f)(y|z|b|c|d|e|f|g|i|j|l|m|n|o|p|q|r|s|t|u|v|w|x)(n|o|p|q|r|s|t|u|v|w|x|y|z|a|b|c|d|e|f|g|h|i|j|k|l|m)(k|l|m|n|o|p|q|r|s|u|v|w|x|y|z|a|b|c|d|e|f|g|h|j)(r|s|t|u|v|w|x|b|c|d|e|f|g|i|j|k|l|m|n|o|p|q)/g)

var dictionary = []

var processCase = function (acase, i) {
  
    console.log(i);
    if (i == 4)
        debugger;
    acase.input = acase.input.replace(/\([^\)]*\)/g, function (m, b) {
        return m.replace(/([a-z])(?=[a-z])/g, '$1|');
    })

    acase.input = new RegExp(acase.input);
    acase.output = dictionary.filter(function (w) {
        return w.match(acase.input)
    }).length;
}




var cases = [];
var parseCases = function (linesPerCase) {
    var inputFile = process.argv[2];
    var inputStr = fs.readFileSync(inputFile, { encoding: 'utf8' });

    var lines = inputStr.trim().split('\n');
    var indexes = lines[0].split(' ');
    var words = Number(indexes[1]);
    var nbCases = Number(indexes[2]);
    for (var i = 0; i < words; i++) {
        dictionary.push(lines[i + 1]);
    }

    var linesPerCase = 1;
    for (var i = 0; i < nbCases; i++) {
        var caseLine = i * linesPerCase + 1 + words;
        var newcase = {
            input: null
        }
        newcase.input = lines[caseLine];
        cases.push(newcase);
    }
}

var printCasesOutput = function () {
    for (var i = 0; i < cases.length; i++) {
        console.log("Case #" + (i + 1) + ": " + cases[i].output);
    }
}


parseCases();
cases.forEach(function (acase, i) { processCase(acase, i) });
debugger;
printCasesOutput();