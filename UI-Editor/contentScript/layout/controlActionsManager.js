controlActionsManager = (function () {
    var defaultNewRowColumns = [3, 3, 3, 3];
    var panelWithActions = null;
    var rowWithActions = null;
    var controlWithActions = null;
    var removeAddedControlActions = function (onlyControl) {
        if (!onlyControl && rowWithActions) {

            rowWithActions.removeClass('uib-row-hover');
            rowWithActions.children('.rowToolbar, .uib-htmladdon-row').remove();
            rowWithActions = null;
        }
        if (controlWithActions) {
            controlWithActions.removeClass('uib-highlighted');
            controlWithActions.children('.controlToolbar').remove();
            controlWithActions = null;
        }
    }

    var updateVisiblePanelActionsFromEvent = function (event) {
        var mouseElement = document.elementFromPoint(event.pageX, event.pageY);
        var panelElement = $(mouseElement).closest('[uib-panel]');
        if (panelElement.length > 0) {
            if (!panelWithActions || !panelWithActions.is(panelElement)) {
                if (panelWithActions)
                    panelWithActions.children('.uib-addrow').remove();
                panelWithActions = panelElement;
                $('<span class="uib-addrow uib-htmladdon">\
                        <div class="uib-addrow-circle">\
                            <i class="fa fa-plus-circle fa-lg"></i>\
                        </div>\
                        <div class="uib-addrow-text">Add new row</div>\
                    </span>').appendTo(panelElement).click(panelElement, function (e) {
                        var panelElement = e.data;
                        var lastRow = panelElement.children('[uib-row]:last');
                        var newRow = null;
                        if (lastRow.length > 0) {
                            var cells = lastRow.children('[uib-cell]:not([uib-col="0"])').map(function (i, cell) {
                                return Number(cell.getAttribute('uib-col'));
                            })
                            newRow = controlsDefinition.getNewRow(cells);
                            lastRow.after(newRow);
                        } else {
                            newRow = controlsDefinition.getNewRow(defaultNewRowColumns);
                            panelElement.prepend(newRow);
                        }
                        uiManager.setDirty(newRow);
                    });
            }
        } else {
            if (panelWithActions) {
                panelWithActions.children('.uib-addrow').remove();
                panelWithActions = null;
            }
        }
    }

    var updateVisibleControlActionsFromEvent = function (event) {
        var mouseElement = document.elementFromPoint(event.pageX, event.pageY);
        if ($(mouseElement).closest('.rowToolbar, .controlToolbar').length >= 1)
            return;

        updateVisibleControlActions(mouseElement);
    }

    var updateVisibleControlActions = function (element, forceRefresh) {
        var controlElement = $(element).closest('[uib-control], [uib-row]');
        if (controlElement.length > 0) {
            var newRowWithActions = null,
                newControlWithActions = null;
            if (controlElement.is('[uib-control]')) {
                newControlWithActions = controlElement;
                newRowWithActions = controlElement.closest('[uib-row]');
            } else {
                newRowWithActions = controlElement;
            }
            if (!forceRefresh && newRowWithActions.is(rowWithActions)) {
                removeAddedControlActions(true);
            } else {
                removeAddedControlActions();
                rowWithActions = newRowWithActions;
                rowWithActions.addClass('uib-row-hover');
                rowWithActions.prepend('<span class="rowToolbar uib-htmladdon">\
                                            <div class="uib-moveRow" draggable="true">\
                                                <i class="fa fa-arrows" title="Move row"></i>\
                                            </div>\
                                            <div class="uib-popover uib-otherActions">\
                                                <i class="fa fa-bars"></i>\
                                                <ul>\
                                                    <li><a class="uib-duplicateRow"><i class="fa fa-copy"></i>Duplicate</a></li>\
                                                    <li><a class="uib-insertRow"><i class="uib-insertRow-icon"></i>Insert before</a></li>\
                                                    <li><a class="uib-deleteRow"><i class="fa fa-times"></i>Delete</a></li>\
                                                </ul>\
                                            </div>\
                                        </span>');
                rowWithActions.attr('uib-row-height-type', rowWithActions.height() > 70 ? "big" : 'small');
                var rowCells = rowWithActions.children('[uib-cell]');
                var compressableCells = rowCells.filter(function () {
                    return this.firstElementChild == null || Number(this.getAttribute('uib-col')) > 1;
                });
                if (compressableCells.length > 0) {
                    var rowAllCellsButLast = rowCells.not(rowCells.last());
                    rowAllCellsButLast.after('<span class="uib-cellResizer uib-betweenCellResizer uib-htmladdon uib-htmladdon-row" draggable="true">\
                                                <div class="uib-cellResizer-contentParent">\
                                                    <div class="uib-cellResizer-content">\
                                                        <div class="uib-cellResizerHandle"/>\
                                                        <div class="uib-cellInsertHandle" title="Make space"/>\
                                                        <div class="uib-cellLineSeparatorHandle" title="Edit line separator"/>\
                                                    </div>\
                                                </div>\
                                            </span>');
                    rowWithActions.attr('uib-row-width-type', rowWithActions.find(".uib-betweenCellResizer").children().width() >= 30 ? "big" : 'small');
                    rowCells.first().before('<span class="uib-cellResizer uib-leftCellResizer uib-htmladdon uib-htmladdon-row">\
                                        <div class="uib-cellResizer-content">\
                                            <div class="uib-cellResizerHandle"/>\
                                        </div>\
                                    </span>');
                    rowCells.last().after('<span class="uib-cellResizer uib-rightCellResizer uib-htmladdon uib-htmladdon-row" draggable="true">\
                                        <div class="uib-cellResizer-content">\
                                            <div class="uib-cellResizerHandle"/>\
                                        </div>\
                                    </span>');
                }
            }
            if (newControlWithActions) {
                controlWithActions = newControlWithActions;
                controlWithActions.addClass('uib-highlighted');
                if (controlWithActions.is('[uib-control="page"]'))
                    controlWithActions.prepend('<span class="controlToolbar uib-htmladdon uib-htmladdon-row">\
                                        <div class="uib-editControl">\
                                            <i class="fa fa-pencil"></i>\
                                        </div>\
                                    </span>')
                else
                    controlWithActions.prepend('<span class="controlToolbar uib-htmladdon uib-htmladdon-row">\
                                        <div class="uib-moveControl" draggable="true">\
                                            <i class="fa fa-arrows" title="Move control"></i>\
                                        </div>\
                                        <div class="uib-editControl">\
                                            <i class="fa fa-pencil" title="Edit control"></i>\
                                        </div>\
                                        <div class="uib-duplicateControl">\
                                            <i class="fa fa-copy" title="Duplicate control"></i>\
                                        </div>\
                                        <div class="uib-deleteControl">\
                                            <i class="fa fa-times" title="Delete control"></i>\
                                        </div>\
                                    </span>')
            }
        } else
            removeAddedControlActions();
    }

    var duplicateControl = function (control) {
        control.clone();
        var controlTemplate = templateUpdater.getControlIdTemplate(control.attr('id'));
        controlsDefinition.parseControlToInsert(controlTemplate);
        controlTemplate.insertAfter(control);
        var newControlId = controlTemplate.attr('id');
        sendMessageToPageWidthCallback({ action: 'compile', content: '#' + newControlId },
                     (function (id) {
                         return function () {
                             $('#' + id).scrollintoview();
                         }
                     })(newControlId));
        uiManager.setDirty(newControlId);
    }

    var deleteControl = function (control) {
        var parent = control.parent();
        control.remove();
        uiManager.setDirty(control.attr('id'));
    }

    var controlActionsManager = {};

    controlActionsManager.enable = function () {

        $(document.body).on('mouseenter.controlActionsManager.uibuilder mouseleave.controlActionsManager.uibuilder', '[uib-panel]', updateVisiblePanelActionsFromEvent);

        $(document.body).on('mouseenter.controlActionsManager.uibuilder mouseleave.controlActionsManager.uibuilder', '[uib-control], [uib-row]', updateVisibleControlActionsFromEvent);

        $(document.body).on('dragstart.controlActionsManager.uibuilder dragend.controlActionsManager.uibuilder', '.uib-moveRow', function (e) {
            rowLayoutManager.dragRowAround(e.type, $(e.target).closest('[uib-row]'));
        })

        $(document.body).on('click.controlActionsManager.uibuilder', '.uib-duplicateRow, .uib-duplicateControl', function (e) {
            duplicateControl($(e.target).closest('[uib-row], [uib-control]'));
            e.preventDefault();
            return false;
        })

        $(document.body).on('click.controlActionsManager.uibuilder', '.uib-deleteRow, .uib-deleteControl', function (e) {
            deleteControl($(e.target).closest('[uib-row], [uib-control]'));
            e.preventDefault();
            return false;
        })

        $(document.body).on('click.controlActionsManager.uibuilder', '.uib-insertRow', function (e) {
            var row = $(e.target).closest('[uib-row]');
            var cells = row.children('[uib-cell]:not([uib-col="0"])').map(function (i, cell) {
                return Number(cell.getAttribute('uib-col'));
            });
            var newRow = controlsDefinition.getNewRow(cells);
            row.before(newRow);
            e.preventDefault();
            uiManager.setDirty(newRow);
            return false;
        })

        $(document.body).on('click.controlActionsManager.uibuilder', '.uib-cellInsertHandle', function (e) {
            var insertedColumn = cellLayoutManager.insertColumnAfter($(e.target).closest('.uib-cellResizer'));
            removeAddedControlActions();
            uiManager.setDirty(insertedColumn);
        })
        

        $(document.body).on('click.controlActionsManager.uibuilder', '.uib-cellLineSeparatorHandle', function (e) {
            cellLayoutManager.editCellBorder($(e.target).closest('.uib-cellResizer'));
            removeAddedControlActions();
        });

        $(document.body).on('mousedown.controlActionsManager.uibuilder', '.uib-cellResizer', function (e) {
            if ($(e.target).closest('.uib-cellInsertHandle').length == 0 && $(e.target).closest('.uib-cellLineSeparatorHandle').length == 0)
                cellLayoutManager.cellResizerMouseDown(e);
        });

        $(document.body).on('dragstart.uibuilder dragend.uibuilder', '.uib-moveControl', function (e) {
            var controlElement = $(e.target).closest('[uib-control]');
            var controlDef = controlsDefinition.controlList[controlElement.attr('uib-control')]
            controlDragManager.dragControlWithinPage(e.type, controlElement, controlDef);
        })

        $(document.body).on('click.controlActionsManager.uibuilder', '.uib-editControl', function (e) {
            var controlId = $(e.target).closest('[uib-control]').attr('id');
            removeAddedControlActions();
            propertiesWindowManager.showPropertiesPopup(controlId);
        })
    }

    controlActionsManager.updateVisibleControlActions = function (element) {
        updateVisibleControlActions(element, true);
    }

    controlActionsManager.disable = function () {
        $(document.body).off('.controlActionsManager');

        removeAddedControlActions();
    }

    return controlActionsManager;
})();
