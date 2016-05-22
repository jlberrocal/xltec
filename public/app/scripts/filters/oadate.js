'use strict';

/**
 * @ngdoc filter
 * @name xltecApp.filter:oadate
 * @function
 * @description
 * # oadate
 * Filter in the xltecApp.
 */
angular.module('xltecApp')
  .filter('oadate', function () {
    return function (input) {
	  //var moment = (typeof require !== 'undefined' && require !== null) && !require.amd ? require('moment') : this.moment;
      return moment.fromOADate(input).format('DD/MM/YYYY h:mm:ss a');
    };
  });
