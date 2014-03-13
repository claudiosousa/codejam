codeWindow = (function () {
    var codeWindow = {};
    codeWindow.show = function () {
        var codejamWindow = null;
        $.get(chrome.runtime.getURL('content/codeWindow/codeWindow.html'), function (response) {
            var codejamWindow = $(response).appendTo(document.body);
            codejamWindow.on('click', '.closeBtn', pageActionClicked);
            codejamWindow.on('click', '.codejam-trywithsample', function () {
                var sampleInput = pageManipulator.getSampleInput();
                var result = problemSolver.solveStrInput(sampleInput);
                pageManipulator.setSampleResult(result);
            });

            handleTabKey(codejamWindow.find('textarea'))

            problemSolver.setCodeElements(codejamRead, codejamProcess, codejamWrite);

            codeVersionner.loadDefaults(function (defaults) {
                codejamRead.value = defaults.read;
                codejamProcess.value = defaults.process;
                codejamWrite.value = defaults.write;
            });        

            makeTabs(codejamWindow.find('.codejam-code-panel-tabs'));
        });
    }

    return codeWindow;
})()