'use strict';

describe('Service: sharedProperties', function () {

  // load the service's module
  beforeEach(module('xltecApp'));

  // instantiate service
  var sharedProperties;
  beforeEach(inject(function (_sharedProperties_) {
    sharedProperties = _sharedProperties_;
  }));

  it('should do something', function () {
    expect(!!sharedProperties).toBe(true);
  });

});
