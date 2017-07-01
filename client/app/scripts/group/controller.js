'use strict';

angular.module('Group')
.controller('group', function ($scope) {

  $scope.controller_loaded = 'Group loaded!';
  $scope.pairs = [];
  $scope.pair = [];
  $scope.employeesGoing = [];

  $scope.addPair = function(pair) {
    $scope.pairs.push(pair);
    $scope.pair = [];
  };

  $scope.chooseEmployeesGoing = function(pairs) {
    var sorted_employees = $scope.idsSortedByNbPairs(pairs);
    var result = [];
    var remaining_pairs = pairs.slice();
    while (remaining_pairs.length) {
      var current_employee = sorted_employees.pop();
      result.push(current_employee);
      remaining_pairs = $scope.removePairsWithEmployee(
        remaining_pairs, current_employee
      );
    }
    return result;
  };

  $scope.removePairsWithEmployee = function(pairs, employee_id) {
    return pairs.filter(function (pair) {
      return pair[0] !== employee_id && pair[1] !== employee_id;
    });
  };

  $scope.flattenObject = function(object) {
    return Object.keys(object).map(function (property) {
      return [property, object[property]];
    });
  };

  $scope.idsSortedByNbPairs = function(pairs) {
    return $scope.flattenObject($scope.nbPairsById(pairs))
      .sort(function (first_pair, second_pair) {
        return first_pair[1] - second_pair[1];
      }).map(function (mapping) {
        return Number(mapping[0]);
      });
  };

  $scope.nbPairsById = function(pairs) {
    var mapping = {};
    pairs.forEach(function (pair) {
      var first = pair[0];
      var second = pair[1];
      mapping[first] = mapping[first] === undefined ? 1 : mapping[first] + 1;
      mapping[second] = mapping[second] === undefined ? 1 : mapping[second] + 1;
    });
    return mapping;
  };

  $scope.setEmployeesGoing = function() {
    var pairs = $scope.pairs.map(function (pair) {
      return [Number(pair[0]), Number(pair[1])];
    });
    $scope.employeesGoing = $scope.chooseEmployeesGoing(pairs);
  };

})
.config(function ($routeProvider) {
  $routeProvider
  .when('/group', {
    templateUrl: 'scripts/group/views/group.html',
    controller: 'group'
  });
});
