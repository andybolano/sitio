(function(){
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('ClientesController',ClientesController);
            
            function ClientesController(clienteService,sessionService){
                var vm = this;
                vm.Clientes = [];
                vm.cliente = {};
                vm.Reservas = [];
                vm.estadisticas_reservas = {};
                vm.getClientes = function(){
                    var promisePost = clienteService.getBySitio(sessionService.getIdSitio());
                    promisePost.then(function (d) {
                      
                       vm.Clientes = d.data.clientes;
          
                    }, function (err) {
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
                }
                
                vm.showCliente = function(cliente){
                    $('#modalCliente').modal('show');
                    
                    vm.estadisticas_reservas.cumplida=0;
                    vm.estadisticas_reservas.incumplida=0;
                    vm.estadisticas_reservas.cancelada=0;
                    vm.estadisticas_reservas.confirmadasinabono=0;
                    vm.estadisticas_reservas.confirmadaconabono=0;
                    vm.estadisticas_reservas.esperandorevision=0;
                    vm.estadisticas_reservas.esperandoconfirmacion=0;
                    
                      var promisePost = clienteService.getHistoriaBySitio(cliente.idCliente,sessionService.getIdSitio());
                    promisePost.then(function (d) {
                      
                      vm.cliente = d.data.cliente;
                      vm.Reservas = d.data.reservas;
                      for(var i = 0; i< vm.Reservas.length; i++){
                          if(vm.Reservas[i].estado == 'cumplida'){
                              vm.estadisticas_reservas.cumplida += 1; 
                          }
                          if(vm.Reservas[i].estado == 'incumplida'){
                              vm.estadisticas_reservas.incumplida += 1; 
                              
                          }
                          if(vm.Reservas[i].estado == 'cancelada'){
                              vm.estadisticas_reservas.cancelada += 1; 
                              
                          }
                          if(vm.Reservas[i].estado == 'confirmadasinabono'){
                              vm.estadisticas_reservas.confirmadasinabono += 1; 
                              
                          }
                          if(vm.Reservas[i].estado == 'confirmadaconabono'){
                              vm.estadisticas_reservas.confirmadasinabono += 1; 
                              
                          }
                         
                          if(vm.Reservas[i].estado == 'esperandorevision'){
                              vm.estadisticas_reservas.esperandorevision += 1; 
                              
                          }
                          if(vm.Reservas[i].estado == 'esperandoconfirmacion'){
                              vm.estadisticas_reservas.esperandoconfirmacion += 1; 
                              
                          }
                      }

                      
                         vm.estadisticas_reservas.cumplida_porcentaje =Math.round((vm.estadisticas_reservas.cumplida*100)/vm.Reservas.length);
                         vm.estadisticas_reservas.incumplida_porcentaje =Math.round((vm.estadisticas_reservas.incumplida*100)/vm.Reservas.length);
                         vm.estadisticas_reservas.cancelada_porcentaje =Math.round((vm.estadisticas_reservas.cancelada*100)/vm.Reservas.length);
                         vm.estadisticas_reservas.confirmadasinabono_porcentaje =Math.round((vm.estadisticas_reservas.confirmadasinabono*100)/vm.Reservas.length);
                         vm.estadisticas_reservas.confirmadaconabono_porcentaje =Math.round((vm.estadisticas_reservas.confirmadaconabono*100)/vm.Reservas.length);
                         vm.estadisticas_reservas.esperandorevision_porcentaje =Math.round((vm.estadisticas_reservas.esperandorevision*100)/vm.Reservas.length);
                         vm.estadisticas_reservas.esperandoconfirmacion_porcentaje =Math.round((vm.estadisticas_reservas.esperandoconfirmacion*100)/vm.Reservas.length);
                    }, function (err) {
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
                }
            }
    
    })();
