class BallotbuilderController {
  constructor(senateData) {
    this.name = 'ballotbuilder';
    this.senateData = senateData;
    this.candidateFilter = null;
    this.candidateOrder = [];
    this.stateCandidatesOnly = this.stateData();
    this.stateCandidatesCount = this.stateCandidatesOnly.length;
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
}

BallotbuilderController.$inject = ['senateData'];

export default BallotbuilderController;
