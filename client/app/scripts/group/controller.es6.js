'use strict';

angular.module('Group')
.controller('group', $scope => {

  $scope.controller_loaded = 'Group loaded!';
  $scope.pairs = [];
  $scope.pair = [];
  $scope.employeesGoing = [];

  $scope.addPair = pair => $scope.pairs.push(pair.splice(0));

  $scope.chooseEmployeesGoing = pairs => {
    var sortedEmployees = $scope.idsSortedByNbPairs(pairs);
    var result = [];
    var remainingPairs = pairs.slice();
    while (remainingPairs.length) {
      var currentEmployee = sortedEmployees.pop();
      result.push(currentEmployee);
      remainingPairs = $scope.removePairsWithEmployee(remainingPairs,
        currentEmployee);
    }
    return result;
  };

  $scope.removePairsWithEmployee = (pairs, employeeId) =>
    pairs.filter(pair => pair.indexOf(employeeId) === -1);

  $scope.flattenObject = object =>
    Object.keys(object).map(property => [property, object[property]]);

  $scope.idsSortedByNbPairs = pairs =>
    $scope.flattenObject($scope.nbPairsById(pairs))
      .sort((firstMap, secondMap) => firstMap[1] - secondMap[1])
      .map(mapping => Number(mapping[0]));

  $scope.flattenMatrix = matrix => [].concat.apply([], matrix);

  $scope.nbPairsById = pairs => $scope.flattenMatrix(pairs)
    .reduce((acc, employeeId) => {
      acc[employeeId] = acc[employeeId] ? acc[employeeId] + 1 : 1;
      return acc;
    }, {});

  $scope.setEmployeesGoing = () => {
    $scope.employeesGoing = $scope.chooseEmployeesGoing(
      $scope.pairs.map(pair => pair.map(elt => Number(elt)))
    );
  };

})
.config($routeProvider => {
  $routeProvider
  .when('/group', {
    templateUrl: 'scripts/group/views/group.html',
    controller: 'group'
  });
});
