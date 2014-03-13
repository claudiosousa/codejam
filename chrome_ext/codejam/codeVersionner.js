codeVersionner = (function () {
    var codeVersionner = {};

    var getData = function (storage, key, callback) {
        chrome.storage.sync.get([key], function (values) {
            if (chrome.runtime.lastError) {
                alert('Impossible to load defaults: ' + chrome.runtime.lastError)
            } else {
                callback(values);
            }
        });
    }

    var setData = function (storage, key, read, process, write) {
        var newData = {}
        newData[key] = {
            read: read,
            process: process,
            write: write
        };
        storage.set(newData, function () {
            if (chrome.runtime.lastError)
                alert('Impossible to save: ' + chrome.runtime.lastError)
            else
                alert('Saved');
        });
    }
    codeVersionner.saveDefaults = function (read, process, write) {
        setData(chrome.storage.sync,"defaults", read, process, write);
    }

    codeVersionner.loadDefaults = function (callback) {
        getData(chrome.storage.sync, 'defaults', callback)
    }

    codeVersionner.saveForURl = function (read, process, write) {
        setData(chrome.storage.local, location.href, read, process, write);
    }

    codeVersionner.loadForURl = function (callback) {
        getData(chrome.storage.local, location.href, function (values) {
            if (!values)
                codeVersionner.loadDefaults(callback);
        });
    }

    return codeVersionner;
})()