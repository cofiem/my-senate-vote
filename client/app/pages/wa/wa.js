import angular from 'angular';
import uiRouter from 'angular-ui-router';
import waComponent from './wa.component';

let waModule = angular.module('wa', [
  uiRouter
])
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('wa', {
        url: '/states/wa',
        template: '<wa></wa>'
      });
  })
  .component('wa', waComponent);

export default waModule;
