import template from './sa.html';
import controller from './sa.controller';
import './sa.styl';

let saComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default saComponent;
