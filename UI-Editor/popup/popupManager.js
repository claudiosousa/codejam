popupManager = (function () {

    var zIndexCounter = 99999999;
    var popups = {};

    var setHeight = function (popupId) {
        var popup = popups[popupId];
        if (popup && popup.iframe)
            popup.iframe.height(($(window).height()));
    };

    var setHeights = function () {
        for (var id in popups)
            setHeight(id);
    };

    var setHeightTimeout = null;
    $(window).on("resize.uibpopup", function () {
        clearTimeout(setHeightTimeout);
        setHeightTimeout = setTimeout(setHeights, 100);
    });

    var isLaunched = function (template, jsFiles, data, callback) {
        for (var pId in popups) {
            if (data && popups[pId].params.data && popups[pId].params.data.controlId == data.controlId)
                return true;
        }
        return false;
    };

    var launch = function (template, jsFiles, data, callback) {
        if (isLaunched(template, jsFiles, data, callback))
            return;

        var popupId = getRandomId();
        var params = {
            template: template,
            data: data,
            jsFiles: jsFiles
        };

        var overlay = $('<div style="position: absolute; background-color: rgba(0,0,0,.6); top: 0px; height: 100%; width: 100%;z-index: ' + zIndexCounter++ + ';"></div>').appendTo($(document.body));
        var iframe = $('<iframe style="border: none;display: block;visibility: visible;position: absolute;opacity: 1;padding: 0px;top: 0px;width: 100%;height: 100%;z-index: ' + zIndexCounter++ + ';"></iframe>').appendTo(document.body);

        var popup = { overlay: overlay, iframe: iframe, params: params, callback: callback };
        popups[popupId] = popup;

        popup.iframe.attr('src', chrome.extension.getURL('popup/popup.html?popupId=' + popupId));
        setHeight(popupId);
    };

    var closePopup = function (popupId, response) {
        var popup = popups[popupId];
        if (popup) {
            popup.iframe.remove();
            popup.overlay.remove();
            if (typeof popup.callback == "function")
                popup.callback(response);
            else if (popup.callback)
                sendMsgToUibPopup(popup.callback.caller, { action: "closePopupCallback", content: { response: response, callbackId: popup.callback.id } });
            delete popups[popupId];
        }
    };

    window.addEventListener("message", function (event) {
        if (!event.data || event.data.from != "uib-popup")
            return;
        switch (event.data.action) {
            case 'openPopup':
                var callback = null;
                if (event.data.popupId && event.data.callbackId)
                    callback = { caller: event.data.popupId, id: event.data.callbackId };
                launch(event.data.content.template, event.data.content.jsFiles, event.data.content.data, callback);
                break;
            case 'closePopup':
                closePopup(event.data.popupId, event.data.content);
                break;
            case "initialize":
                var popup = null;
                if (event.data.popupId)
                    popup = popups[event.data.popupId];
                if (popup)
                    sendMsgToUibPopup(event.data.popupId, { action: "loadPopup", content: { popupParams: popup.params, originLocation: JSON.parse(JSON.stringify(location)) } });
                break;
        }
    });

    sendMsgToUibPopup = function (popupId, msg) {
        var popup = popups[popupId];
        if (popup) {
            msg.from = "popupManager";
            popup.iframe[0].contentWindow.postMessage(msg, '*');
        }
    }

    return { launch: launch };
})();
