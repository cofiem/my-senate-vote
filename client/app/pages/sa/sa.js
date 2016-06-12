import angular from 'angular';
import uiRouter from 'angular-ui-router';
import saComponent from './sa.component';

let saModule = angular.module('sa', [
  uiRouter
])
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('sa', {
        url: '/states/sa',
        template: '<sa></sa>'
      });
  })
  .component('sa', saComponent);

export default saModule;
