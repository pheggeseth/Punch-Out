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

  vm.getProjects = function() {
    $http.get('/projects')
      .then(function(response) {
        console.log('/projects GET success:', response.data);
        vm.projects = response.data;
      })
      .catch(function(error) {
        console.log('/projects GET error:', error);
        
      });
  };
  vm.addProject = function() {
    console.log('add project:', vm.newProject);
    $http.post('/projects', vm.newProject)
      .then(function(response) {
        console.log('/projects POST success:', response);
      })
      .catch(function(error) {
        console.log('/projects POST error:', error);
      });
  };

  vm.deleteProject = function(id) {
    console.log('delete project:', id);
    
  };

  vm.getProjects();
}]);