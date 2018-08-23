app.controller('ProjectsController', ['$http', function($http) {
  const vm = this;
  // vm.message = 'Hello from ProjectsController';

  vm.projects = [];
  vm.editingProject = {};
  vm.sort = {
    column: '',
    reverse: null
  };

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
        vm.getProjects();
        vm.newProject.name = '';
      }).catch(function(error) {
        console.log('/projects POST error:', error);
      });
  };

  vm.editProject = function(index) {
    vm.editingProject = Object.assign({}, vm.projects[index]);
  }

  vm.updateProject = function(index) {
    if (vm.editingProject.name !== undefined) {
      $http.put(`/projects/${vm.editingProject.id}`, vm.editingProject)
      .then(function(response) {
        console.log(`/projects/${vm.editingProject.id} PUT success:`, response);
        vm.projects[index] = vm.editingProject;
        vm.editingProject = {};
        // vm.getProjects();
      }).catch(function(error) {
        console.log(`/projects/${vm.editingProject.id} PUT error:`, error);
      });
    }
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

  vm.sortProjects = function(property) {
    if (vm.sort.reverse === null || vm.sort.column !== property) {
      vm.sort.reverse = false;
    } else {
      vm.sort.reverse = !vm.sort.reverse;
    }
    vm.sort.column = property;
  };

  vm.getProjects();
}]);