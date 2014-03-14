problemSolver = (function () {
    var problemSolver = {};
    var codeElements = {};
    problemSolver.setCodeElements = function (read, parse, write) {
        codeElements.read = read;
        codeElements.parse = parse;
        codeElements.write = write;
    }

    problemSolver.solveStrInput = function (strInput) {

        var problemSolverFn = eval('(function solveInput(inputStr){\n' + codeElements.read.value + ';\n' + codeElements.parse.value + ';\n' + codeElements.write.value + ';\n})');
        return problemSolverFn(strInput.trim())
    }

    return problemSolver;
})()