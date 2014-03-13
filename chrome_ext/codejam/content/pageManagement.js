addAddons = function () {
    var sampleCodeWrapper = $('.problem-io-wrapper');
    sampleCodeWrapper.each(function (i, wrapper) {
        var $wrapper = $(wrapper);
        var sampleCodeRows = $wrapper.find('tr');

        sampleCodeRows.first().append('<td class="codejam-addon">\
                                        <br>\
                                        <span class="problem-item-gray">Solved</span>\
                                   </td>');
        sampleCodeRows.last().append('<td class="codejam-addon"> <code/></td>');
    })
    var codejamContainer = $('<div class="codejam-addon codejam-window">\
                                <div class="codejam-title">\
                                    <div class="closeBtn">X</div>\
                                </div>\
                                <div class="codejam-container">\
                                    <div class="codejam-code" contenteditable>\
                                    </div>\
                                </div>\
                                <div class="codejam-actions">\
                                    <button class="codejam-trywithsample" >Try with sample</button>\
                                </div>\
                            </div>').appendTo(document.body);

    codejamContainer.on('click', '.closeBtn', pageActionClicked);
    codejamContainer.on('click', '.codejam-trywithsample', function () {
        var codes = $('.dsb-content-pages:visible').find('code');
        var inputCode = $(codes[0]);
        var outputCode = $(codes[1]);
        var solvedCode = $(codes[2]);
        var result = problemSolver.solveStrInput(inputCode.text());
        solvedCode.text(result.replace('\n', '<br>'))
    });

    problemSolver.setCodeElement(codejamContainer.find('.codejam-code')[0]);
}

removeAddons = function () {
    $('.codejam-addon').remove();
}
