(function(){
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('HomeController', function(reservasService,sessionService){
          
              var vm = this;
              vm.sitio = {};
              vm.getReservasHoy = getReservasHoy;
              vm.sitio = JSON.parse(sessionStorage.getItem('data'));
        
         Date.prototype.toDateInputValue = (function () {
            var local = new Date(this);
            local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
        });
        
        
              function getReservasHoy(){
               var fecha = new Date().toDateInputValue();
                  var promisePost = reservasService.getByFechaAll(sessionService.getIdSitio(), fecha);
                        promisePost.then(function (d) {
                            if (d.data.length === 0) {
                                toastr['warning']("No hay reservas : " + fecha);
                            } else {
                              vm.reservas = d.data;
  
                            }
                        }, function (err) {
                            if (err.status == 401) {
                                toastr["error"](err.data.respuesta);
                            } else {
                                toastr["error"]("Ha ocurrido un problema!");
                            }
                    });
              }
              
              
            });

})();




