//listen to background
var backgroundListenner = function (message) {
    if (message.to != "contentScript")
        return;

    switch (message.action) {
        case "visibleTabCaptured":
            requestSupport.visibleTabCaptured(message.content);
            break;
        case "setBackgroundEnvironment":
            requestSupport.setBackgroundEnvironment(message.content);
            break;
        case "resourcesIncluded":
            if (manifestVersion != appManifest.version) {
                uiManager.setPageAction('outdatedManifest', { newVersion: manifestVersion, currentVersion: appManifest.version });
            } else {
                var uibuilder_state = $.cookie('uibuilder_state');
                if (uibuilder_state) {
                    if (uibuilder_state == "record")
                        uiManager.enableUIBuilder('record');
                    else {
                        uiManager.enableUIBuilder();
                        $.removeCookie('uibuilder_state');
                    }
                    uiManager.setPageAction('on');
                } else
                    uiManager.setPageAction('off');
            }
            break;
        case "pageActionClick":
            uiManager.pageActionClick();
            break;
        case "upgradeManifest":
            manifestHelper.upgradeManifest();
            break;
        case "enableUiBuilder":
            uiManager.enableUIBuilder();
            break;
        case "disableUiBuilder":
            uiManager.disableUIBuilder();
            break;
        default:
            console.log("case = " + message.action);
    }
}

chrome.runtime.onMessage.addListener(backgroundListenner);

var pageListener = function (event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;
    switch (event.data.action) {
        case "elementPropertiesUpdated":
            propertiesWindowManager.refreshPropertiesPopup();
            break;
        case "setDirty":
            uiManager.setDirty(event.data.content);
            break;
        case "elementRecompileRequested":
            window.windowHelper.recompileElementId(event.data.content.controlId);
            break;
    }
}
window.addEventListener("message", pageListener, false);

