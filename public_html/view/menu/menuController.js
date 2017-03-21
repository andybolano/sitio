(function(){
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('MenuController', function($location,sitioService,$state,sessionService){
          
              var vm = this;
              vm.sitio = {};
               vm.getSitio = getSitio;
               vm.logout = logout;
            
                
            Pusher.logToConsole = true;

            var pusher = new Pusher('b4015226d5614422f631', {
              encrypted: true
            });

            var channel = pusher.subscribe('private-'+sessionService.getToken());
            channel.bind('nuevaReserva', function(data) {
              alert(data.message);
            });
            
            

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
                           toastr['error']('No autorizado!');
                        }
                    }else{
                        vm.sitio = JSON.parse(sessionStorage.getItem('data'));
                        vm.sitio.email = sessionStorage.getItem('email');
                    }
                }
                
                function logout(){
                    pusher.unsubscribe('private-'+sessionService.getToken());
                      sitioService.logout().then(success, error);
                      function success(d) {
                          localStorage.clear();
                          sessionStorage.clear();
                           toastr['success']("sesión finalizada!");
                           $state.go('auth',{},{reload: true});
                      
                        }
                        function error(error) {
                           toastr['error'](error.data.error);
                        }
                }
                
            });

})();


