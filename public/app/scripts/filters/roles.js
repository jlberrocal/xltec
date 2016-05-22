'use strict';

/**
 * @ngdoc filter
 * @name xltecApp.filter:roles
 * @function
 * @description
 * # roles
 * Filter in the xltecApp.
 */
angular.module('xltecApp')
    .filter('roles', function () {
        return function (input) {
            switch (input) {
                case 'admin': return 'Administrador';
                case 'gestor': return 'Gestor  de Procesos';
                case 'audit': return 'Auditor';
                case 'other': return 'Otro';
                default: return input;
            }
        };
    });
