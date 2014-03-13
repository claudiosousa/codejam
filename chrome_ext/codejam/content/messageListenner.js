var backgroundListenner = function (message) {
    if (message.to != "contentScript")
        return;

    //message.content
    switch (message.action) {
        case "pageActionClick":
            pageActionClicked();
            break;
    }
}

chrome.runtime.onMessage.addListener(backgroundListenner);



var pageListener = function (event) {
    if (event.source != window)
        return;
    //event.data.content
    switch (event.data.action) {

    }
}

window.addEventListener("message", pageListener, false);