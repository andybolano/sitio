(function(){
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('ClientesController',ClientesController);
            
            function ClientesController(clienteService,sessionService){
                var vm = this;
                vm.Clientes = [];
                vm.getClientes = function(){
                    var promisePost = clienteService.getBySitio(sessionService.getIdSitio());
                    promisePost.then(function (d) {
                        
                       vm.Clientes = d.data.clientes;
                       console.log(vm.Clientes)
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
