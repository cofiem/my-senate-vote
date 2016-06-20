import angular from 'angular';
import PDFDocument  from 'pdfkit';
import blobStream   from 'blob-stream';

var pdfModel = angular.module('app.models.pdf', []);

pdfModel.factory('pdfGenerate', ['$log', 'stateNames', function ($log, stateNames) {

  var groupCandidates = function groupCandidates(candidatesContainer) {
    var candidateCount = candidatesContainer.length;

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

    $log.debug('party groups', groups.length, groups);

    return groups;
  };

  var addBaseContent = function addBaseContent(doc, edgeMargin, headerHeight, stateName) {
    doc
      .moveTo(edgeMargin, edgeMargin)
      .fontSize(16)
      .text('My Senate Vote | 2016 Australian Federal Election: Senate how-to-vote card for ' + stateName)
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
    //var colWidth = width / groupCount;


  };

  var buildDocument = function buildDocument(candidatesContainer) {

    // two rows, with each column containing the candidates for a party in order.
    // each candidate has a square. Those that were numbered will have a number in the square, others are emtpy.


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
    var pages = 2;
    var rowCount = 4;
    var rowsPerPage = Math.ceil(rowCount / pages);
    var widthRow = pageWidth - bothMargins;
    var groupsPerRow = Math.ceil(groups.length / rowCount);

    var rowHeight = (pageHeight - bothMargins - headerHeight - descHeight) / rowsPerPage;
    var xRow = edgeMargin;

    for (var pageIndex = 0; pageIndex < pages; pageIndex++) {
      if (pageIndex > 0) {
        doc.addPage();
      }

      var yRowStart = edgeMargin;
      if (pageIndex == 0) {
        yRowStart += headerHeight + descHeight;
      }

      for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        // rowIndex modulo rowsPerPage (e.g. 0 % 2 = 0; 1 % 2 = 1; 2 % 2 = 0; etc..)
        var yPageOffset = rowHeight * (rowIndex % rowsPerPage);
        var yRow = yRowStart + yPageOffset;
        var extractStart = rowIndex * groupsPerRow;
        var extractEnd = extractStart + (groupsPerRow - 1);
        var candidateGroupSlice = candidatesContainer.slice(extractStart, extractEnd);

        drawRow(xRow, yRow, widthRow, rowHeight, doc, candidateGroupSlice);
      }
    }


    // end and display the document
    var stream = doc.pipe(blobStream());
    doc.end();
    stream.on('finish', function () {
      var url = stream.toBlobURL('application/pdf');
      window.open(url);
    });
  };

  var old = function old(candidatesContainer) {

    // ===================
    // draw the party boxes containing candidates


    for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      // draw the line above the row
      var y = yTop + (rowHeight * rowIndex);
      doc
        .moveTo(edgeMargin, y)
        .lineWidth(3)
        .lineTo(A4.width - edgeMargin, y)
        .stroke();

      // draw the party boxes in the row
      var firstColIndex = rowIndex * groupsPerRow;
      var lastColIndex = (rowIndex + 1) * groupsPerRow;

      for (var colIndex = firstColIndex; colIndex < lastColIndex; colIndex++) {
        var group = groups[colIndex];
        var x = (colIndex - firstColIndex) * colWidth + edgeMargin;
        var y = yTop + (rowIndex * rowHeight);

        // draw the line
        var yEnd = y + rowHeight;
        doc
          .moveTo(x, y)
          .lineWidth(1)
          .lineTo(x, yEnd)
          .stroke();

        if (colIndex + 1 == lastColIndex) {
          doc
            .moveTo(x + colWidth, y)
            .lineWidth(1)
            .lineTo(x + colWidth, yEnd)
            .stroke();
        }

        // draw the party name
        var partyNameHeight = 35;
        var ticketId = group[0].ticket;
        var partyName = ' - ' + (group[0].party_ballot_nm ? group[0].party_ballot_nm : '');
        doc
          .fontSize(12)
          .text(ticketId, x + 1, y + 3, {width: colWidth, continued: true, height: partyNameHeight})
          .fontSize(9)
          .text(partyName);

        // draw the candidate boxes
        var yCandidateStart = +y + 3 + partyNameHeight;
        var xCandidateStart = x + 1;
        var boxSideLength = 15;
        var yTextStart = yCandidateStart + 3;
        var xTextStart = xCandidateStart + boxSideLength + 2;
        var candidateHeight = 20;

        for (var candidateIndex = 0; candidateIndex < group.length; candidateIndex++) {
          var yOffset = candidateHeight * candidateIndex;
          var xBox = xCandidateStart;
          var yBox = yCandidateStart + yOffset;
          var xText = xTextStart;
          var yText = yTextStart + yOffset;
          var candidate = group[candidateIndex];
          doc
            .rect(xBox, yBox, boxSideLength, boxSideLength)
            .stroke()
            .fontSize(11)
            .text(candidate.surname, xText, yText, {width: colWidth - boxSideLength - 3, height: candidateHeight});
        }
      }
    }
  };

  return {
    generate: function (candidatesContainer) {
      return buildDocument(candidatesContainer);
    }
  }
}]);


export default pdfModel;
