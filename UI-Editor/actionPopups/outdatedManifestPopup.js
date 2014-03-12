document.addEventListener('DOMContentLoaded', function () {    
    var tabId = Number(location.search.match(/tabid=([^&]*)/)[1]);
    var newVersionTxt = location.search.match(/&newVersion=([^&]*)/)[1];
    var currentVersionTxt = location.search.match(/&currentVersion=([^&]*)/)[1];
    currentVersion.innerHTML = currentVersionTxt;
    newVersion.innerHTML = newVersionTxt;

    $('#btnUpdateManifest').click(function () {
        chrome.tabs.sendMessage(tabId, { action: "upgradeManifest", to: "contentScript" });
        window.close();
    })
});