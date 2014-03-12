function setBorderPopup() {
    var setBorderWindowPnl = $('<div class="setBorderPopupPanel"></div>');
    var setBorderWindow = $('<div class="setBorderPopupWindow"><p class="draggableTitle">Manage pages</p></div>');

    setBorderWindowPnl.append(setBorderWindow);
    var container = $('<div class="container"></div>')
    setBorderWindow.append(container);

    setBorderWindow.append(container);
    var actionContainer = $('<div class="actionPanel"></div>')
    setBorderWindow.append(actionContainer);

    $('<button class="btn cancelPageButton">Cancel</button>').appendTo(actionContainer);
    $('<button class="btn bttnAppColor confirmPageButton">OK</button>').appendTo(actionContainer);

    var pnl = $('<div class="pagesMngrInnerContainer"></div>').appendTo(container);

    $(document.body).append(setBorderWindowPnl)
    debugger;
}