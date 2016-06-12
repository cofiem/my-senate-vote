import angular from 'angular';
import uiRouter from 'angular-ui-router';
import vicComponent from './vic.component';

let vicModule = angular.module('vic', [
  uiRouter
])
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('vic', {
        url: '/states/vic',
        template: '<vic></vic>'
      });
  })
  .component('vic', vicComponent);

export default vicModule;
