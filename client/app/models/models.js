import angular from 'angular';
import coreModel from './core/core.model';
import senateModel from './senate/senate.model';
import pdfModel from './pdf/pdf.model';

// ensure any new models in /client/app/models are added here
let modelModule = angular.module('app.models', [
  coreModel.name,
  senateModel.name,
  pdfModel.name
]);

export default modelModule;
