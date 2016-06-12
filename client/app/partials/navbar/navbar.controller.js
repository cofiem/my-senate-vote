class NavbarController {
  constructor($state, projectInfo) {
    this.name = 'navbar';
    this.isCollapsed = true;
    this.$state = $state;
    this.projectInfo = projectInfo;
  }
}

NavbarController.$inject = ['$state', 'projectInfo'];

export default NavbarController;
