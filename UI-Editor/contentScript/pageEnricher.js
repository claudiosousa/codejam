pageEnricher = (function () {

    var uibToolbar = null;
    var ctrlsWindow = null;

    //#region drag title
    var dragTitle = function (event) {
        event.stopPropagation();
        event.preventDefault();

        var lastMousePos = { x: event.clientX, y: event.clientY };
        var containerForDraggableTitle = $(event.target).closest('.draggableTitle').parent()[0];
        var rect = containerForDraggableTitle.getBoundingClientRect();
        containerForDraggableTitle.y = rect.top;
        containerForDraggableTitle.left = rect.left;

        var maxPos = {
            height: $(window).height() - containerForDraggableTitle.clientHeight,
            width: $(window).width() - containerForDraggableTitle.clientWidth
        };

        $(window).on('mousemove.draggableTitle.uibuilder', function (event) {
            event.stopPropagation();
            event.preventDefault();

            var movementX = event.clientX - lastMousePos.x;
            var movementY = event.clientY - lastMousePos.y;
            movementY = Math.max(0, Math.min(maxPos.height, movementY + containerForDraggableTitle.y)) - containerForDraggableTitle.y;
            movementX = Math.max(0, Math.min(maxPos.width, movementX + containerForDraggableTitle.left)) - containerForDraggableTitle.left;

            containerForDraggableTitle.left += movementX;
            containerForDraggableTitle.y += movementY;

            containerForDraggableTitle.style.webkitTransform = new WebKitCSSMatrix(containerForDraggableTitle.style.webkitTransform).translate(movementX, movementY);
            lastMousePos.x += movementX;
            lastMousePos.y += movementY;
        });


        $(window).on('mouseup.draggableTitle.uibuilder', function () {
            $(window).off('.draggableTitle.uibuilder');
        });
    }
    //#endregion

    //#region Add methods


    var addUIBuilderDomElements = function () {

    }

    var addUIBuilderEvents = function () {

        $(window).on('beforeunload.uibuilder', function () {
            uiManager.doImmediateSave()
            if (uiManager.pageActionState == "saving" || uiManager.pageActionState == "dirty")
                return 'There are changes on the page that are still beeing saved.\n' +
                        "Please try to close the page again in a short moment";
            // + 'Are you sure that you want to exit?';
        });

        $(document.body).on('mousedown.uibuilder', '.draggableTitle', function (event) {
            dragTitle(event);
        })

        controlActionsManager.enable();
    }

    //#endregion

    //#region Remove methods

    var removeUIBuilderDomElements = function () {
        $('.uib-htmladdon').remove();
    }

    var removeUIBuilderEvents = function () {
        $(window).off('.uibuilder');
        $(document.body).off('.uibuilder');
    }

    //#endregion

    var pageEnricher = {};

    pageEnricher.updateUndoState = function (undoState) {
        if (uibToolbar)
            uibToolbar.updateUndoState(undoState);
    }

    pageEnricher.addUIBuilderEnrichments = function () {
        if (uibToolbar)
            uibToolbar.hide();
        uibToolbar = new uibAppToolbar();

        if (ctrlsWindow)
            ctrlsWindow.hide();
        ctrlsWindow = new controlsWindow();


        addUIBuilderDomElements();
        addUIBuilderEvents();

        sendMessageToPage({ action: 'triggerCurrentViewFilename' });
    }

    pageEnricher.removeUIBuilderEnrichments = function () {
        if (uibToolbar) {
            uibToolbar.hide();
            uibToolbar = null;
        }

        if (ctrlsWindow) {
            ctrlsWindow.hide();
            ctrlsWindow = null;
        }

        propertiesWindowManager.hide();

        removeUIBuilderDomElements();
        removeUIBuilderEvents();

        controlActionsManager.disable();
    }

    return pageEnricher;
})();