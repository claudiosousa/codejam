pagesManagerWindow = function () {
    var win = {};
	uiManager.setMode('manage');
	var pagesMngrWindowPnl = $('<div class="pagesMngrWindowPanel uib-htmladdon"></div>');
    var pagesMngrWindow = $('<div class="pagesMngrWindow"><p class="draggableTitle pagesMngrDraggableTitle">Manage pages</p></div>');

    pagesMngrWindowPnl.append(pagesMngrWindow);
    var pagesMngrContainer = $('<div class="pagesMngrContainer"></div>')
    pagesMngrWindow.append(pagesMngrContainer);
	win.pagesMngrWindowPnl = pagesMngrWindowPnl;

    pagesMngrWindow.append(pagesMngrContainer);
    var pagesMngrActionContainer = $('<div class="pagesMngrActionPanel"></div>')
    pagesMngrWindow.append(pagesMngrActionContainer);

    $('<button class="btn pagesMngrCancelPageButton">Cancel</button>').appendTo(pagesMngrActionContainer);
    $('<button class="btn bttnAppColor pagesMngrConfirmPageButton">OK</button>').appendTo(pagesMngrActionContainer);

	var retrieveConfiguration = function(url) {
		$.get(
			url,
	        function (response, textStatus, jqXHR) {
				if (textStatus == "success") {
	            	if (response["endpoints"] && response["endpoints"]["navigation"] != undefined)
						retrieveNavigation(response["endpoints"]["navigation"]);
					else
						alert('unable to read application configuration file ("' + url + '".');
				} else 
					alert('unable to retrieve application configuration file ("' + url + '".');
	        }
	    );
	};
	
	var retrieveNavigation = function(url) {
		$.get(
			url,
	        function (response, textStatus, jqXHR) {
				if (textStatus == "success") {
	            	if (response["main"] instanceof Array)
						createNavigationTree(response["main"]);
					else
						alert('unable to read application navigation file ("' + url + '".');
				} else 
					alert('unable to retrieve application navigation file ("' + url + '".');
	        }
	    );
	};
	//<i class="icon-reorder" style="font-size: xx-large; color: rgba(95, 92, 92, 0.36);" />
	var createNavigationTree = function(nav) {
		win.nav = nav;
		var pnl = $('<div class="pagesMngrInnerContainer"></div>').appendTo(pagesMngrContainer);
		var pageList = $('<ul class="sortablePages"></ul>').appendTo(pnl);
		win.pageList = pageList;
		nav.forEach(function(item, i) {
			$('<li class="sortablePage ui-state-default">\
				<div class="pageGrip"></div>\
				<input pId="' +  item["id"] +'" value="' +  item["label"] + '" />\
				<button class="sortablePageDeleteBtn"><i class="fa fa-trash-o" /></button>\
				<div class="sortablePageConfirmDeletePnl">\
					<button class="sortablePageConfirmDeleteBtn">Delete</button>\
				</div>\
			</li>').appendTo(pageList);
		});
		
		pageList.on('click', '.sortablePageDeleteBtn', function (e) {
			$(this.parentNode).addClass("sortablePageToDelete");
			$(this.parentNode).find("input").blur();
			$(this).blur();
			//$(this.parentNode).find(".sortablePageConfirmDeleteBtn").focus();
	    });
	
		pageList.on('focus', 'input', function (e) {
			pageList.find(".sortablePageToDelete").removeClass("sortablePageToDelete");
	    });
		pageList.on('focus', '.sortablePageDeleteBtn', function (e) {
			pageList.find(".sortablePageToDelete").removeClass("sortablePageToDelete");
	    });
		
		pageList.on('click', '.sortablePageConfirmDeleteBtn', function (e) {
			$(this.parentNode.parentNode).remove();
	    });
		
		pageList.on('keypress', 'input', function (event) {
		    var regex = new RegExp("^[a-zA-Z0-9\s]+$");
		    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
		    if (!regex.test(key)) {
		        event.preventDefault();
		        return false;
		    }
		});

		pageList.find("li").mouseleave(function(e) {
			$(this).removeClass("sortablePageToDelete");
			$(this).find("input").blur();
			$(this).find(".sortablePageDeleteBtn").blur();
		});
		
		$(function() {
			pageList.sortable({
				placeholder: "ui-state-highlight"
			});
			pageList.disableSelection();
		});
	};
	
	retrieveConfiguration('api/config.json');

    pagesMngrActionContainer.on('click', '.pagesMngrCancelPageButton', function (e) {
		uiManager.setMode('edit');
        win.hide();
    });

    pagesMngrActionContainer.on('click', '.pagesMngrConfirmPageButton', function (e) {
		if (!win.nav instanceof Array || !win.pageList)
			return;
			
		var pages = [];
		var items = win.pageList.find("input[pId]");
		for (var i=0; i<items.length; i++) {
			var id = $(items[i]).attr("pId");
			if (id != undefined) {
				var page = null;
				win.nav.some(function(n) {
					if (n["id"] == id) {
						page = jQuery.extend({}, n);
						return true;
					}
					return false;
				});
				if (page != null) {
					page["label"] = items[i].value;
					var index = page["partial"].lastIndexOf("/") + 1;
					if (index != 0)
						page["partial"] = page["partial"].substr(0, index) + page["label"] + ".html";
					else
						page["partial"] = "partials/" + page["label"] + ".html";
					pages.push(page);
				}
			}
		}
		saveNavigation(pages);
		uiManager.setMode('edit');
        win.hide();
    });

    win.hide = function () {
		if (this.pagesMngrWindowPnl)
        	this.pagesMngrWindowPnl.remove();
    }
    $(document.body).append(pagesMngrWindowPnl)
    return win;
}

var saveNavigation = function (pages) {
    $.ajax({
        url: uibuilderEndPoints.saveNavigation,
        type: 'POST',
        data: JSON.stringify(pages),
        contentType: "application/json; charset=utf-8",
        success: function (response, textStatus, jqXHR) {
            uiManager.reloadApp();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Impossible add save navigation. Error: " + errorThrown);
        }
    });
}

