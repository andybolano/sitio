/* 
 * Controlador de canchas
 */
app.controller('homeController', function($scope) {
   $scope.sitio = {};
   
   
   $scope.getSitio = function(){
       var sitio = JSON.parse(sessionStorage.getItem('sitio'));
       $scope.sitio = sitio[0];
   }
});


