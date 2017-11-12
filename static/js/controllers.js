/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl($rootScope) {

    $rootScope.userName = localStorage.getItem('username') || 'Unknown';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

};

function loginController ($scope, $state, AuthService) {

	$scope.login = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $state.transitionTo("index.dashboard");
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

	};

};

function registerController ($scope, $state, AuthService) {

	$scope.register = function () {
      // initial values
      $scope.error = false;
      $scope.disabled = true;
      // call login from service
      
      AuthService.register($scope.registerForm)
        // handle success
        .then(function () {
          $state.transitionTo("login");
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });
	};
};

function dashboardController($scope, $state, AuthService) {
    $scope.users = [];
    $scope.getUsers = function () {
      AuthService.getAllusers()
        .then(function (users) {
          $scope.users.length = 0;
          $scope.users = users;
          angular.forEach(users, function(val) {
            var item = {};

            item["value"] = val.id;
            item["name"] = val.username;
            $scope.data.availableOptions.push(item);
          });

        });
    };
    $scope.groups = [];
    $scope.getGroups = function () {
      AuthService.getAllgroups()
        .then(function (groups){
          $scope.groups.length = 0;
          $scope.groups = groups;
        });
    };
    $scope.addGroup = function (data) {
      var item = {}
      if (data.name) {
        item["name"] = data.name;

      } else {
        return;
      }
      item["user_set"] = []
      if (data.model) {
        angular.forEach(data.model, function(val) {
          item["user_set"].push(val);
        });
      }
      AuthService.addGroup(item)
        .then(function (data){
          $scope.groups.push(data);
          $scope.data.model = null;
          $scope.data.name = "";  
        })
        .catch(function (data){
          $scope.data.model = null;
          $scope.data.name = "";
        });
    };    
    $scope.getGroups();
    $scope.getUsers(); 
    $scope.data = {
      model: null,
      availableOptions: [
      ]
    };
};
function logoutController($scope, $state, $window) {
  $scope.logout = function() {
    $window.localStorage.clear();
    $state.transitionTo("login");
  };
};


angular
    .module('inspinia')
    .controller('MainCtrl', ['$rootScope', MainCtrl])
    .controller('loginController', ['$scope', '$state', 'AuthService', loginController])
    .controller('logoutController', ['$scope', '$state', '$window', logoutController])
    .controller('registerController', ['$scope', '$state', 'AuthService', registerController])
    .controller('dashboardController', ['$scope', '$state', 'AuthService', dashboardController]);