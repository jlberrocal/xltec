'use strict';

describe('Directive: maskAddress', function () {

  // load the directive's module
  beforeEach(module('xltecApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<mask-address></mask-address>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the maskAddress directive');
  }));
});
