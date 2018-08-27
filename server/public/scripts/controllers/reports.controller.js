app.controller('ReportsController', ['$http', function($http) {
  vm = this;
  // vm.message = 'Hello from ReportsController';
  vm.projects = [];
  vm.projectNames = [];
  vm.projectHours = [];
  vm.chartOptions = {
    legend: {
      labels: {
        fontColor: 'orange'
      }
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          fontColor: 'orange',
          labelString: 'Total Hours'
        },
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          fontColor: 'orange',
          labelString: 'Project'
        }
      }]
    }     
  };

  vm.getProjects = function() {
    $http.get('/projects')
      .then(function(response) {
        console.log('/projects GET success:', response.data);
        vm.projects = response.data;
        vm.projectNames = vm.projects.map(project => project.name);
        vm.projectHours = vm.projects.map(project => project.total_hours);

      }).catch(function(error) {
        console.log('/projects GET error:', error);
      });
  };

  vm.getProjects();
}]);