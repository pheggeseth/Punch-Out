app.controller('EntriesController', ['$http', function ($http) {
  const vm = this;
  // vm.hello = "Hello from EntriesController";

  // milliseconds in an hour, used for converting unix epoch times to hours
  const HOUR = 1000 * 60 * 60; 

  // add entry form object
  vm.newEntry = {
    text: '',
    project_id: null,
    entry_date: new Date(Date.now()),
    start_time: null,
    end_time: null
  };

  // list of projects used to attribute a new entry to a project
  vm.projects = [];

  // list of entries from the database
  vm.entries = [];
  
  // object for monitoring which column, if any, is sorting a table
  vm.sort = {
    column: '',
    reverse: null
  };

  // object used to hold a copy of an entry while editing it
  vm.editingEntry = {};

  // get all entries from database, along with the entry 'project_name' from the projects table
  vm.getEntries = function () {
    $http.get('/entries').then(function (response) {
        console.log('/entries GET success:', response.data);
        
        // the database returns dates as unix epoch date numbers
        // so we need to map all entries through a function
        // which converts the unix epoch numbers to JavaScript date objects,
        // which the date and time input fields need
        vm.entries = response.data.map(sanitizeEntriesFromDB);
      }).catch(function (error) {
        console.log('/entries GET error:', error);
      });
  };

  // get projects from server to show in add entry select field
  vm.getProjects = function() {
    $http.get('/projects').then(function(response) {
        console.log('/projects GET success:', response.data);
        vm.projects = response.data;
      }).catch(function (error) {
        console.log('/projects GET error:', error);
      });
  };

  // add new entry to database
  vm.addEntry = function () {
    // add appropriate date values to the start and end times, used for checking for overlapping times
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
      // clear the form
      vm.newEntry = {};
      // refresh the list of entries
      vm.getEntries();
    }).catch(function(error) {
      console.log('/entries POST error:', error);
    });
  };

  // delete an entry from the database by id
  vm.deleteEntry = function (id) {
    swal({
      title: "Are you sure?",
      text: "You cannot undo this action.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        console.log('delete entry:', id);
        const route = '/entries/' + id;
        $http.delete(route)
        .then(function(response) {
          console.log(route + ' DELETE success:', response);
          vm.getEntries();
        }).catch(function(error) {
          console.log(route + ' DELETE error:', error);
        });
      } 
    });
  };

  // assign values to the properties of the vm.sort object
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

  // update an edited entry in the database
  vm.updateEntry = function(id) {
    // add the entry_date to the start and end time from the editing inputs
    vm.editingEntry.start_time = addDateToTime(vm.editingEntry.entry_date, vm.editingEntry.start_time);
    vm.editingEntry.end_time = addDateToTime(vm.editingEntry.entry_date, vm.editingEntry.end_time);

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
  } // end updateEntry

  // checks if entry has any empty values, or if entry times overlap with existing entries
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
  } // validateEntry

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
  } // end sanitizeEntriesFromDB

  // convert dates back to unix epoch numbers for storing in db
  function sanitizeEntryForDB(entry) {
    let s = Object.assign({}, entry);
    s.start_time = s.start_time.getTime();
    s.end_time = s.end_time.getTime();
    s.entry_date = s.entry_date.getTime();
    return s;
  } // end sanitizeEntryForDB

  // used for adding the entry_date to the start and end time,
  // as time inputs create dates with the correct time but a date of 1/1/1970 (beginning of unix epoch)
  function addDateToTime(date, time) {
    time.setMonth(date.getMonth());
    time.setDate(date.getDate());
    time.setFullYear(date.getFullYear());
    return time;
  } // addDateToTime

  vm.getEntries(); // get all entries on controller load
  vm.getProjects(); // get all projects on controller load
}]);