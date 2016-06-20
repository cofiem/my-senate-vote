import angular from 'angular';
import PDFDocument  from 'pdfkit';
import blobStream   from 'blob-stream';

var pdfModel = angular.module('app.models.pdf', []);

pdfModel.factory('pdfGenerate', ['$log', 'stateNames', function ($log, stateNames) {

  var groupCandidates = function groupCandidates(candidatesContainer) {
    var candidateCount = candidatesContainer.length;

    // Note: this function will create more than one group for the last group (usually UG) party if there are too many candidates

    var currentGroup = null;
    var candidatesInGroup = [];
    var groups = [];
    for (var i = 0; i < candidateCount; i++) {
      var currentCandidate = candidatesContainer[i];

      if (!currentGroup) {
        currentGroup = currentCandidate.ticket;
      }

      if (currentCandidate.ticket == currentGroup) {
        candidatesInGroup.push(currentCandidate);
      } else {
        groups.push(candidatesInGroup);
        candidatesInGroup = [];
        candidatesInGroup.push(currentCandidate);
        currentGroup = currentCandidate.ticket;
      }
    }

    // catch the last set
    groups.push(candidatesInGroup);

    var groupCount = groups.length;

    // split up the UG group to have no more than 13 candidates
    // assume it is the last group
    var maxCandidatesPerGroup = 13;
    var lastIndex = groupCount - 1;
    var lastGroup = groups[lastIndex];
    var lastGroupCount = lastGroup.length;

    if (lastGroupCount > maxCandidatesPerGroup) {
      // slice extracts up to, but not including, the end index
      var newGroup1 = lastGroup.slice(0, 13);
      var newGroup2 = lastGroup.slice(13, lastGroupCount);

      groups[lastIndex] = newGroup1;
      groups.push(newGroup2);
    }

    /*
     // if a group has more than maxCandidatesPerGroup, split the group until each group has
     // fewer than maxCandidatesPerGroup


     var extraGroups = [];
     for(var groupIndex = 0; groupIndex < groupCount; groupIndex++){
     var group = groups[groupIndex];
     var candidatesInGroup = group.length;
     if(candidatesInGroup > maxCandidatesPerGroup){
     var candidatesPerGroup = Math.ceil(candidatesInGroup / (maxCandidatesPerGroup - 1));
     var newGroupCount = Math.ceil(candidatesInGroup / candidatesPerGroup);
     groups[groupIndex] = group.slice(0, candidatesPerGroup - 1);

     for(var newGroupIndex = 0; newGroupIndex < newGroupCount; newGroupIndex++){
     extraGroups
     }
     }
     }
     */

    $log.debug('party groups', groupCount, groups);

    return groups;
  };

  var addBaseContent = function addBaseContent(doc, edgeMargin, headerHeight, stateName) {
    doc
      .moveTo(edgeMargin, edgeMargin)
      .fontSize(16)
      .text('MySenateVote.org | 2016 Australian Federal Election: Senate how-to-vote card for ' + stateName)
      .fontSize(11)
      .moveTo(edgeMargin, edgeMargin + headerHeight)
      .text('Use this how-to-vote card on election day to help you fill out your below the ' +
        'line vote for the ' + stateName + ' senate. The ballot paper you get won\'t look quite the same, ' +
        'but it will have the same party and candidate boxes, in the same order.');
  };

  var drawRow = function drawRow(x, y, width, height, doc, groups) {
    // draw the line above the row
    doc
      .moveTo(x, y)
      .lineWidth(3)
      .lineTo(width, y)
      .stroke();

    var groupCount = groups.length;
    var colWidth = width / groupCount;
    var colLastIndex = groupCount - 1;

    $log.debug('row candidate total', groups.reduce(function (previousValue, currentValue) {
      return previousValue + currentValue.length;
    }, 0));

    $log.debug('row group count max', groups.reduce(function (previousValue, currentValue) {
      if (previousValue > currentValue.length) {
        return previousValue;
      } else {
        return currentValue.length;
      }
    }, 0));

    for (var colIndex = 0; colIndex < groupCount; colIndex++) {
      var group = groups[colIndex];
      var xColLeft = x + (colIndex * colWidth);
      var xColRight = xColLeft + colWidth;
      var yColTop = y;
      var yColBot = y + height;

      // draw left vertical line for column
      doc
        .moveTo(xColLeft, y)
        .lineWidth(1)
        .lineTo(xColLeft, yColBot)
        .stroke();

      // draw right vertical column for right-most column
      if (colIndex == colLastIndex) {
        doc
          .moveTo(xColRight, y)
          .lineWidth(1)
          .lineTo(xColRight, yColBot)
          .stroke();
      }

      // draw the party name
      var partyNameHeight = 35;
      var xPartyName = xColLeft + 1;
      var yPartyName = yColTop + 3;
      var ticketId = group[0].ticket;
      var partyName = ' - ' + (group[0].party_ballot_nm ? group[0].party_ballot_nm : '');
      doc
        .fontSize(12)
        .text(ticketId, xPartyName, yPartyName, {width: colWidth, continued: true, height: partyNameHeight})
        .fontSize(9)
        .text(partyName);

      // draw the candidate boxes and number (if present)
      var yCandidateStart = yPartyName + partyNameHeight;
      var xCandidateStart = xColLeft;
      var boxWidth = 16;
      var boxHeight = 11;
      var yTextStart = yCandidateStart + 3;
      var xTextStart = xCandidateStart + boxWidth + 2;
      var candidateHeight = 15;
      var candidateNameFontSize = 10;

      for (var candidateIndex = 0; candidateIndex < group.length; candidateIndex++) {
        var yOffset = candidateHeight * candidateIndex;
        var xBox = xCandidateStart;
        var yBox = yCandidateStart + yOffset;
        var xText = xTextStart;
        var yText = yTextStart + yOffset;
        var candidateTextWidth = colWidth - boxWidth - 3;
        var candidate = group[candidateIndex];

        doc
          .lineWidth(1)
          .rect(xBox, yBox, boxWidth, boxHeight)
          .stroke()
          .fontSize(candidateNameFontSize)
          .text(candidate.surname, xText, yText, {width: candidateTextWidth, height: candidateHeight});

        if (candidate.hasOwnProperty('enteredNumber') && candidate['enteredNumber']) {
          doc
            .fontSize(8)
            .text(candidate.enteredNumber, xBox + 1, yBox + 2);
        }
      }

    }
  };

  var buildDocument = function buildDocument(candidatesContainer, hasErrors) {

    // two rows, with each column containing the candidates for a party in order.
    // each candidate has a square. Those that were numbered will have a number in the square, others are emtpy.

    $log.info('loaded new set of candidates');
    $log.debug('candidates total', candidatesContainer.length);

    // A4 is [595.28, 841.89] (at 72 point)
    var A4 = {height: 595.28, width: 841.89};
    var edgeMargin = 24;
    var bothMargins = edgeMargin * 2;
    var headerHeight = 12;
    var descHeight = 31;
    var pageHeight = A4.height;
    var pageWidth = A4.width;
    var stateName = stateNames[candidatesContainer[0].state_ab.toLowerCase()];

    // create a document and pipe to a blob
    var doc = new PDFDocument({
      layout: 'landscape', size: 'A4', margin: edgeMargin,
      info: {
        'Title': 'MySenateVote.org | 2016 Australian Federal Election',
        'Author': 'Mark (@cofiem)',
        'Subject': 'A custom below the line vote for the Senate in the 2016 Australian Federal Election.',
        'Keywords': 'senate, vote, election, australia, generated'
      }
    });

    // add the basic document content
    addBaseContent(doc, edgeMargin, headerHeight, stateName);

    // put candiates into groups
    var groups = groupCandidates(candidatesContainer);

    // calculate the width of a column based on the number of party groups
    //var maxColsPerRow = 11;
    //var minColsPerRow = 6;
    var pages = 2;
    var rowCount = 4;
    var rowsPerPage = Math.ceil(rowCount / pages);
    var widthRow = pageWidth - bothMargins;
    var groupsPerRow = Math.ceil(groups.length / rowCount);

    var rowHeight = (pageHeight - bothMargins - headerHeight - descHeight) / rowsPerPage;
    var xRow = edgeMargin;

    // if there are errors, make this obvious
    if (hasErrors) {
      var xErrorText = edgeMargin;
      var yErrorText = edgeMargin + headerHeight + descHeight;
      doc
        .fontSize(60)
        .text('This ballot paper may not be counted!', xErrorText, yErrorText);
    }

    for (var pageIndex = 0; pageIndex < pages; pageIndex++) {
      if (pageIndex > 0) {
        doc.addPage();
      }

      var yRowStart = edgeMargin;
      if (pageIndex == 0) {
        yRowStart += headerHeight + descHeight;
      }

      var rowIndex = pageIndex * rowsPerPage;
      var rowCount = (pageIndex + 1) * rowsPerPage;

      for (; rowIndex < rowCount; rowIndex++) {
        // rowIndex modulo rowsPerPage (e.g. 0 % 2 = 0; 1 % 2 = 1; 2 % 2 = 0; etc..)
        var yPageOffset = rowHeight * (rowIndex % rowsPerPage);
        var yRow = yRowStart + yPageOffset;
        var extractStart = rowIndex * groupsPerRow;
        var extractEnd = extractStart + groupsPerRow;
        // slice extracts up to, but not including, the end index
        var groupsSlice = groups.slice(extractStart, extractEnd);

        $log.debug('row', rowIndex, groupsSlice);

        drawRow(xRow, yRow, widthRow, rowHeight, doc, groupsSlice);
      }
    }

    // end and display the document
    var stream = doc.pipe(blobStream());
    doc.end();
    stream.on('finish', function () {

      // from https://github.com/devongovett/pdfkit/issues/422
      // IE doesn't support blob urls or data-uris, so force a download
      if (window.navigator.msSaveOrOpenBlob) {
        var blob = stream.toBlob('application/pdf')
        window.navigator.msSaveOrOpenBlob(blob, 'output.pdf');
      } else {
        var url = stream.toBlobURL('application/pdf');
        window.open(url);
      }
    });
  };

  return {
    generate: function (candidatesContainer, hasErrors) {
      return buildDocument(candidatesContainer, hasErrors);
    }
  }
}]);


export default pdfModel;
