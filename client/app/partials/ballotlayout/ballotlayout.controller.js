class BallotlayoutController {
  constructor(stateNames) {
    this.name = 'ballotlayout';
    this.candidateFilterValue = '';
    this.stateNames = stateNames;
  }
}

BallotlayoutController.$inject = ['stateNames'];

export default BallotlayoutController;
