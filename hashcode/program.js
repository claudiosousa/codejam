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

var getWareHouseForProduct = function (p, nb, coords) {
    var minValue = Number.MAX_VALUE;
    var warehouse;
    w_items.forEach((w, i) => {
        if (w.items[p] < nb)
            return;
        var dist = getDistance(coords, w.coords);
        if (dist < minValue) {
            minValue = dist;
            warehouse = w;
        }
    })
    return warehouse;
}

var getCostForOrder = function (c) {
    if (!c.cost) {
        var p = Number(Object.getOwnPropertyNames(c.prods)[0]);
        var warehouse = getWareHouseForProduct(p, c.prods[p], c.coords);
        var weight = c.prods.map((nb, p) => p_weights[p] * nb).reduce((a, b) => a + b, 0);
        c.cost = (getDistance(warehouse.coords, c.coords) * weight / maxload) + c.prods.length;
    }
    return c.cost;
}

c_prods = c_prods.sort((a, b) => {
    return getCostForOrder(a) - getCostForOrder(b);
})


var tasks = [];

c_prods.forEach(c=> {
    c.prods.forEach((nb, p) => {
        tasks.push({ id: c.id, coords: c.coords, p: p, nb: nb, cost: c.cost });
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

var getTaskWithClosestWareHouse = function (coords) {
    var minValue = Number.MAX_VALUE;
    var taskIndex = 0;
    tasks.forEach((t, i) => {
        var cost = t.cost + getDistance(coords, getWareHouseForProduct(t.p, t.nb, coords));
        if (cost < minValue) {
            minValue = cost;
            taskIndex = i;
        }
    })
    return taskIndex;
    /*
    var task = tasks.sort((t1, t2) => {
        return t1.cost - t2.cost + getDistance(coords, t1.coords) - +getDistance(coords, t1.coords);
    })[0];
    return tasks.findIndex(t=> t === task);
    */
}

var getClosestTask = function (coords, warehouse) {
    var minValue = Number.MAX_VALUE;
    var taskIndex = -1;
    tasks.forEach((t, i) => {
        if (warehouse.items[t.p] == 0)
            return;
        var cost = t.cost + getDistance(coords, t.coords);
        if (cost < minValue) {
            minValue = cost;
            taskIndex = i;
        }
    })
    return taskIndex;
    /*
    var task = tasks.sort((t1, t2) => {
        return t1.cost - t2.cost + getDistance(coords, t1.coords) - +getDistance(coords, t1.coords);
    })[0];
    return tasks.findIndex(t=> t === task);
    */
}

var processOrders = function () {
    var donesomething = true;
    while (donesomething && tasks.length > 0) {
        donesomething = false;
        for (var i = 0; i < d_count; i++) {
            var drone = drones[i];
            var taskIndex = getTaskWithClosestWareHouse(drone.coords);

            var task = tasks[taskIndex];

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
                    
                    //console.log("+"+warehouse.items[task.p]);
                    warehouse.items[task.p]--;
                    //console.log("-"+warehouse.items[task.p]);
                    
                    if (task.nb == 0 || warehouse.items[task.p] <= 0) {
                        if (task.nb == 0) {
                            var a = tasks.length;
                            tasks.splice(taskIndex, 1);
                        }
                        if (tasks.length == 0) {
                            writeCommands();
                            return;
                        }
                        taskIndex = getClosestTask(drone.coords, warehouse);
                        //console.log(taskIndex);
                        if (taskIndex < 0) {
                            // console.log(w / maxload);
                            break;
                        }
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
