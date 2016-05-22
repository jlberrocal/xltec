'use strict';

describe('Controller: CodesCtrl', function () {

  // load the controller's module
  beforeEach(module('xltecApp'));

  var CodesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CodesCtrl = $controller('CodesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CodesCtrl.awesomeThings.length).toBe(3);
  });
});
