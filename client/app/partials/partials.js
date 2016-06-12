import angular from 'angular';
import Navbar from './navbar/navbar';
import Ballotbuilder from './ballotbuilder/ballotbuilder';
import Ballotlayout from './ballotlayout/ballotlayout';

// ensure any new partials in /client/app/partials are added here
let partialModule = angular.module('app.partials', [
  Navbar.name,
  Ballotbuilder.name,
  Ballotlayout.name
]);

export default partialModule;
