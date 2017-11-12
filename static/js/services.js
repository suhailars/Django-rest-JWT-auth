var my_app = angular.module('inspinia');
my_app.factory('AuthService',
  ['$q', '$timeout', '$http', '$window', 'jwtHelper', '$rootScope',
  function ($q, $timeout, $http, $window, jwtHelper, $rootScope) {
    return {
      login: login,
      register: register,
      getAllusers: getAllusers,
      getAllgroups: getAllgroups,
      addGroup: addGroup
    };

  function login(username, password) {
    var deferred = $q.defer();

    $http.post('/account/login/', {username: username, password: password})
      // handle success
      .success(function (data, status) {
        var username = data.username || "unknown";
        
        if (data.token) {
          payload = jwtHelper.decodeToken(data.token);
          $rootScope.userName = payload.username;
          localStorage.setItem('username', payload.username);

          $window.localStorage.token = data.token;
          $window.localStorage.refresh_token = data.refresh_token;

          // add jwt token to auth header for all requests made by the $http service
          //$http.defaults.headers.common.Authorization = 'Bearer ' + data.token;
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      .error(function (data) {
        deferred.reject();
      });
    return deferred.promise;
  }

  function register(data) {
    var deferred = $q.defer();

    $http.post('/account/register/', data)
      // handle success
      .success(function (data, status) {
        var username = data.username || "unknown";
        if (data) {
          //$window.localStorage.currentUser = { username: username, token: data.token };
          // add jwt token to auth header for all requests made by the $http service
          //$http.defaults.headers.common.Authorization = 'Bearer ' + data.token;
          deferred.resolve();
        } else {
          deferred.reject();
        }
      })
      .error(function (data) {
        deferred.reject();
      });
    return deferred.promise;
  }

  function getAllusers() {
    var deferred = $q.defer();

    $http.get('/account/register/')
      .success(function (data) {
        if (data) {
          deferred.resolve(data)
        } else {
          deferred.reject();
        }
      })
      .error(function (data) {
        deferred.reject();
      });
    return deferred.promise;

    };

  function getAllgroups() {
    var deferred = $q.defer();

    $http.get('/account/group/')
      .success(function (data) {
        if (data) {
          deferred.resolve(data)
        } else {
          deferred.reject();
        }
      })
      .error(function (data) {
        deferred.reject();
      });
    return deferred.promise;

    };

  function addGroup(data) {
    var deferred = $q.defer();

    $http.post('/account/group/', data)
      // handle success
      .success(function (data, status) {
        var username = data.username || "unknown";
        if (data) {
          deferred.resolve(data);
        } else {
          deferred.reject();
        }
      })
      .error(function (data) {
        deferred.reject();
      });
    return deferred.promise;
  }


  
}]);