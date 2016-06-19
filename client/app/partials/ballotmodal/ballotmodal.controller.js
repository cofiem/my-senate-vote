/*
class BallotmodalController {
  constructor($uibModal, $log) {
    this.name = 'ballotmodal';
    this.$uibModal = $uibModal;
    this.log = $log;

    this.errors = [];
    // see https://github.com/angular-ui/bootstrap/issues/5683
    this.modalInstance = null;

    this.$onChanges = this.onChanges;

    this.log.debug(this.$dismiss);
    this.log.debug(this.$close);
  }

  onChanges(changesObj) {
    // The changesObj is a hash whose keys are the names of the bound properties that have changed, and the values are
    // an object of the form { currentValue, previousValue, isFirstChange() }. Use this hook to trigger updates within
    // a component such as cloning the bound value to prevent accidental mutation of the outer value.
    this.log.debug(changesObj);
  }

  closeModal() {
    this.close();
    this.onClose();
  }

  openModal(){
    this.modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'ballotmodal.html',
      controller:  function() {
        this.errors =
      },
      controllerAs: '$ctrl'
    });


  }

}

BallotmodalController.$inject = ['$uibModal', '$log'];

export default BallotmodalController;
*/
