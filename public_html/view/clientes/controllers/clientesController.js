(function () {
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('ClientesController', ClientesController);

    function ClientesController(clienteService, sessionService) {
        var vm = this;
        vm.Clientes = [];
        vm.cliente = {};
        vm.Reservas = [];
        vm.estadisticas_reservas = {};
    

        vm.getClientes = function () {
         
            var promisePost = clienteService.getBySitio(sessionService.getIdSitio());
            promisePost.then(function (d) {
                
           
                
                
                vm.Clientes = d.data.clientes;
                setTimeout(function(){
                   var oTable = $('#editableClientes').DataTable();
                },500);

            }, function (err) {
                if (err.status == 401) {
                    toastr["error"](err.data.respuesta);
                } else {
                    toastr["error"]("Ha ocurrido un problema!");
                }
            });
        }
        
        vm.getTotal = function(param){
            var sum = 0;
            if(param == 'price'){
                  for (var i = 0; i < vm.Reservas.length; i++) {
                    if(vm.Reservas[i].estado == 'cumplida'){  
                    sum += vm.Reservas[i].precio; 
                    }
                }
            }else if(param == 'pagado'){
                 for (var i = 0; i < vm.Reservas.length; i++) {
                      sum += parseInt(vm.Reservas[i].pago) + parseInt(vm.Reservas[i].abonoLiquidado);  
                }
            }else if(param == 'espera'){
                for (var i = 0; i < vm.Reservas.length; i++) {
                      if(vm.Reservas[i].estado == 'confirmadasinabono' || vm.Reservas[i].estado == 'esperandorevision' || vm.Reservas[i].estado == 'esperandoconfirmacion'){  
                        sum += vm.Reservas[i].precio; 
                      }
                }
            }
                return sum;
        }

        vm.showCliente = function (cliente) {
            $('#modalCliente').modal('show');
    
                    
           var table = $('#editableReservas').DataTable();
           table.destroy();   
           
            vm.estadisticas_reservas.cumplida = 0;
            vm.estadisticas_reservas.incumplida = 0;
            vm.estadisticas_reservas.cancelada = 0;
            vm.estadisticas_reservas.confirmadasinabono = 0;
            vm.estadisticas_reservas.confirmadaconabono = 0;
            vm.estadisticas_reservas.esperandorevision = 0;
            vm.estadisticas_reservas.esperandoconfirmacion = 0;

            var promisePost = clienteService.getHistoriaBySitio(cliente.idCliente, sessionService.getIdSitio());
            promisePost.then(function (d) {
                
                vm.cliente = d.data.cliente;
                vm.Reservas = d.data.reservas;

                
                setTimeout(function(){
                     var oTable = $('#editableReservas').DataTable();
               },500);
                
                for (var i = 0; i < vm.Reservas.length; i++) {
                    if (vm.Reservas[i].estado == 'cumplida') {
                        vm.estadisticas_reservas.cumplida += 1;
                    }
                    if (vm.Reservas[i].estado == 'incumplida') {
                        vm.estadisticas_reservas.incumplida += 1;

                    }
                    if (vm.Reservas[i].estado == 'cancelada') {
                        vm.estadisticas_reservas.cancelada += 1;

                    }
                    if (vm.Reservas[i].estado == 'confirmadasinabono') {
                        vm.estadisticas_reservas.confirmadasinabono += 1;

                    }
                    if (vm.Reservas[i].estado == 'confirmadaconabono') {
                        vm.estadisticas_reservas.confirmadaconabono += 1;

                    }

                    if (vm.Reservas[i].estado == 'esperandorevision') {
                        vm.estadisticas_reservas.esperandorevision += 1;

                    }
                    if (vm.Reservas[i].estado == 'esperandoconfirmacion') {
                        vm.estadisticas_reservas.esperandoconfirmacion += 1;

                    }
                }
                /*  vm.estadisticas_reservas.cumplida_porcentaje =Math.round((vm.estadisticas_reservas.cumplida*100)/vm.Reservas.length);
                 vm.estadisticas_reservas.incumplida_porcentaje =Math.round((vm.estadisticas_reservas.incumplida*100)/vm.Reservas.length);
                 vm.estadisticas_reservas.cancelada_porcentaje =Math.round((vm.estadisticas_reservas.cancelada*100)/vm.Reservas.length);
                 vm.estadisticas_reservas.confirmadasinabono_porcentaje =Math.round((vm.estadisticas_reservas.confirmadasinabono*100)/vm.Reservas.length);
                 vm.estadisticas_reservas.confirmadaconabono_porcentaje =Math.round((vm.estadisticas_reservas.confirmadaconabono*100)/vm.Reservas.length);
                 vm.estadisticas_reservas.esperandorevision_porcentaje =Math.round((vm.estadisticas_reservas.esperandorevision*100)/vm.Reservas.length);
                 vm.estadisticas_reservas.esperandoconfirmacion_porcentaje =Math.round((vm.estadisticas_reservas.esperandoconfirmacion*100)/vm.Reservas.length);*/
                drawChart(vm.estadisticas_reservas);
            }, function (err) {
                if (err.status == 401) {
                    toastr["error"](err.data.respuesta);
                } else {
                    toastr["error"]("Ha ocurrido un problema!");
                }
            });
        }
    }

    function drawChart(estadisticas) {



        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
            ['Incumplidas', estadisticas.incumplida],
            ['Canceladas', estadisticas.cancelada],
            ['Cumplidas', estadisticas.cumplida],
            ['Confirmadas', estadisticas.confirmadasinabono + estadisticas.confirmadaconabono],
            ['En Espera', estadisticas.esperandoconfirmacion + estadisticas.esperandorevision]
        ]);

        // Set chart options
        var options = {'title': 'Reservas',
            'width': 280,
            'height': 280,
            colors: ['#F8AC59', '#ed5565', '#1C84C6', '#23c6c8', '#1AB394'],

            pieHole: 0.5,
            pieSliceTextStyle: {
                color: 'white',
            },
            legend: 'none'
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart_reservas'));
        chart.draw(data, options);


    }

})();
