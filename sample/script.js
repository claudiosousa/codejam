var fs = require('fs');

var processCase = function(acase){
}

var cases = [];
var parseCases = function(linesPerCase){
	var inputFile = process.argv[2];
	var inputStr = fs.readFileSync(inputFile, { encoding: 'utf8' });

	var lines = inputStr.split('\n');
	var nbCases = Number(lines[0]);
	for (var i = 0; i < nbCases; i++) {
		var caseLine = i * linesPerCase + 1;
		var newcase = {
			input:[]
		}
		for (var iLine = 0; iLine < linesPerCase; iLine++) {
			newcase.input.push(lines[caseLine+ iLine));
		cases.push(newcase);
 	}	
}

var printCasesOutput = function(){
	for (var i = 0; i < cases.length; i++) {
		console.log("Case #" + (i + 1) + ": " + cases[i].output);
	}
}


parseCases(1);
cases.forEach(function(acase){processCase(acase)});
printCasesOutput();

for (var i = 0; i < cases.length; i++) {
    var currentCase = cases[i];
    currentCase.output = currentCase.input.split(' ');
    currentCase.output.reverse();
}
