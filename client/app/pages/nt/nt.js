import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ntComponent from './nt.component';

let ntModule = angular.module('nt', [
  uiRouter
])
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('nt', {
        url: '/states/nt',
        template: '<nt></nt>'
      });
  })
  .component('nt', ntComponent);

export default ntModule;
