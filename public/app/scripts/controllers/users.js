'use strict';

/**
 * @ngdoc function
 * @name xltecApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the xltecApp
 */
angular.module('xltecApp')
    .controller('userController', function ($scope, $http, config, $uibModal, sharedProperties, authManager) {
        function loadUsers() {
            $http.get(config.backEnd + 'users').then(function (response) {
                $scope.users = response.data;
                sharedProperties.setter(null);
            });
        }

        $scope.isAdmin = authManager.isAdmin();

        loadUsers();

        $scope.openModal = function (user) {
            sharedProperties.setter(null);
            if(user) {
                sharedProperties.setter(user);
            }

            var modal = $uibModal.open({
                templateUrl: 'modal.html',
                controller: 'userModalController'
            });

            modal.result.then(function (data) {
                data.allowedDevices = data.allowedDevices.map(function (device) {
                    return Object.keys(device).map(function (key) {
                        return device[key];
                    })[0];
                });
                data.roles = data.roles.map(function (role) {
                    return Object.keys(role).map(function (key) {
                        return role[key];
                    })[0];
                });
                if(user) {
                    $http.put(config.backEnd + 'users/' + user.username, JSON.stringify(data)).then(loadUsers);
                }
                else {
                    $http.post(config.backEnd + 'users', data, {
                        headers: {'Content-type': 'application/json'}
                    }).then(loadUsers, function (resp) {
                        console.error(resp);
                    });
                }
            });
        };

        $scope.delete = function (username) {
            var confirm = $uibModal.open({
                templateUrl: 'views/confirmModal.html',
                controller: 'ConfirmModalController'
            });

            confirm.result.then(function () {
                $http.delete(config.backEnd + 'users/' + username).then(loadUsers);
            });
        };
    }).
    controller('userModalController', function ($scope, $uibModalInstance, $http, config, sharedProperties, authManager) {
        $scope.form = {
            allowedDevices: [],
            roles: []
        };

        $scope.isAdmin = authManager.isAdmin();

        var shared = sharedProperties.getter();
        if(shared) {
            $scope.form = {
                name: shared.name,
                username: shared.username,
                allowedDevices: shared.allowedDevices.map(function (item) {
                    return {id: item._id};
                }),
                roles: shared.roles.map(function (item) {
                    return {id: item};
                })
            };
        }

        $scope.translations = {
            checkAll: 'Seleccionar todos',
            uncheckAll: 'Quitar todos',
            buttonDefaultText: 'Seleccione los valores deseados',
            dynamicButtonTextSuffix: 'seleccionado(s)'
        };

        $scope.devices = [];

        $scope.roles = [
            {
                id: 'admin',
                label: 'Administrador'
            },
            {
                id: 'gestor',
                label: 'Gestor de Procesos'
            },
            {
                id: 'audit',
                label: 'Auditor'
            },
            {
                id: 'other',
                label: 'Otro'
            }
        ];

        $http.get(config.backEnd + 'devices').then(function (response) {
            $scope.devices = response.data.map(function (device) {
                return {
                    id: device._id,
                    label: device.name
                };
            });
        });

        $scope.addUser = function (form) {
            $uibModalInstance.close(form);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    })
    .controller('ConfirmModalController', function ($scope, $uibModalInstance) {
        $scope.yes = function () {
            $uibModalInstance.close();
        };

        $scope.no = function () {
            $uibModalInstance.dismiss();
        };
    });
