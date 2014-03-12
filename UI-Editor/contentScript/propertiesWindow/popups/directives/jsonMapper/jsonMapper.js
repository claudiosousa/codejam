var module = angular.module('jsonMapperTools', []);

module.directive('jsonMapper', ['$sce', '$timeout', function ($sce, $timeout) {

    var cleanStruct = function (struct) {
        if ($.isArray(struct)) {
            //to handle
        } else if ($.isPlainObject(struct)) {
            for (var p in struct) {
                var structProp = struct[p];
                if ($.isPlainObject(structProp))
                    cleanStruct(structProp);
                else
                    delete struct[p];
            }
        }
    }

    var getMappings = function (expectedDataLines) {
        var getPathParts = function (path) { return path.split('[]'); };

        var mappings = { fields: {}, arrays: {} };
        for (var iLine = 0; iLine < expectedDataLines.length; iLine++) {
            var line = expectedDataLines[iLine];
            if (line.mapping) {
                var srcParts = getPathParts(line.path);
                var destParts = getPathParts(line.mapping.text);
                var currentDest = mappings;
                var arraysCount = 0;
                for (var i = 0; i < srcParts.length; i++) {
                    var srcPart = srcParts[i];
                    if (i == srcParts.length - 1) {
                        currentDest.fields[srcPart] = destParts;
                    } else {
                        arraysCount++;
                        if (!currentDest.arrays[srcPart])
                            currentDest.arrays[srcPart] = { fields: {}, arrays: {} };
                        currentDest = currentDest.arrays[srcPart];
                    }
                }
            }
        }
        return mappings;
    }

    var mapPartsWithArrayIndexes = function (array) {
        return array.map(function (p, pi, pa) { return (pa.length > pi + 1) ? p + "[i" + pi + "]" : p });
    }
    var getMappingsInstructions = function (mappings, currentPath, arrayCounter, expectedData) {
        var instructions = [];
        for (var f in mappings.fields) {
            instructions.push(currentPath + f + " = originalData" + mapPartsWithArrayIndexes(mappings.fields[f]).join("") + ";");
        }
        for (var a in mappings.arrays) {
            var arrayMappings = mappings.arrays[a];
            var arrayMappingsSources = {};

            var buildArrayMappingsSources = function (maps, level) {
                for (var mf in maps.fields) {
                    var arraySrc = maps.fields[mf];
                    arrayMappingsSources[mapPartsWithArrayIndexes(arraySrc.slice(0, arraySrc.length - level)).join("")] = null;
                }
                for (var ma in maps.arrays)
                    buildArrayMappingsSources(maps.arrays[ma], level + 1);
            }
            buildArrayMappingsSources(arrayMappings, 1);
            var isExpectedScalarArray = !!arrayMappings.fields[""];
            var srcMaxLength = "Math.min.call(Math.min";
            for (var src in arrayMappingsSources)
                srcMaxLength += ", originalData" + src + ".length";
            instructions.push(currentPath + a + " = []");
            instructions.push("var i" + arrayCounter + "MaxLength = " + srcMaxLength + ");");
            instructions.push("for(var i" + arrayCounter + " = 0; i" + arrayCounter + " < i" + arrayCounter + "MaxLength; i" + arrayCounter + "++){");
            if (isExpectedScalarArray) {
                instructions.push(currentPath + a + ".push(originalData" + mapPartsWithArrayIndexes(arrayMappings.fields[""]).join("") + ");");
            } else {
                var currentData = expectedData;
                var arrayParts = a.split('.');
                for (var i = 0; i < arrayParts.length; i++) {
                    var arrayPart = arrayParts[i];
                    if (!arrayPart)
                        continue;
                    currentData = currentData[arrayPart];
                }
                var emptyStructure = $.extend(true, {}, currentData[0]);
                cleanStruct(emptyStructure);
                instructions.push("var newRowi" + arrayCounter + " = " + JSON.stringify(emptyStructure) + ";");
                instructions.push(currentPath + a + ".push(newRowi" + arrayCounter + ");");
                instructions.push.apply(instructions, getMappingsInstructions(arrayMappings, "newRowi" + arrayCounter, arrayCounter + 1, currentData[0]));
            }
            instructions.push("};");
        }
        return instructions;
    }

    var updateMapOutput = function (expectedData, expectedDataLines) {
        var mappings = getMappings(expectedDataLines);

        var instructions = [];

        var emptyStructure = $.extend(true, {}, expectedData);
        cleanStruct(emptyStructure);
        instructions.push('var transformedData = ' + JSON.stringify(emptyStructure));

        instructions.push.apply(instructions, getMappingsInstructions(mappings, "transformedData", 0, expectedData));

        return 'function transformData(originalData){\n' + instructions.join('\n') + '\nreturn transformedData;\n}';
    }

	var jsonMapperCtrlr = function ($scope, $element, $attrs) {
        $scope.deconstructedJson = { availableData: null, expectedData: null };
        $scope.state = { isDragging: false, readyToDrag: false, currentHighlightedMappingPath: null, droppableArrayLevels: {} };
		if ($scope.output == undefined)
			$scope.output = { };
		$scope.output.js=  null;
		$scope.output.json=  null;
		$scope.output.status=  null;

        this.setDeconstructedJson = function (ctrl, elem, lines) {
            if (elem.attr('available') == undefined) {
                $scope.deconstructedJson.expectedDataCtrl = ctrl;
                $scope.deconstructedJson.expectedData = lines;
			} else if (elem.attr('expected') == undefined) {
                $scope.deconstructedJson.availableDataCtrl = ctrl;
                $scope.deconstructedJson.availableData = lines;
            }
			this.restorePersistedDeconstructedJson();
        }


		this.restorePersistedDeconstructedJson = function() {
			
			var findItem = function(list, path) {
				var result = null;
				if (list instanceof Array) {
					list.some(function(item) {
						if (item.path == path) {
							result = item;
							return true;
						}
						return false;
					});
				}
				return result;
			};
			
			var resetData = function(list) {
				if (list instanceof Array) {
					list.forEach(function(item) {
						item.binded = false;
						item.mapping = null;
					});
				}
			};
			
			if ($scope.deconstructedJson && $scope.deconstructedJson.availableData && $scope.deconstructedJson.expectedData) {
				resetData($scope.deconstructedJson.availableData);
				resetData($scope.deconstructedJson.expectedData);
				var json = [];
				try {
					json = JSON.parse($scope.output.mapping);
				} catch(e) {}
				if (json instanceof Array) {
					json.forEach(function(item) {
						var src = findItem($scope.deconstructedJson.availableData, item.s);
						var dest = findItem($scope.deconstructedJson.expectedData, item.d);
						if (src && dest) {
							src.binded = true;
							dest.mapping = {
								type: "mapping",
								text: src.path,
								bindedtoLine: src
							}
						}
					});
				}
				this.updateMapOutput(true);
			}
		};

        this.updateMapOutput = function (initial) {
            $scope.updateMapOutput(initial);
        }
    };
	jsonMapperCtrlr.$inject = ['$scope', '$element', '$attrs'];
    return {
        restrict: 'A',
        scope: true,
        priority: 2,
        controller: jsonMapperCtrlr,
        link: function (scope, elem, attrs) {
            elem.addClass('jsonMapper');
            scope.state.dragging = false;
            var currentlyDroppingOn = null;
			
            $(elem[0]).on('mouseenter mouseleave', '.prettifyLine[binded="true"]', function (e) {
                if (scope.state.dragging)
                    return;
                if (e.type == "mouseenter") {
                    var hoverpath = angular.element(this).scope().line.path;
                    if (hoverpath && hoverpath != scope.state.currentHighlightedMappingPath) {
                        scope.state.currentHighlightedMappingPath = hoverpath;
                        scope.$safeApply();
                    }
                } else if (e.type == "mouseleave" && scope.state.currentHighlightedMappingPath) {
                    scope.state.currentHighlightedMappingPath = null;
                    scope.$safeApply();
                }
            });

			$(elem[0]).on('mouseenter mouseleave', '.prettifyLine .prettifyPart_mapping', function (e) {
                if (scope.state.dragging)
                    return;
                if (e.type == "mouseenter") {
                    var mapping = angular.element(this.parentNode).scope().line.mapping;
                    if (mapping) {
                        var hoverpath = mapping.bindedToLine.path;
                        if (hoverpath && hoverpath != scope.state.currentHighlightedMappingPath) {
                            scope.state.currentHighlightedMappingPath = hoverpath;
                            scope.$safeApply();
                        }
                    }
                } else if (e.type == "mouseleave" && scope.state.currentHighlightedMappingPath) {
                    scope.state.currentHighlightedMappingPath = null;
                    scope.$safeApply();
                }
				scope.$apply();
            });

            $(elem[0]).on('mouseenter mouseleave', '.prettify_droppable', function (e) {
                if (!scope.state.dragging)
                    return;
                if (e.type == "mouseenter") {
                    this.setAttribute("hover", true);
                    currentlyDroppingOn = this;
                } else if (e.type == "mouseleave") {
                    this.setAttribute("hover", false);
                    currentlyDroppingOn = null;
                }
				scope.$apply();
            });

            $(elem[0]).on('mousedown', '.prettify_draggable .dragCircle', function (e) {
                var dragged = this;
                var linkLine = $('<div class="linkLine"></div').appendTo(elem);

                var elemRect = elem[0].getBoundingClientRect();
                var circleRect = this.getBoundingClientRect();
                var startEventPos = { clientX: circleRect.left + circleRect.width / 2, clientY: circleRect.top + circleRect.height / 2 };
                var startPoint = { x: startEventPos.clientX - elemRect.left, y: startEventPos.clientY - elemRect.top };

                linkLine.css({ top: startPoint.y + "px", left: startPoint.x + "px" })
                event.stopPropagation();
                event.preventDefault();
                scope.state.dragging = true;
                dragged.setAttribute("dragging", true);

                var draggingLine = angular.element(this.parentNode).scope().line;
                updateDragEndPossibilities(draggingLine);

                $(window).on('mousemove.jsonMapper', function (e) {
                    var distance = Math.sqrt(Math.pow(e.clientX - startEventPos.clientX, 2) + Math.pow(e.clientY - startEventPos.clientY, 2));
                    var angle = Math.asin((e.clientY - startEventPos.clientY) / distance) * 180 / Math.PI;
                    if (e.clientX < startEventPos.clientX)
                        angle = 90 - angle;
                    else
                        angle -= 90;
                    linkLine.css({ height: distance + "px", '-webkit-transform': 'rotateZ(' + angle + 'deg)' });
                    event.stopPropagation();
                    event.preventDefault();
                });

                $(window).on('mouseup.jsonMapper', function () {
                    if (currentlyDroppingOn) {
                        currentlyDroppingOn.setAttribute("hover", false);
                        createMapping(draggingLine, angular.element(currentlyDroppingOn).scope().line);
                        currentlyDroppingOn = null;
                    }
                    linkLine.remove();
                    updateDragEndPossibilities();
                    dragged.setAttribute("dragging", false);
                    scope.state.dragging = false;
                    $(window).off('mousemove.jsonMapper');
                    $(window).off('mouseup.jsonMapper');
                });
				
				scope.$apply();
            });
			
            scope.$watchCollection('deconstructedJson.expectedData', function () {
                updateDragStartPossibilities();
            });

            scope.$watchCollection('deconstructedJson.availableData', function () {
                updateDragStartPossibilities();
            });

            scope.shouldHighlightMapping = function (line) {
                if (line.binded && line.path == scope.state.currentHighlightedMappingPath)
                    return true;
                if (line.mapping && line.mapping.bindedToLine.path == scope.state.currentHighlightedMappingPath)
                    return true;
                return false;
            }

			var updatePersistedDeconstructedJson = function() {
				var json = [];
				if (scope.deconstructedJson && scope.deconstructedJson.expectedData instanceof Array) {
					scope.deconstructedJson.expectedData.forEach(function(item) {
						if (item.mapping != null && item.mapping.type == "mapping")
							json.push({"s": item.mapping.text, "d": item.path});
					});
				}
				scope.output.mapping = JSON.stringify(json);
			};

            scope.updateMapOutput = function (initial) {
                var transformFn = updateMapOutput(scope.$eval($(elem[0]).find('[expected][prettify]').attr('prettify')), scope.deconstructedJson.expectedData);
				scope.output.transformFn = transformFn;
                //scope.output.js = js_beautify(transformFn);
				if (!initial)
					updatePersistedDeconstructedJson();
				scope.output.status = true;
                scope.output.js = $sce.trustAsHtml('<pre class="prettyprint lang-dart linenums">' + js_beautify(transformFn) + '</pre>');
                scope.output.json = $sce.trustAsHtml('<pre class="prettyprint lang-dart linenums">' + js_beautify(JSON.stringify(eval(transformFn + ";transformData(" + JSON.stringify(scope.$eval($(elem[0]).find('[available][prettify]').attr('prettify'))) + ")"))) + '</pre>');
                scope.$safeApply();
                prettyPrint();
            }

            var createMapping = function (dragLine, dropLine) {
                dropLine.mapping = { text: dragLine.path, bindedToLine: dragLine, type: "mapping" };
                updateDropableArrayLevels();
                dragLine.binded = true;
                dragLine.draggable = false;
                scope.updateMapOutput();
            }

            var updateDragEndPossibilities = function (draggedLine) {
                if (draggedLine) {
                    scope.deconstructedJson.expectedData.forEach(function (line) {
                        line.droppable = line.dataType == "scalar" && !line.mapping && line.withinNArrays == draggedLine.withinNArrays;
                    });
                } else {
                    scope.deconstructedJson.expectedData.forEach(function (line) {
                        line.droppable = false;
                    });
                }
                scope.deconstructedJson.availableDataCtrl.scopeRefresh();
            }

            var updateDropableArrayLevels = function () {
                scope.state.droppableArrayLevels = {};
                scope.deconstructedJson.expectedData.forEach(function (line) {
                    if (line.droppable)
                        scope.state.droppableArrayLevels[line.withinNArrays] = true;
                });
            }

            var updateDragStartPossibilities = function () {
                if (!scope.deconstructedJson.expectedData || !scope.deconstructedJson.availableData) {
                    scope.state.isDragging = scope.state.readyToDrag = false;
                    return;
                }

                scope.deconstructedJson.expectedData.forEach(function (line) {
                    line.droppable = line.dataType == "scalar" && !line.mapping;
                });

                updateDropableArrayLevels();


                scope.deconstructedJson.expectedData.forEach(function (line) {
                    line.droppable = false;
                });


                scope.deconstructedJson.availableData.forEach(function (line) {
                    line.draggable = line.dataType == "scalar" && scope.state.droppableArrayLevels[line.withinNArrays];
                });

                scope.state.readyToDrag = true;
                scope.deconstructedJson.availableDataCtrl.scopeRefresh();
                scope.deconstructedJson.expectedDataCtrl.scopeRefresh();
            }

        }
    }
}]);

module.directive('prettify', [function () {
    var emptyRow = "EMPTY_ROW";
    var createLineFromParts = function (beforeValue, value, afterValue, tabs, dataPath, data, withNArrays) {
        var dataType = null;
        if (data == emptyRow)
            data = null;
        else
            dataType = $.isArray(data) ? 'array' : ($.isPlainObject(data) ? 'object' : 'scalar');

        var getParts = function (partsParam) {
            if (!$.isArray(partsParam))
                return [];

            if (!$.isArray(partsParam[0])) {
                var parts = [];
                parts.push(partsParam);
            } else
                var parts = partsParam;

            return parts.map(function (p) { return { text: p[0], type: p[1] } });
        }

        var line = {
            tabs: tabs,
            withinNArrays: withNArrays,
            path: dataPath,
            beforeValue: getParts(beforeValue),
            value: getParts(value),
            mapping: null,
            afterValue: getParts(afterValue),
            data: data,
            binded: false,
            dataType: dataType
        };

        return line;
    }

    var buildLinesFromObj = function (existingLines, currentTabLevel, jsonObj, currentPath, withNArrays, currentLine) {
        if (withNArrays == undefined)
            withNArrays = 0;
        if (currentPath == undefined)
            currentPath = "";
        if ($.isArray(jsonObj)) {
            currentPath += "[]";
            var tabOpeningLine;
            if (currentLine) {
                tabOpeningLine = currentLine.beforeValue.push({ text: "[", type: "symbol" });
            } else {
                tabOpeningLine = createLineFromParts(["[", "symbol"], undefined, undefined, currentTabLevel, currentPath, jsonObj, withNArrays);
                existingLines.push(tabOpeningLine);
            }
            withNArrays += 1;
            if (jsonObj.length > 0) {
                var firstRow = jsonObj[0];
                if ($.isPlainObject(firstRow) || $.isArray(firstRow))
                    buildLinesFromObj(existingLines, currentTabLevel + 1, firstRow, currentPath, withNArrays);
                else {
                    existingLines.push(createLineFromParts(undefined, [firstRow, "value"], undefined, currentTabLevel + 1, currentPath, firstRow, withNArrays));
                }
                if (jsonObj.length > 1) {
                    existingLines[existingLines.length - 1].afterValue.push({ text: ",", type: "comma" });
                    existingLines.push(createLineFromParts(["...", "symbol"], undefined, undefined, currentTabLevel + 1, currentPath, emptyRow, withNArrays));
                }
            }
            existingLines.push(createLineFromParts(undefined, undefined, ["]", "symbol"], currentTabLevel, currentPath, emptyRow, withNArrays));
        } else if ($.isPlainObject(jsonObj)) {
            if (currentLine)
                currentLine.beforeValue.push({ text: "{", type: "symbol" });
            else
                existingLines.push(createLineFromParts(["{", "symbol"], undefined, undefined, currentTabLevel, currentPath, jsonObj, withNArrays));
            currentPath += ".";
            var isFirstPropForObj = true;
            for (var p in jsonObj) {
                if (!isFirstPropForObj)
                    existingLines[existingLines.length - 1].afterValue.push({ text: ",", type: "comma" });
                isFirstPropForObj = false;
                var value = jsonObj[p];
                if ($.isPlainObject(value) || $.isArray(value)) {
                    var line = createLineFromParts([[p, "key"], [":", "symbol"]], undefined, undefined, currentTabLevel + 1, currentPath + p, value, withNArrays)
                    existingLines.push(line);
                    buildLinesFromObj(existingLines, currentTabLevel + 1, value, currentPath + p, withNArrays, line);
                } else {
                    existingLines.push(createLineFromParts([[p, "key"], [":", "symbol"]], [value, "value"], undefined, currentTabLevel + 1, currentPath + p, value, withNArrays));
                }
            }
            existingLines.push(createLineFromParts(undefined, undefined, ["}", "symbol"], currentTabLevel, currentPath, emptyRow, withNArrays));
        }
    }
    var prettifyCtrlr = function ($scope, $element, $attrs) {
        this.scopeRefresh = function () {
            $scope.$safeApply();
        };
    };
	prettifyCtrlr.$inject = ['$scope', '$element', '$attrs'];

    return {
        restrict: 'A',
        template: '<div class="prettifyArea"> <!--  hasUnmappedValues="{{output.hasUnmappedValues()}}" --> \
                    <div ng-transclude>\
                    </div>\
                    <div class="prettifyLine" highlightMapping="{{shouldHighlightMapping(line)}}" binded="{{line.binded}}" ng-repeat="line in lines" style="{{\'margin-left:\'+line.tabs*20+\'px\'}}" ng-class="{true:\'prettify_draggable\'}[line.draggable] + {true:\' prettify_droppable\'}[line.droppable]" drag_able="{{line.draggable}}" drop_able="{{line.droppable}}"  hasValue="{{line.value.length>0}}" hasMapping="{{!!line.mapping}}">\
                        <div class="dropCircle"><div class="dropInnerCircle"></div></div>\
						<div class="prettifyPart" ng-repeat="part in line.beforeValue" ng-class="\'prettifyPart_\'+part.type" ng-bind="part.text"></div>\
                        <div style="display:inline-block" ng-if="!line.mapping">\
                            <div class="prettifyPart" ng-repeat="part in line.value" ng-class="\'prettifyPart_\'+part.type" ng-bind="part.text"></div>\
                        </div>\
                        <div class="prettifyPart" ng-if="line.mapping" ng-class="\'prettifyPart_\'+line.mapping.type">\
                            <span ng-bind="line.mapping.text"></span>\
                            <div class="mappingRemove icon fa fa-lg fa-times" ></div>\
                        </div>\
                        <div class="prettifyPart" ng-repeat="part in line.afterValue" ng-class="\'prettifyPart_\'+part.type" ng-bind="part.text"></div>\
                        <div class="dragCircle"><div class="dragInnerCircle"></div></div>\
                    </div>\
                </div>',
        replace: true,
        transclude: true,
        scope: true,
        require: ['prettify', '?^jsonMapper'],
        controller: prettifyCtrlr,
        link: function (scope, elem, attrs, ctrls) {
			$(elem[0]).on('click', '.mappingRemove', function (e) {
                var lineScope = angular.element(this.parentNode.parentNode).scope();
                lineScope.line.mapping.bindedToLine.binded = false;
                lineScope.line.mapping.bindedToLine.draggable = true;
                lineScope.line.mapping = null;
                lineScope.$safeApply();
                if (jsonMapper)
                    jsonMapper.updateMapOutput();
            })
            var prettify = ctrls[0];
            var jsonMapper = ctrls[1];
            var ngTransclude = $(elem[0]).find('[ng-transclude]')
            var innerJSON = ngTransclude.text();
            ngTransclude.remove();

			if (scope.output == undefined)
	       		scope.output = { };
            scope.output.hasUnmappedValues = function () {
                if (!scope.lines)
                    return false;
                return scope.lines.some(function (l) { return l.value.length > 0 && !l.mapping });
            }
            var drawJson = function (json) {
                var currentTabLevel = 0;
                var lines = [];
                buildLinesFromObj(lines, currentTabLevel, json);
                scope.lines = lines;
                if (jsonMapper)
                    jsonMapper.setDeconstructedJson(prettify, elem, lines);
            }
            try {
                if (attrs.prettify) {
                    scope.$watch(attrs.prettify, function (value) {
                        drawJson(value);
                    });
                }
                else {
                    var json = JSON.parse(innerJSON);
                    drawJson(json)
                }
            } catch (e) {
                scope.lines = [{
                    tabs: 0,
                    parts: [{ text: "Invalid JSON", type: "error" }]
                }];
                return;
            }
        }
    }
}]);