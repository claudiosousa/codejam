pagesWindow = function () {
    var win = {};
    uiManager.setMode('manage');
    var pagesWindowPnl = $('<div class="pagesWindowPanel uib-htmladdon"></div>');
    win.pagesWindowPnl = pagesWindowPnl;

    var showPagesWindow = function () {

        if (win.createPageWindow) win.createPageWindow.remove();
        if (win.pagesWindow) win.pagesWindow.remove();

        var pagesWindow = $('<div class="pagesWindow"><p class="draggableTitle">Add a new page</p></div>');
        win.pagesWindowPnl.append(pagesWindow);
        win.pagesWindow = pagesWindow;


        var tabs = [
            {
                "title": "Layouts",
                "templates": [
                    { icon: "tmpl1cellLayout", title: "1 cell", template: '/resources/layouts/tmpl1cellLayout.html' },
                    { icon: "tmpl2cellsLayout", title: "2 cells", template: '/resources/layouts/tmpl2cellsLayout.html' },
                    { icon: "tmpl3cellsLayout", title: "3 cells", template: '/resources/layouts/tmpl3cellsLayout.html' },
                    { icon: "tmplLeftColumnCellLayout", title: "Left column", template: '/resources/layouts/tmplLeftColumnCellLayout.html' },
                    { icon: "tmplRightColumnCellLayout", title: "Right column", template: '/resources/layouts/tmplRightColumnCellLayout.html' }
                ]
            },
            {
                "title": "Page Templates",
                "templates": [
			        { icon: "tmplEmptyPage", title: "Blank page", template: '/resources/pages/tmplEmptyPage.html' },
			        { icon: "tmplInvSummary", title: "Investment Summary", template: '/resources/pages/tmplInvSummary.html' },
			        { icon: "templTransactions", title: "Transactions", template: '/resources/pages/templTransactions.html' },
			        { icon: "tmplHoldings", title: "Holdings", template: '/resources/pages/tmplHoldings.html' },
			        { icon: "tmplAccountList", title: "Account List", template: '/resources/pages/tmplAccountList.html' },
			        { icon: "tmplTrading", title: "Trading", template: '/resources/pages/tmplTrading.html' },
			        { icon: "tmplReports", title: "Reports", template: '/resources/pages/tmplReports.html' },
			        { icon: "tmplEducationFunding", title: "Education Funding", template: '/resources/pages/tmplEducationFunding.html' },
			        { icon: "tmplFinancialStatements", title: "Financial Statements", template: '/resources/pages/tmplFinancialStatements.html' },
			        { icon: "tmplRetirement", title: "Retirement", template: '/resources/pages/tmplRetirement.html' },
			        { icon: "tmplFinancialGoals", title: "Financial Goals", template: '/resources/pages/tmplFinancialGoals.html' },
			        { icon: "tmplCashDebtMgmt", title: "Cash/Debt Mng", template: '/resources/pages/tmplCashDebtMgmt.html' }
                    //{ icon: "tmplReports", title: "Reports", template: '/resources/pages/tmplReports.html' }
                ]
            }
        ];

        if (tabs.length > 0) {
            var pagesTabs = $('<ul class="pagesTabs"></ul>').appendTo(pagesWindow);

            pagesTabs.on('click', 'a', function (e) {
                pagesTabs.find('li').removeClass("active");
                pagesWindow.find('.pagesContainer').removeClass("active");
                $(this).parent().addClass("active");
                var tabIdx = $(this).attr("tab");
                pagesWindow.find('.pagesContainer[tabContent="' + tabIdx + '"]').addClass("active");
            });

            tabs.forEach(function (tab, tabIdx) {
                $('<li' + ((tabIdx == 0) ? ' class="active"' : '') + '><a tab="' + tabIdx + '">' + tab.title + '</a></li>').appendTo(pagesTabs);

                var pagesContainer = $('<div class="pagesContainer' + ((tabIdx == 0) ? ' active' : '') + '" tabContent="' + tabIdx + '"></div>');

                pagesContainer.on('click', '.page', function (e) {
                    if (!$(this).hasClass("pageNotAvailable")) {
                        pagesContainer.find('.page').removeClass("pageSelected");
                        $(this).addClass("pageSelected");
                    }
                });

                var pageSelected = -1;
                tab.templates.forEach(function (p, i) {
                    if (pageSelected == -1 && p["template"] != undefined) pageSelected = i;
                    $('<div class="page ' + ((pageSelected == i) ? "pageSelected" : "") + ((p["template"] != undefined) ? "" : "pageNotAvailable") + '" tmplI="' + i + '"><div class="icon ' + p["icon"] + '"></div><div class="title">' + p["title"] + '</div><div class="iconForbiden"><div><i class="icon-ban-circle" /></div></div</div>').appendTo(pagesContainer);
                });

                pagesWindow.append(pagesContainer);
            });
        }

        var actionContainer = $('<div class="actionPanel"></div>')
        pagesWindow.append(actionContainer);
        $('<button class="btn cancelPageButton">Cancel</button>').appendTo(actionContainer);
        $('<button class="btn bttnAppColor nextPageButton" ' + ((pagesWindow.find('.pagesContainer.active').children('.pageSelected').length < 1) ? "disabled=\"disabled\"" : "") + ' >Next   <i class="icon-chevron-right" /></button>').appendTo(actionContainer);

        actionContainer.on('click', '.cancelPageButton', function (e) {
            uiManager.setMode('edit');
            win.hide();
        });

        actionContainer.on('click', '.nextPageButton', function (e) {
            var pagesContainer = pagesWindow.find('.pagesContainer.active');
            if (pagesContainer.length > 0) {
                var tabIdx = Number($(pagesContainer[0]).attr("tabContent"));
                if (!isNaN(tabIdx) && tabs.length > tabIdx) {
                    var template = tabs[tabIdx].templates;
                    var tmplIdx = Number($(pagesContainer[0]).children('.pageSelected').attr('tmplI'));
                    if (!isNaN(tmplIdx) && template.length > tmplIdx) {
                        var page = template[tmplIdx];
                        win.showCreatePageWindow(page);
                    }
                }
            }
        });
    };

    var showCreatePageWindow = function (page) {

        if (win.pagesWindow) win.pagesWindow.remove();
        if (win.createPageWindow) win.createPageWindow.remove();

        var createPageWindow = $('<div class="createPageWindow"><p class="draggableTitle createPageDraggableTitle">Add a new page</p></div>');
        win.pagesWindowPnl.append(createPageWindow);
        win.createPageWindow = createPageWindow;

        var newPageContainer = $('<div class="newPageContainer"></div>');
        createPageWindow.append(newPageContainer);

        $('<div class="page"><div class="icon ' + page["icon"] + '"></div><div class="title">' + page["title"] + '</div></div>').appendTo(newPageContainer);

        $('<div class="newPageTitleLbl">Please enter a title for the page:</div>').appendTo(newPageContainer);
        $('<input type="text" class="newPageTitleInput" value="" />').appendTo(newPageContainer);

        newPageContainer.on('keyup', '.newPageTitleInput', function (e) {
            if (newPageContainer.find('.newPageTitleInput')[0].value.replace(/\s/g, "") == "")
                createPageActionContainer.find('.createPageCreateButton').attr("disabled", "disabled");
            else
                createPageActionContainer.find('.createPageCreateButton').removeAttr("disabled");
        });

        var createPageActionContainer = $('<div class="createPageActionPanel"></div>')
        createPageWindow.append(createPageActionContainer);

        $('<button class="btn createPageBackButton"><i class="icon-chevron-left" />   Back</button>').appendTo(createPageActionContainer);
        $('<button class="btn createPageCancelButton">Cancel</button>').appendTo(createPageActionContainer);
        $('<button class="btn bttnAppColor createPageCreateButton" disabled="disabled">Create</button>').appendTo(createPageActionContainer);

        createPageActionContainer.on('click', '.createPageBackButton', function (e) {
            win.showPagesWindow();
        });

        createPageActionContainer.on('click', '.createPageCancelButton', function (e) {
            uiManager.setMode('edit');
            win.hide();
        });

        createPageActionContainer.on('click', '.createPageCreateButton', function (e) {
            addPage(newPageContainer.find('.newPageTitleInput')[0].value, page["template"]);
            uiManager.setMode('edit');
            win.hide();
        });

        newPageContainer.find('.newPageTitleInput')[0].focus();
    };

    win.showPagesWindow = showPagesWindow;
    win.showCreatePageWindow = showCreatePageWindow;
    win.hide = function () {
        this.pagesWindowPnl.remove();
    }
    $(document.body).append(pagesWindowPnl);
    showPagesWindow();
    return win;
}

var addPage = function (navLabel, templateUrl) {

    var saveNewPage = function (pageTemplateContent) {

        var $pageContent = $(pageTemplateContent);
        controlsDefinition.parseControlToInsert($pageContent);

        $.ajax({
            url: uibuilderEndPoints.addPage,
            type: 'POST',
            data: JSON.stringify({ label: navLabel, content: $pageContent[0].outerHTML }),
            contentType: "application/json; charset=utf-8",
            success: function (response, textStatus, jqXHR) {
                var newFileUrl = location.origin + location.pathname + "#/" + navLabel;
                location.href = newFileUrl;
                uiManager.reloadApp();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Impossible add new page. Error: " + errorThrown);
            }
        });
    }

    $.ajax({
        url: chrome.extension.getURL(templateUrl),
        success: function (response, textStatus, jqXHR) {
            saveNewPage(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Impossible to save. Could not obtain template '" + template + "'. Error: " + errorThrown);
        }
    });
}
