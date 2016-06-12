import template from './ballotbuilder.html';
import controller from './ballotbuilder.controller';
import './ballotbuilder.styl';

let ballotbuilderComponent = {
  restrict: 'E',
  bindings: {
    electionState: '@',
    candidateFilter: '<'
  },
  template,
  controller,
  controllerAs: 'vm'
};

export default ballotbuilderComponent;
