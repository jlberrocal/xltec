'use strict';

describe('Filter: oadate', function () {

  // load the filter's module
  beforeEach(module('xltecApp'));

  // initialize a new instance of the filter before each test
  var oadate;
  beforeEach(inject(function ($filter) {
    oadate = $filter('oadate');
  }));

  it('should return the input prefixed with "oadate filter:"', function () {
    var text = 'angularjs';
    expect(oadate(text)).toBe('oadate filter: ' + text);
  });

});
