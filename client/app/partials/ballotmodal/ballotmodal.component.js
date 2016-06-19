import template from './ballotmodal.html';
//import controller from './ballotmodal.controller';
import './ballotmodal.styl';

let ballotmodalComponent = {
  restrict: 'E',
  bindings: {
    title: "@",
    component: "@",
    errors: '&'
  },
  transclude: true,
  template: '<button type="button" class="btn btn-default" ng-click="$ctrl.open()" ng-transclude>Check my ballot paper</button>',
  controller: ['$uibModal', function ($uibModal) {
    var title = this.title;
    var subErrorCalulateFunction = this.errors;
    /*
     var errorTemplate = [
     '<div class="modal-header">',
     '  <button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="$dismiss()">',
     '    <span aria-hidden="true">&times;</span>',
     '  </button>',
     '  <h4 class="modal-title">' + title + '</h4>',
     '</div>',
     '<div class="modal-body" style="overflow: auto;">'
     ];

     if (errors.length < 1) {

     errorTemplate.push('<div class="alert alert-success" role="alert">');
     errorTemplate.push('  <i class="fa fa-check"></i>');
     errorTemplate.push('  Your vote is valid.');
     errorTemplate.push('</div>');

     } else {
     for (var i = 0; i < errors.length; i++) {
     errorTemplate.push('<div class="alert alert-danger" role="alert">');
     errorTemplate.push('  <i class="fa fa-times"></i>');
     errorTemplate.push(errors[i]);
     errorTemplate.push('</div>');
     }
     }

     errorTemplate.push('</div>');
     errorTemplate.push('<div class="modal-footer">');
     errorTemplate.push('  <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="$close()">Close</button>');
     errorTemplate.push('</div>');
     */
    // TODO: just generate the elements for the errors manually


    this.open = () => {

      var subErrors = subErrorCalulateFunction();

      $uibModal.open({
        template: template,
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance, errors) {
          $scope.errors = errors;
        }],
        backdrop: 'static',
        controllerAs: 'vm',
        keyboard: true,
        size: 'l',
        resolve: {
          errors: function () {
            return subErrors;
          }
        }
      });
    }
  }]
};

export default ballotmodalComponent;
