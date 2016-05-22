'use strict';

/**
 * @ngdoc function
 * @name xltecApp.controller:PermissionsCtrl
 * @description
 * # PermissionsCtrl
 * Controller of the xltecApp
 */
angular.module('xltecApp')
    .controller('PermissionsController', function ($scope, $http, authManager, config, $uibModal, sharedProperties) {
        $scope.isAdmin = authManager.isAdmin();
        $scope.isGestor = authManager.isGestor();
        $scope.permissions = [];

        function getPermissions() {
            $http.get(config.backEnd + 'permissions').then(function (data) {
                $scope.permissions = data.data;
            });
        }

        getPermissions();

        $scope.openModal = function (permission) {
            sharedProperties.setter(null);
            if(permission) {
                sharedProperties.setter(permission);
            }

            var modal = $uibModal.open({
                templateUrl: 'modal.html',
                controller: 'permissionModalController'
            });

            modal.result.then(function (data) {
                data.users = data.users.map(function (user) {
                    return user.id;
                });
                if(permission) {
                    $http.put(config.backEnd + 'permissions/' + permission._id, JSON.stringify(data)).then(getPermissions);
                }
                else {
                    $http.post(config.backEnd + 'permissions', data, {
                        headers: {'Content-type': 'application/json'}
                    }).then(getPermissions, function (err) {
                        console.error(err);
                    });
                }
            });
        };

        $scope.delete = function (permission) {
            var confirm = $uibModal.open({
                templateUrl: 'views/confirmModal.html',
                controller: 'ConfirmModalController'
            });

            confirm.result.then(function () {
                $http.delete(config.backEnd + 'permissions/' + permission).then(getPermissions);
            });
        };
    })
    .controller('permissionModalController', function ($scope, authManager, $uibModalInstance,
                                                       sharedProperties, $http, config) {
        $scope.isAdmin = authManager.isAdmin();
        $scope.isGestor = authManager.isGestor();
        $scope.form = {
            users: []
        };

        $scope.auditors = [];

        $http.get(config.backEnd + 'users/auditors/json').then(function (resp) {
            $scope.auditors = resp.data.map(function (user) {
                return {
                    id: user._id,
                    label: user.name
                };
            });
        });

        var shared = sharedProperties.getter();
        if(shared) {
            $scope.form = {
                from: new Date(shared.from),
                until: new Date(shared.until),
                users: shared.users.map(function (item) {
                    return {id: item._id};
                })
            };
        }

        $scope.addPermission = function (form) {
            if(form.from > form.until) {
                $scope.err = "La fecha desde no puede estar posterior a hasta";
            } else if(form.from.getTime() === form.until.getTime()) {
                $scope.err = "Desde y hasta no pueden ser iguales";
            } else {
                $uibModalInstance.close(form);
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.translations = {
            checkAll: 'Seleccionar todos',
            uncheckAll: 'Quitar todos',
            buttonDefaultText: 'Seleccione los valores deseados',
            dynamicButtonTextSuffix: 'seleccionado(s)'
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dateOpened = true;
        };

        $scope.dateOptions = {
            showWeeks: false
        };
    });
