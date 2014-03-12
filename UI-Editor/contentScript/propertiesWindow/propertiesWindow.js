propertiesWindow = function (currentProperties, callback) {
    var propertiesBeeingEdited = currentProperties;
    var win = {};

    var propertiesWindowPnl = $('<div class="propertiesWindowPanel"></div>');

    var wnd = $('<div class="propertiesWindow"></div>').appendTo(propertiesWindowPnl);

    var header = $('<div class="propertiesWindowHeader draggableTitle"></div>').appendTo(wnd);

    var eltIcon = $('<i class="selectedElementIcon"></i>').appendTo(header);
    var eltTitle = $('<span class="selectedElementTitle"></span>').appendTo(header);
    var eltHomePnl = $('<span class="controlHomepagePnl">(<a class="controlHomepageAnchor" target="_blank">Homepage</a>)</span>').appendTo(header);
    var eltUrl = eltHomePnl.find("a");

    var body = $('<div class="propertiesWindowBody"></div>').appendTo(wnd);
    var bodyBlock = $('<div class="selectedElementPropertiesBlock"></div>').appendTo(body);
    var bodyPnl = $('<div class="selectedElementBodyPnl"></div>').appendTo(bodyBlock);
    var objectProperties = $('<table id="objectProperties"></table>').appendTo(bodyPnl);

    var footer = $('<div class="propertiesWindowFooter"></div>').appendTo(wnd);
    var btnGrp = $('<div class="propertiesWindowFooterBtnGroup"></div>').appendTo(footer);
    var saveBtn = $('<button class="propertiesWindowBtn propertiesWindowFooterBtn propertiesWindowBtnImportant propertiesWindowFooterImportantBtn">OK</button>').appendTo(btnGrp);

    win.propertiesWindow = propertiesWindowPnl;
    win.hide = function () {
        $(window).off("resize.uibpropwnd");
        if (this.propertiesWindow) {
            this.propertiesWindow.remove();
            this.propertiesWindow = null;
        }
    }
    $(document.body).append(propertiesWindowPnl);

    var closeMe = function (reason) {
        win.hide();
        if (typeof callback == "function")
            callback({ reason: reason, data: propertiesBeeingEdited });
    };

    var openPopup = function (template, jsFiles, data, callback) {
        //$(popupOverlay).show();
        popupManager.launch(template, jsFiles, data, callback);
    };

    var cleanDollarProperties = function (obj) {
        if (angular.isArray(obj)) {
            var res = [];
            obj.forEach(function (item) {
                res.push(cleanDollarProperties(item));
            });
            return res;
        } else if (angular.isObject(obj)) {
            var res = {};
            for (var p in obj)
                if (p[0] != '$')
                    res[p] = cleanDollarProperties(obj[p]);
            return res;
        } else
            return obj;
    }

    var customPropertyDefaultModules = {
        'ui.sortable': 'angular.module("ui.sortable", []).value("uiSortableConfig", {}).directive("uiSortable", ["uiSortableConfig", "$log", function (e, t) { return { require: "?ngModel", link: function (n, r, i, s) { function o(e, t) { if (t && typeof t === "function") { return function (n, r) { e(n, r); t(n, r) } } return e } var u = {}; var a = { receive: null, remove: null, start: null, stop: null, update: null }; var f = function (e, t) { if (t.item.sortable.resort || t.item.sortable.relocate) { n.$apply() } }; angular.extend(u, e); if (s) { s.$render = function () { if (r.sortable) r.sortable("refresh") }; a.start = function (e, t) { t.item.sortable = { index: t.item.index() } }; a.update = function (e, t) { t.item.sortable.resort = s }; a.receive = function (e, t) { t.item.sortable.relocate = true; s.$modelValue.splice(t.item.index(), 0, t.item.sortable.moved) }; a.remove = function (e, t) { if (s.$modelValue.length === 1) { t.item.sortable.moved = s.$modelValue.splice(0, 1)[0] } else { t.item.sortable.moved = s.$modelValue.splice(t.item.sortable.index, 1)[0] } }; a.stop = function (e, t) { if (t.item.sortable.resort && !t.item.sortable.relocate) { var n, r; r = t.item.sortable.index; n = t.item.index(); t.item.sortable.resort.$modelValue.splice(n, 0, t.item.sortable.resort.$modelValue.splice(r, 1)[0]) } }; n.$watch(i.uiSortable, function (e, t) { angular.forEach(e, function (e, t) { if (a[t]) { e = o(a[t], e); if (t === "stop") { e = o(e, f) } } if (r.sortable) r.sortable("option", t, e) }) }, true); angular.forEach(a, function (e, t) { u[t] = o(e, u[t]) }); u.stop = o(u.stop, f) } else { t.info("ui.sortable: ngModel not provided!", r) } if (r.sortable) r.sortable(u) } } }])',
        'custom.input': "angular.module('custom.input', []).directive('ngModelOnchange', function($timeout) {\
                        return {\
                            restrict: 'A',\
                            require: 'ngModel',\
                            link: function(scope, $element, attr, modelCtrl) {\
                                 if (attr.type === 'radio' || attr.type === 'checkbox')\
                                    return;\
                                var $setViewValue = modelCtrl.$setViewValue,\
                                    bufferedValue;\
                                modelCtrl.$setViewValue = bufferViewValue;\
                                $element.on('change', onchange);\
                                function onchange(e) {\n\
                                    $timeout(flushViewValue);\n\
                                }\n\
                                function bufferViewValue(value) {\
                                    bufferedValue = value;\
                                }\
                                function flushViewValue() {\n\
                                    $setViewValue.call(modelCtrl, bufferedValue);\n\
                                }\n\
                            }\
                        };\
                    });",
        'uib.colorPicker': 'angular.module("uib.colorPicker", []).directive("uibColorPicker", function($rootScope, $timeout) { \
	                        var colors = { \
                                "aliceblue": "#f0f8ff", \
                                "antiquewhite": "#faebd7", \
                                "aqua": "#00ffff", \
                                "aquamarine": "#7fffd4", \
                                "azure": "#f0ffff", \
                                "beige": "#f5f5dc", \
                                "bisque": "#ffe4c4", \
                                "black": "#000000", \
                                "blanchedalmond": "#ffebcd", \
                                "blue": "#0000ff", \
                                "blueviolet": "#8a2be2", \
                                "brown": "#a52a2a", \
                                "burlywood": "#deb887", \
                                "cadetblue": "#5f9ea0", \
                                "chartreuse": "#7fff00", \
                                "chocolate": "#d2691e", \
                                "coral": "#ff7f50", \
                                "cornflowerblue": "#6495ed", \
                                "cornsilk": "#fff8dc", \
                                "crimson": "#dc143c", \
                                "cyan": "#00ffff", \
                                "darkblue": "#00008b", \
                                "darkcyan": "#008b8b", \
                                "darkgoldenrod": "#b8860b", \
                                "darkgray": "#a9a9a9", \
                                "darkgreen": "#006400", \
                                "darkkhaki": "#bdb76b", \
                                "darkmagenta": "#8b008b", \
                                "darkolivegreen": "#556b2f", \
                                "darkorange": "#ff8c00", \
                                "darkorchid": "#9932cc", \
                                "darkred": "#8b0000", \
                                "darksalmon": "#e9967a", \
                                "darkseagreen": "#8fbc8f", \
                                "darkslateblue": "#483d8b", \
                                "darkslategray": "#2f4f4f", \
                                "darkturquoise": "#00ced1", \
                                "darkviolet": "#9400d3", \
                                "deeppink": "#ff1493", \
                                "deepskyblue": "#00bfff", \
                                "dimgray": "#696969", \
                                "dodgerblue": "#1e90ff", \
                                "firebrick": "#b22222", \
                                "floralwhite": "#fffaf0", \
                                "forestgreen": "#228b22", \
                                "fuchsia": "#ff00ff", \
                                "gainsboro": "#dcdcdc", \
                                "ghostwhite": "#f8f8ff", \
                                "gold": "#ffd700", \
                                "goldenrod": "#daa520", \
                                "gray": "#808080", \
                                "green": "#008000", \
                                "greenyellow": "#adff2f", \
                                "honeydew": "#f0fff0", \
                                "hotpink": "#ff69b4", \
                                "indianred ": "#cd5c5c", \
                                "indigo ": "#4b0082", \
                                "ivory": "#fffff0", \
                                "khaki": "#f0e68c", \
                                "lavender": "#e6e6fa", \
                                "lavenderblush": "#fff0f5", \
                                "lawngreen": "#7cfc00", \
                                "lemonchiffon": "#fffacd", \
                                "lightblue": "#add8e6", \
                                "lightcoral": "#f08080", \
                                "lightcyan": "#e0ffff", \
                                "lightgoldenrodyellow": "#fafad2", \
                                "lightgreen": "#90ee90", \
                                "lightgrey": "#d3d3d3", \
                                "lightpink": "#ffb6c1", \
                                "lightsalmon": "#ffa07a", \
                                "lightseagreen": "#20b2aa", \
                                "lightskyblue": "#87cefa", \
                                "lightslategray": "#778899", \
                                "lightsteelblue": "#b0c4de", \
                                "lightyellow": "#ffffe0", \
                                "lime": "#00ff00", \
                                "limegreen": "#32cd32", \
                                "linen": "#faf0e6", \
                                "magenta": "#ff00ff", \
                                "maroon": "#800000", \
                                "mediumaquamarine": "#66cdaa", \
                                "mediumblue": "#0000cd", \
                                "mediumorchid": "#ba55d3", \
                                "mediumpurple": "#9370d8", \
                                "mediumseagreen": "#3cb371", \
                                "mediumslateblue": "#7b68ee", \
                                "mediumspringgreen": "#00fa9a", \
                                "mediumturquoise": "#48d1cc", \
                                "mediumvioletred": "#c71585", \
                                "midnightblue": "#191970", \
                                "mintcream": "#f5fffa", \
                                "mistyrose": "#ffe4e1", \
                                "moccasin": "#ffe4b5", \
                                "navajowhite": "#ffdead", \
                                "navy": "#000080", \
                                "oldlace": "#fdf5e6", \
                                "olive": "#808000", \
                                "olivedrab": "#6b8e23", \
                                "orange": "#ffa500", \
                                "orangered": "#ff4500", \
                                "orchid": "#da70d6", \
                                "palegoldenrod": "#eee8aa", \
                                "palegreen": "#98fb98", \
                                "paleturquoise": "#afeeee", \
                                "palevioletred": "#d87093", \
                                "papayawhip": "#ffefd5", \
                                "peachpuff": "#ffdab9", \
                                "peru": "#cd853f", \
                                "pink": "#ffc0cb", \
                                "plum": "#dda0dd", \
                                "powderblue": "#b0e0e6", \
                                "purple": "#800080", \
                                "red": "#ff0000", \
                                "rosybrown": "#bc8f8f", \
                                "royalblue": "#4169e1", \
                                "saddlebrown": "#8b4513", \
                                "salmon": "#fa8072", \
                                "sandybrown": "#f4a460", \
                                "seagreen": "#2e8b57", \
                                "seashell": "#fff5ee", \
                                "sienna": "#a0522d", \
                                "silver": "#c0c0c0", \
                                "skyblue": "#87ceeb", \
                                "slateblue": "#6a5acd", \
                                "slategray": "#708090", \
                                "snow": "#fffafa", \
                                "springgreen": "#00ff7f", \
                                "steelblue": "#4682b4", \
                                "tan": "#d2b48c", \
                                "teal": "#008080", \
                                "thistle": "#d8bfd8", \
                                "tomato": "#ff6347", \
                                "turquoise": "#40e0d0", \
                                "violet": "#ee82ee", \
                                "wheat": "#f5deb3", \
                                "white": "#ffffff", \
                                "whitesmoke": "#f5f5f5", \
                                "yellow": "#ffff00", \
                                "yellowgreen": "#9acd32" \
                            }; \
	                        var colorNames = {}; \
	                        for (var name in colors) { \
		                        colorNames[colors[name]] = name; \
	                        }; \
	                        var rgbToHex = function(rgb) { \
		                        if (typeof rgb != "string") \
			                        return undefined; \
			                         \
		                         var toHex = function(n) { \
			                         n = Number(n); \
			                         if (isNaN(n))  \
			 	                        return undefined; \
			                         if (n < 0 || n > 255) \
				                        return undefined; \
			                         return "0123456789ABCDEF".charAt((n-n%16)/16) \
			                              + "0123456789ABCDEF".charAt(n%16); \
		                        }; \
		                        var m = rgb.match(/\s*rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*$/); \
		                        if (m == null || m.length != 4) \
			                        return undefined; \
		                        var hR = toHex(m[1]); \
		                        var hG = toHex(m[2]); \
		                        var hB = toHex(m[3]); \
		                        if (hR == undefined || hG == undefined || hB == undefined) \
			                        return undefined; \
		                         \
		                        return "#" + hR + hG + hB; \
	                        }; \
	                        var hexToRGB = function(hex) { \
		                        if (typeof hex != "string") \
			                        return undefined; \
			                         \
		                        hex = hex.toUpperCase(); \
		                        var m = hex.match(/\s*#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})\s*$/i); \
		                        if (m == null || m.length != 4)  \
			                        m = hex.match(/\s*#([0-9A-F])([0-9A-F])([0-9A-F])\s*$/i); \
		                        if (m == null || m.length != 4)  \
			                        return undefined; \
		                        var r = undefined; \
		                        var g = undefined; \
		                        var b = undefined; \
		                        try { \
			                        r = parseInt(m[1],16); \
			                        g = parseInt(m[2],16); \
			                        b = parseInt(m[3],16); \
		                        } catch(e) {} \
		                        if (r == undefined || g == undefined || b == undefined) \
			                        return undefined; \
		                         \
		                        return "rgb(" + r + "," + g + "," + b + ")";  \
	                        }; \
	                        var hslToRgb = function(hsl) { \
		                        if (typeof hsl != "string") \
			                        return undefined; \
			                         \
                                var hue2rgb = function(p, q, t){ \
                                    if(t < 0) t += 1; \
                                    if(t > 1) t -= 1; \
                                    if(t < 1/6) return p + (q - p) * 6 * t; \
                                    if(t < 1/2) return q; \
                                    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6; \
                                    return p; \
                                }; \
		                         \
		                        var m = hsl.match(/^\s*hsl\(\s*(0|[1-9]\d?|[12]\d\d|3[0-5]\d)\s*,\s*((0|[1-9]\d?|100)%)\s*,\s*((0|[1-9]\d?|100)%)\s*\)\s*$/); \
		                        if (m == null || m.length != 6)  \
			                        return undefined; \
		                        var h = Number(m[1]); \
		                        var s = Number(m[3]); \
		                        var l = Number(m[5]); \
		                        if (isNaN(h) || isNaN(s) || isNaN(l)) \
			                        return undefined; \
		                        h = h/100; \
		                        s = s/100; \
		                        l = l/100; \
		                         \
	                            var r, g, b; \
	                            if(s == 0) { \
	                                r = g = b = l;  \
	                            } else { \
	                                var q = l < 0.5 ? l * (1 + s) : l + s - l * s; \
	                                var p = 2 * l - q; \
	                                r = hue2rgb(p, q, h + 1/3); \
	                                g = hue2rgb(p, q, h); \
	                                b = hue2rgb(p, q, h - 1/3); \
	                            } \
                         \
	                            return "rgb(" + Math.round(r * 255) + ","  + Math.round(g * 255) + "," + Math.round(b * 255) + ")"; \
	                        }; \
	                        var rgbToHsl = function(rgb) { \
		                        if (typeof rgb != "string") \
			                        return undefined; \
		                         \
		                        var m = ("" + rgb).match(/\s*rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*$/); \
		                        if (m == null || m.length != 4) \
			                        return undefined; \
		                        var r = Number(m[1]); \
		                        var g = Number(m[2]); \
		                        var b = Number(m[3]); \
		                        if (isNaN(r) || isNaN(g) || isNaN(g)) \
			                        return undefined; \
		                        r = r/255; \
		                        g = g/255; \
		                        b = b/255; \
	                            var max = Math.max(r, g, b), min = Math.min(r, g, b); \
	                            var h, s, l = (max + min) / 2; \
                         \
	                            if(max == min){ \
	                                h = s = 0;  \
	                            }else{ \
	                                var d = max - min; \
	                                s = l > 0.5 ? d / (2 - max - min) : d / (max + min); \
	                                switch(max){ \
	                                    case r: h = (g - b) / d + (g < b ? 6 : 0); break; \
	                                    case g: h = (b - r) / d + 2; break; \
	                                    case b: h = (r - g) / d + 4; break; \
	                                } \
	                                h /= 6; \
	                            } \
                         \
		                        h = Math.min(100, Math.round(h*100)); \
		                        s = Math.min(100, Math.round(s*100)); \
		                        l = Math.min(100, Math.round(l*100)); \
		                         \
	                            return "hsl(" + h + "," + s + "%," + l + "%)"; \
	                        }; \
                            return { \
                                restrict: "E", \
                                require: "?ngModel", \
                                replace: true, \
                                scope: { \
			                        "model": "=" \
		                        }, \
		                        template: \'<span class="uibColorPicker">\
					                            <style>\
						                            .uibColorPickerContainer {\
							                            display: inline-block;\
							                            position: relative;\
							                            vertical-align: middle; \
						                            }\
						                            .uibColorPickerIcon {\
							                            display: block;\
							                            position: relative;\
							                            width: 17px;\
							                            height: 17px;\
							                            border: 1px inset black;\
							                            cursor: crosshair;\
							                            box-sizing:border-box;\
						                            }\
						                            .uibColorPickerPopup {\
							                            display: none;\
							                            position: absolute;\
							                            z-index: 1;\
						                            }\
						                            .uibColorPickerPopupPanel {\
							                            display: inline-block;\
							                            position: relative;\
							                            padding: 8px;\
							                            background-color: #F8F7F6; \
							                            border: 1px inset black;\
							                            color: #333;\
							                            font-family: Verdana, Arial, sans-serif;\
							                            font-size: 12px;\
							                            font-style: normal;\
							                            box-shadow: rgba(0, 0, 0, 0.4) 2px 2px 6px 0px;\
							                            text-align: center;\
						                            }\
						                            .uibColorPicker:hover .uibColorPickerPopup {\
							                            display: inline-block;\
						                            }\
						                            .uibColorPickerArrow {\
							                            position: absolute;\
							                            width: 0px;\
							                            height: 0px;\
						                            }\
						                            .uibColorPicker[position="top"] .uibColorPickerPopup {\
							                            top: auto;\
							                            bottom: -1px;\
							                            left: -99px;\
							                            padding-top: 0;\
							                            padding-bottom: 25px;\
							                            padding-left: 0;\
						                            }\
						                            .uibColorPicker[position="top"] .uibColorPickerArrow {\
							                            top: auto;\
							                            bottom: -6px;\
							                            left: calc(50% - 3px - 8px - 1px + 7px);\
							                            border-bottom: 0;\
							                            border-top: 5px solid black;\
							                            border-left: 5px solid transparent;\
							                            border-right: 5px solid transparent;\
						                            }\
						                            .uibColorPicker[position="top-right"] .uibColorPickerPopup {\
							                            top: auto;\
							                            bottom: -1px;\
							                            left: 0;\
							                            padding-top: 0;\
							                            padding-bottom: 25px;\
							                            padding-left: 3px;\
						                            }\
						                            .uibColorPicker[position="top-right"] .uibColorPickerArrow {\
							                            top: auto;\
							                            bottom: -6px;\
							                            left: -1px;\
							                            border-bottom: 0;\
							                            border-top: 5px solid black;\
							                            border-left: 5px solid transparent;\
							                            border-right: 5px solid transparent;\
						                            }\
						                            .uibColorPickerPopup, \
						                            .uibColorPicker[position="right"] .uibColorPickerPopup {\
							                            top: -109px;\
							                            left: -1px;\
							                            padding-top: 0;\
							                            padding-left: 25px;\
						                            }\
						                            .uibColorPickerArrow, \
						                            .uibColorPicker[position="right"] .uibColorPickerArrow {\
							                            top: calc(50% - 5px);\
							                            left: -6px;\
							                            border-left: 0;\
							                            border-right: 5px solid black;\
							                            border-top: 5px solid transparent;\
							                            border-bottom: 5px solid transparent;\
						                            }\
						                            .uibColorPickerPopup, \
						                            .uibColorPicker[position="bottom-right"] .uibColorPickerPopup {\
							                            top: -1px;\
							                            left: 0;\
							                            padding-top: 25px;\
							                            padding-left: 3px;\
						                            }\
						                            .uibColorPickerArrow, \
						                            .uibColorPicker[position="bottom-right"] .uibColorPickerArrow {\
							                            top: -11px;\
							                            left: -1px;\
							                            border-bottom: 5px solid black;\
							                            border-left: 5px solid transparent;\
							                            border-right: 5px solid transparent;\
						                            }\
						                            .uibColorPicker[position="bottom"] .uibColorPickerPopup {\
							                            top: -1px;\
							                            left: -99px;\
							                            padding-top: 25px;\
							                            padding-left: 0;\
						                            }\
						                            .uibColorPicker[position="bottom"] .uibColorPickerArrow {\
							                            top: -11px;\
							                            left: calc(50% - 3px - 8px - 1px + 7px);\
							                            border-bottom: 5px solid black;\
							                            border-left: 5px solid transparent;\
							                            border-right: 5px solid transparent;\
						                            }\
						                            .uibColorPicker[position="bottom-left"] .uibColorPickerPopup {\
							                            top: -1px;\
							                            left: auto;\
							                            right: 0;\
							                            padding-top: 25px;\
							                            padding-right: 3px;\
							                            padding-left: 0;\
						                            }\
						                            .uibColorPicker[position="bottom-left"] .uibColorPickerArrow {\
							                            top: -11px;\
							                            left: auto;\
							                            right: -1px;\
							                            border-bottom: 5px solid black;\
							                            border-left: 5px solid transparent;\
							                            border-right: 5px solid transparent;\
						                            }\
						                            .uibColorPicker[position="left"] .uibColorPickerPopup {\
							                            top: -109px;\
							                            left: auto;\
							                            right: -1px;\
							                            padding-top: 0;\
							                            padding-right: 25px;\
							                            padding-left: 0;\
						                            }\
						                            .uibColorPicker[position="left"] .uibColorPickerArrow {\
							                            top: calc(50% - 5px);\
							                            left: auto;\
							                            right: -6px;\
							                            border-right: 0;\
							                            border-left: 5px solid black;\
							                            border-top: 5px solid transparent;\
							                            border-bottom: 5px solid transparent;\
						                            }\
						                            .uibColorPicker[position="top-left"] .uibColorPickerPopup {\
							                            top: auto;\
							                            bottom: -1px;\
							                            left: auto;\
							                            right: 0;\
							                            padding-bottom: 25px;\
							                            padding-right: 3px;\
							                            padding-top: 0;\
							                            padding-left: 0;\
						                            }\
						                            .uibColorPicker[position="top-left"] .uibColorPickerArrow {\
							                            top: auto;\
							                            bottom: -6px;\
							                            left: auto;\
							                            right: -1px;\
							                            border-bottom: 0;\
							                            border-top: 5px solid black;\
							                            border-left: 5px solid transparent;\
							                            border-right: 5px solid transparent;\
						                            }\
						                            .uibColorpickerInput {\
                                                        width: 120px;\
						                            }\
					                            </style>\
					                            <div class="uibColorPickerContainer"><div class="uibColorPickerIcon" ng-style="iconStyle"></div>\
						                            <div class="uibColorPickerPopup">\
							                            <div class="uibColorPickerPopupPanel">\
								                            <div class="uibColorpickerWidget"></div>\
								                            <input class="uibColorpickerInput" ng-model="model" />\
								                            <div class="uibColorPickerArrow"></div>\
							                            </div>\
						                            </div>\
				                               </div></span>\', \
                                link: function(scope, $element, attrs, modelCtrl) { \
			                        scope.iconStyle = { \
				                        "background-color": scope.model \
			                        }; \
			                        var widget = $.farbtastic($element.find(".uibColorpickerWidget")); \
			                        scope.$watch("model", function(newColor, oldColor) { \
				                        if (newColor != undefined && typeof newColor == "string") { \
					                        scope.iconStyle = { \
						                        "background-color": newColor \
					                        }; \
					                        var newColor = newColor.replace(/\s/g, ""); \
					                        var hex = colors[newColor]; \
					                        if (hex != undefined) { \
						                        widget.setColor(hex); \
					                        } else if (/^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/.test(newColor)) { \
						                        widget.setColor(newColor); \
					                        } else if (/transparent/i.test(newColor)) { \
						                        scope.iconStyle = { \
							                        "background-color": "transparent" \
						                        }; \
					                        } else if (/^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/.test(newColor)) { \
						                        var hex = rgbToHex(newColor); \
						                        if (hex != undefined) { \
							                        widget.setColor(hex); \
						                        } \
					                        } else if (/^hsl\((0|[1-9]\d?|[12]\d\d|3[0-5]\d),((0|[1-9]\d?|100)%),((0|[1-9]\d?|100)%)\)$/.test(newColor)) { \
						                        var rgb = hslToRgb(newColor); \
						                        if (rgb != undefined) { \
							                        var hex = rgbToHex(rgb); \
							                        if (hex != undefined) { \
								                        widget.setColor(hex); \
							                        } \
						                        } \
					                        } \
				                        } \
			                        }); \
			                        widget.linkTo(function(hex){ \
				                        var color = hex; \
				                        if (("" + scope.model).indexOf("#") != -1) { \
					                        color = hex; \
				                        } else if (("" + scope.model).indexOf("rgb") != -1) { \
					                        color = hexToRGB(hex); \
					                        if (color == undefined) \
						                        color = hex; \
				                        } else if (("" + scope.model).indexOf("hsl") != -1) { \
					                        var rgb = hexToRGB(hex); \
					                        if (rgb != undefined) { \
						                        var hsl = rgbToHsl(rgb); \
						                        if (hsl != undefined) { \
							                        color = hsl; \
						                        } \
					                        } \
				                        } else { \
					                        color = colorNames[hex]; \
					                        if (color == undefined) \
						                        color = hex; \
				                        }	 \
				                        scope.model = color; \
				                        scope.iconStyle = { \
					                        "background-color": color \
				                        }; \
	                                    if ($rootScope.$root.$$phase != "$apply" && $rootScope.$root.$$phase != "$digest") \
					                        scope.$apply(); \
			                        }); \
                                } \
                            }; \
                        });'
    };

    saveBtn.on('click', function (e) {
        closeMe('ok');
    });

    objectProperties.on('mouseenter mouseleave', '.help', function (e) {
        if (e.type == 'mouseenter')
            $(e.target.parentNode.parentNode).attr("help", "on");
        else
            $(e.target.parentNode.parentNode).removeAttr("help");
    });

    var initialWinHeight = wnd.height();
    var refreshSizes = function () {
        var contentHeight = bodyBlock.height();
        var height = propertiesWindowPnl.height();
        var winHeight = wnd.height();
        if ((initialWinHeight + contentHeight + 40) > height)
            body.height(Math.max(0, height - 40 - initialWinHeight));
        else
            body.height(contentHeight);
    };
    $(window).on("resize.uibpropwnd", function () {
        refreshSizes();
    });

    var refreshObjectProperties = function () {
        objectProperties.empty();
        if (propertiesBeeingEdited) {
            bodyBlock.css({ "display": "block" });
            eltIcon.addClass(propertiesBeeingEdited.icon.icon);
            eltTitle[0].textContent = propertiesBeeingEdited.label;
            var homepage = propertiesBeeingEdited.homepage.trim();
            if (homepage) {
                eltHomePnl.css({ "display": "inline-block" });
                eltUrl.attr('href', homepage);
            } else
                eltHomePnl.css({ "display": "none" });



            for (var p in propertiesBeeingEdited.properties) {
                var attr = propertiesBeeingEdited.properties[p];
                if (attr.visible === false)
                    continue;
                var tr = $('<tr propertyType="' + attr.dataType + '" />');
                objectProperties.append(tr);
                var titleTd = $('<td><div>' + (attr.icon ? '<i class="elementPropIcon ' + attr.icon + '"></i>' : '') + '<span class="elementPropLabel">' + (attr.description || attr.name) + ':</span></div></td>').appendTo(tr);
                var td = $('<td></td>').appendTo(tr);
                if (['string', "number", "boolean", "function", "array", "object"].indexOf(attr.dataType) >= 0) {
                    var isExpressionableType = ['string', "number", "boolean"].indexOf(attr.dataType) >= 0;
                    var isExpression = isExpressionableType && !attr.binding;
                    if (isExpression) {
                        var customField = null;
                        var currentSource = 1;
                        if (!attr.current || attr.current.indexOf('{') < 0) {
                            currentSource = 0;
                        } else {
                            if (attr.current.length > 4) {
                                var expressionContent = attr.current.substr(2, attr.current.length - 4);
                                if (attr.scopeValues)
                                    if (attr.scopeValues.some(function (scopeVal) { return scopeVal.field == expressionContent }))
                                        currentSource = 2;
                            }
                        }

                        if (attr.dataType == "boolean") {
                            var customField = $('<div></div>')
                            var checked = attr.current == "true";
                            var checkbox = $('<input type="checkbox" ' + (currentSource == 0 && checked ? 'checked' : '') + '/>').appendTo(customField)[0];
                            var setCheckedStatus = (function (customField, checkbox) {
                                return function (checked) {
                                    checkbox.checked = checked;
                                    if (checked)
                                        checkbox.setAttribute("checked", "checked");
                                    else
                                        checkbox.removeAttribute("checked")
                                    customField.setAttribute("checked", checked ? "checked" : "unchecked");
                                    $(checkbox).change();
                                }
                            })(customField[0], checkbox);
                            setCheckedStatus(checked);
                            var chkYes = $('<span class="checked">yes</span>').appendTo(customField);
                            var chkNo = $('<span class="unchecked">no</span>').appendTo(customField);
                            chkYes.click("click", setCheckedStatus, function (e) {
                                e.data(true);
                            });
                            chkNo.on("click", setCheckedStatus, function (e) {
                                e.data(false);
                            });
                        } else if (attr.dataType == "string") {
                            var currentValue = (attr.current || '');
                            if (attr.bigdata)
                                customField = $('<textarea style="width:300px; height: 100px;" placeholder="' + attr.placeholder + '">' + (currentSource == 0 && currentValue ? currentValue : '') + '</textarea>');
                            else
                                customField = $('<div><input type="text" style="width:300px;" placeholder="' + (attr.placeholder || '') + '" value="' + (currentSource == 0 ? currentValue : '') + '"/></div>');
                        } else if (attr.dataType == 'number') {
                            var min = null;
                            var max = null;
                            if (attr.min != attr.max) {
                                min = attr.min;
                                max = attr.max;
                            }
                            customField = $('<input type="number" placeholder="' + (attr.placeholder || '') + '"  value="' + (currentSource == 0 ? attr.current : '') + '" ' + (min != null ? 'min="' + min + '" ' : '') + (max != null > 2 ? ' max="' + max + '" ' : '') + '/>')
                        }
                        customField.appendTo(td);
                        var expressionField = $('<div><input type="text" style="width:300px;" placeholder="{{ (1 + 3 )+ \'$\'}}" value="' + (currentSource == 1 ? attr.current : '') + '"/></div>').appendTo(td);

                        var options = '"<option value=""></option>"';
                        var selectedField = attr.current;
                        if (attr.scopeValues) {
                            for (var i = 0; i < attr.scopeValues.length; i++) {
                                var option = attr.scopeValues[i];
                                var optionValue = '{{' + option.field + "}}";
                                var isSelected = optionValue == selectedField && currentSource == 2;
                                options += '<option value="' + optionValue + '" ' + (isSelected ? 'selected' : '') + '>' + option.field + '</option>\n';
                            }
                        }
                        var modelProperty = $('<select fieldselect  style="width:317px;">' + options + '</select>').appendTo(td);
                        var source = $('<select class="dontwatchange" style="margin-left:20px;" fieldselect>\
                                            <option value="0">'+ attr.dataType[0].toUpperCase() + attr.dataType.substr(1) + '</option>\
                                            <option value="1">Expression</option>\
                                            <option value="2">Data model property</option>\
                                        </select>').appendTo(td);
                        source.children()[currentSource].setAttribute('selected', '');
                        source.on('change', [customField, expressionField, modelProperty], function (e) {
                            e.data.forEach(function (field) { field.hide(); });
                            var currentInput = e.data[this.selectedIndex];
                            currentInput.show();
                            if (!currentInput.is('input, select, textarea'))
                                currentInput = currentInput.find('input, select, textarea');
                            currentInput.change();
                        })
                        source.change();
                    } else {
                        var options = '"<option value="someValue"></option>"';
                        var selectedField = attr.current || '';
                        if (attr.scopeValues) {
                            for (var i = 0; i < attr.scopeValues.length; i++) {
                                var option = attr.scopeValues[i];
                                var isSelected = option.field == selectedField;
                                options += '<option value="' + option.field + '" ' + (isSelected ? 'selected' : '') + '>' + option.field + '</option>\n';
                            }
                        }
                        var $select = $('<select fieldselect>' + options + '</select>').appendTo(td);
                    }
                } else if (attr.dataType == "sgData") {
                    var currentSgData = {
                        "datasource": "url", // url, scope, static
                        "url": "",
                        "scope": "",
                        "canned": null
                    };
                    try { currentSgData = JSON.parse(attr.current); } catch (e) { }

                    (function (propName, attr, currentSgData) {
                        var sgDataSummary = $('<span style="font-style: italic;margin-left: 10px;font-size: 10px;"></span>').appendTo(td);
                        var setSgDataSummary = function () {
                            sgDataSummary.text('');
                            if (currentSgData && currentSgData.datasource) {
                                if (currentSgData.datasource == "url" && currentSgData.url) {
                                    sgDataSummary.text('(url: ' + currentSgData.url + ")");
                                } else if (currentSgData.datasource == "scope" && currentSgData.scope) {
                                    sgDataSummary.text('(scope: ' + currentSgData.scope + ")");
                                } else if (currentSgData.datasource == "static" && currentSgData.canned) {
                                    sgDataSummary.text('(static)');
                                }
                            }
                        }
                        setSgDataSummary();
                        td.prepend($('<i class="fa fa-external-link" style="margin: 6px 0 0px 4px;" />').click(function () {
                            openPopup(
                                chrome.extension.getURL('contentScript/propertiesWindow/popups/sgwData.html'),
                                [
                                    chrome.extension.getURL('contentScript/propertiesWindow/popups/sgwDataCtrl.js'),
                                    chrome.extension.getURL('resources/ui-bootstrap-0.9.0.min.js'),
                                    chrome.extension.getURL('resources/ui-bootstrap-tpls-0.9.0.min.js'),
                                    chrome.extension.getURL('resources/google-code-prettify/prettify.js'),
                                    chrome.extension.getURL('resources/beautify/beautify.js'),
                                    chrome.extension.getURL('contentScript/propertiesWindow/popups/directives/abn-tree/abn_tree_directive.js'),
                                    chrome.extension.getURL('contentScript/propertiesWindow/popups/directives/jsonMapper/jsonMapper.js')
                                ],
                                { sgDataScopeData: attr.sgDataScopeData, currentSgData: currentSgData, template: attr.template },
                                function (response) {
                                    if (response.reason == "save") {
                                        currentSgData = response.data.currentSgData;
                                        setSgDataSummary();
                                        sendPropChange(propName, attr.path, JSON.stringify(currentSgData));
                                        //refreshObjectProperties();
                                    }
                                })
                        }))
                    })(p, attr, currentSgData);
                } else if (attr.dataType == "custom") {
                    var customProp = $(attr.customPropertyHtml).appendTo(td);
                    (function (attr, customProp) {
                        var propertyModule = "prop" + attr.description;
                        angular.element(customProp).ready(function () {
                            var customModules = [];

                            var customPropertyModules = $.extend(true, {}, customPropertyDefaultModules, attr.customPropertyModules)
                            if (customPropertyModules) {
                                for (var customModule in customPropertyModules) {
                                    customModules.push(customModule);
                                    eval(customPropertyModules[customModule])
                                }
                            }
                            var bootstraped = false;
                            var saveProperty = function () {
                                saveCustomProperty(attr.description, attr.path, cleanDollarProperties(attr.customPropertyData), attr.controller);
                            }
                            angular.module('propertyModule', customModules).run(function ($rootScope) {
                                $rootScope.data = attr.customPropertyData;
                                $rootScope.save = saveProperty;
                                $rootScope.$watch(function () { return JSON.stringify($rootScope.data) }, function (newValue, oldValue) {
                                    if (bootstraped)
                                        saveProperty();
                                })
                            });
                            angular.bootstrap(customProp, ['propertyModule']);
                            bootstraped = true;
                        });
                    })(attr, customProp);
                } else if (attr.dataType == "gridmetadata") {
                    var currentlyUsedMetadata = null;
                    try { currentlyUsedMetadata = JSON.parse(attr.current); } catch (e) { }
                    if (currentlyUsedMetadata) {
                        var metadata_table = $('<table class="gridmetadataTable" attr="' + p + '"></table>').appendTo(td);
                        var metadata_thead = $('<thead></thead>').appendTo(metadata_table);
                        var metadata_tbody = $('<tbody></tbody>').appendTo(metadata_table);

                        for (var i = 0; i < currentlyUsedMetadata.columns.length; i++) {
                            var column = currentlyUsedMetadata.columns[i];
                            if (i == 0) {
                                var metadata_tr = $('<tr></tr>').appendTo(metadata_thead);
                                for (var f in column)
                                    metadata_tr.append('<th>' + f + '</th>');
                            }
                            var metadata_tr = $('<tr columnrow></tr>').appendTo(metadata_tbody);
                            for (var f in column) {
                                if (f == undefined)
                                    continue;
                                var metadata_td = $('<td field="' + f + '"></td>').appendTo(metadata_tr);
                                var fValue = column[f];
                                if (f == 'datatype') {
                                    var dataTypes = ['string', 'number', 'decimal', 'percentage', 'currency', 'boolean', 'date'];
                                    var options = "";
                                    for (var k = 0; k < dataTypes.length; k++) {
                                        var option = dataTypes[k];
                                        options += '<option value="' + option + '" ' + (option == fValue ? 'selected' : '') + '>' + option + '</option>\n';
                                    }
                                    metadata_td.append('<select>' + options + '</select>');
                                } else if (f == 'field') {
                                    metadata_td.append('<input type="text" disabled value="' + fValue + '"/>');
                                } else if (fValue.constructor == Boolean) {
                                    metadata_td.append('<input type="checkbox" ' + (fValue == true ? 'checked' : '') + '/>');
                                } else if (fValue.constructor == Number) {
                                    metadata_td.append('<input type="number" value="' + fValue + '"/>');
                                } else {
                                    metadata_td.append('<input type="text" value="' + fValue + '"/>');
                                }
                            }
                            var metadata_td = $('<td><div class="handle"></div></td>').appendTo(metadata_tr);
                        }

                        $(metadata_tbody).sortable({
                            helper: "clone",
                            handle: ".handle",
                            opacity: 0.5,
                            axis: "y",
                            //containment: "parent",
                            cursor: "move",
                            distance: 2,
                            update: function (event, ui) {
                                var attr = ui.item.parent().parent().attr('attr')
                                chnageGridmetadata(attr);
                            }
                        });
                    }
                } else if (attr.dataType == "image") {
                    var img = $('<img style="max-height: 200px;"/><input type="file" accept="image/*" style="width:300px;"/>').appendTo(td);
                    img[0].src = attr.current;
                } else if (attr.dataType == "dataurl") {
                    var currentValue = (attr.current || '');
                    var url = '', name = '';
                    if (currentValue.indexOf('@') > -1) {
                        var parts = currentValue.split('@');
                        name = parts[0];
                        url = parts[1];
                    } else
                        url = currentValue;
                    var div = $('<div></div>').appendTo(td);
                    div.append('<input type="text" dataurl-url style="width:300px;display:inline-block;" placeholder="' + (attr.placeholder || '') + '" value="' + url + '"/>');
                    div.append('<span class="multipleFieldsSep"><span></span><span></span></span><span class="secondFieldLabel">Name*:</span>');
                    div.append('<input type="text" dataurl-name class="secondField" style="width:200px;" placeholder="Name for rest API" value="' + name + '"/>');
                } else if (attr.dataType == "lookup") {
                    var options = "";
                    var selected = attr.current;
                    for (var i = 0; i < attr.possibleValues.length; i++) {
                        var option = attr.possibleValues[i];
                        if (!$.isPlainObject(option))
                            option = { value: option, label: option };

                        options += '<option value="' + option.value + '" ' + (option.value == selected ? 'selected' : '') + '>' + option.label + '</option>\n';
                    }
                    td.append('<select>' + options + '</select>');
                }

                if (attr.dataType != "custom") {
                    td.find('input:not(.dontwatchange)').change({ name: p, attr: attr }, function (e) {
                        changeProperty(e)
                    });
                    td.find('textarea').change({ name: p, attr: attr }, function (e) {
                        changeProperty(e)
                    });
                    tr.find('select:not(.dontwatchange)').change(
                        (function (data) {
                            return function (e) {
                                e.data = data;
                                changeProperty(e)
                            }
                        })({ name: p, attr: attr, test: 1 })
                    );
                }
                if (td[0].firstChild && td[0].firstChild.tagName == "SELECT") {
                    var select = $(td[0].firstChild).detach();
                    var div = $('<div></div>').appendTo(td);
                    div.append('<div class="fieldselectArrow">&#xf0d7;</div>');
                    div.append(select);
                }
                var helpTd = $('<td style="text-align: right;"></td>').appendTo(tr);
                var help = attr.help.trim();
                if (help)
                    $('<i class="help fa fa-question-circle"></i>').appendTo(helpTd).attr('title', help);
            }
        } else {
            bodyBlock.css({ "display": "none" });
        }
        refreshSizes();
    };
    refreshObjectProperties();

    wnd.one('transitionEnd', function (e) {
        wnd.removeClass("propertiesWindowAnim");
    });
    var height = propertiesWindowPnl.height();
    var winHeight = wnd.height();
    var top = Math.round((height - winHeight) / 2);
    wnd.css({ "top": height + "px" });
    wnd.addClass("propertiesWindowAnim");
    window.setTimeout(function () {
        wnd.css({ "top": top + "px" });
    }, 100);
   
    win.refreshProperties = function (currentProperties) {
        currentProperties.changed = propertiesBeeingEdited.changed;
        propertiesBeeingEdited = currentProperties;
        refreshObjectProperties();
    }
    var getInputValue = function (input) {
        if (input.is('input[type="checkbox"]'))
            return input[0].checked;
        return input.val();
    }

    var saveCustomProperty = function (name, path, value, controller) {
        sendPropChange(name, path, value, controller);
    }

    var chnageGridmetadata = function (propName) {
        try {
            var metaDataTable = $(selectedElementPropertiesBlock).find('[attr="' + propName + '"]');
            var property = propertiesBeeingEdited.properties[propName];
            var currentlyUsedMetadata = null;
            try { currentlyUsedMetadata = JSON.parse(property.current); } catch (e) { }
            if (!currentlyUsedMetadata) {
                return;
            }
            currentlyUsedMetadata.columns = [];
            var columns = metaDataTable.find('tr[columnrow]');
            for (var i = 0; i < columns.length; i++) {
                var columnMetaData = {};
                var tds = columns[i].children;
                for (var j = 0; j < tds.length; j++) {
                    var td = $(tds[j]);
                    var fieldName = td.attr('field');
                    if (fieldName == undefined)
                        continue;
                    columnMetaData[fieldName] = getInputValue(td.children().first());
                }
                currentlyUsedMetadata.columns.push(columnMetaData);
            }
            var value = JSON.stringify(currentlyUsedMetadata);
            sendPropChange(propName, property.path, value);
        } catch (e) {
            alert('chnageGridmetadata error: ' + e);
        }
    }

    var changeProperty = function (e) {
        if (e.data.attr.dataType == "gridmetadata") {
            chnageGridmetadata(e.data.name);
        } else if (e.data.attr.dataType == "dataurl") {
            var $this = $(e.target);
            var url = $this.parent().children('input[dataurl-url]');
            var name = $this.parent().children('input[dataurl-name]');
            var value = getInputValue(name) + "@" + getInputValue(url)
            sendPropChange(e.data.name, e.data.attr.path, value);
        } else {
            var $this = $(e.target);
            if ($this.is('input[type="file"]')) {
                if (e.target.files.length === 0)
                    return;
                var file = e.target.files[0];
                var reader = new FileReader();
                reader.onload = function (ef) {
                    sendPropChange(e.data.name, e.data.attr.path, ef.target.result);
                    e.target.parentNode.firstChild.src = ef.target.result;
                };
                reader.readAsDataURL(file);
                return;
            }

            var value = getInputValue($this);
            sendPropChange(e.data.name, e.data.attr.path, value);
        }
    };

    sendPropChange = function (name, path, value, controller) {
        propertiesBeeingEdited.changed = true;
        window.windowHelper.changeProperty(propertiesBeeingEdited.controlId, propertiesBeeingEdited.properties[name], value);
    };

    return win;
}
