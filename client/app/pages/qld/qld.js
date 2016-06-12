import angular from 'angular';
import uiRouter from 'angular-ui-router';
import qldComponent from './qld.component';

let qldModule = angular.module('qld', [
  uiRouter
])
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('qld', {
        url: '/states/qld',
        template: '<qld></qld>'
      });
  })
  .component('qld', qldComponent);

export default qldModule;
