(function () {
    deffered_callback = "deffered_callback";

    window.uib_inject = {};
    var uiService = null;

    var propertiesToFilter = [
        //functions
        "i18n", "open", "close", "activeViewPanel", "activeViewPanelIndex", "viewPanels", "openDialog", "closeDialog", "alert", "prompt", "confirm", "applyTheme", "previewTheme", "openWindow", "registerFooter",
        //objects
        'this', 'navigationContext', 'page', 'customstyle', 'shell', 'uid', 'selectedIndex', "pagerPosition", 'registeredInputs', 'dataFormm', "panel", "fieldMessageMap", "config", "currentTheme", "location", "sgDataUibData",
        //arrays
        'activeDialogs'
    ];

    uib_inject.initialize = function (uiServiceP) {
        uiService = uiServiceP;
        uiService.sendReadyStatus();

        window.addEventListener("message", function (event) {
            if (event.source != window)
                return;
            if (!event.data || event.data.from != "content_script")
                return;

            var callbackId = null;
            if (event.data.callbackid)
                callbackId = event.data.callbackid;
            var res = deffered_callback;
            switch (event.data.action) {

                case 'startErrorRecording':
                    res = startErrorRecording();
                    break;
                case 'stopErrorRecording':
                    res = stopErrorRecording();
                    break;
                case 'updateControlTemplate':
                    res = updateControlTemplate(event.data.content);
                    break;
                case 'changeProperty':
                    res = changeProperty(event.data.content.controlId, event.data.content.property, event.data.content.value);
                    break;
                case 'compile':
                    res = compile(event.data.content);
                    break;
                case 'triggerCurrentViewFilename':
                    res = triggerCurrentViewFilename();
                    break;
                case 'getSgDataScopeData':
                    res = getSgDataScopeData(event.data.content);
                    break;
                case 'getScopeData':
                    res = getScopeData(event.data.content);
                    break;
                case "notifyElementDirty":
                    notifyElementDirty(event.data.content);
                    break;
                case 'getCustomProperty':
                    getCustomProperty(event.data.content, (function (callbackId) {
                        return function (res) {
                            sendCallback(callbackId, res);
                        }
                    })(callbackId));
                    break;
                default:
            }
            if (res != deffered_callback && callbackId)
                sendCallback(callbackId, res);
        }, false);
    };

    startErrorRecording = function () {
        uibErrorRecord = true;
        uibErrorsRecorded = [];
    }

    stopErrorRecording = function () {
        uibErrorRecord = false;
        var res = uibErrorsRecorded;
        uibErrorsRecorded = [];
        return res;
    }

    updateControlTemplate = function (templateAndId) {
        var idSelector = '#' + templateAndId.id;
        $(idSelector).replaceWith(templateAndId.template)
        uiService.compile(idSelector);
    }

    notifyElementDirty = function (dirtyElementIds) {
        dirtyElementIds.forEach(function (dirtyElementId) {
            var $element = angular.element('#' + dirtyElementId);
            if ($element.length != 1)
                return;
            var scope = $element.scope();
            scope.$emit("UIB_ITEM_DIRTY");
        })
    }

    getCustomProperty = function (msgContent, callback) {
        var element = angular.element(msgContent.elementSelector);
        if (element.length != 1) {
            alert("Looking for " + msgContent.elementSelector + " found " + element.length + " elements. Expecting 1.");
            return false;
        }
        var controller = element.controller(msgContent.controller);
        if (!controller) {
            alert("Element " + msgContent.elementSelector + " contains no controller " + msgContent.controller);
            return false;
        }
        if (!controller.getCustomProperty) {
            alert("Controller " + msgContent.controller + " for " + msgContent.elementSelector + " contains no method 'getCustomProperty'");
            return false;
        }
        controller.getCustomProperty(msgContent.property, (function (callback) {
            return function (html, data, modules) {
                callback({ html: html, data: data, modules: modules })
            }
        })(callback));
    }

    getSgDataScopeData = function (msgContent) {
        var elementSelector = msgContent.elementSelector;
        var $element = angular.element(elementSelector);
        if ($element.length != 1)
            return null;
        var scope = $element.scope();
        var scopeData = {};
        var foundFields = {};
        var fillScopeData = function (scopeObj, prefix) {
            for (var p in scopeObj) {
                if (p == "$parent") {
                    fillScopeData(scopeObj.$parent, prefix + "$parent.");
                    continue;
                }
                if (foundFields[p])
                    continue;
                if (p[0] == '$' || p == "this" || propertiesToFilter.indexOf(p) > -1)
                    continue;
                var data = scopeObj[p];
                var datatype = $.type(data);
                if (datatype != "object" && datatype != "array")
                    continue;

                try {
                    scopeData[prefix + p] = JSON.parse(JSON.stringify(data));
                    foundFields[p] = true;
                } catch (e) { }
            }
        }
        fillScopeData(scope, "");

        return scopeData;
    }

    getScopeData = function (msgContent) {
        var elementSelector = msgContent.elementSelector;
        var dataType = msgContent.dataType;
        var dataFilter = msgContent.dataFilter;

        var deep = ['string', 'number', 'boolean', 'array', 'object'].indexOf(dataType) >= 0;
        var $element = angular.element(elementSelector);
        if ($element.length != 1)
            return null;
        var scope = $element.scope();

        var shouldFilterProperty = function (propertyName) {
            return propertyName[0] == '$' || propertiesToFilter.indexOf(propertyName) > -1;
        }

        var res = [];
        var isValidDataType = function (data, type, dataFilter) {
            var dataType = $.type(data);
            switch (type) {
                case "array":
                    return dataType == "array";
                case "string":
                    return dataType == 'string';
                case "object":
                    return dataType == 'object';
                case "boolean":
                    return dataType == 'boolean';
                case "number":
                    if (dataType != "number")
                        return false;
                    if (dataFilter.min != dataFilter.max)
                        return data >= dataFilter.min && data <= dataFilter.max;
                    return true;
                case "function":
                    return dataType == "function";
                    break;
            }
            return false;
        }
        var getPropsForObjRecursively = function (res, resAsObj, obj, prefixPath, dataType, dataFilter, deep) {
            for (var p in obj) {
                if (resAsObj[prefixPath + p])
                    continue;
                if (shouldFilterProperty(p))
                    continue;
                var pData = obj[p];
                if (isValidDataType(pData, dataType, dataFilter)) {
                    var foundField = { field: prefixPath + p }
                    res.push(foundField);
                    resAsObj[foundField.field] = foundField;
                }
                if (deep && pData && $.type(pData) == "object")
                    getPropsForObjRecursively(res, resAsObj, pData, prefixPath + p + ".", dataType, dataFilter, true);
            }
            if (obj.$parent)
                getPropsForObjRecursively(res, resAsObj, obj.$parent, prefixPath, dataType, dataFilter, true)
        }
        getPropsForObjRecursively(res, {}, scope, "", dataType, dataFilter, deep);


        return res;
    }

    changeProperty = function (controlId, property, value) {
        var control = $('#' + controlId);
        if (property.path)
            var $element = angular.element(control.find(property.path));
        else
            var $element = angular.element(control);

        if (property.dataType == "custom") {
            var controller = $element.controller(property.controller);
            controller.setCustomProperty(property.description, value);
        } else {
            var uibAttr = $element.controller('uibAttr');
            if (!uibAttr) {
                var err = "Impossible to change element properties. Verify angular UI-Builder code injection."
                alert(err);
                console.error(err);
                return;
            }
            uibAttr.setAttribute(property.attribute, value + "");
        }

        $element.scope().$apply();
    }

    var sendCallback = function (callbackid, msg) {
        uib_inject.sendMessageToContentScript({ action: 'callback', callbackid: callbackid, content: msg })
    }


    compile = function (selector) {
        uiService.compile(selector);
    };

    triggerCurrentViewFilename = function () {
        uiService.triggerCurrentViewFilename();
    };

    uib_inject.sendMessageToContentScript = function (message) {
        message.from = "page";
        window.postMessage(message, '*');
    }

    window.sungard = null;
    var checkIfappReadyForInjectionReady = function (manifest) {
        if (sungard) {
            try {
                var sungardModules = sungard.initParams().modules;
                angular.module(sungardModules[sungardModules.length - 1]);
                uib_inject.sendMessageToContentScript({ action: 'appReadyForInjectionReady', content: { manifest: manifest, uibuilderEndPoints: window.uibuilderApiEndpoints } })
                return;
            } catch (e) { }
        }
        setTimeout(checkIfappReadyForInjectionReady, 0, manifest);
    }


    var checkIfappIsUIbCompatible = function () {
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                checkIfappReadyForInjectionReady(xmlhttp.responseText);
            }
        }

        xmlhttp.open("GET", "uibuilder.manifest", true);
        xmlhttp.send();
    }

    checkIfappIsUIbCompatible();
})();