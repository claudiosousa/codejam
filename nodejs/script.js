var fs = require('fs');


var processCase = function (acase, i) {
  }


var parseCases = function (linesPerCase) {
    var inputStr = fs.readFileSync('input.in', { encoding: 'utf8' });

    var lines = inputStr.trim().split('\n');
    var nbCases = Number(lines[0]);
  var cases = new [];

                 for (var i = 0; i < cases.length; i++) {
                {
                    var cas = {};
                    var lineParts = lines[i+1].Split(' ');
                    cas.input = lineParts.map(function(p){return Number(p)});
                    cases.push(cas);
                }
                return cases;

}

var printCasesOutput = function () {
    for (var i = 0; i < cases.length; i++) {
        console.log("Case #" + (i + 1) + ": " + cases[i].output);
    }
}


var cases = parseCases();
cases.forEach(function (acase, i) { 
    processCase(acase, i) 
});
printCasesOutput();


        class Case
        {
            public int[] input;
            public string output;

            public static Case[] parseinput(string input)
            {
                string[] lines = input.Trim().Split('\n').Select(l => l.TrimEnd('\r')).ToArray();

                long nbCases = Convert.ToInt64(lines[0]);
                Case[] cases = new Case[nbCases];

                for (int i = 0; i < nbCases; i++)
                {
                    var caseLine = i + 1;
                    var lineParts = lines[caseLine].Split(' ');
                    Case newcase = new Case { input = lineParts.Select(n => Convert.ToInt32(n)).ToArray() };
                    cases[i] = newcase;
                }
                return cases;
            }
        }

