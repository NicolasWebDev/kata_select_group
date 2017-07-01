'use strict';

describe('Controller: select group', function () {

  beforeEach(module('Group'));

  var controller;
  var scope;
  var pairs1;
  var pairs2;
  var pairs3;

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    controller = $controller('group', { $scope: scope });
    pairs1 = [[1009, 2011], [1017, 2011]];
    pairs2 = [[1009, 2000], [1009, 2001], [1002, 2002], [1003, 2002]];
    pairs3 = [[1, 2], [1, 3], [1, 6], [1, 7], [4, 7], [2, 3], [2, 4]];
  }));

  describe('On instance', function () {
    it('sets the employees that are going', function() {
      scope.pairs = pairs1;
      scope.setEmployeesGoing();
      expect(scope.employeesGoing).toEqual([2011]);
      scope.pairs = pairs2;
      scope.setEmployeesGoing();
      expect(scope.employeesGoing).toEqual([2002, 1009]);
      scope.pairs = pairs3;
      scope.setEmployeesGoing();
      expect(scope.employeesGoing).toEqual([1, 2, 7]);
    });

    it('adds a pair to the scope pairs', function() {
      expect(scope.pairs).toEqual([]);
      scope.addPair([1, 2]);
      expect(scope.pairs).toEqual([[1, 2]]);
      scope.addPair([3, 4]);
      expect(scope.pairs).toEqual([[1, 2], [3, 4]]);
    });
    it('should set "controller_loaded" variable in scope', function () {
      expect(scope.controller_loaded).toContain('loaded');
    });

    it('chooses the employess that go to the beach', function() {
      expect(scope.choose_employees_going(pairs1)).toEqual([2011]);
    });

    it('chooses the employess that go to the beach case 2', function() {
      expect(scope.choose_employees_going(pairs2)).toEqual([2002, 1009]);
    });

    it('chooses the employess that go to the beach case 3', function() {
      expect(scope.choose_employees_going(pairs3)).toEqual([1, 2, 7]);
    });

    it('removes the pairs which contain the given employee', function() {
      expect(scope.remove_pairs_with_employee(pairs1, 2011)).toEqual([]);
      expect(scope.remove_pairs_with_employee(pairs1, 1009)).toEqual([[1017, 2011]]);
      expect(scope.remove_pairs_with_employee(pairs1, 1017)).toEqual([[1009, 2011]]);
    });

    it('returns the ids of the employees ordered by their number of pairs', function () {
      expect(scope.ids_sorted_by_nb_pairs(pairs1)).toEqual([1009, 1017, 2011]);
    });

    it('returns the ids of the employees ordered by their number of pairs case 2', function () {
      expect(scope.ids_sorted_by_nb_pairs(pairs2)).toEqual(
        [1002, 1003, 2000, 2001, 1009, 2002]
      );
    });

    it('returns a mapping of ids/number_of_pairs', function() {
      expect(scope.nb_pairs_by_id(pairs1)).toEqual({
        1009: 1,
        1017: 1,
        2011: 2,
      });
    });

    it('returns a mapping of ids/number_of_pairs case 2', function() {
      expect(scope.nb_pairs_by_id(pairs2)).toEqual({
        1009: 2,
        1002: 1,
        1003: 1,
        2000: 1,
        2001: 1,
        2002: 2,
      });
    });
  });

  describe('when going to /group', function () {

    var route, location, rootScope, httpBackend;

    beforeEach(inject(function ($route, $location, $rootScope, $httpBackend) {
      route = $route;
      location = $location;
      rootScope = $rootScope;
      httpBackend = $httpBackend;

      httpBackend.when('GET', 'scripts/group/views/group.html').respond('<div></div>');
    }));

    afterEach(function () {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should use minesweeper.html and controller', function () {
      expect(route.current).toBeUndefined();

      location.path('/group');

      httpBackend.flush();

      expect(route.current.templateUrl).toBe('scripts/group/views/group.html');
      expect(route.current.controller).toBe('group');
    });
  });

});
