codeVersionner = (function () {
    var codeVersionner = {};
    codeVersionner.saveDefaults = function (read, process, write) {
        var newDefaults = {
            read: read,
            process: process,
            write: write
        }
        chrome.storage.sync.set({ defaults: newDefaults }, function () {
            if (chrome.runtime.lastError)
                alert('Impossible to save defaults: ' + chrome.runtime.lastError)
            else
                alert('Defaults saved');
        });
    }

    codeVersionner.loadDefaults = function (callback) {
        chrome.storage.sync.get(['defaults'], function (defaults) {
            if (chrome.runtime.lastError) {
                alert('Impossible to load defaults: ' + chrome.runtime.lastError)
            } else {
                callback(defaults);
            }
        });
    }

    codeVersionner.saveForURl = function (callback) {

    }

    codeVersionner.loadForURl = function (callback) {

    }

    return codeVersionner;
})()