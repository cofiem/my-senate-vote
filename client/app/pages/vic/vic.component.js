import template from './vic.html';
import controller from './vic.controller';
import './vic.styl';

let vicComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default vicComponent;
