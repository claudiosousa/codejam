angular.module('popupModule', ['ui.bootstrap', 'angularBootstrapNavTree', 'jsonMapperTools']).controller('sgwDataCtrl', ['$scope', '$timeout', '$sce',
    function ($scope, $timeout, $sce) {
       
		/*
		$scope.data = {
			currentSgData: {
				"datasource": "url", // url, scope, static
				"url": "/rest/accounts",
				"scope": "part1.part2[3].part4",
				"canned": {},
				"template": null
			},
			sgDataScopeData: {};
		}
		*/
		
        $scope.currentStep = '1';
		$scope.datasource = {};
		$scope.datasource.ready = false;
		$scope.datasource.availableData = {};
		$scope.output = {
			"isJsCollapsed": false,
			"isJsonCollapsed": false,
			"transformFn": $scope.data.currentSgData.transformFn,
			"mapping": $scope.data.currentSgData.mapping
		};
		$scope.datasource.scope = "";
		if ($scope.data.currentSgData.scope != null && $scope.data.currentSgData.scope != undefined)
			$scope.datasource.scope = $scope.data.currentSgData.scope.replace(/\$parent\./g, "");
		$scope.hasTemplate = ($scope.data.template != null && $scope.data.template != undefined && $scope.data.template != "");
		$scope.datasource.templateData = null;
		if ($scope.hasTemplate) {
			try {
				$scope.datasource.templateData = JSON.parse($scope.data.template);
			} catch(e) {
				$scope.datasource.templateData = null;
			}
		}
  	  $scope.$watch('output.transformFn', function(newValue) {
         $scope.data.currentSgData.transformFn = newValue;
		 $scope.data.currentSgData.mapping = $scope.output.mapping;
  	  });
	    var buildTreeNav = function(parent, jsonObj) {
			if (!parent)
				parent = [];
	        if ($.isArray(jsonObj)) {
	            for (var i=0; i<jsonObj.length; i++) {
					var p = "[" + i + "]";
					var value = jsonObj[i];
					var leaf = {
						"label": p,
						"match": function(key) {
							return (this["data"]["path"] == key);
						},
						"getKey": function() {
							return this["data"]["path"];
						},
						"data": {
							"path": ((parent["data"])?(parent["data"]["path"] + p):p),
							"value": value
						},
						"children": []
					};
					if (parent["children"])
						parent["children"].push(leaf);
					else
						parent.push(leaf);
	                if ($.isPlainObject(value) || $.isArray(value)) {
						buildTreeNav(leaf, value);
	                } 
				}
	        } else if ($.isPlainObject(jsonObj)) {
	            for (var p in jsonObj) {
					if (p != "__proto__") {
						var value = jsonObj[p];
						var leaf = {
							"label": p.replace(/\$parent\./g, ""),
							"match": function(key) {
								return (this["data"]["path"] == key);
							},
							"getKey": function() {
								return this["data"]["path"];
							},
							"data": {
								"path": ((parent["data"])?(parent["data"]["path"] + "." + p):p),
								"value": value
							},
							"children": []
						};
						if (parent["children"])
							parent["children"].push(leaf);
						else
							parent.push(leaf);
		                if ($.isPlainObject(value) || $.isArray(value)) {
							buildTreeNav(leaf, value);
		                } 
					}
	            }
	        }
			return parent;
	    };
		
		$scope.datasource.restUrlLoading = false;
		$scope.datasource.restUrlStatus = "";
        $scope.datasource.restUrlData = null;
        $scope.datasource.prettyPrintRestUrlData = $sce.trustAsHtml("");

		/*
		$scope.datasource.scopeNavTree = [{
		  label: 'Level 1',
		  children: [
		  	{
	  		  label: 'Level 1.1',
	  		  children: [
			  	{
		  		  label: 'Level 1.1.1',
		  		  children: [
	  			  	{
	  		  		  label: 'Level 1.1.1.1',
	  		  		  children: []
	  			  	},
	  			  	{
	  		  		  label: 'Level 1.1.1.2',
	  		  		  children: []
	  			  	}
		  		  ]
			  	},
			  	{
		  		  label: 'Level 1.1.2',
		  		  children: []
			  	}
	  		  ]
		  	},
		  	{
	  		  label: 'Level 1.2',
	  		  children: [
			  	{
		  		  label: 'Level 1.2.1',
		  		  children: []
			  	},
			  	{
		  		  label: 'Level 1.2.2',
		  		  children: []
			  	}
	  		  ]
		  	}
		  ]
		}];
		*/
		
		$scope.datasource.scopeNavTree = buildTreeNav(null, $scope.data.sgDataScopeData);
		
		$scope.datasource.selectScopePath = function(branch) {
			if ($scope.isScopeDatasource()) {
				//console.log("selected path is " + branch.data["path"]);
				$scope.data.currentSgData.scope = branch.data["path"];
				$scope.datasource.scope = "";
				if ($scope.data.currentSgData.scope != null && $scope.data.currentSgData.scope != undefined)
					$scope.datasource.scope = $scope.data.currentSgData.scope.replace(/\$parent\./g, "");
				$scope.datasource.ready = true;	
			}
		};
		
		$scope.datasource.cannedDataStatus = "";
		$scope.datasource.cannedDataString = (($scope.data.currentSgData.canned)?JSON.stringify($scope.data.currentSgData.canned):"");
		$scope.datasource.prettyPrintCannedData = $sce.trustAsHtml('');
		
		$scope.loadRestUrl = function() {
			$scope.datasource.ready = false;
			$scope.datasource.restUrlData = null;
			$scope.datasource.prettyPrintRestUrlData = "";
			$scope.datasource.restUrlLoading = true;
			$scope.datasource.ready = false;			
			
			var jsonUrl = $scope.data.currentSgData.url;
			if (jsonUrl.indexOf("://")==-1){
			    jsonUrl = $scope.originLocation.protocol + "//"+ $scope.originLocation.host +$scope.originLocation.pathname+jsonUrl;			    
			}
		    $.getJSON(jsonUrl).done(function (json, status, jqXHR) {
				$scope.datasource.ready = true;
				$scope.datasource.restUrlLoading = false;
				$scope.datasource.restUrlStatus = "";
				$scope.datasource.restUrlData = json;
				$scope.datasource.prettyPrintRestUrlData = $sce.trustAsHtml('<pre class="prettyprint lang-dart linenums">' + js_beautify(JSON.stringify(json)) + '</pre>'); 
				$scope.datasource.ready = true;
				$scope.$apply();
				prettyPrint();
			})
			.fail(function(jqxhr, textStatus, error) {
				$scope.datasource.ready = false;
				$scope.datasource.restUrlLoading = false;
				var err = textStatus + ", " + error;
				$scope.datasource.restUrlStatus = "Request Failed: " + err;
				$scope.datasource.restUrlData = null;
				$scope.datasource.prettyPrintRestUrlData = $sce.trustAsHtml('<pre class="prettyprint lang-dart linenums">' + js_beautify(jqxhr.responseText) + '</pre>');
				$scope.datasource.ready = false;
				$scope.$apply();
				prettyPrint();
			});
		};
        $scope.$watch('data.currentSgData.url', function(newValue, oldValue) {
			$scope.datasource.restUrlStatus = "";
			$scope.datasource.restUrlData = null;
			$scope.datasource.prettyPrintRestUrlData = $sce.trustAsHtml('');
			$scope.datasource.ready = false;
        });
		
		$scope.checkCannedData = function() {
			$scope.datasource.ready = false;
			$scope.datasource.cannedDataStatus = "";
			$scope.data.currentSgData.canned = null;
			$scope.datasource.prettyPrintCannedData = $sce.trustAsHtml('');
			try {
				$scope.data.currentSgData.canned = JSON.parse($scope.datasource.cannedDataString);
			} catch (e) {
				var err = e.name + ", " + e.message;
				$scope.datasource.cannedDataStatus = err;
				$scope.datasource.ready = false;
				$scope.data.currentSgData.canned = null;
			}
			if ($scope.datasource.cannedDataStatus == "") {
	        	$scope.datasource.prettyPrintCannedData = $sce.trustAsHtml('<pre class="prettyprint lang-dart linenums">' + js_beautify($scope.datasource.cannedDataString) + '</pre>');
				$scope.datasource.ready = true;
			}
			$timeout(function() {
				prettyPrint();
			}, 20);
		};
        $scope.$watch('datasource.cannedDataString', function(newValue, oldValue) {
		  $scope.data.currentSgData.canned = null;
		  $scope.datasource.cannedDataStatus = "";
		  $scope.datasource.prettyPrintCannedData = $sce.trustAsHtml('');
          $scope.datasource.ready = false;
        });
		
        $scope.goToStepSelectDatasource = function () {
            $scope.currentStep = '1';
        };
        $scope.isOnStepSelectDatasource = function () {
            return $scope.currentStep == '1';
        };
        $scope.goToStepValidateDataMapping = function () {
			switch ($scope.data.currentSgData.datasource) {
				case "scope":
					var appScope = angular.copy($scope.data.sgDataScopeData);
					for (var p in appScope) {
						var pp = p.split("$parent.");
						if (pp.length > 1) {
							var l = appScope;
							for (var i=1; i<pp.length; i++) {
								if (!l["$parent"])
									l["$parent"] = {};
								l = l["$parent"];
							}
							l[pp[pp.length-1]] = appScope[p];
							delete appScope[p];
						}
					}
					try {
						$scope.datasource.availableData = eval("appScope." + $scope.data.currentSgData.scope);
					} catch (e) {}
					break;
				case "static":
					$scope.datasource.availableData = $scope.data.currentSgData.canned;
					break;
				case "url":
				default:
					$scope.datasource.availableData = $scope.datasource.restUrlData;
					break;
			}
            $scope.currentStep = '2';
        };
        $scope.isOnStepValidateDataMapping = function () {
            return $scope.currentStep == '2';
        };
        $scope.goToStepConfirmDataMapping = function () {
            $scope.currentStep = '3';
        };
        $scope.isOnStepConfirmDataMapping = function () {
            return $scope.currentStep == '3';
        };
		
		$scope.tabs = {
			"url": true,
			"scope": false,
			"static": false
		};
		var selectDatasourceType = function(t) {
			$scope.datasource.type = t;
			$scope.tabs = {
				"url": false,
				"scope": false,
				"static": false
			}
			$scope.tabs[t] = true;
		};
		
        $scope.selectRestUrlDatasource = function () {
            selectDatasourceType('url');
			$scope.data.currentSgData.datasource = "url";
			$scope.datasource.restUrlStatus = "";
			$scope.datasource.restUrlData = null;
			$scope.datasource.prettyPrintRestUrlData = $sce.trustAsHtml('');
            $scope.datasource.ready = false;
        };
        $scope.isRestUrlDatasource = function () {
            return $scope.datasource.type == 'url';
        };
        $scope.selectScopeDatasource = function () {
            selectDatasourceType('scope');
			$scope.data.currentSgData.datasource = "scope";
            $scope.datasource.ready = false;
        };
        $scope.isScopeDatasource = function () {
            return $scope.datasource.type == 'scope';
        };
        $scope.selectCannedDatasource = function () {
            selectDatasourceType('static');
			$scope.data.currentSgData.datasource = "static";
  		  	$scope.data.currentSgData.canned = null;
  		  	$scope.datasource.cannedDataStatus = "";
  		  	$scope.datasource.prettyPrintCannedData = $sce.trustAsHtml('');
            $scope.datasource.ready = false;
        };
        $scope.isCannedDatasource = function () {
            return $scope.datasource.type == 'static';
        };

		switch ($scope.data.currentSgData.datasource) {
			case "scope":
				$scope.selectScopeDatasource();
				break;
			case "static":
				$scope.selectCannedDatasource();
				break;
			case "url":
			default:
				$scope.selectRestUrlDatasource();
				break;
		}
		
		$scope.saveDatasource = function () {
		    switch ($scope.data.currentSgData.datasource) {
		        case "scope":
		            $scope.data.currentSgData.url = "";
		            $scope.data.currentSgData.canned = null;
		            break;
		        case "static":
		            $scope.data.currentSgData.url = "";
		            $scope.data.currentSgData.scope = "";
		            break;
		        case "url":
		        default:
		            $scope.data.currentSgData.canned = null;
		            $scope.data.currentSgData.scope = "";
		            break;
		    }
		    if ($scope.data.currentSgData.mapping == null)
		        delete $scope.data.currentSgData.transformFn;
			$scope.closePopup('save')
		};
    }]);