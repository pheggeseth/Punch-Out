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
    vm.newEntry.start_time = addDateToTime(vm.newEntry.entry_date, vm.newEntry.start_time);
    vm.newEntry.end_time = addDateToTime(vm.newEntry.entry_date, vm.newEntry.end_time);

    let error = validateEntry(vm.newEntry);
    if (error) {
      showMessage(error);
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
      let error = validateEntry(vm.editingEntry);
      if (error) {
        showMessage(error);
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

  function validateEntry(entry) {
    if (anyEmptyValues(entry)) {
      return 'must complete all fields';
    } else if (entry.start_time >= entry.end_time || entry.end_time < entry.start_time) {
      return 'entry times must be valid';
    } else if (entryTimesOverlap(entry)) {
      return 'entry must not overlap with existing entries';
    } else {
      return null;
    }
  }

  function anyEmptyValues(object) {
    return Object.values(object).some(value => !value);
  }

  function entryTimesOverlap(entry) {
    for (let e of vm.entries) {
      if (entry.id !== e.id && entry.start_time < e.end_time && entry.end_time > e.start_time) {
        return true;
      }
    }
    return false;
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
    let s = Object.assign({}, entry);
    // convert dates back to unix epoch numbers for storing in db
    // first add the entry_date to the start and end times
    s.start_time = addDateToTime(s.entry_date, s.start_time).getTime();
    s.end_time = addDateToTime(s.entry_date, s.end_time).getTime();
    s.entry_date = s.entry_date.getTime();
    return s;
  }

  function addDateToTime(date, time) {
    time.setUTCMonth(date.getUTCMonth());
    time.setUTCDate(date.getUTCDate());
    time.setUTCFullYear(date.getUTCFullYear());
    return time;
  }

  vm.getEntries(); // get all entries on controller load
  vm.getProjects(); // get all projects on controller load
}]);