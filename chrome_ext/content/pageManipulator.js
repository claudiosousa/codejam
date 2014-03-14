pageManipulator = (function () {
    pageManipulator = {};

    pageManipulator.getSampleInput = function () {
        var codes = $('.dsb-content-pages:visible').find('code');
        return codes.first().text();
    }

    pageManipulator.setSampleResult = function (sampleResult) {
        var codes = $('.dsb-content-pages:visible').find('code');
        var outputCode = $(codes[1]);
        var solvedCode = $(codes[2]);
        solvedCode.css("background-color", outputCode.text().trim() == sampleResult ? 'lightgreen' : 'lightpink');
        solvedCode.html(sampleResult.replace(/\n/g, '<br>'))
    }


    pageManipulator.addAddons = function () {
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

        codeWindow.show();
    }

    pageManipulator.removeAddons = function () {
        $('.codejam-addon').remove();
    }

    return pageManipulator;
})()