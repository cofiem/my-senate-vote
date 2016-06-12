import angular from 'angular';

var coreModel = angular.module('app.models.core', []);

coreModel
  .value("projectInfo", {
    "longName": "My Senate Vote",
    "shortName": "My Senate Vote",
    "description": "Prepare your below the line senate vote before the 2016 Australian federal election.",
    "tagLine": "Know your senate"
  })
  .value("stateNames", {
    "act": "Australian Capital Territory",
    "nsw": "New South Wales",
    "nt": "Northern Territory",
    "qld": "Queensland",
    "sa": "South Australia",
    "tas": "Tasmania",
    "vic": "Victoria",
    "wa": "Western Australia"
  });

export default coreModel;

