controlsWindow = function () {
    var win = {};
    var controlsWindow = $('<div class="controlWindow uib-htmladdon"></div>');
    var bodyContainer = $('<div class="bodyContainer"></div>').appendTo(controlsWindow);
    var ctrlGrp = $('<div class="ctrlGrp" expanded=true><div class="ctrlGrpHeader"><span class="ctrlGrpTitle">Tools</span></div></div>');
    var ctrlGrpBody = $('<div class="ctrlGrpBody"></div>');
    var ctrlList = $('<div class="ctrlList"></div>');
    
    controlsWindow.on('click', '.collapseIcon', function (e) {
        parent = $(this.parentNode)
        parent.attr("expanded", (parent.attr("expanded") != "true"));
    });

    var controlsContainer = $('<div class="controlsContainer"></div>')
    bodyContainer.append(controlsContainer);


    var controlTmpl = '<div class="uibNewControl" draggable="true">\
                        <i class="{icon}">{iconText}</i>\
                        {label}\
                    </div>';
    var controlIconTmpl = '<i class="{icon}">{iconText}</i>';

    var recentList = [
        "label",
        "form",
        "sgGrid",
        "masterDetail",
	    "sgSelectField",
        "repeater",
        "box",
        "uibPopup"
    ];

    var drawControls = function (filterBrowers) {
        controlsContainer.empty();
        var ctrlGrp = null;
        var ctrlGrpBody = null;
        var ctrlList = null;
        var grpCnt = 0;
        var controlCnt = 0;
        var currentSection = null;

        var recents = [];
        recentList.forEach(function(id) {
            for (var ctrlId in controlsDefinition.controlList) {
                var ctrl = controlsDefinition.controlList[ctrlId];
                if (ctrl && ctrl.id == id) {
                    recents.push(ctrl);
                    break;
                }
            }
        });

        var addGroupNodes = function (title) {
            ctrlGrp = $('<div class="ctrlGrp" expanded="false" />');
            if (title)
                $('<div class="ctrlGrpHeader"><span class="ctrlGrpTitle">' + title + '</span></div>').appendTo(ctrlGrp);
            ctrlGrpBody = $('<div class="ctrlGrpBody" />').appendTo(ctrlGrp);
            ctrlList = $('<div class="ctrlList" />').appendTo(ctrlGrpBody);
        };

        var addCtrlNodes = function (controlDef) {
            if (controlDef.show === false)
                return false;

            var supported = true;

            for (var i = 0; i < filterBrowers.length; i++) {
                if (controlDef.browserSupport.indexOf(filterBrowers[i]) == -1) {
                    supported = false;
                    break;
                }

            }

            if (!supported)
                return false;

            var iconObj = controlDef.icon;
            var control = $(controlTmpl.replace('{label}', controlDef.shortLabel || controlDef.label).replace('{icon}', iconObj.icon).replace('{iconText}', iconObj.text));
            if (controlDef.doubleColumn)
                control.addClass("controlDoubleColumn");

            control.on('dragstart dragend',
                { controlDef: controlDef },
                function (e) {                    
                    controlDragManager.dragControlIntoPage(e.type, e.target, e.data.controlDef);
                });

            ctrlList.append(control);
            return true;
        };

        currentSection = "Recents";
        addGroupNodes(currentSection);
        for (var ctrlId in recents) {
            var controlDef = recents[ctrlId];
            if (addCtrlNodes(controlDef))
                controlCnt++;
        };
        if (ctrlGrp != null && controlCnt > 0)
            ctrlGrp.appendTo(controlsContainer);

        for (var ctrlId in controlsDefinition.controlList) {
            var controlDef = controlsDefinition.controlList[ctrlId];
            if (controlDef.show === false)
                continue;
            var isNewSection = controlDef.section != currentSection;
            currentSection = controlDef.section;
            if (ctrlList == null || isNewSection) {
                if (ctrlGrp != null && controlCnt > 0) {
                    grpCnt++;
                    if (grpCnt == 1)
                        ctrlGrp.attr("expanded", "true");
                    ctrlGrp.appendTo(controlsContainer);
                }
                addGroupNodes(currentSection);
                controlCnt = 0;
            }

            if (addCtrlNodes(controlDef))
                controlCnt++;
        };
        if (ctrlGrp != null && controlCnt > 0)
            ctrlGrp.appendTo(controlsContainer);
    }

    var sb = $(document.body).attr("supported-browsers");
    if (!sb) sb = "";
    drawControls(sb.split(","));
    var propagateObservations = function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes') {
                if (mutation.attributeName == "supported-browsers") {
                    var sb = $(document.body).attr("supported-browsers");
                    if (!sb) sb = "";
                    drawControls(sb.split(","));
                }
            }
        });
    }
    var _observer = new MutationObserver(propagateObservations);
    _observer.observe(document.body, { attributes: true, attributeFilter: 'supported-browsers' });

    controlsContainer.on('click', '.ctrlGrpHeader', function (e) {
        $('.ctrlGrp').attr("expanded", "false");
        parent = $(this.parentNode);
        parent.attr("expanded", "true");
    });

    win.controlsWindow = controlsWindow;
    win.hide = function () {
        _observer.disconnect();
        this.controlsWindow.remove();
    }
    $(document.body).append(controlsWindow);
    return win;
}
