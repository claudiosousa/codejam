const getStdin = require('get-stdin'),
    fsp = require('fs-promise');

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
    let offset = 0;
    for (var i = 0; i < nbCases; i++) {
        let [cities, routes] = lines[i + 1 + offset].split(' ').map(Number);
        let horses = [];
        for (var j = 1; j < cities; j++) {
            horses.push(lines[i + 1 + offset + j].split(' ').map(Number));
        }
        offset += cities;
        for (var j = 1; j < cities; j++) {
            lineParts = lines[i + 1 + offset + j].split(' ').map(Number);
            horses[j - 1].push(lineParts[j]);
        }
        offset += cities + 1;
        cases.push(horses);
    }

    return cases;

}
let hs;
function processCase(horses, ic) {
    hs = horses.map(h => ({
        e: h[0],
        s: h[1],
        d: h[2]
    }));
    let h1 = hs[0];
    return getbesttime(0, h1.d / h1.s, h1.e - h1.d, h1.s);
}


function getbesttime(i, time, hdist, hspeed) {
    i++;
    if (hs.length == i)
        return time;
    let h = hs[i];

    let t0 = Number.MAX_VALUE, t1 = Number.MAX_VALUE;
    if (hdist >= h.d)
        t0 = getbesttime(i, h.d / hspeed, hdist - h.d, hspeed);
    if (h.s > hspeed || h.e > hdist)
        t1 = getbesttime(i, h.d / h.s, h.e - h.d, h.s);
    return time + Math.min(t0, t1);
}