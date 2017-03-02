(function(){
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('MenuController', function($location,sitioService,$state){
          
              var vm = this;
              vm.sitio = {};
               vm.getSitio = getSitio;
               vm.logout = logout;
              

                vm.isActive = function(viewLocation){
                    return viewLocation === $location.path();
                }
                
                vm.hoy = function (){
                    var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
                    var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
                    var f = new Date();
                    var hoy = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
                    return hoy
               }
                
                 function getSitio(){
                     if(sessionStorage.getItem('data') == null){
                      sitioService.get().then(success, error);
                      function success(d) {
                           vm.sitio = d.data[0];
                           vm.sitio.email = sessionStorage.getItem('email');
                           sessionStorage.setItem('data',JSON.stringify(d.data[0]));
                          
                        }
                        function error(error) {
                           toastr['error'](error.data.error);
                        }
                    }else{
                        vm.sitio = JSON.parse(sessionStorage.getItem('data'));
                        vm.sitio.email = sessionStorage.getItem('email');
                    }
                }
                
                function logout(){
                      sitioService.logout().then(success, error);
                      function success(d) {
                          localStorage.clear();
                          sessionStorage.clear();
                           toastr['success']("sesión finalizada!");
                          $state.go('auth');
                      
                        }
                        function error(error) {
                           toastr['error'](error.data.error);
                        }
                }
                
            });

})();


