app.controller('ProjectsController', ['$http', function($http) {
  const vm = this;
  // vm.message = 'Hello from ProjectsController';

  vm.projects = [
    {
      id: 1,
      name: 'My Project',
      hours: 2
    },
    {
      id: 2,
      name: 'My Project 2',
      hours: 4
    }
  ];
  vm.addProject = function() {
    console.log('add project:', vm.newProject);
    
  };

  vm.deleteProject = function(id) {
    console.log('delete project:', id);
    
  };
}]);