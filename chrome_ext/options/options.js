doLoad = function () {
    codeVersionner.loadDefaults(function (defaults) {
        inputParsing.value = defaults.read;
        caseProcessing.value = defaults.process;
        writeOutput.value = defaults.write;
    });

    save = function () {
        codeVersionner.saveDefaults(inputParsing.value, caseProcessing.value, writeOutput.value);
    };

    saveBtn.onclick = save;

    handleTabKey(document.querySelectorAll('textarea'));
};



window.onload = doLoad;
