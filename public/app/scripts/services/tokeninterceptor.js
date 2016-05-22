'use strict';

/**
 * @ngdoc service
 * @name xltecApp.tokenInterceptor
 * @description
 * # tokenInterceptor
 * Factory in the xltecApp.
 */
angular.module('xltecApp')
    .factory('tokenInterceptor', function ($q, $localStorage) {

        return {
            response: function (response) {
                if(response.headers('x-auth-token')) {
                    $localStorage.token = response.headers('x-auth-token');
				}
                return $q.resolve(response);
            },
            responseError: function (response) {
                return $q.reject(response);
            }
        };
    });
