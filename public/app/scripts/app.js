'use strict';

/**
 * @ngdoc overview
 * @name xltecApp
 * @description
 * # xltecApp
 *
 * Main module of the application.
 */
angular
    .module('xltecApp', [
        'angular-jwt',
        'ui.bootstrap',
        'ngAnimate',
        'ngResource',
        'ngRoute',
        'ngTouch',
        'ngSanitize',
        'ngStorage',
        'uiSwitch',
        'chart.js',
        'smart-table',
        'angularjs-dropdown-multiselect',
        'ui.bootstrap.datetimepicker',
        'rt.select2',
        'pascalprecht.translate',
        'tmh.dynamicLocale'
    ])
    .config(function ($routeProvider, $httpProvider, $translateProvider, tmhDynamicLocaleProvider) {
        $translateProvider.preferredLanguage('es_CR');
        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
        $httpProvider.interceptors.push('tokenInterceptor');

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainController'
            })
            .when('/404', {
                templateUrl: '404.html'
            })
            .when('/users', {
                templateUrl: 'views/users.html',
                controller: 'userController'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })
            .when('/devices', {
                templateUrl: 'views/devices.html',
                controller: 'DevicesController'
            })
            .when('/permissions', {
                templateUrl: 'views/permissions.html',
                controller: 'PermissionsController',
            })
            .when('/processes', {
                templateUrl: 'views/processes.html',
                controller: 'ProcessesController',
            })
            .when('/codes', {
                templateUrl: 'views/codes.html',
                controller: 'CodesController'
            })
            .otherwise({
                redirectTo: '/404'
            });
    }).constant('LOCALES', {
    'locales': {
        'es_CR': 'Español'
    },
    'preferredLocale': 'es_CR'
}).run(function ($localStorage, $http, $location, $rootScope, jwtHelper) {
    if($localStorage.token) {
        $http.defaults.headers.common['x-auth-token'] = $localStorage.token;
    }

    $rootScope.$on('$routeChangeStart', function () {
        var publicPages = ['/login'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if(restrictedPage && !$localStorage.token) {
            $location.path('/login');
        } else if($localStorage.token !== undefined && $location.path() === '/login') {
            $location.path('/');
        } else if($localStorage.token && jwtHelper.isTokenExpired($localStorage.token)) {
            delete $localStorage.token;
            $http.defaults.headers.common['x-auth-token'] = null;
            $location.path('/login');
        }
    });
});
