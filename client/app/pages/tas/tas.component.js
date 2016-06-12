import template from './tas.html';
import controller from './tas.controller';
import './tas.styl';

let tasComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default tasComponent;
