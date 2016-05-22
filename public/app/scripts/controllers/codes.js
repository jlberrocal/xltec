'use strict';

/**
 * @ngdoc function
 * @name xltecApp.controller:CodesCtrl
 * @description
 * # CodesCtrl
 * Controller of the xltecApp
 */
angular.module('xltecApp')
    .controller('CodesController', function ($scope, $http, config, authManager, sharedProperties, $uibModal) {
        $scope.codes = [];
        $scope.isAdmin = authManager.isAdmin();
        $scope.isGestor = authManager.isGestor();

        function getCodes() {
            $http.get(config.backEnd + 'codes').then(function (resp) {
                $scope.codes = resp.data;
            });
        }

        $scope.$on('$viewContentLoaded', getCodes);

        $scope.openModal = function (code) {
            sharedProperties.setter(null);
            if(code) {
                sharedProperties.setter(code);
            }

            var modal = $uibModal.open({
                templateUrl: 'modal.html',
                controller: 'codesModalController'
            });

            modal.result.then(getCodes);
        };

        $scope.delete = function (code) {
            var confirm = $uibModal.open({
                templateUrl: 'views/confirmModal.html',
                controller: 'ConfirmModalController'
            });

            confirm.result.then(function () {
                $http.delete(config.backEnd + 'codes/' + code).then(getCodes);
            });
        };
    })
    .controller('codesModalController', function ($scope, authManager, $uibModalInstance, sharedProperties, $http, config) {
        $scope.form = {};
        $scope.processes = [
            {id: 'Migración', name: 'Migración'},
            {id: 'Equipaje', name: 'Equipaje'},
            {id: 'Aduanas', name: 'Aduanas'},
            {id: 'Seguimiento Entrada', name: 'Seguimiento de Entrada'},
            {id: 'Impuestos', name: 'Impuestos'},
            {id: 'CheckIn', name: 'CheckIn'},
            {id: 'Seguridad', name: 'Seguridad'},
            {id: 'Rayos X', name: 'Rayos X'},
            {id: 'Seguimiento Comercial', name: 'Seguimiento Comercial'},
            {id: 'Abordaje', name: 'Abordaje'},
            {id: 'Seguimiento Salida', name: 'Seguimiento de Salida'}
        ];

        var shared = sharedProperties.getter();
        if(shared) {
            $scope.form = {
                code: shared.code,
                observation: shared.observation,
                process: shared.process
            };
        }

        $scope.addCode = function (form) {
            if(!form.code) {
                $scope.err = "Debe especificar un código";
            } else if(!form.observation) {
                $scope.err = "Debe darle una descripción al código";
            } else if(!form.process) {
                $scope.err = "Debe especificar un proceso para el código";
            } else {
                if(shared) {
                    $http.put(config.backEnd + 'codes/' + shared._id, JSON.stringify(form)).then(function (resp) {
                        $uibModalInstance.close(resp.data);
                    }, function (err) {
                        console.error(err);
                    });
                } else {
                    $http.post(config.backEnd + 'codes', form, {
                        headers: {'Content-type': 'application/json'}
                    }).then(function (resp) {
                        $uibModalInstance.close(resp.data);
                    }, function (err) {
                        console.error(err);
                    });
                }
            }

        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    });
