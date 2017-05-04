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
    let offset = 0;
    let cases = [];
    for (var i = 0; i < nbCases; i++) {
        let [t1, t2] = lines[i + 1 + offset].split(' ').map(Number);
        let tasks = [];
        for (var j = 1; j <= t1 + t2; j++) {
            let [s, e] = lines[i + 1 + offset + j].split(' ').map(Number);
            tasks.push({
                t1: j <= t1,
                s,
                e,
                t: e - s
            });
        }
        offset += t1 + t2;
        cases.push(
            tasks
        );
    }

    return cases;

}


function processCase(tasks, ic) {
    return calculate(tasks);
}

function calculate(tasks, ic) {
    let retry;
    let time1 = 0;
    let time2 = 0;
    let mandatoryChnages;
    do {
        tasks.sort((a, b) => a.s - b.s);
        for (let i = 0; i < tasks.length - 1; i++) {
            if (tasks[i + 1].t1 != tasks[i].t1)
                tasks[i].i = 0;
            else
                tasks[i].i = tasks[i + 1].s - tasks[i].e;
        }
        tasks[tasks.length - 1].i = 0;
        time1 = 0;
        time2 = 0;
        retry = false;
        mandatoryChnages = 0;
        let change = false;
        for (let i = 0; i < tasks.length; i++) {
            change = i > 0 && tasks[i].t1 != tasks[i - 1].t1;
            if (change)
                mandatoryChnages++;
            let time = tasks[i].t;
            if (!change && i > 0) {
                time += tasks[i - 1].i;
            }
            if (tasks[i].t1)
                time1 += time;
            else
                time2 += time;
        }

        if (time1 > 720) {
            splittasks(tasks, true);
            retry = true;
        }
        if (time2 > 720) {
            splittasks(tasks, false);
            retry = true;
        }
    } while (retry);


    let lastIsT1 = tasks[tasks.length - 1].t1;
    let time = lastIsT1 ? time1 : time2;
    if (time + tasks[0].start + 1440 - tasks[tasks.length - 1].e > 720) {
        lastIsT1 = !lastIsT1;
        mandatoryChnages += 1;
    }
    if (lastIsT1 != tasks[0].t1)
        mandatoryChnages += 1;
    // console.log(mandatoryChnages + "\n" + JSON.stringify(tasks, null, '\t'));
    return mandatoryChnages;
}

function splittasks(tasks, t1) {
    tasks.sort((a, b) => {
        if (a.t1 == t1 && b.t1 == t1) {
            return b.i - a.i;
        }
        return b.t1 == t1 ? 1 : -1;
    });
    tasks.push({
        s: tasks[0].e + 1,
        e: tasks[0].e + 1,
        t: 0,
        t1: !t1
    });

}

function getGroupCount(changes, t1, index, timet1, timet2) {
    if (timet1 > 720 || timet2 > 720)
        return Number.MAX_VALUE;
    let task = tasks[index];
    let time0 = Number.MAX_VALUE;
    let time1 = Number.MAX_VALUE;
    if (task.t1 == t1)
        time0 = getGroupCount(changes, t1, index + 1, t1 ? (timet1 + task.t) : timet1, !t1 ? (timet2 + task.t) : timet2);

    time1 = getGroupCount(changes + 1, t1, index + 1);
    return changes + Math.min(time0, time1);
}