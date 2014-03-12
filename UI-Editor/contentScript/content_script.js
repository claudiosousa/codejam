var manifestVersion = "0.0.1.1";
var manifestPackage = "internal";

var bootstraped = false;
var appManifest = null;
var uibuilderEndPoints = {};
var page_msgs_callbacks = {};
var currentViewFilename = null;

var isValidExtention = false;
uiManager = null;


var cs_pageListener = function (event) {
    if (!isValidExtention)
        return;

    if (event.source != window)
        return;
    if (!event.data || event.data.from != "page")
        return;
    //alert('Received from page:' + JSON.stringify(event.data));
    switch (event.data.action) {
        case "setCurrentViewFilename":
            currentViewFilename = event.data.content;
            if (uiManager)
                uiManager.refreshUndoState(currentViewFilename);
            break;
        case "appReadyForInjectionReady":
            uibuilderEndPoints = event.data.content.uibuilderEndPoints;
            var manifest = JSON.parse(event.data.content.manifest);
            appManifest = manifest;
            loadScripts();
            break;
        case "appUiBuilderReady":
            isAppUiBuilderReady = true;
            bootstrapExtention();
            break;
        case "callback":
            var callbackid = event.data.callbackid;
            var callbackfn = page_msgs_callbacks[callbackid];
            delete page_msgs_callbacks[callbackid];
            if (callbackfn)
                callbackfn(event.data.content)
            break;
    }
}

window.addEventListener("message", cs_pageListener, false);

var sendMessageToPage = function (message) {
    message.from = "content_script";
    window.postMessage(message, '*');
}

var sendMessageToPageWidthCallback = function (message, callback) {
    message.callbackid = getRandomId();
    page_msgs_callbacks[message.callbackid] = callback;
    sendMessageToPage(message)
}


bootstrapExtention = function () {
    if (bootstraped)
        return;
    bootstraped = true;
    chrome.runtime.sendMessage({ action: "includeResources" });
}

injectScriptToPage = function (script) {
    var elem = document.createElement("script");
    elem.type = "text/javascript";
    elem.src = chrome.runtime.getURL(script);
    return document.head.appendChild(elem);
}

var loadScripts = function () {
    injectScriptToPage("/inject/uibService.js");
}

setTimeout(function () {

    chrome.runtime.sendMessage({ action: "setExtentionState", content: 'hidden' });

    if (document.documentElement.getAttribute('uib-ready') != undefined) {
        if (document.documentElement.getAttribute('uib-version') == manifestPackage) {
            isValidExtention = true;
            document.documentElement.setAttribute("wait4uib", true);
            injectScriptToPage("/inject/inject_script.js");
        }
    }
});

var getRandomId = function () { return Math.random().toString(36).substring(7) };

if (document.cookie && document.cookie.indexOf("uibuilder_state=record") > -1) {
    errorsRecorder.startRecording();

    chrome.runtime.sendMessage({ action: "startRecordingTabRequests" });
}