import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ballotlayoutComponent from './ballotlayout.component';

let ballotlayoutModule = angular.module('ballotlayout', [
  uiRouter
])

.component('ballotlayout', ballotlayoutComponent);

export default ballotlayoutModule;
