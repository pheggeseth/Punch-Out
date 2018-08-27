console.log('JS');

const app = angular.module('punchout', ['ngRoute', 'chart.js'/*, 'ngMaterial'*/]);

app.config(function($routeProvider) {
  $routeProvider.when('/entries', {
      templateUrl: 'views/entries.html',
      controller: 'EntriesController as vm'
  }).when('/projects', {
    templateUrl: 'views/projects.html',
    controller: 'ProjectsController as vm'
  }).when('/reports', {
    templateUrl: 'views/reports.html',
    controller: 'ReportsController as vm'
  }).otherwise('/entries');
});

app.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    chartColors: ['#FF5252', '#FF8A80'],
    responsive: false
  });
}]);

function showMessage(message) {
  console.log(message);
  swal("Warning!", message, "warning");
} // end entryTimesOverlap