app.controller('sessionController', function($scope) {

  $scope.logout = function(){
       sessionStorage.clear();
        location.reload(true);
   }
  
 });