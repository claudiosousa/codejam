templateUpdater = (function () {
    var templateUpdater = {};

    var getElementUibControl = function (element) {
        if (element.getAttribute('uib-row') != undefined)
            return "uib-row";

        if (element.getAttribute('uib-cell') != undefined)
            return "uib-cell";

        return element.getAttribute('uib-control');
    }
    var getElementId = function (element) {
        var uibcontrol = getElementUibControl(element);
        if (uibcontrol == "page")
            return uibcontrol;

        return uibcontrol + "_" + element.getAttribute('id');
    }

    var getPreviousUibControl = function (elem) {
        var currentElem = elem;
        do {
            if (!currentElem.previousElementSibling)
                return null;
            if ($(currentElem.previousElementSibling).is('[uib-control],[uib-cell],[uib-row]'))
                return currentElem.previousElementSibling;
            currentElem = currentElem.previousElementSibling;
        } while (currentElem != null);
    }

    var getUIBControlsHirarchy = function (page) {
        var uibcontrols = page.find('[uib-control],[uib-cell],[uib-row]');
        var controlsInfoHierarchy = {};
        for (var i = 0; i < uibcontrols.length; i++) {
            var uibcontrol = uibcontrols[i];
            if ($(uibcontrol).closest('[uib-ignore="true"]').length > 0)
                continue;
            var controlParents = $(uibcontrol).parentsUntil(page, '[uib-control],[uib-cell],[uib-row]');
            var uibcontrolList = [uibcontrol];
            if (controlParents.length > 0)
                uibcontrolList.push.apply(uibcontrolList, controlParents.toArray());
            for (var j = uibcontrolList.length - 1; j >= 0; j--) {
                var controlParent = uibcontrolList[j];
                var uibcontrol = getElementUibControl(controlParent);
                var id = getElementId(controlParent);
                var controlInfo = controlsInfoHierarchy[id];
                if (!controlInfo) {
                    var parent = j == uibcontrolList.length - 1 ? null : uibcontrolList[j + 1];
                    var parentElementId = parent ? getElementId(parent) : null;
                    var controlDefinition = controlsDefinition.controlList[uibcontrol];
                    var previousSibling = getPreviousUibControl(controlParent);

                    controlInfo = {
                        uibControl: controlDefinition,
                        uibControlName: uibcontrol,
                        elementId: id,
                        element: controlParent,
                        previousElement: previousSibling,
                        previousElementId: previousSibling ? getElementId(previousSibling) : null,
                        parentElement: parent,
                        parentElementId: parentElementId,
                        children: []
                    };

                    controlsInfoHierarchy[id] = controlInfo;
                }
                if (j != 0)
                    controlInfo.children.push(uibcontrolList[j - 1])
            }
        }
        return controlsInfoHierarchy;
    }

    var noUibInitialProps = ['id', 'uib-col', "uib-left-line"];
    var getElementPropertyValue = function (element, property) {
        var attrFn = element.attr || element.getAttribute;
        var value = null;
        if (noUibInitialProps.indexOf(property) == -1)
            value = attrFn.call(element, 'uib-initial-' + property);
        if (value)
            return value.replace(/\\{/g, '{').replace(/\\}/g, '}')
        else
            return attrFn.call(element, property);
    }
    var setElementPropertyValue = function (element, property, value) {
        var attrFn = element.attr || element.setAttribute;
        attrFn.call(element, property, value);
        if (noUibInitialProps.indexOf(property) == -1)
            attrFn.call(element, 'uib-initial-' + property, value != undefined ? value.replace(/{/g, '\\{').replace(/}/g, '\\}') : '')
    }

    templateUpdater.getElementPropertyValue = getElementPropertyValue;
    templateUpdater.setElementPropertyValue = setElementPropertyValue;

    var getModifications = function (templateHierarchy, currentHierarchy) {
        var modifications = {
            moved: [],
            added: [],
            deleted: [],
            modified: []
        };

        for (var id in currentHierarchy) {
            var currentControlInfo = currentHierarchy[id];
            var oldControlInfo = templateHierarchy[id];
            if (!oldControlInfo) {
                modifications.added.push({ id: id, controlInfo: currentControlInfo });
                continue;
            }

            if (currentControlInfo.parentElementId != oldControlInfo.parentElementId || currentControlInfo.previousElementId != oldControlInfo.previousElementId)
                modifications.moved.push({ id: id, controlInfo: currentControlInfo, oldControlInfo: oldControlInfo });

            var properties = controlsDefinition.controlTypeProperties[currentControlInfo.uibControlName];
            if (currentControlInfo.uibControl && currentControlInfo.uibControl.properties2save) {
                properties = $.extend(true, [], properties);
                for (var i = 0; i < currentControlInfo.uibControl.properties2save.length; i++) {
                    var prop2save = currentControlInfo.uibControl.properties2save[i];
                    properties.push({ key: prop2save });
                }
            }

            if (properties) {
                var modifiedProperties = [];
                for (var i = 0; i < properties.length; i++) {
                    var prop = properties[i];
                    var valueBefore = null;
                    var valueAfter = null;

                    if (!prop.path) {
                        valueAfter = getElementPropertyValue(currentControlInfo.element, prop.key);
                        valueBefore = getElementPropertyValue(oldControlInfo.element, prop.key);
                    }
                    else {
                        valueAfter = getElementPropertyValue($(currentControlInfo.element).find(prop.path), prop.key);
                        valueBefore = getElementPropertyValue($(oldControlInfo.element).find(prop.path), prop.key);
                    }
                    if (valueAfter != valueBefore)
                        modifiedProperties.push({ prop: prop, valueBefore: valueBefore, valueAfter: valueAfter });
                }

                if (modifiedProperties.length > 0)
                    modifications.modified.push({ id: id, controlInfo: currentControlInfo, modifiedProperties: modifiedProperties });
            }
        }

        for (var id in templateHierarchy) {
            var currentControlInfo = currentHierarchy[id];
            var oldControlInfo = templateHierarchy[id];
            if (!currentControlInfo)
                modifications.deleted.push({ id: id, oldControlInfo: oldControlInfo });
        }

        return modifications;
    }

    var alertChanges = function (modifications) {
        var getPathDescriptive = function (ctrlInfo) {
            var desc = "Parent:" + ctrlInfo.parentElementId;
            if (ctrlInfo.previousElementId)
                desc += ",after:" + ctrlInfo.previousElementId;
            desc += "\n";
            return desc;
        }

        var modificationsTxt = "";
        if (modifications.moved.length > 0) {
            modificationsTxt += "====Moved:====\n";
            for (var i = 0; i < modifications.moved.length; i++) {
                var moved = modifications.moved[i];
                modificationsTxt += moved.id + "\n";
                modificationsTxt += "Now:" + getPathDescriptive(moved.controlInfo);
                modificationsTxt += "Before:" + getPathDescriptive(moved.oldControlInfo);
                modificationsTxt += "-----\n";
            }
        }
        if (modifications.added.length > 0) {
            modificationsTxt += "\n====Added:====\n";
            for (var i = 0; i < modifications.added.length; i++) {
                var added = modifications.added[i];
                modificationsTxt += added.id + ":" + getPathDescriptive(added.controlInfo);
                modificationsTxt += "-----\n";
            }
        }
        if (modifications.deleted.length > 0) {
            modificationsTxt += "\n====Deleted:====\n";
            for (var i = 0; i < modifications.deleted.length; i++) {
                var deleted = modifications.deleted[i];
                modificationsTxt += deleted.id + ":" + getPathDescriptive(deleted.oldControlInfo);
                modificationsTxt += "-----\n";
            }
        }

        if (modifications.modified.length > 0) {
            modificationsTxt += "\n====Modified:====\n";
            for (var i = 0; i < modifications.modified.length; i++) {
                var modified = modifications.modified[i];
                modificationsTxt += modified.id + ":" + getPathDescriptive(modified.controlInfo);
                for (var j = 0; j < modified.modifiedProperties.length; j++) {
                    var modifiedProp = modified.modifiedProperties[j];
                    modificationsTxt += " - " + modifiedProp.prop.key + "-now:" + modifiedProp.valueAfter + ",before:" + modifiedProp.valueBefore + "\n";
                }
                modificationsTxt += "-----\n";
            }
        }

        if (modificationsTxt.length == 0) {
            uiManager.setPristine();
            alert('No modification was found!');
            return false;
        } else
            return confirm('Are you sure to apply the following changes:\n' + modificationsTxt);
    }

    var getNewElementHtml = function (added) {
        var properties;
        var template;
        if (added.uibControlName == "uib-row") {
            template = $(controlsDefinition.rowTemplate);
        } else if (added.uibControlName == "uib-cell") {
            template = $(controlsDefinition.cellTemplate);
        } else {
            template = $(added.uibControl.template);
        }
        properties = controlsDefinition.controlTypeProperties[added.uibControlName];
        for (var i = 0; i < properties.length; i++) {
            var prop = properties[i];
            if (!prop.path) {
                setElementPropertyValue(template, prop.key, getElementPropertyValue(added.element, prop.key));
            } else {
                setElementPropertyValue(template.find(prop.path), prop.key, getElementPropertyValue($(added.element).find(prop.path), prop.key));
            }
        }
        return template
    }

    var getElementInTemplate = function (element, elementId, templateHierarchy) {
        var elementInHierarchy = templateHierarchy[elementId];
        if (elementInHierarchy)
            var elementInTemplate = $(elementInHierarchy.element);
        else {
            var elementInTemplate = $(templateHierarchy['page'].element).find('#' + element.getAttribute('id'))
        }

        if (elementInTemplate.length != 1) {
            throw "Expecting to find 1 element in template for id: " + elementId + ". Found " + elementInTemplate.length;
        }

        return elementInTemplate;
    }

    var appendToTemplate = function (elementToAppend, controlInfo, templateHierarchy) {
        var hasPrevious = controlInfo.previousElement != null;
        if (hasPrevious) {
            var element = getElementInTemplate(controlInfo.previousElement, controlInfo.previousElementId, templateHierarchy);
            element.after(elementToAppend);
        } else {
            var element = getElementInTemplate(controlInfo.parentElement, controlInfo.parentElementId, templateHierarchy);
            if (element.attr('uib-row') == undefined && element.attr('uib-cell') == undefined) {
                element = element.find('[uib-panel]:first');
                if (element.length != 1)
                    throw "could not find parent content container id: " + controlInfo.parentElementId;
            }
            element.prepend(elementToAppend);
        }
    }

    var applyChanges = function (modifications, templateHierarchy, currentHierarchy) {
        for (var i = 0; i < modifications.added.length; i++) {
            var added = modifications.added[i];
            var newElementHtml = getNewElementHtml(added.controlInfo);
            appendToTemplate(newElementHtml, added.controlInfo, templateHierarchy);
        }

        for (var i = 0; i < modifications.moved.length; i++) {
            var moved = modifications.moved[i];
            var elementInTemplate = $(moved.oldControlInfo.element).remove();
            appendToTemplate(elementInTemplate, moved.controlInfo, templateHierarchy);
        }

        for (var i = 0; i < modifications.deleted.length; i++) {
            var deleted = modifications.deleted[i];
            $(deleted.oldControlInfo.element).remove();
        }

        for (var i = 0; i < modifications.modified.length; i++) {
            var modified = modifications.modified[i];
            var modifiedElement = getElementInTemplate(modified.controlInfo.element, modified.controlInfo.elementId, templateHierarchy)
            for (var j = 0; j < modified.modifiedProperties.length; j++) {
                var modifiedProp = modified.modifiedProperties[j];
                var modifiedPropertyElement;
                if (modifiedProp.prop.path)
                    modifiedPropertyElement = modifiedElement.find(modifiedProp.prop.path);
                else
                    modifiedPropertyElement = modifiedElement;
                setElementPropertyValue(modifiedPropertyElement, modifiedProp.prop.key, modifiedProp.valueAfter);
            }
        }
    }

    var getAppOptions = function () {
        var options = {};
        options.noController = $("body>div:first-child").attr("sg-no-controller");
        options.sgWith = $("body>div:first-child").attr("sg-with");
        return options;
    }

    var saveTemplate = function (template, elementIds, extraData, callback) {
        var finalTemplate = template[0].innerHTML;
        //alert('Final template:\n' + finalTemplate);
        var options = getAppOptions();
        $.ajax({
            url: uibuilderEndPoints.updatePage,
            type: 'POST',
            data: JSON.stringify({ file: currentViewFilename, content: finalTemplate, appOptions: options, extraData: extraData, elementIds: elementIds }),
            contentType: "application/json; charset=utf-8",
            success: function (response, textStatus, jqXHR) {
                callback(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Impossible to save template. Error: " + errorThrown);
                callback(errorThrown);
            }
        });
    }

    templateUpdater.getControlIdTemplate = function (controlId) {
        var control = $("#" + controlId);
        var controlType = control.attr('uib-control');

        var template = $('<div/>');
        var pageDef = controlsDefinition.controlList['page'];
        var templatePage = $(pageDef.template).appendTo(template);
        var currentControl = $('<div/>');
        if (controlType != "page") {
            $(pageDef.template).appendTo(currentControl).find('[uib-panel]:first').append(control.clone());

        } else {
            currentControl.append(control.clone())
        }
        var templateHierarchy = getUIBControlsHirarchy(template);
        var currentHierarchy = getUIBControlsHirarchy(currentControl);
        var modifications = getModifications(templateHierarchy, currentHierarchy);
        applyChanges(modifications, templateHierarchy, currentHierarchy);
        if (controlType != "page") {
            return templatePage.find('[uib-panel]:first').children();
        } else {
            return templatePage;
        }
    }
    templateUpdater.saveChanges = function (callback, elementIds, extraData) {

        $.ajax({
            url: currentViewFilename,
            /*dataType: 'xml',*/
            success: function (response, textStatus, jqXHR) {
                var template = $('<div></div>').append(response);
                var templateHierarchy = getUIBControlsHirarchy(template);
                var currentHierarchy = getUIBControlsHirarchy($('[uib-viewedpage]'));

                var modifications = getModifications(templateHierarchy, currentHierarchy);

                /*
                var mustApplyChanges = alertChanges(modifications);
                if (!mustApplyChanges)
                    return;
                    */

                applyChanges(modifications, templateHierarchy, currentHierarchy);

                saveTemplate(template, elementIds, extraData, callback);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Impossible to save. Could not obtain template '" + currentViewFilename + "'. Error: " + errorThrown);
            }
        });
    }
    return templateUpdater;
})();