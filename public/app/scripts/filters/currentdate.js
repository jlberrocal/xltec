'use strict';

/**
 * @ngdoc filter
 * @name xltecApp.filter:currentDate
 * @function
 * @description
 * # currentDate
 * Filter in the xltecApp.
 */
angular.module('xltecApp')
    .filter('currentYear', function ($filter) {
        return function () {
            return $filter('date')(new Date(), 'yyyy');
        };
    });
