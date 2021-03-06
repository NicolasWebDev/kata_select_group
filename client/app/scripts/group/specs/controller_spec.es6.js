'use strict';

describe('Controller: select group', () => {

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

  describe('On instance', () => {
    describe('setEmployeesGoing', () => {
      it('sets the employees that are going', () => {
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
    });

    describe('addPair', () => {
      it('adds a pair to the scope pairs', () => {
        expect(scope.pairs).toEqual([]);

        scope.addPair([1, 2]);
        expect(scope.pairs).toEqual([[1, 2]]);
        expect(scope.employeesGoing).toEqual([]);

        scope.addPair([3, 4]);
        expect(scope.pairs).toEqual([[1, 2], [3, 4]]);
        expect(scope.employeesGoing).toEqual([4, 3, 2]);
      });
    });

    it('should set "controller_loaded" variable in scope', () => {
      expect(scope.controller_loaded).toContain('loaded');
    });

    describe('chooseEmployeesGoing', () => {
      it('chooses the employes of pairs1 that go to the beach', () => {
        expect(scope.chooseEmployeesGoing(pairs1)).toEqual([2011]);
      });

      it('chooses the employes of pairs2 that go to the beach', () => {
        expect(scope.chooseEmployeesGoing(pairs2)).toEqual([2002, 1009]);
      });

      it('chooses the employes of pairs3 that go to the beach', () => {
        expect(scope.chooseEmployeesGoing(pairs3)).toEqual([1, 2, 7]);
      });
    });

    describe('removePairsWithEmployee', () => {
      it('removes the pairs which contain the given employee', () => {
        // currying, for the fun
        var removePairFromPair1 = scope.removePairsWithEmployee.bind(undefined,
          pairs1);

        expect(removePairFromPair1(2011)).toEqual([]);

        expect(removePairFromPair1(1009)).toEqual([[1017, 2011]]);

        expect(removePairFromPair1(1017)).toEqual([[1009, 2011]]);
      });
    });

    describe('idsSortedByNbPairs', () => {
      it('returns the employees of pairs1 ordered by their number of pairs',
        () => {
          expect(scope.idsSortedByNbPairs(pairs1)).toEqual([1009, 1017, 2011]);
        });

      it('returns the employees of pairs2 ordered by their number of pairs',
        () => {
          expect(scope.idsSortedByNbPairs(pairs2)).toEqual(
            [1002, 1003, 2000, 2001, 1009, 2002]
          );
        });
    });

    describe('nbPairsById', () => {
      it('returns a mapping of ids/number_of_pairs for pairs1', () => {
        expect(scope.nbPairsById(pairs1)).toEqual({
          1009: 1,
          1017: 1,
          2011: 2,
        });
      });

      it('returns a mapping of ids/number_of_pairs for pairs2', () => {
        expect(scope.nbPairsById(pairs2)).toEqual({
          1009: 2,
          1002: 1,
          1003: 1,
          2000: 1,
          2001: 1,
          2002: 2,
        });
      });
    });
  });

  describe('when going to /group', () => {

    var route, location, rootScope, httpBackend;

    beforeEach(inject(function ($route, $location, $rootScope, $httpBackend) {
      route = $route;
      location = $location;
      rootScope = $rootScope;
      httpBackend = $httpBackend;

      httpBackend.when('GET', 'scripts/group/views/group.html').respond('<div></div>');
    }));

    afterEach(() => {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should use minesweeper.html and controller', () => {
      expect(route.current).toBeUndefined();

      location.path('/group');

      httpBackend.flush();

      expect(route.current.templateUrl).toBe('scripts/group/views/group.html');
      expect(route.current.controller).toBe('group');
    });
  });

});
