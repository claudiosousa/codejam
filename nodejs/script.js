var fs = require('fs');


var processCase = function (cas, i) {
    cas.output = i;
  }

    var cases =  [];
var parseCases = function (linesPerCase) {
    var inputStr = fs.readFileSync('input.in', { encoding: 'utf8' });

    var lines = inputStr.trim().split('\n');
    var nbCases = Number(lines[0]);

    for (var i = 0; i < nbCases; i++) {                
        var cas = {};
        var lineParts = lines[i+1].split(' ');
        cas.input = lineParts.map(function(p){return Number(p)});
        cases.push(cas);
    }

}

var printCasesOutput = function () {
    for (var i = 0; i < cases.length; i++) {
        console.log("Case #" + (i + 1) + ": " + cases[i].output);
    }
}


 parseCases();
cases.forEach(function (cas, i) {     processCase(cas, i) });
printCasesOutput();

debugger;
      

