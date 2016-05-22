'use strict';

/**
 * @ngdoc directive
 * @name xltecApp.directive:maskAddress
 * @description
 * # maskAddress
 */
angular.module('xltecApp')
    .directive('macAddress', function () {
        return {
            restrict: 'E',
            template: [
                '<div class="form-group" ng-if="isAdmin || isGestor">',
                '<label>MAC</label>',
                '<input class="form-control" placeholder="00:00:00:00:00:00" name="mac" ng-model="form.mac" ng-pattern="/^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/" required>',
                '</div>',
                '<div class="form-group">',
                '<div class=" alert" ng-class="{\'alert-danger\': formulario.$error.pattern}">',
                '{{ formulario.$error.pattern ? "El formato de la MAC es invalido." : ""}}',
                '</div>',
                '</div>'
            ].join(''),
            link: function postLink() {
            }
        };
    });
