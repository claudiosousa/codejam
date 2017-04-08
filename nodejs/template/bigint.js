const getStdin = require('get-stdin'),
    bigInt = require("big-integer"),
    fsp = require('fs-promise');

(process.argv.length > 2 ? fsp.readFile(process.argv[2], { encoding: 'utf8' }) : getStdin())
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
        cases.push(bigInt(lineParts[0]));
    }

    return cases;
}

function processCase(cas, i) {
    let nb = cas;
    while (true) {
        let charArr = nb.toString().split('');

        for (var i = 1; i < charArr.length; i++)
            if (charArr[i] < charArr[i - 1]) {
                nb = nb.minus(bigInt(charArr.slice(i).join('')).plus(1));
                break;
            }

        if (i == charArr.length)
            break;
    }
    return nb.toString();
}
