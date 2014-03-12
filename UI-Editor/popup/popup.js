var p = location.search.substr(1).split("&");
var urlParams = {};
for (var i = 0; i < p.length; i++) {
    var s = p[i].split("=");
    if (s.length > 1 && s[1] != null)
        urlParams[s[0]] = ("" + s[1]).replace(/%20/g, " ");
}
//console.log(JSON.stringify(urlParams));

var popupId = urlParams["popupId"];

var popupParams = null;
var originLocation = null;

var initApp = function () {
    var modules = [];
    try {
        angular.module('popupModule')
        modules.push('popupModule');
    } catch (e) { }

    angular.module('popupMainModule', modules).run(["$rootScope","$sce", function ($rootScope, $sce) {
        $rootScope.templateUrl = $sce.trustAsResourceUrl(popupParams.template);
        $rootScope.data = popupParams.data;
        $rootScope.originLocation = originLocation;
        $rootScope.$safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
        $rootScope.openPopup = function (template, jsFiles, data, callback) {
            askToOpenPopup({template: template, jsFiles: jsFiles, data: data}, callback);
        };
        $rootScope.closePopup = function (reason) {
            askToClosePopup({ reason: reason, data: $rootScope.data });
        };
    }])

    angular.bootstrap(document.body, ["popupMainModule"])
}

var jsIndex = -1;
var loadJs = function () {
    var jsFile = null;
    do {
        jsIndex++;
        jsFile = popupParams.jsFiles[jsIndex]
    } while (!jsFile && jsIndex < popupParams.jsFiles.length - 1)
    if (jsIndex < popupParams.jsFiles.length) {
        $.ajax({
            url: jsFile,
            dataType: "script",
            success: loadJs
        });
    } else {
        setTimeout(function () {
            initApp();
        })
    }
}

var callbacks = {};
var source_msg_window = null;
window.addEventListener("message", function (event) {
    if (!event.data || event.data.from != "popupManager")
        return;
    source_msg_window = event.source;
    switch (event.data.action) {
        case 'loadPopup':
            popupParams = event.data.content.popupParams;
            originLocation = event.data.content.originLocation;
            loadJs();
            break;
        case 'closePopupCallback':
            if (event.data.content && event.data.content.callbackId) {
                var callback = callbacks[event.data.content.callbackId];
                if (typeof callback == "function")
                    callback(event.data.content.response);
            }
            break;
    }
});
var askToOpenPopup = function (content, callback) {
    if (!source_msg_window)
        return;
    var msg = { from: 'uib-popup', popupId: popupId, action: 'openPopup', content: content };
    if (typeof callback == "function") {
        var callbackId = "callbackId" + new Date().getTime() + Math.random().toString(36).substr(2);
        callbacks[callbackId] = callback;
        msg.callbackId = callbackId;
    }
    source_msg_window.postMessage(msg, '*');
};
var askToClosePopup = function (response) {
    if (!source_msg_window)
        return;
    source_msg_window.postMessage( { from: 'uib-popup', popupId: popupId, action: 'closePopup', content: response }, '*');
};

if (location.search == "?test") {
    popupParams = {
        "template": "/contentScript/propertiesWindow/popups/sgwData.html",
        "data": {
			"sgDataScopeData": {
				"car": {
					"wheels": [
						{"name": "wheel1"},
						{"name": "wheel2"},
						{"name": "wheel3"},
						{"name": "wheel4"}
					]
				},
				"house": {
					"kitchen": {
						"fridge": 2,
						"owen": 1,
						"table": 1,
						"chairs": [
							{"name": "chair1"},
							{"name": "chair2"},
							{"name": "chair3"},
							{"name": "chair4"}
						]
					}
				}
			},
			"template": '{"crm":{"firstname":"Jonh","lastname":"Smith","age":25,"married":true},"updated":"01/01/1970","financial":{"netAssetValue":350000,"accounts":[{"name":"Private Account","status":"active","creationDate":"01/01/2010","shortName":"A0","accountId":"03243082398","expiryDate":"07/02/2018","taxRate":0.07,"subaccounts":[561493,4342435]}]}}',
			"template2": '{"values":[20,30,50],"colors":["red","blue","green"]}',
			"template3": '{"11123456":{"name":"My account 1"},"11123457":{"name":"My account 2"}}',
			"currentSgData": {
	            "datasource": "scope", // url, scope, static
	            "url": "http://localhost:3001/rest/accounts",
	            "scope": "house",
				"mapping": '[{"s":".kitchen.fridge","d":".crm.firstname"},{"s":".kitchen.chairs[].name","d":".financial.accounts[].name"}]',
	            "canned": {
	                "totalAssetValue": 200000,
	                "updateTimeStamp": "01/01/2014",
					"SystemInfo": {
				        "Type": "client",
				        "Category": "individual",
				        "PrimaryOwner": "sungard",
				        "Rating": "tier 1",
				        "Status": "active"
				    },
	                "owner": {
	                    "first_name": "Steve",
	                    "last_name": "Jobs",
	                    "age": 58,
	                    "married": true,
						"company": "TIFFANY & Co"
	                },
	                "accountsStatus": ["active", "inactive", "inactive"],
	                "data": [
	                   {
							"name": "Investement Account",
							"start_date": "01/01/2010",
							"short_name": "A1",
							"id": "1523555",
							"expiry_date": "07/02/2023",
							"pricing_frequency": "yearly",
							"rate": 0.25,
							"currentBalance": 400000,
							"costBasis": 200,
							"annualContribution": 10000,
							"contributionGrowthRate": 0.06,
							"subaccounts": [4359034, 32949204]
	                   },
	                   {
							"name": "Son Education Funding",
							"start_date": "04/11/2009",
							"short_name": "E2",
							"id": "2345234",
							"expiry_date": "08/03/2019",
							"pricing_frequency": "yearly",
							"rate": 0.16,
							"currentBalance": 250000,
							"costBasis": 150,
							"annualContribution": 5000,
							"contributionGrowthRate": 0.08,
							"subaccounts": [345354587, 656454354]
	                   },
	                   {
							"name": "Life Insurance",
							"start_date": "05/12/2002",
							"short_name": "I3",
							"id": "2345234",
							"expiry_date": "07/05/2034",
							"pricing_frequency": "yearly",
							"rate": 0.18,
							"currentBalance": 600000,
							"costBasis": 90,
							"annualContribution": 500,
							"contributionGrowthRate": 0.10,
							"subaccounts": [8324587, 754454354, 6564354354]
	                   },
	                   {
							"name": "Retirement Account",
							"start_date": "07/04/2005",
							"short_name": "R7",
							"id": "2345234",
							"expiry_date": "01/07/2022",
							"pricing_frequency": "monthly",
							"rate": 0.27,
							"currentBalance": 300000,
							"costBasis": 75,
							"annualContribution": 2000,
							"contributionGrowthRate": 0.05,
							"subaccounts": [65344587, 23454354, 656422354, 123454354, 567454354]
	                   },
	                   {
							"name": "Daughter Education Funding",
							"start_date": "01/08/2005",
							"short_name": "E4",
							"id": "2345234",
							"expiry_date": "09/02/2030",
							"pricing_frequency": "daily",
							"rate": 0.21,
							"currentBalance": 120000,
							"costBasis": 110,
							"annualContribution": 5000,
							"contributionGrowthRate": 0.09,
							"subaccounts": [3554587, 85454354, 6433454354, 4633454354]
	                   },
	                   {
							"name": "Children Investment Account",
							"start_date": "04/01/2008",
							"short_name": "I3",
							"id": "2345234",
							"expiry_date": "07/05/2035",
							"pricing_frequency": "weekly",
							"rate": 0.35,
							"currentBalance": 700000,
							"costBasis": 200,
							"annualContribution": 1500,
							"contributionGrowthRate": 0.04,
							"subaccounts": [7654587, 97454354, 65554354]
	                   }
	                ]
	            },
				"canned2": [
				    {
						"title": "Microsoft Corporation",
						"symbol": "MSFT",
						"exchange": "NASDAQ",
				        "amount": 30000,
						"pctChange": 0.15,
						"assetClass": "Equity",
						"assetClass": "Private Equity",
				        "color":"red"
				    },
				    {
						"title": "SPDR Gold Trust (ETF)",
						"symbol": "GLD",
						"exchange": "NYSE",
				        "amount": 15000,
						"pctChange": 0.20,
						"assetFamily": "Commodities",
						"assetClass": "Precious metals",
				        "color": "blue"
				    },
				    {
						"title": "Templeton Foreign Fund Class A",
						"symbol": "TEMFX",
						"exchange": "MUTF",
				        "amount": 10000,
						"pctChange": -0.18,
						"assetClass": "Fixed Income",
						"assetClass": "Foreign",
				        "color": "green"
				    }
				],
				"canned3": [
				    {
				        "accountid": 11123456,
				        "name": "My account 1"
				    },
				    {
				        "accountid": 11123457,
				        "name": "My account 2"
				    }
				]
                
	        }
		},
        "jsFiles": [
			"/contentScript/propertiesWindow/popups/sgwDataCtrl.js",
			"/resources/ui-bootstrap-0.9.0.min.js",
			"/resources/ui-bootstrap-tpls-0.9.0.min.js",
			"/resources/google-code-prettify/prettify.js",
			"/resources/beautify/beautify.js",
			"/contentScript/propertiesWindow/popups/directives/abn-tree/abn_tree_directive.js",
            "/contentScript/propertiesWindow/popups/directives/jsonMapper/jsonMapper.js"
        ]
    }
    loadJs();;
}
window.top.postMessage({ from: 'uib-popup', popupId: popupId, action: 'initialize' }, '*');

