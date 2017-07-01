'use strict';

angular.module('Group')
.controller('group', $scope => {

  $scope.controller_loaded = 'Group loaded!';
  $scope.pairs = [];
  $scope.pair = [];
  $scope.employeesGoing = [];

  $scope.addPair = pair => $scope.pairs.push(pair.splice(0));

  $scope.chooseEmployeesGoing = pairs => {
    var sorted_employees = $scope.idsSortedByNbPairs(pairs);
    var result = [];
    var remaining_pairs = pairs.slice();
    while (remaining_pairs.length) {
      var current_employee = sorted_employees.pop();
      result.push(current_employee);
      remaining_pairs = $scope.removePairsWithEmployee(remaining_pairs,
        current_employee);
    }
    return result;
  };

  $scope.removePairsWithEmployee = (pairs, employee_id) =>
    pairs.filter(pair => pair.indexOf(employee_id) === -1);

  $scope.flattenObject = object =>
    Object.keys(object).map(property => [property, object[property]]);

  $scope.idsSortedByNbPairs = pairs =>
    $scope.flattenObject($scope.nbPairsById(pairs))
      .sort((first_pair, second_pair) => first_pair[1] - second_pair[1])
      .map(mapping => Number(mapping[0]));

  $scope.flattenMatrix = matrix => [].concat.apply([], matrix);

  $scope.nbPairsById = pairs => $scope.flattenMatrix(pairs)
    .reduce((acc, employee_id) => {
      acc[employee_id] = acc[employee_id] ? acc[employee_id] + 1 : 1;
      return acc;
    }, {});

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
