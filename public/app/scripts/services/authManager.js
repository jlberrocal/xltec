'use strict';

/**
 * @ngdoc service
 * @name xltecApp.isAdmin
 * @description
 * # isAdmin
 * Service in the xltecApp.
 */
angular.module('xltecApp')
    .service('authManager', function (jwtHelper, $localStorage) {
        var admin = false;
        if(!$localStorage.token) {
            admin = false;
        } else {
            admin = jwtHelper.decodeToken($localStorage.token).roles.indexOf('admin') > -1;
        }

        return {
            isAdmin: function () {
                return $localStorage.token ?
                jwtHelper.decodeToken($localStorage.token).roles.indexOf('admin') > -1 :
                    false;
            },

            isGestor: function () {
                return $localStorage.token ?
                jwtHelper.decodeToken($localStorage.token).roles.indexOf('gestor') > -1 :
                    false;
            },

            isAudit: function () {
                return $localStorage.token ?
                jwtHelper.decodeToken($localStorage.token).roles.indexOf('gestor') > -1 :
                    false;
            }
        };
    });
