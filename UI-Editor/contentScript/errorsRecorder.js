var errorsRecorder = (function () {
    var errorsRecorder = {}
    var errorHookwasInjected = false;
    errorsRecorder.isRecording = false;
    errorsRecorder.startRecording = function () {
        if (errorsRecorder.isRecording)
            return;
        errorsRecorder.isRecording = true;

        if (!errorHookwasInjected) {
            setTimeout(function () {
                errorHookwasInjected = true;
                var elem = document.createElement("script");
                elem.innerText = '  var uibErrorRecord = true;\
                                    var uibErrorsRecorded = [];\
                                    console._error = console.error;\n\
                                    console.error = function (errorTxt, a, b, c) {\
                                        if (uibErrorRecord)\
                                            uibErrorsRecorded.push(errorTxt);\
                                        console._error(errorTxt)\
                                    }';
                document.head.appendChild(elem);
            });
        } else {
            sendMessageToPage({ action: 'startErrorRecording' });
        }
    }
    errorsRecorder.stopRecording = function (callback) {
        if (!errorsRecorder.isRecording)
            return;
        errorsRecorder.isRecording = false;
        sendMessageToPageWidthCallback({ action: 'stopErrorRecording' }, function (errors) {
            callback(errors);
        });
    }

    return errorsRecorder;
})();
