'use strict';

describe('Controller: ProcessesCtrl', function () {

  // load the controller's module
  beforeEach(module('xltecApp'));

  var ProcessesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProcessesCtrl = $controller('ProcessesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProcessesCtrl.awesomeThings.length).toBe(3);
  });
});
