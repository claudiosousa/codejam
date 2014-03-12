propertiesWindowManager = (function () {

    var win = {};

    var openPopup = function (template, jsFiles, data, callback) {
        $(popupOverlay).show();
        popupManager.launch(template, jsFiles, data, callback);
    };

    var getElementInformation = function ($element, callback) {
        var controlType = $element.attr('uib-control');
        var controlDefinition = controlsDefinition.controlList[controlType];
        if (!controlDefinition)
            callback();

        controlDefinition = $.extend({}, controlDefinition)
        if (!controlDefinition.properties)
            callback(controlDefinition);
        (function (controlDefinition, callback) {

            var waitingFoNCallbacks = 0;
            for (var prop in controlDefinition.properties) {
                var propertyDef = controlDefinition.properties[prop];
                if (propertyDef.visible === false)
                    continue;
                if (propertyDef.dataType != 'custom') {
                    var propertyElement = $element;
                    if (propertyDef.path) {
                        propertyElement = $element.find(propertyDef.path);
                        if (propertyElement.length != 1) {
                            var err = 'Expecting 1 element matching the "' + prop + '" property path "' + propertyDef.path + '". Found ' + propertyElement.length + '!';
                            console.error(err);
                            alert(err);
                        }
                    }
                    propertyDef.current = templateUpdater.getElementPropertyValue(propertyElement, propertyDef.attribute);
                }
                if (['string', "number", "boolean", "function", "array", "object"].indexOf(propertyDef.dataType) >= 0) {
                    var elementSelector = '#' + $element.attr('id');
                    if (propertyDef.path)
                        elementSelector += " " + propertyDef.path;
                    waitingFoNCallbacks++;
                    sendMessageToPageWidthCallback(
                        { action: "getScopeData", content: { elementSelector: elementSelector, dataType: propertyDef.dataType, dataFilter: { min: propertyDef.min, max: propertyDef.max } } },
                        (function (propertyDef) {
                            return function (scopeValues) {
                                waitingFoNCallbacks--;

                                propertyDef.scopeValues = scopeValues;
                                if (waitingFoNCallbacks == 0)
                                    callback(controlDefinition);
                            }
                        })(propertyDef)
                    )
                } else if (propertyDef.dataType == 'custom') {
                    var elementSelector = '#' + $element.attr('id');
                    if (propertyDef.path)
                        elementSelector += " " + propertyDef.path;
                    waitingFoNCallbacks++;
                    sendMessageToPageWidthCallback(
                        { action: "getCustomProperty", content: { elementSelector: elementSelector, controller: propertyDef.controller, property: prop } },
                        (function (propertyDef) {
                            return function (customProperty) {
                                waitingFoNCallbacks--;
                                if (customProperty) {
                                    propertyDef.customPropertyHtml = customProperty.html;
                                    propertyDef.customPropertyData = customProperty.data;
                                    propertyDef.customPropertyModules = customProperty.modules;
                                }
                                if (waitingFoNCallbacks == 0)
                                    callback(controlDefinition);
                            }
                        })(propertyDef)
                    )
                } else if (propertyDef.dataType == 'sgData') {
                    var elementSelector = '#' + $element.attr('id');
                    if (propertyDef.path)
                        elementSelector += " " + propertyDef.path;
                    waitingFoNCallbacks++;
                    sendMessageToPageWidthCallback(
                        { action: "getSgDataScopeData", content: { elementSelector: elementSelector } },
                        (function (propertyDef) {
                            return function (sgDataScopeData) {
                                waitingFoNCallbacks--;
                                propertyDef.sgDataScopeData = sgDataScopeData;
                                if (waitingFoNCallbacks == 0)
                                    callback(controlDefinition);
                            }
                        })(propertyDef)
                    )
                }
            }
            if (waitingFoNCallbacks == 0)
                callback(controlDefinition);
        })(controlDefinition, callback)
    };

    win.refreshPropertiesPopup = function () {
        var selectedElement = $('#' + currentControlId);
        if (selectedElement.length != 1 || !win.propertiesPopup)
            return;

        getElementInformation(selectedElement, function (elementInformation) {
            elementInformation.controlId = currentControlId;
            win.propertiesPopup.refreshProperties(elementInformation)
        });

    };

    var currentControlId = null;
    win.showPropertiesPopup = function (controlId) {
        currentControlId = controlId;
        var selectedElement = $('#' + controlId);
        if (selectedElement.length != 1)
            return;

        getElementInformation(selectedElement, function (elementInformation) {
            elementInformation.controlId = controlId;
            if (win.propertiesPopup)
                win.propertiesPopup.hide();
            win.propertiesPopup = new propertiesWindow(
                elementInformation,
                function (response) {
                    if (response.data.changed)
                        uiManager.setDirty(selectedElement);
                }
            );
        });

    };


    win.hide = function () {

    };

    return win;
})();
