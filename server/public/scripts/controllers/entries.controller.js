app.controller('EntriesController', ['$http', function ($http) {
  const vm = this;
  // vm.hello = "Hello from EntriesController";
  const HOUR = 1000 * 60 * 60;

  vm.newEntry = {
    text: '',
    project_id: null,
    entry_date: null,
    start_time: null,
    end_time: null
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
        // entries include the 'project_name' as a string as well as the 'project_id'
        vm.entries = response.data.map(sanitizeEntriesFromDB);
      }).catch(function (error) {
        console.log('/entries GET error:', error);
      });
  };
  vm.getProjects = function() {
    $http.get('/projects').then(function(response) {
        console.log('/projects GET success:', response.data);
        vm.projects = response.data;
      }).catch(function (error) {
        console.log('/projects GET error:', error);
      });
  };
  vm.addEntry = function () {
    if(anyEmptyValues(vm.newEntry)) {
      showMessage('must complete all fields');
      return;
    }
    console.log('add new entry:', vm.newEntry);
    $http.post('/entries', sanitizeEntryForDB(vm.newEntry))
    .then(function(response) {
      console.log('/entries POST success:', response);
      vm.getEntries();
    }).catch(function(error) {
      console.log('/entries POST error:', error);
    });
  };
  vm.deleteEntry = function (id) {
    console.log('delete entry:', id);
    const route = '/entries/' + id;
    $http.delete(route)
    .then(function(response) {
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
      if(anyEmptyValues(vm.editingEntry)) {
        showMessage('must complete all fields');
        return;
      }
      console.log('update entry '+id);
      $http.put('/entries/' + id, sanitizeEntryForDB(vm.editingEntry))
      .then(function(response) {
        console.log(`/entries/${id} PUT success:`, response);
        vm.editingEntry = {};
        vm.getEntries();
      }).catch(function(error) {
        console.log(`/entries/${id} PUT error:`, error);
      });
    } else {
      vm.editingEntry = {};
    }
  }

  function anyEmptyValues(object) {
    return Object.values(object).some(value => !value);
  }

  function showMessage(message) {
    console.log(message);
  }

  function sanitizeEntriesFromDB(entry) {
    // convert epoch time strings to date objects
    entry.entry_date = new Date(+entry.entry_date);
    entry.start_time = new Date(+entry.start_time);
    entry.end_time = new Date(+entry.end_time);
    // add entry 'hours' getter, which computes the difference
    // between end_time and start_time in hours
    Object.defineProperty(entry, 'hours', {
      get: function() {
        return (this.end_time.getTime() - this.start_time.getTime()) / HOUR;
      }
    });
    return entry;
  }

  function sanitizeEntryForDB(entry) {
    let sanitized = Object.assign({}, entry);
    // convert dates back to unix epoch numbers for storing in db
    sanitized.entry_date = sanitized.entry_date.getTime();
    sanitized.start_time = sanitized.start_time.getTime();
    sanitized.end_time = sanitized.end_time.getTime();
    return sanitized;
  }

  vm.getEntries(); // get all entries on controller load
  vm.getProjects(); // get all projects on controller load
}]);