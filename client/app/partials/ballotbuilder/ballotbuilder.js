import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ballotbuilderComponent from './ballotbuilder.component';

let ballotbuilderModule = angular.module('ballotbuilder', [
  uiRouter
])
  .filter('filterCandidates', function () {
    return function (candidatesArray, filterString) {

      var filterStringUpper = filterString ? filterString.toUpperCase() : '';
      if (filterString) {
        return candidatesArray.filter(function (element, index, array) {

          var firstName = element.hasOwnProperty('ballot_given_nm') &&
            element.ballot_given_nm.toUpperCase().includes(filterStringUpper);
          var lastName = element.hasOwnProperty('surname') &&
            element.surname.toUpperCase().includes(filterStringUpper);
          var partyName = element.hasOwnProperty('party_ballot_nm') &&
            element.party_ballot_nm.toUpperCase().includes(filterStringUpper);
          var occupation = element.hasOwnProperty('occupation') &&
            element.occupation.toUpperCase().includes(filterStringUpper);

          return firstName || lastName || partyName || occupation;
        });
      } else {
        return candidatesArray;
      }
    };
  })
  .component('ballotbuilder', ballotbuilderComponent);

export default ballotbuilderModule;
