'use strict';

describe('Service: tokenInterceptor', function () {

  // load the service's module
  beforeEach(module('xltecApp'));

  // instantiate service
  var tokenInterceptor;
  beforeEach(inject(function (_tokenInterceptor_) {
    tokenInterceptor = _tokenInterceptor_;
  }));

  it('should do something', function () {
    expect(!!tokenInterceptor).toBe(true);
  });

});
