import template from './ballotmodal.html';
import controller from './ballotmodal.controller';
import './ballotmodal.styl';

let ballotmodalComponent = {
  restrict: 'E',
  bindings: {
    showModal: '<',
    errors: '<',
    onClose: '&'
  },
  template,
  controller,
  controllerAs: 'vm'
};

export default ballotmodalComponent;
