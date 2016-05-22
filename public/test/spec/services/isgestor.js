'use strict';

describe('Service: isGestor', function () {

  // load the service's module
  beforeEach(module('xltecApp'));

  // instantiate service
  var isGestor;
  beforeEach(inject(function (_isGestor_) {
    isGestor = _isGestor_;
  }));

  it('should do something', function () {
    expect(!!isGestor).toBe(true);
  });

});
