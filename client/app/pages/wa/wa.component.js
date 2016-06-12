import template from './wa.html';
import controller from './wa.controller';
import './wa.styl';

let waComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default waComponent;
