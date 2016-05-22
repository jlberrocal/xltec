'use strict';

describe('Service: authManager', function () {

  // load the service's module
  beforeEach(module('xltecApp'));

  // instantiate service
  var isAdmin;
  beforeEach(inject(function (_isAdmin_) {
    isAdmin = _isAdmin_;
  }));

  it('should do something', function () {
    expect(!!isAdmin).toBe(true);
  });

});
