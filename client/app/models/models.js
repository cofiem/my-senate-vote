import angular from 'angular';
import coreModel from './core/core.model';
import senateModel from './senate/senate.model';

// ensure any new models in /client/app/models are added here
let modelModule = angular.module('app.models', [
  coreModel.name,
  senateModel.name
]);

export default modelModule;
