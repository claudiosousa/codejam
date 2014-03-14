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

            var loadValues = function (values) {
                codejamRead.value = values.read;
                codejamProcess.value = values.process;
                codejamWrite.value = values.write;
            }

            codeVersionner.loadForURl(loadValues);

            codejamWindow.on('click', '.save', function () {
                codeVersionner.saveForURl(codejamRead.value, codejamProcess.value, codejamWrite.value);
            });

            codejamWindow.on('click', '.reset', function () {
                codeVersionner.loadDefaults(loadValues);
            });

            makeTabs(codejamWindow.find('.codejam-code-panel-tabs'));
        });
    }

    return codeWindow;
})()