requestSupport = (function () {
    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);

        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    }
    var page = {
        height: document.body.clientHeight,
        width: document.body.clientWidth,
        defaultWidth: 250,
        defaultHeight: 150,
        isMouseDown: false,
        isMoving: false,
        isResizing: false
    }
    page.startX = page.width / 2 - page.defaultWidth / 2;
    page.startY = page.height / 2 - page.defaultHeight / 2;
    page.endX = page.width / 2 + page.defaultWidth / 2;
    page.endY = page.height / 2 + page.defaultHeight / 2;
    page.getCropRectangle = function () {
        return {
            top: Math.min(page.startY, page.endY),
            left: Math.min(page.startX, page.endX),
            height: Math.abs(page.startY - page.endY),
            width: Math.abs(page.startX - page.endX)
        }
    }

    var win = {};

    var cropImage = function (fullImage, cropArea, callback) {
        var image = new Image();
        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = cropArea.width;
            canvas.height = cropArea.height;
            var context = canvas.getContext("2d");
            context.drawImage(image, cropArea.left, cropArea.top, cropArea.width, cropArea.height, 0, 0, cropArea.width, cropArea.height);
            callback(canvas.toDataURL("image/png"));
        };
        image.src = fullImage;
    }


    var collectScreenImage = function (callback) {
        var imageCollectDom = $('<div class="uib-imagecolect-background">\
                                    <div class="uib-imagecolect-shadow_top"></div>\
                                    <div class="uib-imagecolect-shadow_bottom"></div>\
                                    <div class="uib-imagecolect-shadow_left"></div>\
                                    <div class="uib-imagecolect-shadow_right"></div>\
                                    <div class="uib-imagecolect-area">\
                                        <div class="uib-imagecolect-container"></div>\
                                        <div class="uib-imagecolect-size">Highlight the issue</div>\
                                        <div class="uib-imagecolect-cancel">Cancel</div>\
                                        <div class="uib-imagecolect-crop">OK</div>\
                                        <div class="uib-imagecolect-north_west"></div>\
                                        <div class="uib-imagecolect-north_east"></div>\
                                        <div class="uib-imagecolect-south_east"></div>\
                                        <div class="uib-imagecolect-south_west"></div>\
                                    </div>\
                                </div>');
        imageCollectDom.appendTo(document.body);

        var shadowTop = imageCollectDom.find('.uib-imagecolect-shadow_top');
        var shadowBottom = imageCollectDom.find('.uib-imagecolect-shadow_bottom');
        var shadowLeft = imageCollectDom.find('.uib-imagecolect-shadow_left');
        var shadowRight = imageCollectDom.find('.uib-imagecolect-shadow_right');
        var collectArea = imageCollectDom.find('.uib-imagecolect-area');


        var removeImageCollectDom = function () {
            $(document).off('.collectScreenImage');
            $(window).off('.collectScreenImage');
            imageCollectDom.remove();
        }

        var captureImage = function () {
            win.visibleTabCaptured = function (image) {
                win.visibleTabCaptured = null;
                removeImageCollectDom();
                var cropRectangle = page.getCropRectangle();
                cropImage(image, cropRectangle, function (cropedImage) {
                    callback(image, cropedImage, cropRectangle);
                });

            }
            chrome.runtime.sendMessage({ action: "captureVisibleTab", content: { format: 'png' } });
        }

        collectArea.on('dblclick', captureImage);
        imageCollectDom.on('click', '.uib-imagecolect-crop', captureImage);
        imageCollectDom.on('click', '.uib-imagecolect-cancel', imageCollectDom, function () {
            removeImageCollectDom();
            callback(null);
        });

        var sizeImageCollectDom = function () {
            var cropRectangle = page.getCropRectangle();

            shadowTop.css({ width: cropRectangle.left + cropRectangle.width + 'px', height: cropRectangle.top + 'px' });
            shadowBottom.css({ width: page.width - cropRectangle.left + 'px', height: page.height - cropRectangle.top - cropRectangle.height + 'px' });
            shadowLeft.css({ width: cropRectangle.left + 'px', height: page.height - cropRectangle.top + 'px' });
            shadowRight.css({ width: page.width - cropRectangle.left - cropRectangle.width + 'px', height: cropRectangle.top + cropRectangle.height + 'px' });
            collectArea.css({
                width: cropRectangle.width + 'px',
                height: cropRectangle.height + 'px',
                top: cropRectangle.top + 'px',
                left: cropRectangle.left + 'px'
            });
        }
        sizeImageCollectDom();

        $(window).on('resize.collectScreenImage', function () {
            page.height = document.body.clientHeight;
            page.width = document.body.clientWidth;
            if (page.width <= page.endX) {
                var diff = page.endX - page.width + 1;
                page.startX -= diff;
                page.endX -= diff;
            }
            sizeImageCollectDom()
        });

        $(document).on('mousemove.collectScreenImage', function (e) {
            if (!page.isMouseDown)
                return;

            var target = $(e.target);

            var collectAreaElement = collectArea[0];

            var mouseX = event.pageX;
            var mouseY = event.pageY;
            if (page.dragging || page.resizing) {
                page.endX = Math.max(0, Math.min(mouseX, page.width));
                page.endY = Math.max(0, Math.min(mouseY, page.height));
            } else if (page.moving) {
                var newXPosition = mouseX - page.moveX;
                var newYPosition = mouseY - page.moveY;

                var newXPosition = Math.max(0, Math.min(newXPosition, page.width - collectAreaElement.clientWidth))
                var newYPosition = Math.max(0, Math.min(newYPosition, page.height - collectAreaElement.clientHeight))

                page.endX = newXPosition + collectAreaElement.clientWidth;
                page.startX = newXPosition;
                page.endY = newYPosition + collectAreaElement.clientHeight;
                page.startY = newYPosition;
            }

            var crop = imageCollectDom.find('.uib-imagecolect-crop')[0];
            var cancel = imageCollectDom.find('.uib-imagecolect-cancel')[0];
            if (Math.max(page.startY, page.endY) + 25 > document.body.clientHeight) {
                crop.style.bottom = 0;
                cancel.style.bottom = 0
            } else {
                crop.style.bottom = '-25px';
                cancel.style.bottom = '-25px';
            }

            sizeImageCollectDom();
        })

        $(document).on('mouseup.collectScreenImage', function (e) {
            page.isMouseDown = false;
            if (event.button == 2)
                return;

            page.resizing = false;
            page.dragging = false;
            page.moving = false;
            page.moveX = 0;
            page.moveY = 0;
            var temp;
            if (page.endX < page.startX) {
                temp = page.endX;
                page.endX = page.startX;
                page.startX = temp;
            }
            if (page.endY < page.startY) {
                temp = page.endY;
                page.endY = page.startY;
                page.startY = temp;
            }
        })


        imageCollectDom.on('mousedown', function (e) {
            if (e.originalEvent.button == 2)
                return;

            var target = $(e.target);
            if (target.hasClass('uib-imagecolect-cancel') || target.hasClass('uib-imagecolect-crop'))
                return;

            page.isMouseDown = true;

            var collectAreaElement = collectArea[0];
            var mouseX = e.pageX;
            var mouseY = e.pageY;

            if (target.hasClass('uib-imagecolect-container')) {
                page.moving = true;
                page.moveX = mouseX - collectAreaElement.offsetLeft;
                page.moveY = mouseY - collectAreaElement.offsetTop;
            } else if (target.hasClass('uib-imagecolect-north_east')) {
                page.resizing = true;
                page.startX = collectAreaElement.offsetLeft;
                page.startY = collectAreaElement.offsetTop + collectAreaElement.clientHeight;
            } else if (target.hasClass('uib-imagecolect-north_west')) {
                page.resizing = true;
                page.startX = collectAreaElement.offsetLeft + collectAreaElement.clientWidth;
                page.startY = collectAreaElement.offsetTop + collectAreaElement.clientHeight;
            } else if (target.hasClass('uib-imagecolect-south_east')) {
                page.resizing = true;
                page.startX = collectAreaElement.offsetLeft;
                page.startY = collectAreaElement.offsetTop;
            } else if (target.hasClass('uib-imagecolect-south_west')) {
                page.resizing = true;
                page.startX = collectAreaElement.offsetLeft + collectAreaElement.clientWidth;
                page.startY = collectAreaElement.offsetTop;
            } else {
                page.dragging = true;
                page.endX = 0;
                page.endY = 0;
                page.endX = page.startX = mouseX;
                page.endY = page.startY = mouseY;
            }

            e.preventDefault();
        });
    }


    win.request = function (recordedScenarioData) {
        var requestSupportPanel = $('<div class="requestSupportPanel uib-htmladdon">\
                                            <div class="requestSupportWindow">\
                                                <p class="draggableTitle">Request support form</p>\
                                                <div class="requestSupportContainer">\
                                                    <a class="recordScenario">Record scenario</a>\
                                                    <div>Describe the issue:</div>\
                                                    <textarea class="problemDescription" placeholder="problem found, steps to reproduce, preliminary analysis, expected behavior, etc"></textarea>\
                                                    <div style="margin-top:20px;">Issue screenshot:</div>\
                                                    <div class="requestSupportScreenshotContainer requestSupportScreenshotEmpty">\
                                                        <div class="emptyScreenshot"></div>\
                                                        <img class="requestSupportScreenshot"></img>\
                                                    </div>\
                                                    <div style="margin-top:20px;">Expected response time:</div>\
                                                    <select class="expectedResponseTime">\
                                                        <option value="0">ASAP</option>\
                                                        <option value="1440" selected>Within the next 24h</option>\
                                                        <option value="4320">Within the next 3 days</option>\
                                                        <option value="10080">Within the next 7 days</option>\
                                                    </select>\
                                                    <div class="addAttachement" style="margin-top:20px;">Add attachments</div>\
                                                        <input class="attachements" type="file" size="20" multiple/>\
                                                    <div>\
                                                    <div style="margin-top:20px;">Contact me at:</div>\
                                                     <input class="contactMeAt" type="text" />\
                                                 </div>\
                                                <div class="actionPanel">\
                                                    <button class="btn bttnAppColor okButton">Send</button>\
                                                </div>\
                                            </div>\
                                        </div>')
        var problemDescription = requestSupportPanel.find('.problemDescription');
        var recordScenario = requestSupportPanel.find('.recordScenario');
        if (recordedScenarioData) {
            recordScenario.css("display", "none");
        } else
            problemDescription.on('change keyup', recordScenario, function (e) {
                //setTimeout(function (e) {
                if (problemDescription.val())
                    e.data.attr('disabled', 'disabled');
                else
                    e.data.removeAttr('disabled');
                //}, 10, e);
            });

        recordScenario.on('click', uiManager.startRecordingScenario);

        requestSupportPanel.on('click', '.emptyScreenshot,.requestSupportScreenshot', requestSupportPanel, function (e) {
            var requestSupportScreenshotContainerDom = e.data.find('.requestSupportScreenshotContainer')[0];
            var containerSize = { height: 150, width: requestSupportScreenshotContainerDom.clientWidth - 4 };
            e.data.hide();
            collectScreenImage(function (fullImage, cropImage, cropSize) {
                var requestSupportScreenshotContainer = e.data.find('.requestSupportScreenshotContainer');
                var requestSupportScreenshotContainerDom = requestSupportScreenshotContainer[0];
                var requestSupportScreenshotDom = e.data.find('.requestSupportScreenshot')[0];
                requestSupportScreenshotContainerDom.image = fullImage;
                requestSupportScreenshotDom.src = cropImage;
                if (fullImage) {
                    requestSupportScreenshotContainer.removeClass('requestSupportScreenshotEmpty');
                    var containerRatio = containerSize.height / containerSize.width;
                    var screenshotRatio = cropSize.height / cropSize.width;
                    if (containerRatio < screenshotRatio) {
                        requestSupportScreenshotDom.style.height = containerSize.height + "px";
                        requestSupportScreenshotDom.style.width = containerSize.height / screenshotRatio + "px";
                    } else {
                        requestSupportScreenshotDom.style.width = containerSize.width + "px";
                        requestSupportScreenshotDom.style.height = containerSize.width * screenshotRatio + "px";

                    }
                } else
                    requestSupportScreenshotContainer.addClass('requestSupportScreenshotEmpty');

                e.data.show();
            })
        });


        var getEnvironment = function (getMHtml, callback) {

            win.setBackgroundEnvironment = function (backgroundEnvironment) {
                win.setBackgroundEnvironment = null;
                var extentionManifest = chrome.runtime.getManifest();
                var frontEnvironment = {
                    uibuilder: {
                        version: extentionManifest.version,
                        name: extentionManifest.name
                    },
                    app: appManifest,
                    browser: window.navigator.userAgent
                };

                var environment = $.extend(frontEnvironment, backgroundEnvironment);

                callback(environment);
            }

            chrome.runtime.sendMessage({ action: "getBackgroundEnvironment", content: { getMHtml: getMHtml } });
        }


        var sendRequestSupport = function (supportPanel, image) {

            getEnvironment(!!recordedScenarioData, function (environment) {
                var problemDescription = supportPanel.find('.problemDescription');
                var expectedResponseTime = supportPanel.find('.expectedResponseTime');
                var contactMeAt = supportPanel.find('.contactMeAt');
                var attachements = supportPanel.find('.attachements');

                var formData = new FormData();
                formData.append("request", problemDescription.val());
                formData.append("screenshot", dataURItoBlob(image));
                formData.append("expectedResponseTime", expectedResponseTime.val());
                formData.append("contact", contactMeAt.val());
                formData.append("environment", new Blob([JSON.stringify(environment)], { type: "application/json" }));
                if (recordedScenarioData) {
                    debugger;
                    formData.append("recorded_scenario_errors", new Blob([recordedScenarioData.errors], { type: "application/json" }));
                    for (var i = 0; i < recordedScenarioData.requests.length; i++) {
                        var request = recordedScenarioData.requests[i];
                        if (request.response) {
                            formData.append("recorded_scenario_ajax_request-" + request.requestId, new Blob([request.response], {}), request.url);
                        }
                    }
                    formData.append("recorded_scenario_ajax_requests", new Blob([recordedScenarioData.requests], { type: "application/json" }));
                    formData.append("recorded_scenario_ajax_mhtml", new Blob([recordedScenarioData.mhtml], { type: "message/rfc822" }));
                }
                var files = attachements[0].files;
                for (var i = 0; i < files.length; i++) {
                    formData.append("attachement-" + i, files[i]);
                }

                $.ajax({
                    url: uibuilderEndPoints.requestSupport,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function (data) {
                        alert("Sucess. Ticket:" + data);
                        supportPanel.remove();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Failed:" + textStatus);
                        supportPanel.remove();
                    }
                });
            });
        }

        requestSupportPanel.on('click', '.okButton', requestSupportPanel, function (e) {
            var supportPanel = e.data;
            var screenshotContainer = supportPanel.find('.requestSupportScreenshotContainer');
            supportPanel.find('.okButton').attr('disabled', 'disabled');

            if (screenshotContainer.hasClass('requestSupportScreenshotEmpty')) {
                win.visibleTabCaptured = function (image) {
                    win.visibleTabCaptured = null;
                    sendRequestSupport(supportPanel, image);
                }
                chrome.runtime.sendMessage({ action: "captureVisibleTab", content: { format: "jpeg", quality: 50 } });//{ format: 'png' } });
            } else {
                var image = screenshotContainer[0].image;
                sendRequestSupport(supportPanel, image);
            }
        });

        $(document.body).append(requestSupportPanel)
    }
    return win;
})()



