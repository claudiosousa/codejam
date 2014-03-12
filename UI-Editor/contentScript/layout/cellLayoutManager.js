/// <reference path="cellLayoutManager.js" />
/// <reference path="cellLayoutManager.js" />
/// <reference path="setBorderPopup/setBorderPopup.html" />
cellLayoutManager = (function () {

    var cellResizer = null,
        sizerCurrentPos = null,
       sizerInitialPos = null,
       possibleDrops = null,
       rowLeftOffset = 0,
       row = null,
       sizerType = null, //"start,middle,end"
       cellsToCompress2theRightObj = null,
       cellsToCompress2theLeftObj = null;


    var currentlyImpactedCells = [];
    var cellResizerMouseMove = function (e) {
        if (possibleDrops.length == 0)
            return;
        var mouseXInRow = e.originalEvent.clientX - rowLeftOffset;
        var dropAtPos = null;
        var distanceToDropPos = Number.MAX_VALUE;
        for (var i = 0; i < possibleDrops.length; i++) {
            var possibleDrop = possibleDrops[i];
            var distanceToNewDropPos = Math.abs(mouseXInRow - possibleDrop.left);
            if (distanceToDropPos > distanceToNewDropPos) {
                distanceToDropPos = distanceToNewDropPos;
                dropAtPos = possibleDrop.col;
            }
        }

        if (cellSplitterCurrentPos != dropAtPos) {
            cellSplitterCurrentPos = dropAtPos;

            currentlyImpactedCells = [];

            cellsToCompress2theRightObj.concat(cellsToCompress2theLeftObj).forEach(function (cellObj) {
                cellObj.cell.attr('uib-col', cellObj.col);
            })

            if (dropAtPos != cellSplitterInitialPos) {
                var dragDirectionCells = null;

                var colOffset = Math.abs(cellSplitterInitialPos - dropAtPos)
                var cellsToCompressForMouseDirection = null;
                var cellBeeingIncreased = null;

                if (dropAtPos < cellSplitterInitialPos) {
                    cellsToCompressForMouseDirection = cellsToCompress2theLeftObj;
                    cellBeeingIncreased = cellsToCompress2theRightObj[0];
                } else {
                    cellsToCompressForMouseDirection = cellsToCompress2theRightObj;
                    cellBeeingIncreased = cellsToCompress2theLeftObj[0];
                }


                if (cellBeeingIncreased) {
                    cellBeeingIncreased.cell.attr('uib-col', cellBeeingIncreased.col + colOffset);
                    currentlyImpactedCells.push(cellBeeingIncreased.cell);
                }
                var cols2absorve = colOffset;
                for (var i = 0; i < cellsToCompressForMouseDirection.length && cols2absorve > 0; i++) {
                    var cell2compressObj = cellsToCompressForMouseDirection[i];

                    var compressCellBy = Math.min((cell2compressObj.empty ? cell2compressObj.col : cell2compressObj.col - 1), cols2absorve);
                    cols2absorve -= compressCellBy;
                    cell2compressObj.cell.attr('uib-col', cell2compressObj.col - compressCellBy);
                    currentlyImpactedCells.push(cell2compressObj.cell);
                }
            }
        }
        e.preventDefault()

    }

    var cellResizerMouseUp = function () {
        if (!row)
            return;
        $(document.body).off(".dragManager");
        row.children('[uib-cell][uib-col="0"]').remove();
        uiManager.setMode('edit');
        controlActionsManager.updateVisibleControlActions(row);
        if (currentlyImpactedCells.length > 0)
            uiManager.setDirty(currentlyImpactedCells.map(function (cell) { return cell.attr('id') }));
        possibleDrops = null;
        row = null;
        cellResizer.removeClass('dragging');
    }

    var cellLayoutManager = {};

    cellLayoutManager.cellResizerMouseDown = function (event) {

        cellResizer = $(event.target).closest('.uib-cellResizer');
        cellResizer.addClass('dragging');

        sizerType = cellResizer.hasClass('uib-leftCellResizer') ? "start" : (cellResizer.hasClass('uib-rightCellResizer') ? "end" : "middle")
        row = cellResizer.closest('[uib-row]');

        if (sizerType == "start")
            cellResizer.before(controlsDefinition.getNewCell(0));
        else if (sizerType == "end")
            cellResizer.after(controlsDefinition.getNewCell(0));

        var previousCells = cellResizer.prevAll('[uib-cell]');
        var nextCells = cellResizer.nextAll('[uib-cell]');

        cellSplitterInitialPos = 0;
        previousCells.each(function (i, cell) {
            var cellCol = Number(cell.getAttribute('uib-col'));
            if (cellCol != Number.NaN)
                cellSplitterInitialPos += cellCol;
        });

        cellSplitterCurrentPos = cellSplitterInitialPos;

        possibleDrops = [];
        var rowWidth = row.width();
        var rowPercent = rowWidth / 100;
        rowLeftOffset = row.offset().left;

        var getLeft = function (col, beforeOrAfter) {
            var left = Math.min(rowWidth, Math.max(0, rowPercent * 8.5 * col - rowPercent));;

            /*
            if (beforeOrAfter && beforeOrAfter == "before")
                left += 3 * rowPercent;
            if (beforeOrAfter && beforeOrAfter == "after")
                left -= 3 * rowPercent;
                */
            return left;
        }

        possibleDrops.push({ col: cellSplitterInitialPos, left: getLeft(cellSplitterInitialPos) });
        cellsToCompress2theLeftObj = [];
        var contentCells2compressAtTheEnd = [];
        var forLoopLastPos = cellSplitterInitialPos;
        for (var i = 0; i < previousCells.length; i++) {
            var cell = $(previousCells[i]);
            var cellCol = Number(cell.attr('uib-col'));
            var cellObj = { cell: cell, col: cellCol, empty: cell.children().length == 0 };
            for (var j = 0; j < (cellObj.empty ? cellCol : cellCol - 1) ; j++) {
                forLoopLastPos--;
                possibleDrops.unshift({ col: forLoopLastPos, left: getLeft(forLoopLastPos, "before") });
            }
            if (i == 0 || cellObj.empty)
                cellsToCompress2theLeftObj.push(cellObj)
            else if (cellObj.col > 1)
                contentCells2compressAtTheEnd.push(cellObj);
        }

        cellsToCompress2theLeftObj.push.apply(cellsToCompress2theLeftObj, contentCells2compressAtTheEnd);


        forLoopLastPos = cellSplitterInitialPos;
        cellsToCompress2theRightObj = [];
        contentCells2compressAtTheEnd = [];
        for (var i = 0; i < nextCells.length; i++) {
            var cell = $(nextCells[i]);
            var cellCol = Number(cell.attr('uib-col'));
            var cellObj = { cell: cell, col: cellCol, empty: cell.children().length == 0 };
            for (var j = 0; j < (cellObj.empty ? cellCol : cellCol - 1) ; j++) {
                forLoopLastPos++;
                possibleDrops.push({ col: forLoopLastPos, left: getLeft(forLoopLastPos, 'after') });
            }
            if (i == 0 || cellObj.empty)
                cellsToCompress2theRightObj.push(cellObj)
            else if (cellObj.col > 1)
                contentCells2compressAtTheEnd.push(cellObj);
        }
        cellsToCompress2theRightObj.push.apply(cellsToCompress2theRightObj, contentCells2compressAtTheEnd)

        uiManager.setMode('cell-resize');
        $(document.body).off(".dragManager");

        $(document.body).on('mousemove.dragManager.uibuilder', cellResizerMouseMove);
        $(document.body).on('mouseup.draggableTitle.uibuilder', cellResizerMouseUp);

        //event.stopPropagation();
        //event.preventDefault();
    }

    var getCellToCompressForAddingColumn = function (beforeElement) {
        var nextCells = beforeElement.nextAll('[uib-cell]');
        var previousCells = beforeElement.prevAll('[uib-cell]');
        var nextAndBeforeCells = nextCells.toArray().concat(previousCells.toArray());
        for (var i = 0; i < nextAndBeforeCells.length; i++) {
            var cell = nextAndBeforeCells[i];
            if (Number(cell.getAttribute('uib-col')) > 1)
                return cell;
        }
        var getFirstEmptyAfterContent = function (collection) {
            var foundContent = false;
            for (var i = 0; i < collection.length; i++) {
                var cell = collection[i];
                if (cell.children.length > 0) {
                    foundContent = true;
                    continue;
                }

                if (foundContent && Number(cell.getAttribute('uib-col')) > 0)
                    return cell;
            }
        }

        var emptyCell = getFirstEmptyAfterContent(nextCells);
        if (!emptyCell)
            emptyCell = getFirstEmptyAfterContent(previousCells);
        if (!emptyCell) {
            emptyCell = nextCells.toArray().concat(previousCells.toArray()).filter(function (cell) {
                var cols = Number(cell.getAttribute('uib-col'));
                return cols > 1 || (cols > 0 && cell.children.length == 0);
            })[0];
        }
        return emptyCell;
    }

    cellLayoutManager.insertColumnAfter = function (beforeElement) {
        var newCell = controlsDefinition.getNewCell(0);
        beforeElement.after(newCell);

        var cell2Compress = getCellToCompressForAddingColumn(beforeElement)
        uiManager.setMode('cell-resize');
        setTimeout(function (newCell, cell2Compress, row) {
            newCell.attr('uib-col', '1');
            if (cell2Compress)
                cell2Compress.setAttribute('uib-col', Number(cell2Compress.getAttribute('uib-col')) - 1);
            setTimeout(function (row) {
                row.children('[uib-cell][uib-col="0"]').remove();
                uiManager.setMode('edit');
            }, 600, row);
        }, 0, newCell, cell2Compress, beforeElement.closest('[uib-row]'));
        return newCell;
    }

    cellLayoutManager.editCellBorder = function (cellSpliter) {
        var cellToTheRight = cellSpliter.next('[uib-cell]:not([uib-col="0"])');
        if (cellToTheRight.length > 0) {
            if (cellToTheRight.attr('uib-left-line') != undefined)
                cellToTheRight.removeAttr('uib-left-line')
            else
                cellToTheRight.attr('uib-left-line', '')
            uiManager.setDirty(cellToTheRight);
        }
    }

    return cellLayoutManager;
})();
