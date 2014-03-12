manifestHelper = (function () {

    var getManifestRequestData = function () {
        var now = new Date();
        return {
            manifest: appManifest,
            uibuilderVersion: chrome.runtime.getManifest().version,
            appTitle: document.title,
            navigator: navigator.appVersion,
            time: now.toString(),
            timestamp: now.getTime()
        };
    }

    var saveManifest = function (manifest) {
        $.ajax({
            url: uibuilderEndPoints.manifest,
            type: 'POST',
            data: JSON.stringify(manifest),
            contentType: "application/json; charset=utf-8",
            success: function (response, textStatus, jqXHR) {
                uiManager.reloadApp();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Impossible to save manifest. Error: " + errorThrown);
            }
        });
    }

    var manifestHelper = {};

    manifestHelper.modifyManifest = function (newManifest) {
        var message = getManifestRequestData();
        message.extra = { newManifest: newManifest }
        $.ajax({
            url: uibuilderEndPoints.storeManifestModification,
            //url: 'http://localhost:3004/modifymanifest',
            type: 'POST',
            data: JSON.stringify(message),
            contentType: "application/json; charset=utf-8",
            success: function (response, textStatus, jqXHR) {
                saveManifest(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Impossible to upgrade manifest. Error: " + errorThrown);
            }
        })
    }

    manifestHelper.upgradeManifest = function () {
        var message = getManifestRequestData();
        message.extra = { oldManifestVersion: manifestVersion }
        $.ajax({
            url: uibuilderEndPoints.storeManifestUpdate,
            //url: 'http://localhost:3004/upgrademanifest',
            type: 'POST',
            data: JSON.stringify(message),
            contentType: "application/json; charset=utf-8",
            success: function (response, textStatus, jqXHR) {
                saveManifest(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Impossible to upgrade manifest. Error: " + errorThrown);
            }
        })
    }

    return manifestHelper;
})();


