problemSolver = (function () {
    var problemSolver = {};
    var codeElement = null;
    problemSolver.setCodeElement = function (_codeElement) {
        codeElement = _codeElement;
        codeElement.innerText = "function solveInput(inputStr){\n\
                                 \treturn prompt(inputStr);\n\
                                }";
    }

    problemSolver.solveStrInput = function (strInput) {
        var problemSolverFn = eval('(' + codeElement.innerText + ')');
        return problemSolverFn(strInput)
    }

    return problemSolver;
})()