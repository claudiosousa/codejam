var fs = require('fs');

var inputFile = process.argv[2];

var inputStr = fs.readFileSync(inputFile, { encoding: 'utf8' });

var lines = inputStr.split('\n');
var nbCases = Number(lines[0]);
var cases = [];
for (var i = 0; i < nbCases; i++) {
    var lineI = i * 3 + 1;
    var newcase = {
        total: Number(lines[lineI]),
        products: lines[lineI + 2].split(' ').map(function (v) { return Number(v) })
    }
    cases.push(newcase);
}
for (var i = 0; i < cases.length; i++) {
    var currentCase = cases[i];
    var total = currentCase.total;
    var productsfound = false;
    for (var i1 = 0; i1 < currentCase.products.length - 1; i1++) {
        var p1 = currentCase.products[i1];
        if (p1 >= total)
            continue;
        var remaining = total - p1;
        for (var i2 = i1 + 1; i2 < currentCase.products.length; i2++) {
            var p2 = currentCase.products[i2];
            if (p2 == remaining) {
                currentCase.buy = [i1 + 1, i2 + 1];
                productsfound = true;
                break;
            }
        }
        if (productsfound) {
            productsfound = false;
            break;
        }
    }
}
for (var i = 0; i < cases.length; i++) {
    console.log("Case #" + (i + 1) + ": " + cases[i].buy.join(' '));
}
//Case #1: 2 3
