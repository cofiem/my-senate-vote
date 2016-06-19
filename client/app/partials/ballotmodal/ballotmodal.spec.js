import BallotmodalModule from './ballotmodal'
import BallotmodalController from './ballotmodal.controller';
import BallotmodalComponent from './ballotmodal.component';
import BallotmodalTemplate from './ballotmodal.html';

describe('Ballotmodal', () => {
  let $rootScope, makeController;

  beforeEach(window.module(BallotmodalModule.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new BallotmodalController();
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      let controller = makeController();
      expect(controller).to.have.property('name');
    });
  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has name in template [REMOVE]', () => {
      expect(BallotmodalTemplate).to.match(/{{\s?vm\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = BallotmodalComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(BallotmodalTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(BallotmodalController);
      });
  });
});
