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
  
    // delete all entries for this project first
    const entriesRoute = '/entries/project/'+id;
    $http.delete(entriesRoute).then(function(response) {
      console.log(`Deleted all entries for project id: ${id}. Deleting project.`);
      
      // if entries delete is successful, delete the project
      const projectRoute = '/projects/' + id;
      $http.delete(projectRoute).then(function(response) {
        console.log(projectRoute + ' DELETE success:', response);
        vm.getProjects();
      }).catch(function(error) {
        console.log(projectRoute + ' DELETE error:', error);
      });

    }).catch(function(error) {
      console.log(`Error deleting entries for project id ${id}. Could not delete project:`, error);
    });
  };

  vm.getProjects();
}]);