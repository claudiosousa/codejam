auditADA = (function () {
    var auditADA = { launched: false };

    var closePopup = function (e) {
        e.data.remove();
        auditADA.launched = false;
        document.body.setAttribute('checkada', false);
    }  

    var performAudit = function (addWindowContent) {

        document.body.setAttribute('checkada', true);

        var uibcontrols = $('[uib-viewedpage]').find('[uib-control]');
        var table = $('<table/>').appendTo(addWindowContent);
        table.append('<tr>\
                        <th>Type</th>\
                        <th>Label</th>\
                        <th>ADA hint</th>\
                        <th>Res</th>\
                      </tr>')

        for (var i = 0; i < uibcontrols.length; i++) {
            var uibcontrolElem = $(uibcontrols[i]);
            var alt = uibcontrolElem.attr('alt');
            var uibcontrolType = uibcontrolElem.attr('uib-control');
            var uibcontrolId= uibcontrolElem.attr('id');
            var uibcontrolDef = controlsDefinition.controlList[uibcontrolType];
            if (!uibcontrolDef.properties['ADA'])
                continue;
            var ok = !!alt;

            uibcontrolElem.attr('AdaOk', ok);

            var desc = "";
            var propsForDescription = ["Name", "Title", "Sub title"];
            
            function getPropValue(pName){
                var p = uibcontrolDef.properties[pName];
                var elem = uibcontrolElem;
                if (p.path)
                    elem = uibcontrolElem.find(p.path);
                return  elem.attr(p.attribute);
            }

            for (var i = 0; i < propsForDescription.length; i++) {
                if (uibcontrolDef.properties[propsForDescription[i]]) {
                    desc = getPropValue(propsForDescription[i]);
                    break;
                }
            }

            
            if ($.isPlainObject(uibcontrolDef.icon))
                var iconDef = uibcontrolDef.icon;
            else
                var iconDef = { icon: uibcontrolDef.icon, text: "" };
            if (alt == undefined)
                alt = "";
            var row = $('<tr/>').appendTo(table);
            row.append('<td><i class="' + iconDef.icon + '">' + iconDef.text + '<i>' + uibcontrolDef.label + '</td>')
            row.append('<td>' + desc + '</td>')
            row.append('<td>' + alt + '</td>')
            row.append('<td class="' + (ok ? 'adaOKControl' : 'adaNOKControl') + '">' + (ok ? 'Pass' : 'Fail!') + '</td>')
            var selector = '[uib-control="'+uibcontrolType+'"]';
            if (uibcontrolId)
                selector += '#'+uibcontrolId;
            row.click({ selector: selector, table: table }, function (e) {
                table.find('tr').removeClass('selected');
                $(this).addClass('selected');
                //uiManager.selectElement(e.data.selector);
                $(e.data.selector)[0].scrollIntoViewIfNeeded();
            })
        }
    }

    var openPopup = function () {
        var addWindowBackground = $('<div class="auditADAWindowBackground "></div>');
        //var addWindow = $('<div class="auditADAWindow"><p class="draggableTitle">ADA Compliance Audit</p></div>').appendTo(addWindowBackground);
        
        var addWindow = $('<div class="auditADAWindow "><p class="draggableTitle">ADA Compliance Audit</p>\
                <div class="sgwDataPopupCloseBtn" style="top: -7px; right: -6px;">\
        			<div class="icon fa fa-lg fa-times sgwDataPopupCloseBtnOff"></div>\
        			<div class="icon fa fa-lg fa-times-circle sgwDataPopupCloseBtnOn"></div>\
        		</div>\
        </div>').appendTo(addWindowBackground);
        addWindow.on('click', '.sgwDataPopupCloseBtn', addWindowBackground, closePopup);
        
        var addWindowContent = $('<div class="content"></div>').appendTo(addWindow);
        var auditADAActionPanel = $('<div class="auditADAActionPanel">\
                                <button class="btn AuditADACloseButton">Close</button>\
                            </div>').appendTo(addWindow);
        auditADAActionPanel.on('click', '.AuditADACloseButton', addWindowBackground, closePopup);
        addWindowBackground.appendTo(document.body);

        setTimeout((function (addWindowContent) {
            return function () {
                performAudit(addWindowContent);
            }
        })(addWindowContent));
    }

    auditADA.launch = function () {
        if (this.launched)
            return;
        this.launched = true;
        openPopup();
    }

    return auditADA;
})();