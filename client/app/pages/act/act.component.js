import template from './act.html';
import controller from './act.controller';
import './act.styl';

let actComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default actComponent;
