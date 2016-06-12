import template from './qld.html';
import controller from './qld.controller';
import './qld.styl';

let qldComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default qldComponent;
