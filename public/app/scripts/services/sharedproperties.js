'use strict';

/**
 * @ngdoc service
 * @name xltecApp.sharedProperties
 * @description
 * # sharedProperties
 * Service in the xltecApp.
 */
angular.module('xltecApp')
    .service('sharedProperties', function () {
        var obj = {};
        return {
            getter: function () {
                return obj;
            },
            setter: function (value) {
                obj = value;
            }
        };
    });
