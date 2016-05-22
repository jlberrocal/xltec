'use strict';

describe('Filter: keys', function () {

  // load the filter's module
  beforeEach(module('xltecApp'));

  // initialize a new instance of the filter before each test
  var keys;
  beforeEach(inject(function ($filter) {
    keys = $filter('keys');
  }));

  it('should return the input prefixed with "keys filter:"', function () {
    var text = 'angularjs';
    expect(keys(text)).toBe('keys filter: ' + text);
  });

});
