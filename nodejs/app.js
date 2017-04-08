const getStdin = require('get-stdin'),
    fsp = require('fs-promise'),
    math = require('mathjs');

math.config({
    number: 'BigNumber',
    precision: 20
});

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
        cases.push([math.bignumber(lineParts[0]), math.bignumber(lineParts[1])]);
    }

    return cases;
}

function processCase([N, K], i) {
    let powerof2 = math.pow(2, math.log(K, math.bignumber(2)));
    let free = math.ceil(math.divide(math.subtract(N, math.subtract(K, 1)), powerof2));
    free = math.subtract(free, 1);
    free = math.divide(free, 2);
    return math.ceil(free).toNumber() + " " + math.floor(free).toNumber();
}
