var fs = require('fs');
var datastr = fs.readFileSync('learn_and_teach.in', "utf8").split('\n');

var size = datastr[0].split(' ');
var cols = Number(size[1]);
var rows = Number(size[0]);

var data = datastr.slice(1).map(l=> l.split(''));
var datacopy = JSON.parse(JSON.stringify(data));
var blocks = [];
var buildBlock = function (r, c) {
    var pieces = [];
    console.log(blocks.length);
    var minc, minr, maxc, maxr;
    minc = maxc = c;
    minr = maxr = r;
    var addPiece = function (r, c) {
        pieces.push([r, c]);
        if (c < minc) minc = c;
        if (c > maxc) maxc = c;
        if (r < minr) minr = r;
        if (r > maxr) maxr = r;
        data[r][c] = '0';
        var dir = [-1, 0, 1];
        for (var x of dir) {
            var c2 = c + x;
            if (c2 < 0 || c2 >= cols)
                continue;
            for (var y of dir) {
                var r2 = r + y;
                if (r2 < 0 || r2 >= rows)
                    continue;
                if (data[r2][c2] !== '#')
                    continue;
                addPiece(r2, c2);
            }
        }
    };
    addPiece(r, c);

    var blockdata = [];
    var rows = maxr - minr + 1;
    var cols = maxc - minc + 1;
    blocks.push([minr, minc, rows, cols, blockdata]);
    for (var piece of pieces)
        blockdata[(piece[0] - minr) * cols + (piece[1] - minc)] = 1;
};

for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
        if (data[r][c] !== '#')
            continue;
        buildBlock(r, c);
    }
}

var commands = [];

var decomposeBlock = function (block) {
    var startr = block[0];
    var startc = block[1];
    var rows = block[2];
    var cols = block[3];
    var data = block[4];

    var fillLine = function (r, c, data, isLine) {
        var res = { score: 0, data: data, command: "PAINT_LINE " + (startr + r) + " " + (startc + c) + " " };
        var lasrvalidrc;
        while (r < rows && c < cols && data[r * cols + c] === 1) {
            res.score++;
            data[r * cols + c] = 2;
            lasrvalidrc = [r, c];
            if (isLine)
                c++;
            else
                r++;
        }
        res.command += (startr + lasrvalidrc[0]) + " " + (startc + lasrvalidrc[1]);
        return res;
    };

    var addLine = function (r, c, data) {
        return fillLine(r, c, data, true);
    }

    var addCol = function (r, c, data) {
        return fillLine(r, c, data, true);
    };

    var fillBlockCell = function (r, c) {
        var res_line = addLine(r, c, data.slice());
        var res_col = addCol(r, c, data.slice());
        var bestRes = res_line.score > res_col.score ? res_line : res_col
        commands.push(bestRes.command);

        var parts = bestRes.command.split(' ').map(Number);
        var y1 = parts[1], x1 = parts[2], y2 = parts[3], x2 = parts[4];

        for (var x = x1; x <= x2; x++) {
            for (var y = y1; y <= y2; y++) {
                datacopy[y][x] = 'O';
            }
        }
        data = bestRes.data;
    };

    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            if (data[r * cols + c] !== 1)
                continue;
            fillBlockCell(r, c, data);
        }
    }
};
/*
var i = 0;
var writeBlock = function (block) {
    var rows = block[2];
    var cols = block[3];
    var data = block[4];
    var res = "";
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            if (data[r * cols + c] !== 1)
                res += " ";
            else
                res += "#";
        }
        res+='\n';
    }
    fs.writeFileSync('block' + i + '.out', res);
    i++;
};
*/
for (var block of blocks) {
    //writeBlock(block);
    decomposeBlock(block);
}

commands.splice(0, 0, commands.length);
fs.writeFileSync('output.out', commands.join('\n'));
fs.writeFileSync('output2.out', datacopy.map(l=> l.join('')).join('\n'));

process.exit(0);

/*
'PAINT_SQUARE'
'PAINT_LINE'
'ERASE_CELL'

*/