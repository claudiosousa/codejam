controlDragManager = (function () {
    var controlDragManager = {};
    var currentMode = null;
    var dragElementData = null;

    var handleDragEvent = function (eventType, element, controlDef) {
        switch (eventType) {
            case "dragstart":
                uiManager.setMode(dragElementData.mode);
                $(document.body).off(".dragManager.uibuilder");
                $(document.body).on("drop.dragManager.uibuilder dragover.dragManager.uibuilder dragleave.dragManager.uibuilder dragenter.dragManager.uibuilder", controlDragManager.handleDocumentDragEvents);
                var rows = $('[uib-viewedpage]').find('[uib-panel]').children('[uib-row]');
                rows.each(function (i, rowDom) {
                    var row = $(rowDom);
                    var rowCells = row.children('[uib-cell]');
                    var compressableCells = rowCells.filter(function () {
                        return this.firstElementChild == null || Number(this.getAttribute('uib-col')) > 1;
                    });
                    if (compressableCells.length > 0) {
                        row.children('[uib-cell]:not(:last-of-type)')
                        .after('<span class="uib-cellinterval-placeholder uib-htmladdon">\
                                <div class="uib-cellinterval-placeholder-contentParent">\
                                    <div class="uib-cellinterval-placeholder-content">\
                                    </div>\
                                </div>\
                            </span>');
                    }
                });
                break;
            case "dragend":
                if (dragElementData == null)
                    return;
                if (dragElementData.originalElement)
                    dragElementData.originalElement.removeClass('uib-beeingmoved');
                $(document.body).off(".dragManager.uibuilder");
                $(element).removeClass('ui-builder-move-placeholder');
                $('.uib-cellinterval-placeholder').remove();
                $('.uib-droppping-on-cell').removeClass('uib-droppping-on-cell');
                uiManager.setMode('edit');
                break;
        }
    }

    controlDragManager.dragControlWithinPage = function (eventType, element, controlDef) {
        if (eventType == "dragstart") {
            dragElementData = { mode: "move" };

            dragElementData.controlDef = controlDef;
            dragElementData.originalElement = element;
            dragElementData.originalElement.addClass('uib-beeingmoved')
            dragElementData.element = templateUpdater.getControlIdTemplate(element.attr('id'));
            dragElementData.originalElement.closest('[uib-row]').children('.uib-htmladdon-row').remove();
            dragElementData.placeHolder = $('<div class="ui-builder-insert-placeholder"></div>');
        }
        handleDragEvent(eventType, element, controlDef);
    }

    controlDragManager.dragControlIntoPage = function (eventType, element, controlDef) {
        if (eventType == "dragstart") {
            dragElementData = { mode: "insert" };
            dragElementData.controlDef = controlDef;
            dragElementData.element = $(controlDef.template);
            controlsDefinition.parseControlToInsert(dragElementData.element);
            dragElementData.placeHolder = $('<div class="ui-builder-insert-placeholder"></div>');
        }
        handleDragEvent(eventType, element, controlDef);
    }

    
    controlDragManager.handleDocumentDragEvents = function (e) {
        var element = e.target;
        switch (e.type) {
            case "dragenter":
                break;
            case "dragleave":
                break;
            case "dragover":
                var closestCell = $(element).closest('[uib-cell], .uib-cellinterval-placeholder-content');
                if (closestCell.length > 0) {
                    dragElementData.canDrop = true;
                    var isNewCell = !closestCell.is(dragElementData.currentCell);
                    if (isNewCell) {
                        dragElementData.placeHolder.remove();
                        if (dragElementData.currentCell)
                            dragElementData.currentCell.removeClass('uib-droppping-on-cell');
                        closestCell.addClass('uib-droppping-on-cell');
                        dragElementData.currentCell = closestCell;
                    }
                    var dropAtPosition = 0;
                    var cellDom = closestCell[0];
                    var cellChildren = closestCell.children(':not(.ui-builder-insert-placeholder)');
                    if (cellChildren.length > 0) {
                        var mouseY = e.originalEvent.clientY;
                        var cellTop = $(cellDom).offset().top;
                        var distanceToCellTop = mouseY - cellTop;
                        var distanceToDropPosition = distanceToCellTop;
                        cellChildren = cellDom.children;
                        var placeholderHeightOffset = 0;
                        for (var i = 0; i < cellChildren.length; i++) {
                            var child = cellChildren[i];
                            if ($(child).hasClass('ui-builder-insert-placeholder')) {
                                placeholderHeightOffset += child.clientHeight;
                                continue;
                            }

                            var distanceToEndOfChild = Math.abs(distanceToCellTop - child.offsetTop - child.clientHeight + placeholderHeightOffset);
                            if (distanceToDropPosition > distanceToEndOfChild) {
                                dropAtPosition = i + 1;
                                distanceToDropPosition = distanceToEndOfChild;
                            }
                        }
                    }
                    if (isNewCell || dragElementData.currentCellPosition != dropAtPosition) {
                        dragElementData.currentCellPosition = dropAtPosition;
                        if (dropAtPosition == 0)
                            closestCell.prepend(dragElementData.placeHolder);
                        else
                            dragElementData.placeHolder.insertAfter(cellChildren[dropAtPosition - 1]);
                    }
                } else {
                    if (dragElementData.currentCell) {
                        dragElementData.currentCell.removeClass('uib-droppping-on-cell');
                        dragElementData.currentCell = null;
                        dragElementData.currentCellPosition = null;
                        dragElementData.placeHolder.remove();
                    }
                    dragElementData.canDrop = false;
                }

                if (dragElementData.canDrop) {
                    e.preventDefault()
                    e.originalEvent.dataTransfer.dropEffect = (dragElementData.mode == "insert" ? 'copy' : 'move');
                    return false;
                }
                break;
            case "drop":
                $(document.body).off(".dragManager.uibuilder");
                $('.uib-droppping-on-cell').removeClass('uib-droppping-on-cell');
                if (dragElementData.currentCell && dragElementData.currentCell.hasClass('uib-cellinterval-placeholder-content')) {
                    var cellintervalPlaceholder = dragElementData.currentCell.closest('.uib-cellinterval-placeholder');
                    var newCell = controlsDefinition.getNewCell(0);
                    dragElementData.placeHolder.remove();
                    newCell.append(dragElementData.placeHolder);
                    cellintervalPlaceholder.after(newCell);
                    var nextCells = newCell.nextAll('[uib-cell]');
                    var previousCells = newCell.prevAll('[uib-cell]');
                    var cell2Compress = nextCells.toArray().concat(previousCells.toArray()).filter(function (cell) {
                        var cols = Number(cell.getAttribute('uib-col'));
                        return cols > 1 || (cols > 0 && cell.children.length == 0);
                    });
                    uiManager.setMode('cell-resize');
                    setTimeout(function (newCell, cell2Compress, row) {
                        newCell.attr('uib-col', '1');
                        if (cell2Compress)
                            cell2Compress.setAttribute('uib-col', Number(cell2Compress.getAttribute('uib-col')) - 1);
                        setTimeout(function (row) {
                            row.children('[uib-cell][uib-col="0"]').remove();
                            uiManager.setMode('edit');
                        }, 600, row);
                    }, 0, newCell, cell2Compress[0], dragElementData.currentCell.closest('[uib-row]'));
                }
                else
                    uiManager.setMode('edit');

                $('.uib-cellinterval-placeholder').remove();

                if (dragElementData.mode == "move") {
                    dragElementData.originalElement.remove();
                }

                var newElement = dragElementData.element;
                dragElementData.placeHolder.replaceWith(newElement);
                var elementId = newElement.attr('id');

                if (dragElementData.mode == "insert" && dragElementData.controlDef.properties) {
                    var ngModelProp = dragElementData.controlDef.properties['Model'];
                    if (ngModelProp) {
                        if (ngModelProp.path)
                            var ngModelElement = dragElementData.element.find(ngModelProp.path);
                        else
                            var ngModelElement = dragElementData.element;
                        ngModelElement.attr(ngModelProp.attribute, 'unsetmodel_' + elementId);
                    }
                }

                sendMessageToPageWidthCallback({ action: 'compile', content: '#' + elementId },
                    (function (id) {
                        return function () {
                            $('#' + id).scrollintoview();
                        }
                    })(elementId));

                uiManager.setDirty(newElement);
                dragElementData = null;
                break;
        }
    }

    return controlDragManager;
})();
