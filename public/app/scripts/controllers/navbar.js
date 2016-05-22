'use strict';

/**
 * @ngdoc function
 * @name xltecApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the xltecApp
 */
angular.module('xltecApp')
    .controller('NavBarController', function ($scope, $location, jwtHelper, authManager, $uibModal, loginService, $localStorage) {
        $scope.isActive = function (location) {
            return location === $location.path();
        };

        $scope.$on('$routeChangeSuccess', function () {
            $scope.user = $localStorage.token ? jwtHelper.decodeToken($localStorage.token).name : null;
            $scope.isAdmin = authManager.isAdmin();
            $scope.isGestor = authManager.isGestor();
        });

        $scope.isLoginPage = function () {
            return '/login' === $location.path();
        };

        $scope.isOpen = function () {
            return !$scope.opened;
        };

        $scope.toggle = function () {
            $scope.opened = !$scope.opened;
        };

        $scope.logout = function () {
            loginService.logout();
            $location.path('/login');
        };

        $scope.changePassword = function () {
            $uibModal.open({
                templateUrl: 'views/modalChangePassword.html',
                controller: 'credentialsController'
            });
        };
    })
    .controller('credentialsController', function ($scope, $uibModalInstance, $http, config, jwtHelper) {
        $scope.form = {};

        $scope.changePassword = function (credentials) {
            if(!credentials.old) {
                $scope.err = "La contraseña actual es un campo requerido";
            } else if(!credentials.new) {
                $scope.err = "La contraseña nueva es un campo requerido";
            } else if(!credentials.repeat) {
                $scope.err = "Debe repetir la nueva contraseña";
            } else if(credentials.new !== credentials.repeat) {
                $scope.err = "La contraseña nueva no es idéntica en ambos campos";
            } else if (credentials.new === credentials.old) {
                $scope.err = "La contraseña nueva no puede ser idéntica a la anterior";
            } else {
				var user = jwtHelper.decodeToken(localStorage.getItem('token')).username;
					$http.patch(config.backEnd + 'users/' + user , credentials, {
						headers: {'Content-type': 'application/json'}
					}).then(function () {
						$uibModalInstance.close();
					}, function (err) {
						$scope.err = err.data.message;
					});
				}
        };
    });
