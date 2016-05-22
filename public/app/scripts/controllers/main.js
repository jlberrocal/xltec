'use strict';

/**
 * @ngdoc function
 * @name xltecApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the xltecApp
 */
angular.module('xltecApp')
    .controller('MainController', function ($scope, $http, config) {
        $scope.graphs = [];
        $scope.$on('$routeChangeSuccess', function () {
            $http.get(config.backEnd + 'users/auditors/json').then(function (response) {
                return Promise.all(response.data.map(function (user) {
                    return $http.get(config.backEnd + 'process/report/' + user.username.substring(0,2) + '?name=' + user.name);
                }));
            }).then(function (responses) {
                responses.forEach(function (response) {
                    $scope.graphs.push({
                        user: Object.keys(response.data)[0],
                        processes: {
                            titles: Object.keys(response.data).map(function (key) {
                                return response.data[key].map(function (process) {
                                    return Object.keys(process)[0];
                                });

                            })[0],
                            data: Object.keys(response.data).map(function (key) {
                                return response.data[key].map(function (process) {
                                    return Object.keys(process).map(function (value) {
                                        return process[value];
                                    })[0];
                                });
                            })[0]
                        }
                    });
                });
            });
        });
    });
