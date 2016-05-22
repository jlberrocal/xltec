/**
 * Created by jose on 07/05/16.
 */
'use strict';
angular.module('xltecApp').animation('.alert', function () {
    return {
        enter: function (element, done) {
            element.css('display', 'none')
                .fadeIn(750, done);
            return function () {
                element.stop();
            };
        },
        leave: function(element, done) {
            element.fadeOut(1000, done);
            return function() {
                element.stop();
            };
        }
    };
});
