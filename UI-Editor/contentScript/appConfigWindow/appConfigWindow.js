appConfigWindow = function () {
    var win = {};
    uiManager.setMode('manage');
    var appConfigWindowPnl = $('<div class="appConfigWindowPanel uib-htmladdon"></div>');
    var appConfigWindow = $('<div class="appConfigWindow"><p class="draggableTitle appConfigDraggableTitle">Application Configuration</p></div>');

    appConfigWindowPnl.append(appConfigWindow);
    var appConfigContainer = $('<div class="appConfigContainer"></div>')
    appConfigWindow.append(appConfigContainer);
    win.appConfigWindowPnl = appConfigWindowPnl;

    var configSection = $('<div class="appConfigSection"></div>').appendTo(appConfigContainer);
    var configSectionHeader = $('<div class="appConfigSectionHeader">Supported Browser</div>').appendTo(configSection);
    var configSectionBody = $('<div class="appConfigSectionBody"></div>').appendTo(configSection);

    var browsers = [
		{ "id": "chrome", "icon": "icon_chrome", "title": "", "checked": true },
		{ "id": "ipad", "icon": "icon_ios", "title": "", "checked": false },
		{ "id": "android", "icon": "icon_android", "title": "", "checked": false },
		{ "id": "firefox", "icon": "icon_firefox", "title": "", "checked": true },
		{ "id": "safari", "icon": "icon_safari", "title": "", "checked": true },
		{ "id": "ie10", "icon": "icon_ie", "title": "10", "checked": true },
		{ "id": "ie9", "icon": "icon_ie", "title": "9", "checked": false },
		{ "id": "opera", "icon": "icon_opera", "title": "", "checked": false }
    ];
    var sb = $(document.body).attr("supported-browsers");
    if (!sb) sb = "";
    browsers.forEach(function(b) {
        b["checked"] = (sb.indexOf(b["id"]) != -1)
    });

    var browsersPnl = $('<div class="browsersContainer"></div>').appendTo(configSectionBody);

    browsers.forEach(function (b) {
        $('<div class="browser"><input type="checkbox" name="browser" value="' + b["id"] + '" ' + ((b["checked"]) ? "checked" : "") + ' /><span class="icon ' + b["icon"] + '"></span><span class="browserLabel">' + b["title"] + '</span></div>').appendTo(browsersPnl);
    });
    browsersPnl.on('click', 'input', function (e) {
        browsers.some(function (b) {
            if (e.target.value == b["id"]) {
                b["checked"] = e.target.checked;
                return true;
            }
            return false;
        });
    });
    var configSection = $('<div class="appConfigSection"></div>').appendTo(appConfigContainer);
    var configSectionHeader = $('<div class="appConfigSectionHeader">Shell Configuration</div>').appendTo(configSection);
    var configSectionBody = $('<div class="appConfigSectionBody"></div>').appendTo(configSection);

    var configShellPanel = $('<div class="appConfigShellPanel"></div>').appendTo(configSectionBody);

    var themes = [
        { "label": "Camino", "value": "camino" },
        { "label": "Classic", "value": "classic" },
        { "label": "Light", "value": "light" },
        { "label": "Night", "value": "night" }
    ];

    var configShellItem = $('<div class="appConfigShellItem"></div>').appendTo(configShellPanel);
    $('<span>Theme: </span>').appendTo(configShellItem);
    var options = '';
    themes.forEach(function (t) {
        options += '<option value="' + t.value + '">' + t.label + '</option>';
    });
    var themeSelector = $('<select>' + options + '</select>').appendTo(configShellItem);

    var configShellItem = $('<div class="appConfigShellItem"></div>').appendTo(configShellPanel);
    var shellHeaderChk = $('<input type="checkbox" checked />').appendTo(configShellItem);
    $('<span>Header</span>').appendTo(configShellItem);

    var configShellItem = $('<div class="appConfigShellItem"></div>').appendTo(configShellPanel);
    var shellNavigationChk = $('<input type="checkbox" checked />').appendTo(configShellItem);
    $('<span>Navigation</span>').appendTo(configShellItem);

    var configShellItem = $('<div class="appConfigShellItem"></div>').appendTo(configShellPanel);
    var shellSidebarChk = $('<input type="checkbox" checked />').appendTo(configShellItem);
    $('<span>Sidebar</span>').appendTo(configShellItem);

    var configShellItem = $('<div class="appConfigShellItem"></div>').appendTo(configShellPanel);
    var shellFooterChk = $('<input type="checkbox" checked />').appendTo(configShellItem);
    $('<span>Footer</span>').appendTo(configShellItem);

    var configSection = $('<div class="appConfigSection"></div>').appendTo(appConfigContainer);
    var configSectionHeader = $('<div class="appConfigSectionHeader"><i class="fa fa-wheelchair" style="font-size: xx-large; margin-right: 10px;"></i><span>ADA Compliance</span></div>').appendTo(configSection);
    var configSectionBody = $('<div class="appConfigSectionBody"></div>').appendTo(configSection);

    var adaPanel = $('<div class="appConfigAdaPanel"></div>').appendTo(configSectionBody);
    var adaChk = $('<input type="checkbox"/>').appendTo(adaPanel);
    $('<span>Enable ADA compliance</span>').appendTo(adaPanel);

    /*
    
	auditADAComplianceBtn.onclick = function () {
        auditADA.launch();
	};
    */

    appConfigWindow.append(appConfigContainer);
    var appConfigActionContainer = $('<div class="appConfigActionPanel"></div>')
    appConfigWindow.append(appConfigActionContainer);

    $('<button class="btn appConfigCancelPageButton">Cancel</button>').appendTo(appConfigActionContainer);
    $('<button class="btn bttnAppColor appConfigConfirmPageButton">OK</button>').appendTo(appConfigActionContainer);

    appConfigActionContainer.on('click', '.appConfigCancelPageButton', function (e) {
        uiManager.setMode('edit');
        win.hide();
    });

    appConfigActionContainer.on('click', '.appConfigConfirmPageButton', function (e) {
        var sb = "";
        browsers.forEach(function (b) {
            if (b["checked"]) {
                if (sb != "")
                    sb += ",";
                sb += b["id"];
            }
        });
        $.ajax({
            url: uibuilderEndPoints.saveBrowserCompatibility,
            type: 'POST',
            data: JSON.stringify({ "supportedBrowsers": sb }),
            contentType: "application/json; charset=utf-8",
            success: function (response, textStatus, jqXHR) {
                $(document.body).attr("supported-browsers", sb);
                uiManager.setMode('edit');
                win.hide();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Impossible to save browser compatibility");
            }
        });
    });

    win.hide = function () {
        if (this.appConfigWindowPnl)
            this.appConfigWindowPnl.remove();
    }
    $(document.body).append(appConfigWindowPnl)
    return win;
}


