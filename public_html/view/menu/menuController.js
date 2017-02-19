(function(){
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('MenuController', function($location,sitioService){
          
              var vm = this;
              vm.sitio = {};
               vm.getSitio = getSitio;
               

                vm.isActive = function(viewLocation){
                    return viewLocation === $location.path();
                }
                
                 function getSitio(){
                     if(sessionStorage.getItem('data') == null){
                      sitioService.get().then(success, error);
                      function success(d) {
                           vm.sitio = d.data[0];
                           sessionStorage.setItem('data',JSON.stringify(d.data[0]));
                        }
                        function error(error) {
                           toastr['error'](error.data.error);
                        }
                    }else{
                        vm.sitio = JSON.parse(sessionStorage.getItem('data'));
                    }
                }
                
            });

})();


