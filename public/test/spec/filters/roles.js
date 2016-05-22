'use strict';

describe('Filter: roles', function () {

  // load the filter's module
  beforeEach(module('xltecApp'));

  // initialize a new instance of the filter before each test
  var roles;
  beforeEach(inject(function ($filter) {
    roles = $filter('roles');
  }));

  it('should return the input prefixed with "roles filter:"', function () {
    var text = 'angularjs';
    expect(roles(text)).toBe('roles filter: ' + text);
  });

});
