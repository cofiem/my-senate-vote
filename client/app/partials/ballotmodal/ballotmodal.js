import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ballotmodalComponent from './ballotmodal.component';

let ballotmodalModule = angular.module('ballotmodal', [
  uiRouter
])

.component('ballotmodal', ballotmodalComponent);

export default ballotmodalModule;
