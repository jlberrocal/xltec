'use strict';

/**
 * @ngdoc function
 * @name xltecApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the xltecApp
 */
angular.module('xltecApp')
    .controller('LoginController', function ($scope, $http, $location, config, loginService) {
        $scope.status = false;
        $scope.consulting = false;
        $scope.login = function (form) {
            $scope.consulting = true;
            loginService.login({
                username: form.Usuario.$modelValue,
                password: form.Contrasenna.$modelValue,
                rememberMe: $scope.status
            }, function (err, success) {
                $scope.consulting = false;
                if(err) {
                    $scope.err = err;
                } else if(success) {
                    setTimeout(function () {
                        $location.path('/');
                    }, 1000);
                }
            });
        };
    });
