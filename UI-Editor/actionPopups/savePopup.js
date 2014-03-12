document.addEventListener('DOMContentLoaded', function () {
    var tabId = Number(location.search.match(/tabid=(.*)/)[1]);
    $('#btnSave').click(function () {       
        chrome.tabs.sendMessage(tabId, { action: "saveChanges", to : "contentScript"});
        window.close();
    })
    $('#btnCancel').click(function () {
        chrome.tabs.sendMessage(tabId, { action: "cancelChanges", to: "contentScript" });
        window.close();
    })
});