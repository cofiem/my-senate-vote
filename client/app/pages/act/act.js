import angular from 'angular';
import uiRouter from 'angular-ui-router';
import actComponent from './act.component';

let actModule = angular.module('act', [
  uiRouter
])
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('act', {
        url: '/states/act',
        template: '<act></act>'
      });
  })
  .component('act', actComponent);

export default actModule;
