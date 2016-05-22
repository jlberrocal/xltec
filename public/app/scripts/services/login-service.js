'use strict';

/**
 * @ngdoc service
 * @name xltecApp.loginService
 * @description
 * # loginService
 * Service in the xltecApp.
 */
angular.module('xltecApp')
    .service('loginService', function ($http, $localStorage, config) {
        return {
            login: function (credentials, callback) {
                $http.post(config.backEnd + 'login', credentials, {
                    headers: {'Content-type': 'application/json'}
                }).then(function (response) {
                    if(response.headers('x-auth-token')) {
                        $localStorage.token = response.headers('x-auth-token');
                        $http.defaults.headers.common['x-auth-token'] = response.headers('x-auth-token');
                        return callback(null, true);
                    }
                    return callback("Server don't send the authorization token", false);
                }, function (resp) {
                    return callback(resp, false);
                });
            },
            logout: function () {
                delete $localStorage.token;
                $http.defaults.headers.common['x-auth-token'] = '';
            }
        };
    });
