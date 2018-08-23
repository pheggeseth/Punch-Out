app.controller('EntriesController', ['$http', function($http) {
  const vm = this;
  //vm.hello = "Hello from EntriesController";

  vm.newEntry = {
    text: '',
    project_id: null,
    entry_date: '',
    start_time: '',
    end_time: ''
  };

  vm.projects = [
    {
      id: 1,
      name: 'My Project'
    }
  ];

  vm.addEntry = function() {
    console.log('add new entry:', vm.newEntry);
    
  }
}]);