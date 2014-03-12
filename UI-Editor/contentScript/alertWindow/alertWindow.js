alertWindow = function (title, message) {
	var win = {};
	var alertWindowPnl = $('<div class="alertWindowPanel"></div>');
    var alertWindow = $('<div class="alertWindow"><p class="draggableTitle"><i class="fa fa-exclamation-circle" />' + title + '</p></div>');

	alertWindowPnl.append(alertWindow);
    var alertContainer = $('<div class="alertContainer">' + message + '</div>')
    alertWindow.append(alertContainer);

	var actionContainer = $('<div class="actionPanel"></div>')
    alertWindow.append(actionContainer);
	
	$('<button class="btn bttnAppColor okButton">OK</button>').appendTo(actionContainer);
	
	actionContainer.on('click', '.okButton', function (e) {
        win.hide();
    });
	
	win.alertWindowPnl = alertWindowPnl;
    win.hide = function () {
        this.alertWindowPnl.remove();
    }
    $(document.body).append(alertWindowPnl)
    return win;
}