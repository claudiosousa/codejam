var contentScriptListener = function (message, sender, sendResponse) {
    switch (message.action) {
        case "setPageState":
            setPageState(message.content, sender.tab.id)
            break;
    }
}

setPageState = function (state, tabId) {
    
    switch (state) {
        case "hidden":
            chrome.pageAction.hide(tabId);
            break;
        case "off":
            chrome.pageAction.show(tabId);
            chrome.pageAction.setIcon({ path: "resources/icon_off.jpg", tabId: tabId });
            chrome.pageAction.setTitle({ title: "Turn Code JAM on", tabId: tabId });
            break;
        case "on":
            chrome.pageAction.show(tabId);
            chrome.pageAction.setIcon({ path: "resources/icon_on.jpg", tabId: tabId });
            chrome.pageAction.setTitle({ title: "Turn Code JAM off", tabId: tabId });
            break;
        }
    }

chrome.runtime.onMessage.addListener(contentScriptListener);

var pageAction_clicked = function (tab) {
    sendMessage(tab.id, { action: "pageActionClick" });
}

chrome.pageAction.onClicked.addListener(pageAction_clicked);

var sendMessage = function (tabId, msg) {
    msg.to = "contentScript";
    chrome.tabs.sendMessage(tabId, msg);
}

