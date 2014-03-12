uibAppToolbar = function () {
    var win = { pagesWindow: null, pagesManagerWindow: null, appConfigWindow: null, widgetsManagerWindow: null };
    var toolbar = $('<div class="uib-toolbar uib-htmladdon"></div>');
    var container = $('<div class="uib-toolbarPanel"></div>').appendTo(toolbar);
    var leftContainer = $('<div class="uib-leftToolbar"></div').appendTo(container);
    var centerContainer = $('<div class="uib-centerToolbar"></div').appendTo(container);
    var rightContainer = $('<div class="uib-rightToolbar"></div').appendTo(container);
    var stopRecording = $('<div class="uib-stopRecording">REC</div').appendTo(container);

    stopRecording.on('click', function(){
        uiManager.stopRecordingScenario();
    });

    var newPage = $('<i class="icon fa fa-file-o uib-newPage" title="add new page"></i>').appendTo(leftContainer);
    var back = $('<i class="icon fa fa-reply" title="undo" disabled="disabled"></i>').appendTo(leftContainer).click(function (e) {
        if (this.getAttribute('disabled') == null) {
            back.attr('disabled', 'disabled');
            redo.attr('disabled', 'disabled');
            uiManager.undo()
        }
    });

    var redo = $('<i class="icon fa fa-share" title="redo" disabled="disabled"></i>').appendTo(leftContainer).click(function (e) {
        if (this.getAttribute('disabled') == null) {
            back.attr('disabled', 'disabled');
            redo.attr('disabled', 'disabled');
            uiManager.redo()
        }

    });

    var popups = $('<i class="icon fa fa-square-o uib-popups" title="manage popups"></i>').appendTo(leftContainer);

    var manifest = chrome.runtime.getManifest();
    $('<a href="https://uxlabs.sungard.ch/uxlabs/" target="_blank">UXLabs</a>').appendTo(centerContainer);
    var name = $('<span class="uib-productName">' + manifest.name + '</span>').appendTo(centerContainer);
    var version = $('<span class="uib-productVersion">(' + manifest.version + ')</span>').appendTo(centerContainer);

    var hotline = $('<i class="icon hotline-icon" title="Request for support"></i>').appendTo(rightContainer);
    var config = $('<i class="icon fa fa-cog uib-config" title="configuration"></i>').appendTo(rightContainer);

    var configMenu = $('<div class="uib-configMenu"></div>').appendTo(config);
    $('<div class="uib-configMenuHolder"></div>').appendTo(configMenu);
    var configMenuArrow = $('<div class="uib-configMenuArrow"></div>').appendTo(configMenu);
    var configMenuPanel = $('<div class="uib-configMenuPanel"></div>').appendTo(configMenu);

    var configPages = $('<div class="uib-configMenuItem">Manage Pages</div>').appendTo(configMenuPanel);
    var configWidgets = $('<div class="uib-configMenuItem">Manage Widgets</div>').appendTo(configMenuPanel);
    var appConfig = $('<div class="uib-configMenuItem">Application Configuration</div>').appendTo(configMenuPanel);

    hotline.on('click', function (e) {
        requestSupport.request();
    });

    newPage.on('click', function (e) {
        if (win.pagesWindow)
            win.pagesWindow.hide();
        win.pagesWindow = new pagesWindow();
    });

    configPages.on('click', function (e) {
        if (win.pagesManagerWindow)
            win.pagesManagerWindow.hide();
        win.pagesManagerWindow = new pagesManagerWindow();
    });

    configWidgets.on('click', function (e) {
        if (win.widgetsManagerWindow)
            win.widgetsManagerWindow.hide();
        win.widgetsManagerWindow = new widgetsMngrWindow();
    });

    appConfig.on('click', function (e) {
        if (win.appConfigWindow)
            win.appConfigWindow.hide();
        win.appConfigWindow = new appConfigWindow();
    });

    win.toolbar = toolbar;
    win.hide = function () {
        this.toolbar.remove();
    }

    var updateUndoStateTimeout = null;
    win.updateUndoState = function (undoState, now) {
        clearTimeout(updateUndoStateTimeout);
        if (!now) {
            updateUndoStateTimeout = setTimeout(function (undoState) {
                win.updateUndoState(undoState, true);
            }, 500, undoState)
            return;
        }
        if (!undoState.canUndo)
            back.attr('disabled', "disabled");
        else
            back.removeAttr('disabled');
        if (!undoState.canRedo)
            redo.attr('disabled', "disabled");
        else
            redo.removeAttr('disabled');

    }

    $(".app").before(toolbar);
    return win;
}
