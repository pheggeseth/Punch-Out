app.controller('EntriesController', ['$http', function ($http) {
  const vm = this;
  // vm.hello = "Hello from EntriesController";

  vm.newEntry = {
    text: '',
    project_id: null,
    entry_date: '',
    start_time: '',
    end_time: ''
  };
  vm.entries = [];
  vm.sort = {
    column: '',
    reverse: null
  };
  vm.editingEntry = {};

  vm.projects = [];
  vm.getEntries = function () {
    $http.get('/entries').then(function (response) {
        console.log('/entries GET success:', response.data);
        // date from server is formatted as 'MM/DD/YY',
        // entries also include the 'project_name' as well as the difference between 'start_time' and 'end_time' in 'hours'
        vm.entries = response.data.map(entry => {          
          entry.entry_date = new Date(entry.entry_date);
          return entry;
        });
        
      }).catch(function (error) {
        console.log('/entries GET error:', error);
      });
  };
  vm.getProjects = function() {
    $http.get('/projects').then(function(response) {
        console.log('/projects GET success:', response.data);
        vm.projects = response.data;
      }).catch(function (error) {
        console.log('/entries GET error:', error);
      });
  };
  vm.addEntry = function () {
    console.log('add new entry:', vm.newEntry);
    $http.post('/entries', vm.newEntry).then(function(response) {
      console.log('/entries POST success:', response);
      vm.getEntries();
    }).catch(function(error) {
      console.log('/entries POST error:', error);
    });
  };
  vm.deleteEntry = function (id) {
    console.log('delete entry:', id);
    const route = '/entries/' + id;
    $http.delete(route).then(function(response) {
      console.log(route + ' DELETE success:', response);
      vm.getEntries();
    }).catch(function(error) {
      console.log(route + ' DELETE error:', error);
    });
  };

  vm.sortEntries = function(property) {
    if (vm.sort.reverse === null || vm.sort.column !== property) {
      vm.sort.reverse = false;
    } else {
      vm.sort.reverse = !vm.sort.reverse;
    }
    vm.sort.column = property;
  };

  vm.editEntry = function(index) {
    vm.editingEntry = Object.assign({}, vm.entries[index]);
  }

  vm.updateEntry = function(id) {
    if (id) {
      console.log('update entry '+id);
      $http.put('/entries/' + id, vm.editingEntry)
        .then(function(response) {
          console.log(`/entries/${id} PUT success:`, response);
          vm.getEntries();
          vm.editingEntry = {};
        }).catch(function(error) {
          console.log(`/entries/${id} PUT error:`, error);
        });
    } else {
      vm.editingEntry = {};
    }
  }

  vm.getEntries(); // get all entries on controller load
  vm.getProjects(); // get all projects on controller load
}]);