import angular from 'angular';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import Partials from './partials/partials';
import Pages from './pages/pages';
import Models from './models/models';
import AppComponent from './app.component';

angular.module('app', [
  uiRouter,
  uiBootstrap,
  Partials.name,
  Pages.name,
  Models.name
])
.config(($locationProvider) => {
  "ngInject";
  // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
  // #how-to-configure-your-server-to-work-with-html5mode
  $locationProvider.html5Mode(true).hashPrefix('!');
})

.component('app', AppComponent);
