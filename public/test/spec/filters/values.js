'use strict';

describe('Filter: values', function () {

  // load the filter's module
  beforeEach(module('xltecApp'));

  // initialize a new instance of the filter before each test
  var values;
  beforeEach(inject(function ($filter) {
    values = $filter('values');
  }));

  it('should return the input prefixed with "values filter:"', function () {
    var text = 'angularjs';
    expect(values(text)).toBe('values filter: ' + text);
  });

});
