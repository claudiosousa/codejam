var contentScriptListener = function (message, sender, sendResponse) {
    switch (message.action) {
        case "setExtentionState":
            setExtentionState(message.content, sender.tab.id)
            break;
        case "includeResources":
            includeResources(sender.tab.id);
            break;
        case "captureVisibleTab":
            captureVisibleTab(sender.tab.id, message.content);
            break;
        case "getBackgroundEnvironment":
            getBackgroundEnvironment(sender.tab.id, message.content.getMHtml);
            break;
        case "startRecordingTabRequests":
            startRecordingTabRequests(sender.tab.id);
            break;
        case "stopRecordingTabRequests":
            stopRecordingTabRequests(sender.tab.id, sendResponse);
            break;
    }
}

chrome.runtime.onMessage.addListener(contentScriptListener);

setExtentionState = function (data, tabId) {
    switch (data.state) {
        case "hidden":
            chrome.pageAction.hide(tabId);
            break;
        case "off":
            chrome.pageAction.show(tabId);
            chrome.pageAction.setIcon({ path: "resources/icons/WrenchIcon_off.png", tabId: tabId });
            chrome.pageAction.setTitle({ title: "Turn UI-Builder on", tabId: tabId });
            chrome.pageAction.setPopup({ popup: "", tabId: tabId });
            break;
        case "on":
            chrome.pageAction.show(tabId);
            chrome.pageAction.setIcon({ path: "resources/icons/WrenchIcon_on.png", tabId: tabId });
            chrome.pageAction.setTitle({ title: "Turn UI-Builder off", tabId: tabId });
            chrome.pageAction.setPopup({ popup: "", tabId: tabId });
            break;
        case "saving":
            chrome.pageAction.show(tabId);

            chrome.pageAction.setIcon({ path: "resources/icons/WrenchIcon_saving.png", tabId: tabId });
            chrome.pageAction.setTitle({ title: "Saving page changes...", tabId: tabId });
            chrome.pageAction.setPopup({ popup: "", tabId: tabId });
            break;
        case "dirty":
            chrome.pageAction.show(tabId);
            chrome.pageAction.setIcon({ path: "resources/icons/WrenchIcon_dirty.png", tabId: tabId });
            chrome.pageAction.setTitle({ title: "Page contains unsaved changes", tabId: tabId });
            chrome.pageAction.setPopup({ popup: "", tabId: tabId });
            break;
        case "outdatedManifest":
            chrome.pageAction.show(tabId);
            chrome.pageAction.setIcon({ path: "resources/icons/WrenchIcon_error.png", tabId: tabId });
            chrome.pageAction.setTitle({ title: "The UI-Builder manifest is outdated", tabId: tabId });
            chrome.pageAction.setPopup({
                popup: "actionPopups/outdatedManifestPopup.html?tabid=" + tabId + "&newVersion=" + encodeURIComponent(data.newVersion) + "&currentVersion=" + encodeURIComponent(data.currentVersion),
                tabId: tabId
            });
            break;
    }
}
var recordedTabsRequests = {};
var startRecordingTabRequests = function (tabId) {
    stopRecordingTabRequests(tabId)
    recordedTabRequests = { requests: [] };
    recordedTabRequests.listener = (function (requestList) {
        return function (details) {
            requestList.push(details);
            if (details.method == "GET") {
                (function (details) {
                    var headers = {};
                    details.requestHeaders.forEach(function (requestHeader) {
                        var headerName = requestHeader.name;
                        if (['Referer', "Accept-Encoding", "Cookie", "User-Agent"].indexOf(headerName) > -1)
                            return;
                        headers[headerName] = requestHeader.value;
                    })
                    $.ajax(
                        details.url,
                        {
                            dataType :"text",
                            method: 'GET',
                            headers: headers
                        }).done(function (a, b, c) {
                            details.response = a;
                        });
                })(details)
            }

        }
    })(recordedTabRequests.requests)
    recordedTabsRequests[tabId] = recordedTabRequests;
    chrome.webRequest.onSendHeaders.addListener(
         recordedTabRequests.listener,
         { urls: ["<all_urls>"], tabId: tabId, types: ["xmlhttprequest"] },
         ['requestHeaders'])
}

var stopRecordingTabRequests = function (tabId, sendResponse) {
    var recordedTabRequests = recordedTabsRequests[tabId];
    if (!recordedTabRequests)
        return;
    chrome.webRequest.onSendHeaders.removeListener(recordedTabRequests.listener);
    if (sendResponse)
        sendResponse(recordedTabRequests.requests);
    delete recordedTabsRequests[tabId];
}

var captureVisibleTab = function (tabId, imageOptions) {
    chrome.tabs.captureVisibleTab(null, imageOptions, function (data) {
        sendMessage(tabId, { action: "visibleTabCaptured", content: data });
    });
};

var getBackgroundEnvironment = function (tabId, getmhtml) {
    var getEnv = function (env) {
        chrome.runtime.getPlatformInfo(function (platformInfo) {
            chrome.system.cpu.getInfo(function (cpuInfo) {
                chrome.system.memory.getInfo(function (memoryInfo) {
                    env.platform = platformInfo;
                    env.cpu = cpuInfo;
                    env.memory = memoryInfo;
                    sendMessage(tabId, {
                        action: "setBackgroundEnvironment",
                        content: env
                    });
                });
            });
        });
    }

    if (getmhtml)
        chrome.pageCapture.saveAsMHTML({ tabId: tabId }, function (mhtmlData) {
            getEnv({ mhtml: mhtmlData });
        })
    else
        getEnv({});
}

var includeResources = function (tabId) {
    var jsFilesToLoad = [
       "resources/jquery-2.1.0.min.js",
       "resources/jquery.scrollIntoView.min.js",
       "resources/jquery.cookie.js",
       "resources/jquery/ui/1.10.3/jquery-ui.js",
       "resources/angular.js",
       "resources/farbtastic/farbtastic.js",
       'contentScript/windowHelper.js',
       'contentScript/manifestHelper.js',
       'contentScript/messageHandler.js',
       "contentScript/auditADA/auditADA.js",
       "contentScript/controlsDefinition.js",
       "contentScript/layout/controlDragManager.js",
       "contentScript/layout/rowLayoutManager.js",
       "contentScript/layout/cellLayoutManager.js",
       "contentScript/layout/controlActionsManager.js",
       "contentScript/layout/setBorderPopup/setBorderPopup.js",
       "contentScript/pageEnricher.js",
       "contentScript/uiManager.js",
       "contentScript/alertWindow/alertWindow.js",
       "contentScript/toolbar/toolbar.js",
       "contentScript/pagesWindow/pagesWindow.js",
       "contentScript/propertiesWindow/propertiesWindow.js",
       "contentScript/pagesManagerWindow/pagesManagerWindow.js",
       "contentScript/widgetsManagerWindow/widgetsManagerWindow.js",
       "contentScript/appConfigWindow/appConfigWindow.js",
       "contentScript/controlsWindow/controlsWindow.js",
       "contentScript/templateUpdater.js",
       "popup/popupManager.js",
       "contentScript/requestSupport/requestSupport.js",
       "contentScript/propertiesWindow/propertiesWindowManager.js"
    ];
    var cssFilesToLoad = [
        "resources/jquery/ui/1.10.3/jquery-ui.css",
        "resources/font-awesome-4.0.3/css/font-awesome.css",
        "resources/farbtastic/farbtastic.css",
        "contentScript/content_script.css",
        "contentScript/alertWindow/alertWindow.css",
        "contentScript/toolbar/toolbar.css",
        "contentScript/pagesWindow/pagesWindow.css",
        "contentScript/propertiesWindow/propertiesWindow.css",
        "contentScript/pagesManagerWindow/pagesManagerWindow.css",
        "contentScript/widgetsManagerWindow/widgetsManagerWindow.css",
        "contentScript/appConfigWindow/appConfigWindow.css",
        "contentScript/controlsWindow/controlsWindow.css",
        "contentScript/requestSupport/requestSupport.css",
        "contentScript/auditADA/auditADA.css",
        "popup/popup.css",
        "contentScript/propertiesWindow/popups/sgwData.css",
        "contentScript/layout/controlActions.css"
    ];
    var loadedScripts = 0;
    for (var i = 0; i < cssFilesToLoad.length; i++) {
        chrome.tabs.insertCSS(tabId, { file: cssFilesToLoad[i] })
    }
    for (var i = 0; i < jsFilesToLoad.length; i++) {
        chrome.tabs.executeScript(tabId, { file: jsFilesToLoad[i] }, function () {
            loadedScripts++;
            if (jsFilesToLoad.length == loadedScripts) {
                sendMessage(tabId, { action: "resourcesIncluded" });
            }
        })
    }
}

var pageAction_clicked = function (tab) {
    sendMessage(tab.id, { action: "pageActionClick" });
}

var sendMessage = function (tabId, msg) {
    msg.to = "contentScript";
    chrome.tabs.sendMessage(tabId, msg);
}
chrome.pageAction.onClicked.addListener(pageAction_clicked);
