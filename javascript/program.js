var fs = require('fs');
var datastr = fs.readFileSync('mother_of_all_warehouses.in', "utf8").split('\n');

var size = datastr[0].split(' ');
var rows = Number(size[0]);
var cols = Number(size[1]);
var d_count = Number(size[2]);
var deadline = Number(size[3]);
var maxload = Number(size[4]);
var p_count = Number(datastr[1]);
var p_weights = datastr[2].split(' ').map(Number);
var w_count = Number(datastr[3]);
var w_items = [];

var currentLine = 3;
for (var i = 0; i < w_count; i++) {
    currentLine++;
    var coords = datastr[currentLine].split(' ').map(Number);
    currentLine++;
    var items = datastr[currentLine].split(' ').map(Number);
    w_items.push({ id: i, coords: coords, items: items });
}

var c_count = Number(datastr[++currentLine]);
var c = [];
var c_prods = [];
for (var i = 0; i < c_count; i++) {
    currentLine++;
    var coords = datastr[currentLine].split(' ').map(Number);
    currentLine++;
    currentLine++;
    var prods = [];
    datastr[currentLine].split(' ').map(Number).forEach(p=> {
        if (!prods[p])
            prods[p] = 1;
        else
            prods[p]++;
    });
    c_prods.push({ id: i, coords: coords, prods: prods });
}



/*
fs.writeFileSync('data.json', JSON.stringify({
    
}));
*/

/*
fs.writeFileSync('data.json', JSON.stringify({
    c_prods
}));
*/

var getDistance = function (c1, c2) {
    return Math.ceil(Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2)));
};


c_prods = c_prods.sort((a, b) => {
    var getval = function (c) {
        return /*getDistance(w_coords[0], c.coords)*/ + c.prods.length;
    }
    return getval(a) - getval(b);
})


var tasks = [];

c_prods.forEach(c=> {
    c.prods.forEach((nb, p) => {
        tasks.push({ id: c.id, coords: c.coords, p: p, nb: nb });
    });
});

var commands = [];

var turns = 0;
var drones = [];
for (var i = 0; i < d_count; i++) {
    drones.push({
        turns: 0,
        coords: [0, 0]
    });
}

var getWareHouseForProduct = function (p, nb, coords) {
    var ws = w_items.filter(w=> w.items[p] >= nb);
    if (ws.length > 0) {
        ws = ws.sort((w1, w2) => getDistance(coords, w1) - getDistance(coords, w2));
        return ws[0];
    }
    throw "TODO";
}
var processOrders = function () {
    var donesomething = true;
    while (donesomething && tasks.length > 0) {
        donesomething = false;
        for (var i = 0; i < d_count; i++) {
            var drone = drones[i];
            var task = tasks[0];
            var warehouse = getWareHouseForProduct(task.p, task.nb, task.coords);
            var dist_to_w = getDistance(drone.coords, warehouse.coords);
            drone.coords = warehouse.coords;
            var dist_to_c = getDistance(drone.coords, task.coords);
            drone.turns += dist_to_w + 1 + dist_to_c + 1;
            var pcarried = [];
            var dropCommands = [];
            var writeCommands = function () {
                pcarried.forEach((nb, p) => {
                    if (nb > 0)
                        commands.push(i + " L " + warehouse.id + " " + p + " " + nb);
                });
                dropCommands.forEach(c => {
                    if (c.nb > 0)
                        commands.push(i + " D " + c.task.id + " " + c.task.p + " " + c.nb);
                });
            }
            if (drone.turns < deadline) {

                var w = p_weights[task.p];
                var w_valid = 0;
                var p_w = p_weights[task.p];

                pcarried[task.p] = 0;
                var dropCommand = { task: task, nb: 0 };
                dropCommands.push(dropCommand);
                while (w <= maxload && drone.turns < deadline) {
                    drone.coords = task.coords;
                    w_valid = w;
                    pcarried[task.p]++;
                    dropCommand.nb++;
                    task.nb--;
                    warehouse.items[task.p]--;
                    var taskIndex = 0;
                    if (task.nb == 0 || warehouse.items[task.p] == 0) {
                        if (task.nb == 0)
                            tasks.splice(taskIndex, 1);
                        if (tasks.length == 0) {
                            writeCommands();
                            return;
                        }
                        taskIndex = tasks.findIndex(t=> warehouse.items[t.p] > 0);
                        if (taskIndex < 0)
                            break;
                        task = tasks[taskIndex];
                        p_w = p_weights[task.p];
                        if (!pcarried[task.p]) {
                            pcarried[task.p] = 0;
                            drone.turns + 1;
                        }
                        dropCommand = { task: task, nb: 0 };
                        dropCommands.push(dropCommand);
                        drone.turns += getDistance(drone.coords, task.coords);
                    }
                    w += p_w;
                }
                donesomething = true;
            }
            if (donesomething) {
                writeCommands();
            }
        }
        /*
        sortDronesByTurns desc
        */
    }
}
processOrders();
commands.splice(0, 0, commands.length);
fs.writeFileSync('output.out', commands.join('\n'));

process.exit(0);
    
/*Load/Deliver/Unload

0 L 1 2 3

 the ID of the drone that the command is for
● the command tag ­ a single character, either ‘L’ (for load) or ‘U’ (for unload),
● the ID of the warehouse from which we load items / to which we unload items
● the ID of the product type
● the number of items of the product type to be loaded or unloaded ­ a positive integer

*/
