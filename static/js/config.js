/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, jwtInterceptorProvider, $httpProvider) {
    jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http) {
        var jwt = localStorage.getItem('token');
        var refresh_token = localStorage.getItem('refresh_token');

        if (jwt && jwtHelper.isTokenExpired(jwt)) {
            return $http({
                url: 'token-refresh/',
                // This will not send the JWT for this call
                skipAuthorization: true,
                method: 'POST',
                data: {
                    refresh_token: refresh_token,
                    client_id: 'account'
                }
            }).then(function(response) {
                if (response.status === 200) { 
                    var new_jwt = response.data.token;
                    localStorage.setItem('token', new_jwt);
                    localStorage.setItem('refresh_token', response.data.refresh_token);
                    return new_jwt;
                } else {
                    localStorage.clear();
                    return jwt
                }
            });

        } else {
            return jwt
        }
    }
    $httpProvider.interceptors.push('jwtInterceptor');
    $urlRouterProvider.otherwise("/index/dashboard");
    var static_url = "/static/";
    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            authenticate: false,
            templateUrl: static_url + "views/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            authenticate: true,
            templateUrl: static_url + "views/main.html",
            data: { pageTitle: 'Example view' }
        })
        .state('index.minor', {
            url: "/minor",
            authenticate: false,
            templateUrl: static_url + "views/minor.html",
            data: { pageTitle: 'Example view' }
        })
        .state('login', {
            url: "/login",
            authenticate: false,
            controller: 'loginController',
            templateUrl: static_url + "views/login.html",
            data: { pageTitle: "login"}
        })
        .state('register', {
            url: "/register",
            authenticate: false,
            controller: 'registerController',
            templateUrl: static_url + "views/register.html",
            data: { pageTitle: "register"}
        })
        .state('index.dashboard', {
            url: "/dashboard",
            authenticate: true,
            controller: 'dashboardController',
            templateUrl: static_url + "views/dashboard.html",
            data: { pageTitle: "dashboard"}  
        })

}
angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state, AuthService, $window) {
        $rootScope.$state = $state;
        $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
            if (toState.authenticate && !$window.localStorage.token) {
                $state.transitionTo("login");
                event.preventDefault(); 
            }
        });
    });