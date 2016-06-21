class BallotbuilderController {
  constructor(senateData, $uibModal, $log, $localStorage, pdfGenerate) {
    this.name = 'ballotbuilder';

    this.senateData = senateData;
    this.$uibModal = $uibModal;
    this.$log = $log;
    this.$storage = $localStorage;
    this.pdfGenerate = pdfGenerate;

    // init storage for this state/territory's candidate numbers
    // stores an object in $storage.stateTerrName that is { ballot Id (group id + ticket num): enteredNumber }
    var stateTerrName = this.electionState.toUpperCase();
    this.$storage[stateTerrName] = this.$storage[stateTerrName] || {};
    this.stateBallotStorage = this.$storage[stateTerrName];

    this.candidateFilter = null;
    this.candidateOrder = [];
    this.stateCandidatesOnly = this.stateData();
    this.stateCandidatesCount = this.stateCandidatesOnly.length;
    this.mostRecentEnteredNumber = '?';
    this.totalEnteredNumbers = 0;
    this.enteredNumbers = [];
    this.ballotErrors = [];

    // update counts and info
    this.updateEnteredNumbersCount();
    this.checkBallotEnteredNumbers();
  }

  stateData() {
    var electionStateUpperCase = this.electionState.toUpperCase();
    var filteredData = this.senateData.filter(function (element, index, array) {
      var matchResult = element.state_ab == electionStateUpperCase;
      //console.log('stateData', matchResult, element.state_ab, electionStateUpperCase);

      if (matchResult) {
        element.custom_id = this.buildId(element);

        // load any existing enteredNumber
        var existingValue = this.stateBallotStorage[element.custom_id];
        if (existingValue) {
          element.enteredNumber = existingValue;
        }
      }

      return matchResult;
    }, this);

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

    // all the checks only work if the entered numbers are sorted
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

    // must be unique numbers
    var unique = this.enteredNumbers.reduce(function (prevValue, currentValue, currentIndex, array) {
      if (array.indexOf(currentValue) !== currentIndex && !prevValue.includes(currentValue)) {
        prevValue.push(currentValue);
      }
      return prevValue;
    }, []);

    if (unique.length > 0) {
      this.ballotErrors.push("A number, or more than one number, is used more than once. Check for these numbers: " + unique.join(', '));
    }

    // must be consecutive
    var uniqueForConsecutiveCheck = this.enteredNumbers.filter(function (item, i, ar) {
      return ar.indexOf(item) === i;
    });
    var consecutive = uniqueForConsecutiveCheck.reduce(function (prevValue, currentValue, index) {
      // ignore 0
      if (currentValue < 1) {
        return prevValue;
      }

      // the current value must match index + 1 to be consecutive, as enteredNumbers is sorted
      var check = currentValue === (index + 1);

      if (!check) {
        var expectedSeenFirst = 0;
        var seenLast = prevValue.seen.length < 1 ? expectedSeenFirst : prevValue.seen[prevValue.seen.length - 1];

        for (var missingNumber = seenLast + 1; missingNumber < currentValue; missingNumber++) {

          if (!prevValue.missing.includes(missingNumber)) {
            prevValue.missing.push(missingNumber);
          }
        }
      }

      prevValue.seen.push(currentValue);

      return prevValue;
    }, {seen: [], missing: []});

    if (consecutive.missing.length > 0) {
      this.ballotErrors.push("A number is missing. Number boxes consecutively (e.g. 1, 2, 3, ... ). Check for these numbers: " + consecutive.missing.join(', '));
    }

    // must include at least the numbers 1 - 12
    var requiredNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var required = requiredNumbers.reduce(function (previousValue, currentValue) {
      if (!previousValue.entered.includes(currentValue)) {
        previousValue.missing.push(currentValue);
      }
      return previousValue;
    }, {missing: [], entered: this.enteredNumbers});
    if (required.missing.length > 0) {
      this.ballotErrors.push("The Australian Electoral Commission's instructions for voting below the line " +
        "are to number at least 12 boxes, starting with 1, in the order of your choice. " +
        "Check for these numbers: " + required.missing.join(', '));
    }

    this.$log.debug('ballot errors', this.ballotErrors);

    return this.ballotErrors;
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
    this.checkBallotEnteredNumbers();
    this.pdfGenerate.generate(this.stateCandidatesOnly, this.ballotErrors && this.ballotErrors.length > 0);
  }

  updateEnteredNumbersCount() {
    this.totalEnteredNumbers = this.stateCandidatesOnly.reduce(function (previousValue, currentValue, currentIndex, array) {
      if (currentValue.enteredNumber) {
        return previousValue + 1;
      } else {
        return previousValue;
      }
    }, 0);
  }

  ballotNumberChange(candidate) {
    var enteredNumber = candidate.enteredNumber;
    if (enteredNumber) {
      this.mostRecentEnteredNumber = enteredNumber;
    } else {
      this.mostRecentEnteredNumber = '?';
    }

    this.updateEnteredNumbersCount();

    // update stored entries
    var ballotId = this.buildId(candidate);
    if (enteredNumber) {
      this.stateBallotStorage[ballotId] = enteredNumber;
    } else {
      delete this.stateBallotStorage[ballotId];
    }

    this.$log.debug('current local storage content after number change', this.$storage);
  }

  clearEnteredNumbers() {
    var candidatesCount = this.stateCandidatesOnly.length;
    for (var i = 0, c = candidatesCount; i < c; i++) {
      var candidate = this.stateCandidatesOnly[i];
      candidate.enteredNumber = null;
    }

    this.mostRecentEnteredNumber = '?';
    this.totalEnteredNumbers = 0;

    // clear the local storage
    for (var key in this.stateBallotStorage) {
      if (this.stateBallotStorage.hasOwnProperty(key)) {
        delete this.stateBallotStorage[key];
      }
    }

    this.$log.debug('current local storage content after clearing all', this.$storage);
  }

}

BallotbuilderController.$inject = ['senateData', '$uibModal', '$log', '$localStorage', 'pdfGenerate'];

export default BallotbuilderController;
