app.controller('EntriesController', ['$http', function($http) {
  const vm = this;
  vm.hello = "Hello from EntriesController";
  vm.date;
  vm.hours = Array(12).fill('').map((e, i) => e + (i+1));
  vm.minutes = ['00','15','30','45'];
  vm.ampm = ['AM', 'PM'];
}]);