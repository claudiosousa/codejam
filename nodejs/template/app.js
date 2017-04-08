const getStdin = require('get-stdin');

getStdin()
    .then(parseCases)
    .then(cases => cases.map(processCase))
    .then(printCasesOutput)
    .catch(console.error);

function printCasesOutput(outputs) {
    outputs.forEach((output, i) => {
        console.log("Case #" + (i + 1) + ": " + output);
    })
}

function parseCases(inputStr) {
    let lines = inputStr.trim().split('\n');
    let nbCases = Number(lines[0]);
    let cases = [];

    for (var i = 0; i < nbCases; i++) {
        let lineParts = lines[i + 1].split(' ');
        cases.push(Number(lineParts));
    }

    return cases;
}

function processCase(cas, i) {
    return cas;
}
