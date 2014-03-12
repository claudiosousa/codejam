controlsDefinition = (function () {

    var controlsDefinition = {
        controlList: {},
        controlTypeProperties: {},
        rowTemplate: '<div uib-row/>',
        cellTemplate: '<div uib-cell/>',
        getNewCell: function (cols) {
            return $(this.cellTemplate).attr('id', getRandomId()).attr('uib-col', cols != undefined ? cols + "" : "12");
        },
        getNewRow: function (cols) {
            if (!cols)
                cols = [12];
            var row = $(this.rowTemplate).attr('id', getRandomId());
            for (var i = 0; i < cols.length; i++) {
                row.append(this.getNewCell(cols[i]));
            }
            return row;
        },
        parseControlToInsert: function (controlToInsert) {
            var idElementsSelector = '[uib-control], [uib-row], [uib-cell]';
            if (controlToInsert.is(idElementsSelector))
                controlToInsert.attr('id', getRandomId());
            controlToInsert.find(idElementsSelector).each(function (i, control) { control.setAttribute('id', getRandomId()) });
            var controlsDefinition = this;
            controlToInsert.find('[uib-panel]').filter(function () {
                var uibpaneldefaultlayout = null;
                if (this.childNodes.length > 0 || !(uibpaneldefaultlayout = this.getAttribute('uib-panel-default-layout')))
                    return;
                try {
                    uibpaneldefaultlayout = JSON.parse(uibpaneldefaultlayout);
                } catch (e) { return; }
                var uibPanel = $(this);
                for (var i = 0; i < uibpaneldefaultlayout.length; i++) {
                    uibPanel.append(controlsDefinition.getNewRow(uibpaneldefaultlayout[i]));
                }
            });

        }
    };

    appManifest.groups.forEach(function (g) {
        g.controls.forEach(function (c_original) {
            var c = $.extend(true, {}, c_original);
            c.section = g.name;
            c.sectionExpanded = g.expandedByDefault;
            controlsDefinition.controlList[c.id] = c;
            var properties = {};
            c.properties.forEach(function (p) {
                properties[p.description] = p;
            })
            c.properties = properties;
        })
    })


    for (var controlType in controlsDefinition.controlList) {
        var uibcontrol = controlsDefinition.controlList[controlType]
        if (uibcontrol.template) {
            var $template = $(uibcontrol.template)
            $template.attr('uib-control', controlType);
            if (uibcontrol.properties)
                for (var pname in uibcontrol.properties) {
                    var prop = uibcontrol.properties[pname];
                    if (!prop.path)
                        var propElement = $template;
                    else
                        var propElement = $template.find(prop.path)
                    propElement.attr('uib-attr', '');
                }
            uibcontrol.template = $template[0].outerHTML;
        }
    }

    for (var controlType in controlsDefinition.controlList) {
        var props = [{ key: 'id' }];
        var uibcontrol = controlsDefinition.controlList[controlType]
        if (uibcontrol.properties)
            for (var pname in uibcontrol.properties) {
                var prop = uibcontrol.properties[pname];
                var key = prop.attribute.replace(/[A-Z]/g, function (match) {
                    return "-" + match.toLowerCase();
                })
                props.push($.extend({ key: key }, prop))
            }
        controlsDefinition.controlTypeProperties[controlType] = props;
    }
    controlsDefinition.controlTypeProperties['uib-row'] = [{ key: 'id' }];
    controlsDefinition.controlTypeProperties['uib-cell'] = [{ key: 'id' }, { key: 'uib-col' }, { key: 'uib-left-line' }];
    return controlsDefinition;
})()