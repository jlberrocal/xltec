'use strict';

describe('Controller: PermissionsCtrl', function () {

  // load the controller's module
  beforeEach(module('xltecApp'));

  var PermissionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PermissionsCtrl = $controller('PermissionsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PermissionsCtrl.awesomeThings.length).toBe(3);
  });
});
