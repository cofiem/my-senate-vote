import template from './ballotlayout.html';
import controller from './ballotlayout.controller';
import './ballotlayout.styl';

let ballotlayoutComponent = {
  restrict: 'E',
  bindings: {
    stateName: '<'
  },
  template,
  controller,
  controllerAs: 'vm'
};

export default ballotlayoutComponent;
