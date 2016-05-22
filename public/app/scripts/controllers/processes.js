'use strict';

/**
 * @ngdoc function
 * @name xltecApp.controller:ProcessesCtrl
 * @description
 * # ProcessesCtrl
 * Controller of the xltecApp
 */
angular.module('xltecApp')
    .controller('ProcessesController', function ($scope, authManager, $location, $http, config) {
        if(!authManager.isAdmin() && !authManager.isGestor()) {
            $location.path('/404');
		}
		
        $scope.processData = [];

        $scope.processes = [
            {id: 'migration', name: 'Migración'},
            {id: 'baggage', name: 'Equipaje'},
            {id: 'customs', name: 'Aduanas'},
            {id: 'entrance', name: 'Seguimiento de Entrada'},
            {id: 'taxes', name: 'Impuestos'},
            {id: 'checkIn', name: 'CheckIn'},
            {id: 'security', name: 'Seguridad'},
            {id: 'xRays', name: 'Rayos X'},
            {id: 'commercial', name: 'Seguimiento Comercial'},
            {id: 'boarding', name: 'Abordaje'},
            {id: 'departure', name: 'Seguimiento de Salida'}
        ];

        $scope.$watch('selected', function () {
            if($scope.selected) {
                $scope.processData = [];
                $http.get(config.backEnd + 'process/' + $scope.selected).then(function (resp) {
                    $scope.processData = resp.data;
                });
			}
        });

        $scope.getData = function () {
            return Object.keys($scope.processData).map(function (key) {
                return $scope.processData[key];
            });
        };

        $scope.getHeaders = function () {
            return Object.keys($scope.processData);
        };

        $scope.download = function (model) {
            location.href = config.backEnd + 'process/' + model + '/xlsx';
        };

        $scope.delete = function (model) {
            $http.delete(config.backEnd + 'process/' + model).then(function () {
                $scope.processData = [];
            });
        };
    });
