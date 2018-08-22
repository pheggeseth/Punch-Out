console.log('JS');

const app = angular.module('punchout', ['ngRoute', 'ngMaterial']);

app.config(function($routeProvider) {
  $routeProvider.when('/entries', {
    templateUrl: 'views/entries.html',
    controller: 'EntriesController as vm'
  }).otherwise('/entries');
});