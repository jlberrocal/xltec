'use strict';

/**
 * @ngdoc function
 * @name xltecApp.controller:DevicesCtrl
 * @description
 * # DevicesCtrl
 * Controller of the xltecApp
 */
angular.module('xltecApp')
    .controller('DevicesController', function ($scope, $http, config, authManager, $uibModal, sharedProperties) {
        $scope.devices = [];
        $scope.isAdmin = authManager.isAdmin();
        $scope.isGestor = authManager.isGestor();

        function getDevices() {
            $http.get(config.backEnd + 'devices').then(function (data) {
                $scope.devices = data.data;
            });
        }

        getDevices();

        $scope.openModal = function (device) {
            sharedProperties.setter(null);
            if(device) {
                sharedProperties.setter(device);
            }

            var modal = $uibModal.open({
                templateUrl: 'modal.html',
                controller: 'devicesModalController'
            });

            modal.result.then(function (data) {
                if(device) {
                    $http.put(config.backEnd + 'devices/' + device._id, JSON.stringify(data)).then(getDevices);
                }
                else {
                    $http.post(config.backEnd + 'devices', data, {
                        headers: {'Content-type': 'application/json'}
                    }).then(getDevices, function (err) {
                        console.error(err);
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
                $http.delete(config.backEnd + 'devices/' + username).then(getDevices);
            });
        };
    })
    .controller('devicesModalController', function ($scope, authManager, $uibModalInstance, sharedProperties) {
        $scope.isAdmin = authManager.isAdmin();
        $scope.isGestor = authManager.isGestor();
        $scope.form = {};

        var shared = sharedProperties.getter();
        if(shared) {
            $scope.form = {
                name: shared.name,
                mac: shared.mac
            };
        }

        $scope.addDevice = function (form) {
            $uibModalInstance.close(form);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    });
