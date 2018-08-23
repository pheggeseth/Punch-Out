console.log('JS');

const app = angular.module('punchout', ['ngRoute', 'ngMaterial']);

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