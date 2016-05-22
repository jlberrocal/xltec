'use strict';

describe('Filter: currentDate', function () {

  // load the filter's module
  beforeEach(module('xltecApp'));

  // initialize a new instance of the filter before each test
  var currentDate;
  beforeEach(inject(function ($filter) {
    currentDate = $filter('currentDate');
  }));

  it('should return the input prefixed with "currentDate filter:"', function () {
    var text = 'angularjs';
    expect(currentDate(text)).toBe('currentDate filter: ' + text);
  });

});
