import template from './nt.html';
import controller from './nt.controller';
import './nt.styl';

let ntComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default ntComponent;
