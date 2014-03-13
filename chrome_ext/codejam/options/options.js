doLoad = function () {
    chrome.storage.sync.get(['defaultInputParsing', 'defaultCaseProcessing', 'defaultWriteOutput'], function (defaults) {
        if (chrome.runtime.lastError) {
            alert('Impossible to load defaults: ' + chrome.runtime.lastError)
            return;
        }
        inputParsing.value = defaults.defaultInputParsing;
        caseProcessing.value = defaults.defaultCaseProcessing;
        writeOutput.value = defaults.defaultWriteOutput;
    });

    save = function () {
        var newDefaults = {
            'defaultInputParsing': inputParsing.value,
            'defaultCaseProcessing': caseProcessing.value,
            'defaultWriteOutput': writeOutput.value
        }
        debugger;
        chrome.storage.sync.set(newDefaults, function () {
            if (chrome.runtime.lastError) {
                alert('Impossible to save defaults: ' + chrome.runtime.lastError)
                return;
            }
            alert('Defaults saved');
        });

    };

    saveBtn.onclick = save;
};



window.onload = doLoad;
