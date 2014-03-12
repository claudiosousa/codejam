widgetsMngrWindow = function () {
    var win = {};
	uiManager.setMode('manage');
	var widgetsMngrWindowPnl = $('<div class="widgetsMngrWindowPanel uib-htmladdon"></div>');

	var widgetsMngrWindow = $('<div class="widgetsMngrWindow"><p class="widgetsMngrTitle">Manage Widgets</p></div>').appendTo(widgetsMngrWindowPnl);

    var closeBtn = $(' <div class="widgetsMngrCloseBtn"><div class="icon fa fa-lg fa-times widgetsMngrCloseBtnOff"></div><div class="icon fa fa-lg fa-times-circle widgetsMngrCloseBtnOn"></div></div>').appendTo(widgetsMngrWindow);
    closeBtn.on('click', function (e) {
        uiManager.setMode('edit');
        win.hide();
    });

    var widgetsMngrContainer = $('<div class="widgetsMngrContainer"></div>').appendTo(widgetsMngrWindow);

	var manifestEditorUrl = "http://uxlabs2.sungard.ch/uibuildermanifest/editManifest/index.html#/empty";
	var iframe = $('<iframe id="editManifestIFrame" src="' + manifestEditorUrl + '" class="widgetsMngrIframe"></iframe>').appendTo(widgetsMngrContainer);

    /*
	var resetManifestBtn = $('<button id="resetManifest" style="display: none;">Reload ui-builder controls</button>').appendTo(iframe);
	resetManifestBtn.on('click', function (e) {
	    sendMsgToManifestWindow({ action: "reload" })
	});
    */

    win.hide = function () {
		if (this.widgetsMngrWindowPnl)
        	this.widgetsMngrWindowPnl.remove();
    }

    win.widgetsMngrWindowPnl = widgetsMngrWindowPnl;
    $(document.body).append(widgetsMngrWindowPnl);

    window.addEventListener("message", function (event) {
        if (!event.data || event.data.from != "editManifest")
            return;
        switch (event.data.action) {
            case 'updateManifest':
                manifestHelper.modifyManifest(event.data.content);
                break;
            case "requestManifestFile":
                if (appManifest)
                    sendManifestToEditIFrame();
                break;
        }
    });

    sendManifestToEditIFrame = function () {
        sendMsgToManifestWindow({ action: "editManifest", content: appManifest })
    };

    sendMsgToManifestWindow = function (msg) {
        msg.from = "propsWindow";
        editManifestIFrame.postMessage(msg, '*');
    };

    return win;
}


