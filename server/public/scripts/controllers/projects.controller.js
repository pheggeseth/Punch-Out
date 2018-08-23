app.controller('ProjectsController', ['$http', function($http) {
  const vm = this;
  // vm.message = 'Hello from ProjectsController';

  vm.projects = [];

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
        vm.projects.push(Object.assign({}, vm.newProject));
        vm.newProject.name = '';
      })
      .catch(function(error) {
        console.log('/projects POST error:', error);
      });
  };

  vm.deleteProject = function(id) {
    console.log('delete project:', id);
    const route = '/projects/' + id;
    $http.delete(route).then(function(response) {
      console.log(route + ' DELETE success:', response);
      vm.getProjects();
    }).catch(function(error) {
      console.log(route + ' DELETE error:', error);
    });
  };

  vm.getProjects();
}]);