import angular from 'angular';
import uiRouter from 'angular-ui-router';
import nswComponent from './nsw.component';

let nswModule = angular.module('nsw', [
  uiRouter
])
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('nsw', {
        url: '/states/nsw',
        template: '<nsw></nsw>'
      });
  })
  .component('nsw', nswComponent);

export default nswModule;
