var pageActionState = "hidden";

setPageActionState = function (state) {
    pageActionState = state;
    chrome.runtime.sendMessage({ action: "setPageState", content: state });
}

setPageActionState('off');

pageActionClicked = function () {
    switch (pageActionState) {
        case "off":
            pageManipulator.addAddons();
            setPageActionState('on');
            break;
        case "on":
            pageManipulator.removeAddons();
            setPageActionState('off');
            break;
        default:
    }

}