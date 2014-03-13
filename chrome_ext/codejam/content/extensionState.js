var pageActionState = "hidden";

setPageActionState = function (state) {
    pageActionState = state;
    chrome.runtime.sendMessage({ action: "setPageState", content: state });
}

setPageActionState('off');

pageActionClicked = function () {
    switch (pageActionState) {
        case "off":
            addAddons();
            setPageActionState('on');
            break;
        case "on":
            removeAddons();
            setPageActionState('off');
            break;
        default:

    }

}