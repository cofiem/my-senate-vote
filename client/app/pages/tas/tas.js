import angular from 'angular';
import uiRouter from 'angular-ui-router';
import tasComponent from './tas.component';

let tasModule = angular.module('tas', [
  uiRouter
])
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('tas', {
        url: '/states/tas',
        template: '<tas></tas>'
      });
  })
  .component('tas', tasComponent);

export default tasModule;
