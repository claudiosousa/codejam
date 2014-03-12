windowHelper = (function () {
    return {
        compileElementId: function (controlId) {
            sendMessageToPage({ action: 'compile', content: '#' + controlId });
        },
        recompileElementId: function (controlId) {
            sendMessageToPage({ action: 'updateControlTemplate', content: { id: controlId, template: templateUpdater.getControlIdTemplate(controlId)[0].outerHTML } });
        },
        changeProperty: function (controlId, property, value) {
            if (true || property.forceReload) {
                sendMessageToPageWidthCallback({ action: 'changeProperty', content: { controlId: controlId, property: property, value: value } }, function () {
                    setTimeout(function () {
                        window.windowHelper.recompileElementId(controlId);
                    }, 200);
                });
            } else
                sendMessageToPage({ action: 'changeProperty', content: { controlId: controlId, property: property, value: value } });
        }
    }
})();


