'use strict';

angular.module('Group')
.controller('group', $scope => {

  $scope.controller_loaded = 'Group loaded!';
  $scope.pairs = [];
  $scope.pair = [];
  $scope.employeesGoing = [];

  $scope.addPair = pair => {
    $scope.pairs.push(pair);
    $scope.pair = [];
  };

  $scope.chooseEmployeesGoing = pairs => {
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

  $scope.removePairsWithEmployee = (pairs, employee_id) =>
    pairs.filter(pair => pair[0] !== employee_id && pair[1] !== employee_id);

  $scope.flattenObject = object =>
    Object.keys(object).map(property => [property, object[property]]);

  $scope.idsSortedByNbPairs = pairs =>
    $scope.flattenObject($scope.nbPairsById(pairs))
      .sort((first_pair, second_pair) => first_pair[1] - second_pair[1])
      .map(mapping => Number(mapping[0]));

  $scope.nbPairsById = pairs => {
    var mapping = {};
    pairs.forEach(pair => {
      var first = pair[0];
      var second = pair[1];
      mapping[first] = mapping[first] === undefined ? 1 : mapping[first] + 1;
      mapping[second] = mapping[second] === undefined ? 1 : mapping[second] + 1;
    });
    return mapping;
  };

  $scope.setEmployeesGoing = () => {
    var pairs = $scope.pairs.map(pair => [Number(pair[0]), Number(pair[1])]);
    $scope.employeesGoing = $scope.chooseEmployeesGoing(pairs);
  };

})
.config($routeProvider => {
  $routeProvider
  .when('/group', {
    templateUrl: 'scripts/group/views/group.html',
    controller: 'group'
  });
});
