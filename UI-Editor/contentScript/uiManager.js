uiManager = (function () {

    var uiManager = { mode: 'view', pageActionState: "hidden" };

    uiManager.enableUIBuilder = function (initialState) {
        pageEnricher.addUIBuilderEnrichments();
        uiManager.setMode(initialState || 'edit');
    }

    uiManager.disableUIBuilder = function () {
        pageEnricher.removeUIBuilderEnrichments();
        uiManager.setMode('view');
        document.body.removeAttribute('uib-pageactionstate');
        document.body.removeAttribute('uib-builder-mode');
    }

    uiManager.pageActionClick = function () {
        switch (uiManager.pageActionState) {
            case "hidden":
                alert("How did you clicked on an invisible icon??");
                break;
            case "off":
                uiManager.setPageAction("on");
                uiManager.enableUIBuilder();
                break;
            case "on":
                uiManager.setPageAction("off");
                uiManager.disableUIBuilder();
                break;
            case "dirty":
                alertWindow('Unsaved changes', "Please click on the save button to save the your changes");
                break;
            default:
        }
    }
    uiManager.setPageAction = function (state, extraData) {
        uiManager.pageActionState = state;
        var content = $.extend(true, {}, extraData, { state: state });
        document.body.setAttribute('uib-pageactionstate', state);
        chrome.runtime.sendMessage({ action: "setExtentionState", content: content });
    }

    uiManager.setMode = function (mode) {
        if (mode == "view")
            document.body.removeAttribute('ui-builder-mode');
        else
            document.body.setAttribute('ui-builder-mode', mode);
        uiManager.mode = mode;
    }

    var hasBecomeDirtyWhileSaving = false;
    var hasBecomeDirtyElementIds = [];
    var deferredSaveDirtyElementIds = [];
    uiManager.setDirty = function (dirtyElement) {
        var dirtyElementIds = [];
        if ($.type(dirtyElement) == "array")
            dirtyElementIds.push.apply(dirtyElementIds, dirtyElement);
        else if ($.type(dirtyElement) == "string")
            dirtyElementIds.push(dirtyElement);
        else
            dirtyElementIds.push(dirtyElement.closest('[id]').attr('id'));

        if (uiManager.pageActionState == "saving") {
            hasBecomeDirtyWhileSaving = true;
            hasBecomeDirtyElementIds.push.apply(hasBecomeDirtyElementIds, dirtyElementIds);
            return;
        }
        deferredSaveDirtyElementIds.push.apply(deferredSaveDirtyElementIds, dirtyElementIds);
        uiManager.setPageAction('dirty');
        triggerDeferredSave();
        sendMessageToPage({ action: 'notifyElementDirty', content: dirtyElementIds });
    }

    uiManager.setPristine = function () {
        uiManager.setPageAction('on');
    }

    var saveTimeout = null;
    triggerDeferredSave = function () {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(function () {
            hasBecomeDirtyWhileSaving = false;
            hasBecomeDirtyElementIds = [];
            uiManager.setPageAction("saving");
            uiManager.doImmediateSave(function (undoState) {
                pageEnricher.updateUndoState(undoState);
                deferredSaveDirtyElementIds = [];
                if (hasBecomeDirtyWhileSaving) {
                    uiManager.setPageAction('dirty');
                    uiManager.setDirty(hasBecomeDirtyElementIds);
                    hasBecomeDirtyElementIds = [];
                    hasBecomeDirtyWhileSaving = false;
                } else {
                    uiManager.setPageAction('on');
                }
            })
        }, 100)
    }

    uiManager.doImmediateSave = function (callback) {

        var extraData = {};
        var undoredoStates = $('[uib-on-undoredo-state]');
        if (undoredoStates.length == 1) {
            extraData.undoredoStates = undoredoStates.toArray().map(function (element) {
                return {
                    id: element.id,
                    state: element.getAttribute('uib-on-undoredo-state')
                }
            });
        }

        templateUpdater.saveChanges(callback || angular.noop, deferredSaveDirtyElementIds, extraData);
    }

    uiManager.reloadApp = function () {
        uiManager.disableUIBuilder();
        $.cookie('uibuilder_state', "on");
        location.reload(true);
    }

    uiManager.refreshUndoState = function (currentViewFilename) {
        $.ajax({
            url: uibuilderEndPoints.undoState,
            type: 'POST',
            data: JSON.stringify({ currentViewFilename: currentViewFilename }),
            contentType: "application/json; charset=utf-8",
            success: function (response, textStatus, jqXHR) {
                pageEnricher.updateUndoState({ canUndo: response.canUndo, canRedo: response.canRedo });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Impossible to get undo state");
            }
        });
    }

    uiManager.undo = function () {
        $.ajax({
            url: uibuilderEndPoints.undo,
            type: 'POST',
            data: JSON.stringify({ currentViewFilename: currentViewFilename }),
            contentType: "application/json; charset=utf-8",
            success: function (response, textStatus, jqXHR) {
                applyNewPageContent(response.fileContent, response.extraData, response.elementIds)
                pageEnricher.updateUndoState({ canUndo: response.canUndo, canRedo: response.canRedo });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Impossible to undo template. Error: " + errorThrown);
            }
        });
    }

    var removeUndoHighlightsTimeout = null;
    var applyNewPageContent = function (newPageContent, extraData, elementIds) {
        var viewedpage = $('[uib-viewedpage]');
        viewedpage.empty();
        $('[uib-remove-on-undoredo]').remove();
        var newPageRootId = $(newPageContent).appendTo(viewedpage).attr('id');
        if (extraData) {
            if (extraData.undoredoStates) {
                extraData.undoredoStates.forEach(function (state) {
                    viewedpage.find('#' + state.id).attr('uib-on-undoredo-state', state.state);
                });
            }
        }
        if (elementIds) {
            setTimeout((function (elementIds) {
                return function () {
                    elementIds.forEach(function (id) {
                        $('#' + id).addClass('uib-highlight-undo')
                    });

                    removeUndoHighlightsTimeout = setTimeout(function () {
                        $('.uib-highlight-undo').removeClass('uib-highlight-undo');
                    }, 1000)
                }
            })(elementIds), 300)
        }

        windowHelper.compileElementId(newPageRootId);

    }

    uiManager.redo = function () {
        $.ajax({
            url: uibuilderEndPoints.redo,
            type: 'POST',
            data: JSON.stringify({ currentViewFilename: currentViewFilename }),
            contentType: "application/json; charset=utf-8",
            success: function (response, textStatus, jqXHR) {
                applyNewPageContent(response.fileContent, response.extraData, response.elementIds)
                pageEnricher.updateUndoState({ canUndo: response.canUndo, canRedo: response.canRedo });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Impossible to undo template. Error: " + errorThrown);
            }
        });
    }


    uiManager.getUndoStateForCurrentPage = function () {
        //todo
        updateUndoState(undoState);
    }

    uiManager.startRecordingScenario = function () {
        $.cookie('uibuilder_state', "record");
        location.reload(true);
    }

    uiManager.stopRecordingScenario = function () {
        errorsRecorder.stopRecording(function (recordedErrors) {
            chrome.runtime.sendMessage({ action: "stopRecordingTabRequests" }, function (recordingTabRequests) {
                var recordedScenario = {
                    errors:recordedErrors,
                    requests : recordingTabRequests
                }
                requestSupport.request(recordedScenario);
                $.removeCookie('uibuilder_state');
                uiManager.setMode('edit');
            });
        })
    }

    return uiManager;
})();