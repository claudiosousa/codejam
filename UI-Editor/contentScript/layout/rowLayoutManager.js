rowLayoutManager = (function () {
    var rowLayoutManager = {};


    var rowBeeingMoved = null;
    var rowParent = null;
    var rowSiblings = null;
    var originalRowPosition = null;
    var currentRowPosition = null;
    rowLayoutManager.dragRowAround = function (eventType, row) {
        switch (eventType) {
            case "dragstart":
                rowBeeingMoved = row;
                rowParent = rowBeeingMoved.parent();
                rowSiblings = rowParent.children().not(rowBeeingMoved);
                currentRowPosition = originalRowPosition = rowParent.children().index(rowBeeingMoved);
                uiManager.setMode('move');
                //placeholder.css('height', row.height());
                rowBeeingMoved.addClass('ui-builder-move-placeholder');
                $(document.body).off(".dragManager.uibuilder");
                $(document.body).on("drop.dragManager.uibuilder dragover.dragManager.uibuilder dragleave.dragManager.uibuilder dragenter.dragManager.uibuilder",
                    rowLayoutManager.handleDocumentRowDragEvents);
                break;
            case "dragend":
                $(document.body).off(".dragManager.uibuilder");
                rowBeeingMoved.removeClass('ui-builder-move-placeholder');
                uiManager.setMode('edit');
                rowBeeingMoved = null;
                break;
        }
    }

    rowLayoutManager.handleDocumentRowDragEvents = function (e) {
        var element = e.target;
        switch (e.type) {
            case "dragenter":
                break;
            case "dragleave":
                break;
            case "dragover":
                if (rowSiblings.length == 0)
                    return;
                var mouseY = e.originalEvent.clientY;
                var panelTop = rowParent.offset().top;
                var distanceToPanelTop = mouseY - panelTop;
                var dropAtPosition = 0;
                var distanceToDropPosition = distanceToPanelTop;
                var panelChildren = rowParent.children();
                var placeholderHeightOffset = 0;
                for (var i = 0; i < panelChildren.length; i++) {
                    var row = panelChildren[i];
                    if (rowBeeingMoved.is(row)) {
                        placeholderHeightOffset += row.clientHeight;
                        continue;
                    }

                    var distanceToEndOfRow = Math.abs(distanceToPanelTop - row.offsetTop - row.clientHeight + placeholderHeightOffset);
                    if (distanceToDropPosition > distanceToEndOfRow) {
                        dropAtPosition = i + 1;
                        distanceToDropPosition = distanceToEndOfRow;
                    }
                }
                if (currentRowPosition != dropAtPosition) {
                    currentRowPosition = dropAtPosition;
                    rowBeeingMoved.remove();
                    if (dropAtPosition == 0)
                        rowParent.prepend(rowBeeingMoved);
                    else
                        rowBeeingMoved.insertAfter(panelChildren[dropAtPosition - 1]);
                }

                e.preventDefault()
                e.originalEvent.dataTransfer.dropEffect = 'move';
                return false;
                break;
            case "drop":
                $(document.body).off(".dragManager.uibuilder");
                rowBeeingMoved.removeClass('ui-builder-move-placeholder');
                uiManager.setDirty(rowBeeingMoved);
                controlActionsManager.updateVisibleControlActions(rowBeeingMoved);
                uiManager.setMode('edit');
                break;
        }
    }
    
     return rowLayoutManager;
})();
