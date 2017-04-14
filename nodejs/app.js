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
    });
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
    let powerof2 = math.bignumber(2).pow(math.bignumber(K).log(2).floor());
    let free = N.sub(K.sub(1)).div(powerof2).ceil();
    free = free.sub(1).div(2);
    return free.ceil().toNumber() + " " + free.floor().toNumber();
}
