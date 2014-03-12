angular.module('uib.colorPicker', []).directive('uibColorPicker', function ($rootScope, $timeout) {
    var colors = {
        "aliceblue": "#f0f8ff",
        "antiquewhite": "#faebd7",
        "aqua": "#00ffff",
        "aquamarine": "#7fffd4",
        "azure": "#f0ffff",
        "beige": "#f5f5dc",
        "bisque": "#ffe4c4",
        "black": "#000000",
        "blanchedalmond": "#ffebcd",
        "blue": "#0000ff",
        "blueviolet": "#8a2be2",
        "brown": "#a52a2a",
        "burlywood": "#deb887",
        "cadetblue": "#5f9ea0",
        "chartreuse": "#7fff00",
        "chocolate": "#d2691e",
        "coral": "#ff7f50",
        "cornflowerblue": "#6495ed",
        "cornsilk": "#fff8dc",
        "crimson": "#dc143c",
        "cyan": "#00ffff",
        "darkblue": "#00008b",
        "darkcyan": "#008b8b",
        "darkgoldenrod": "#b8860b",
        "darkgray": "#a9a9a9",
        "darkgreen": "#006400",
        "darkkhaki": "#bdb76b",
        "darkmagenta": "#8b008b",
        "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00",
        "darkorchid": "#9932cc",
        "darkred": "#8b0000",
        "darksalmon": "#e9967a",
        "darkseagreen": "#8fbc8f",
        "darkslateblue": "#483d8b",
        "darkslategray": "#2f4f4f",
        "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3",
        "deeppink": "#ff1493",
        "deepskyblue": "#00bfff",
        "dimgray": "#696969",
        "dodgerblue": "#1e90ff",
        "firebrick": "#b22222",
        "floralwhite": "#fffaf0",
        "forestgreen": "#228b22",
        "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc",
        "ghostwhite": "#f8f8ff",
        "gold": "#ffd700",
        "goldenrod": "#daa520",
        "gray": "#808080",
        "green": "#008000",
        "greenyellow": "#adff2f",
        "honeydew": "#f0fff0",
        "hotpink": "#ff69b4",
        "indianred ": "#cd5c5c",
        "indigo ": "#4b0082",
        "ivory": "#fffff0",
        "khaki": "#f0e68c",
        "lavender": "#e6e6fa",
        "lavenderblush": "#fff0f5",
        "lawngreen": "#7cfc00",
        "lemonchiffon": "#fffacd",
        "lightblue": "#add8e6",
        "lightcoral": "#f08080",
        "lightcyan": "#e0ffff",
        "lightgoldenrodyellow": "#fafad2",
        "lightgreen": "#90ee90",
        "lightgrey": "#d3d3d3",
        "lightpink": "#ffb6c1",
        "lightsalmon": "#ffa07a",
        "lightseagreen": "#20b2aa",
        "lightskyblue": "#87cefa",
        "lightslategray": "#778899",
        "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0",
        "lime": "#00ff00",
        "limegreen": "#32cd32",
        "linen": "#faf0e6",
        "magenta": "#ff00ff",
        "maroon": "#800000",
        "mediumaquamarine": "#66cdaa",
        "mediumblue": "#0000cd",
        "mediumorchid": "#ba55d3",
        "mediumpurple": "#9370d8",
        "mediumseagreen": "#3cb371",
        "mediumslateblue": "#7b68ee",
        "mediumspringgreen": "#00fa9a",
        "mediumturquoise": "#48d1cc",
        "mediumvioletred": "#c71585",
        "midnightblue": "#191970",
        "mintcream": "#f5fffa",
        "mistyrose": "#ffe4e1",
        "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead",
        "navy": "#000080",
        "oldlace": "#fdf5e6",
        "olive": "#808000",
        "olivedrab": "#6b8e23",
        "orange": "#ffa500",
        "orangered": "#ff4500",
        "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa",
        "palegreen": "#98fb98",
        "paleturquoise": "#afeeee",
        "palevioletred": "#d87093",
        "papayawhip": "#ffefd5",
        "peachpuff": "#ffdab9",
        "peru": "#cd853f",
        "pink": "#ffc0cb",
        "plum": "#dda0dd",
        "powderblue": "#b0e0e6",
        "purple": "#800080",
        "red": "#ff0000",
        "rosybrown": "#bc8f8f",
        "royalblue": "#4169e1",
        "saddlebrown": "#8b4513",
        "salmon": "#fa8072",
        "sandybrown": "#f4a460",
        "seagreen": "#2e8b57",
        "seashell": "#fff5ee",
        "sienna": "#a0522d",
        "silver": "#c0c0c0",
        "skyblue": "#87ceeb",
        "slateblue": "#6a5acd",
        "slategray": "#708090",
        "snow": "#fffafa",
        "springgreen": "#00ff7f",
        "steelblue": "#4682b4",
        "tan": "#d2b48c",
        "teal": "#008080",
        "thistle": "#d8bfd8",
        "tomato": "#ff6347",
        "turquoise": "#40e0d0",
        "violet": "#ee82ee",
        "wheat": "#f5deb3",
        "white": "#ffffff",
        "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00",
        "yellowgreen": "#9acd32"
    };
    var colorNames = {};
    for (var name in colors) {
        colorNames[colors[name]] = name;
    };
    var rgbToHex = function (rgb) {
        if (typeof rgb != "string")
            return undefined;

        var toHex = function (n) {
            n = Number(n);
            if (isNaN(n))
                return undefined;
            if (n < 0 || n > 255)
                return undefined;
            return "0123456789ABCDEF".charAt((n - n % 16) / 16)
                 + "0123456789ABCDEF".charAt(n % 16);
        };
        var m = rgb.match(/\s*rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*$/);
        if (m == null || m.length != 4)
            return undefined;
        var hR = toHex(m[1]);
        var hG = toHex(m[2]);
        var hB = toHex(m[3]);
        if (hR == undefined || hG == undefined || hB == undefined)
            return undefined;

        return "#" + hR + hG + hB;
    };
    var hexToRGB = function (hex) {
        if (typeof hex != "string")
            return undefined;

        hex = hex.toUpperCase();
        var m = hex.match(/\s*#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})\s*$/i);
        if (m == null || m.length != 4)
            m = hex.match(/\s*#([0-9A-F])([0-9A-F])([0-9A-F])\s*$/i);
        if (m == null || m.length != 4)
            return undefined;
        var r = undefined;
        var g = undefined;
        var b = undefined;
        try {
            r = parseInt(m[1], 16);
            g = parseInt(m[2], 16);
            b = parseInt(m[3], 16);
        } catch (e) { }
        if (r == undefined || g == undefined || b == undefined)
            return undefined;

        return "rgb(" + r + "," + g + "," + b + ")";
    };
    var hslToRgb = function (hsl) {
        if (typeof hsl != "string")
            return undefined;

        var hue2rgb = function (p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var m = hsl.match(/^\s*hsl\(\s*(0|[1-9]\d?|[12]\d\d|3[0-5]\d)\s*,\s*((0|[1-9]\d?|100)%)\s*,\s*((0|[1-9]\d?|100)%)\s*\)\s*$/);
        if (m == null || m.length != 6)
            return undefined;
        var h = Number(m[1]);
        var s = Number(m[3]);
        var l = Number(m[5]);
        if (isNaN(h) || isNaN(s) || isNaN(l))
            return undefined;
        h = h / 100;
        s = s / 100;
        l = l / 100;

        var r, g, b;
        if (s == 0) {
            r = g = b = l;
        } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return "rgb(" + Math.round(r * 255) + "," + Math.round(g * 255) + "," + Math.round(b * 255) + ")";
    };
    var rgbToHsl = function (rgb) {
        if (typeof rgb != "string")
            return undefined;

        var m = ("" + rgb).match(/\s*rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*$/);
        if (m == null || m.length != 4)
            return undefined;
        var r = Number(m[1]);
        var g = Number(m[2]);
        var b = Number(m[3]);
        if (isNaN(r) || isNaN(g) || isNaN(g))
            return undefined;
        r = r / 255;
        g = g / 255;
        b = b / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        h = Math.min(100, Math.round(h * 100));
        s = Math.min(100, Math.round(s * 100));
        l = Math.min(100, Math.round(l * 100));

        return "hsl(" + h + "," + s + "%," + l + "%)";
    };
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        scope: {
            'model': '='
        },
        template: '<span class="uibColorPicker">\
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
				   </div></span>',
        link: function (scope, $element, attrs, modelCtrl) {
            scope.iconStyle = {
                "background-color": scope.model
            };
            var widget = $.farbtastic($element.find(".uibColorpickerWidget"));
            scope.$watch("model", function (newColor, oldColor) {
                if (newColor != undefined && typeof newColor == "string") {
                    scope.iconStyle = {
                        "background-color": newColor
                    };
                    var newColor = newColor.replace(/\s/g, "");
                    var hex = colors[newColor];
                    if (hex != undefined) {
                        widget.setColor(hex);
                    } else if (/^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$/.test(newColor)) {
                        widget.setColor(newColor);
                    } else if (/transparent/i.test(newColor)) {
                        scope.iconStyle = {
                            "background-color": "transparent"
                        };
                    } else if (/^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/.test(newColor)) {
                        var hex = rgbToHex(newColor);
                        if (hex != undefined) {
                            widget.setColor(hex);
                        }
                    } else if (/^hsl\((0|[1-9]\d?|[12]\d\d|3[0-5]\d),((0|[1-9]\d?|100)%),((0|[1-9]\d?|100)%)\)$/.test(newColor)) {
                        var rgb = hslToRgb(newColor);
                        if (rgb != undefined) {
                            var hex = rgbToHex(rgb);
                            if (hex != undefined) {
                                widget.setColor(hex);
                            }
                        }
                    }
                }
            });
            widget.linkTo(function (hex) {
                var color = hex;
                if (("" + scope.model).indexOf("#") != -1) {
                    color = hex;
                } else if (("" + scope.model).indexOf("rgb") != -1) {
                    color = hexToRGB(hex);
                    if (color == undefined)
                        color = hex;
                } else if (("" + scope.model).indexOf("hsl") != -1) {
                    var rgb = hexToRGB(hex);
                    if (rgb != undefined) {
                        var hsl = rgbToHsl(rgb);
                        if (hsl != undefined) {
                            color = hsl;
                        }
                    }
                } else {
                    color = colorNames[hex];
                    if (color == undefined)
                        color = hex;
                }
                scope.model = color;
                scope.iconStyle = {
                    "background-color": color
                };
                if ($rootScope.$root.$$phase != '$apply' && $rootScope.$root.$$phase != '$digest')
                    scope.$apply();
            });
        }
    };
});