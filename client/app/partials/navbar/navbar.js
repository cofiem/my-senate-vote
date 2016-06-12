import angular from 'angular';
import uiRouter from 'angular-ui-router';
import dropdown from 'angular-ui-bootstrap/src/dropdown';
import navbarComponent from './navbar.component';

let navbarModule = angular.module('navbar', [
  uiRouter,
  dropdown
])

.component('navbar', navbarComponent);

export default navbarModule;
