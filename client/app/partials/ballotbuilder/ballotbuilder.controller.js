class BallotbuilderController {
  constructor(senateData, $uibModal) {
    this.name = 'ballotbuilder';
    this.senateData = senateData;
    this.candidateFilter = null;
    this.candidateOrder = [];
    this.stateCandidatesOnly = this.stateData();
    this.stateCandidatesCount = this.stateCandidatesOnly.length;
    this.mostRecentEnteredNumber = '?';
    this.totalEnteredNumbers = 0;
    this.enteredNumbers = [];
    this.ballotErrors = [];
    this.showModal = false;
    this.$uibModal = $uibModal;
  }

  stateData() {
    var electionStateUpperCase = this.electionState.toUpperCase();
    var filteredData = this.senateData.filter(function (element, index, array) {
      var matchResult = element.state_ab == electionStateUpperCase;
      //console.log('stateData', matchResult, element.state_ab, electionStateUpperCase);
      return matchResult;
    });

    return filteredData;
  }

  buildId(candidateData) {
    return candidateData.state_ab + candidateData.ticket + candidateData.ballot_position;
  }

  checkBallotEnteredNumbers() {
    // You can vote below the line by numbering at least 12 boxes consecutively in the order of your choice (with number 1 as your first choice).

    this.enteredNumbers = [];
    this.ballotErrors = [];

    var candidatesCount = this.stateCandidatesOnly.length;
    for (var i = 0, c = candidatesCount; i < c; i++) {
      var candidate = this.stateCandidatesOnly[i];
      var enteredNumber = Number.parseInt(candidate.enteredNumber, 10);
      if (Number.isInteger(enteredNumber)) {
        this.enteredNumbers.push(enteredNumber);
      }
    }

    this.enteredNumbers = this.enteredNumbers.sort(function (a, b) {
      return a - b;
    });

    // bounds
    var minBound = 1;
    var withinBounds = this.enteredNumbers.every(function (currentValue, index, array) {
      return currentValue >= minBound && currentValue <= candidatesCount;
    });

    if (!withinBounds) {
      this.ballotErrors.push("A number is less than 1 or more than " + candidatesCount + ".");
    }

    // unique
    var unique = this.enteredNumbers.every(function (currentValue, index, array) {
      return array.indexOf(currentValue) === index;
    });

    if (!unique) {
      this.ballotErrors.push("A number is used more than once.");
    }

    // must be consecutive and must include at least the numbers 1 - 12
    var consecutive = this.enteredNumbers.every(function (currentValue, index, array) {
      return currentValue === (index + 1);
    });

    if (!consecutive || this.enteredNumbers.length < 12) {
      this.ballotErrors.push("A number is missing. Number at least 12 boxes consecutively, starting with 1, in the order of your choice.");
    }

    this.showModal = true;
  }

  buildObjEnteredNumbers() {
    var obj = {};
    var candidatesCount = this.stateCandidatesOnly.length;

    for (var i = 0, c = candidatesCount; i < c; i++) {
      var candidate = this.stateCandidatesOnly[i];
      var candidateId = candidate.state_ab.concat(candidate.ticket, candidate.ballot_position);
      obj[candidateId] = candidate.enteredNumber;
    }

    return obj;
  }

  createPdf() {

  }

  ballotNumberChange(enteredNumber) {
    if (enteredNumber) {
      this.mostRecentEnteredNumber = enteredNumber;
    } else {
      this.mostRecentEnteredNumber = '?';
    }

    this.totalEnteredNumbers = this.stateCandidatesOnly.reduce(function (previousValue, currentValue, currentIndex, array) {
      if (currentValue.enteredNumber) {
        return previousValue + 1;
      } else {
        return previousValue;
      }
    }, 0);
  }

  clearEnteredNumbers() {
    var candidatesCount = this.stateCandidatesOnly.length;
    for (var i = 0, c = candidatesCount; i < c; i++) {
      var candidate = this.stateCandidatesOnly[i];
      candidate.enteredNumber = null;
    }

    this.mostRecentEnteredNumber = '?';
    this.totalEnteredNumbers = 0;
  }

  modalClosed(){
    this.showModal = false;
  }

}

BallotbuilderController.$inject = ['senateData', '$uibModal'];

export default BallotbuilderController;
