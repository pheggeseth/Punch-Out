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

  vm.entries = [{
      id: 1,
      text: 'first entry',
      project: 'project 1',
      date: '8/8/18',
      hours: 2
    },
    {
      id: 2,
      text: 'second entry',
      project: 'project 2',
      date: '9/9/19',
      hours: 4
    }
  ];

  vm.projects = [{
    id: 1,
    name: 'My Project'
  }];
  vm.getEntries = function () {
    $http.get('/entries')
      .then(function (response) {
        console.log('/entries GET success:', response.data);
        vm.entries = response.data;
        // date from server is formatted as 'MM/DD/YY',
        // entries also include the 'project_name' as well as the difference between 'start_time' and 'end_time' in 'hours'
      }).catch(function (error) {
        console.log('/entries GET error:', error);
      });
  };
  vm.addEntry = function () {
    console.log('add new entry:', vm.newEntry);

  };
  vm.deleteEntry = function (id) {
    console.log('delete entry:', id);
  };

  vm.getEntries(); // get all entries on controller load
}]);