var sungardModules = sungard.initParams().modules;
angular.module(sungardModules[sungardModules.length - 1]).directive('uibAttr', [

function ($timeout, $compile, $parse, uibService) {
    var nonInitialAttrs = ['uib-on-undoredo-state', 'id', 'uib-col'];
    return {
        restrict: 'A',
        require: 'uibAttr',
        controller: function ($scope) {
            var $attrs = null;
            var $element = null;

            this.setAttribute = function (attribute, value) {
                if (nonInitialAttrs.indexOf(attribute) == -1)
                    $element.attr('uib-initial-' + attribute, (value + "").replace(/{/g, '\\{').replace(/}/g, '\\}'));
                return $attrs.$originalSet($attrs.$normalize(attribute), value + "");
            }

            this.setAttrs = function (attr, element) {
                $attrs = attr;
                $attrs.$originalSet = $attrs.$set;
                $attrs.$set = this.setAttribute;
                $element = element;
            }
        },
        compile: function (scope, element, attr) {
            return function (scope, element, attr, uibAttr) {
                uibAttr.setAttrs(attr, element);
            }
        }
    }
}])

angular.module(sungardModules[sungardModules.length - 1]).service('uibService', ['$rootScope', '$compile', '$route',
        function ($rootScope, $compile, $route) {

            var uibService = {
                initialize: function () { },
                sendReadyStatus: function () {
                    uib_inject.sendMessageToContentScript({ action: 'appUiBuilderReady' });
                },
                compile: function (selector) {
                    var element = angular.element(selector);
                    $compile(element)(element.parent().scope());
                    element.parent().scope().$apply();
                },
                triggerCurrentViewFilename: function () {
                    if (!$route.current || !$route.current.templateUrl)
                        return;
                    var viewFileName = $route.current.templateUrl.split('?')[0];
                    uib_inject.sendMessageToContentScript({ action: 'setCurrentViewFilename', content: viewFileName });
                },
                setDirty: function (elementId) {
                    uib_inject.sendMessageToContentScript({ action: 'setDirty', content: elementId });
                },
                elementPropertiesUpdated: function () {
                    uib_inject.sendMessageToContentScript({ action: 'elementPropertiesUpdated', content: undefined });
                },
                recompileElementId: function (controlId) {
                    uib_inject.sendMessageToContentScript({ action: 'elementRecompileRequested', content: { controlId: controlId } });
                }
            };

            $rootScope.$on('$routeChangeSuccess', function (event, current) {
                uibService.triggerCurrentViewFilename();
            });

            $rootScope.$on('$locationChangeStart', function (event, current) {
                var pageActionState = document.body.getAttribute('uib-pageactionstate');
                if (pageActionState == "saving" || pageActionState == "dirty") {
                    window.alert('The page has been changed. Would you like to change page and loose the changes?');
                    event.preventDefault();
                } else {
                    $('.uib-highlight-undo').removeClass('uib-highlight-undo');
                }
            });

            return uibService;
        }
]).run(['uibService', function (uibService) {
    uibService.initialize();

    uib_inject.initialize(uibService);
}]);

console.log("app run")

if (sungard.htmlWouldHaveStarted)
    sungard.start();
else
    sungard.uibuilderWouldHaveStarted = true;

