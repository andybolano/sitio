(function () {
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('HistorialController', function (reservasService, sessionService, clienteService) {
                var vm = this;
                vm.fecha1 = "";
                vm.fecha2 = "";
                vm.reservas = "";
                vm.finanzas = {};
                vm.v_reserva = {};
                vm.v_estadisticas = {};
                vm.getReservas = getReservas;
                vm.viewReserva = viewReserva;
                
        Date.prototype.toDateInputValue = (function () {
            var local = new Date(this);
            local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
        });
        
        vm.fecha1 = new Date();
        vm.fecha2 = new Date();
        
        
        
       function viewReserva(reserva){
       
            $('#consult_reserva').modal('show');
            
            var canchas = JSON.parse(localStorage.getItem('canchas'));
            for (var i = 0; i < canchas.length; i++) {
                if (canchas[i].id == reserva.idCancha) {
                    var cancha = canchas[i].nombre;
                    break;
                }
            }
            
                vm.v_reserva = reserva;
                vm.v_reserva.cancha = cancha;
        
            vm.v_estadisticas.cumplidas = 0;
            vm.v_estadisticas.incumplidas = 0;
            vm.v_estadisticas.canceladas = 0;

            var promisePost = clienteService.get(reserva.idCliente);
            promisePost.then(function (d) {
                vm.v_cliente = d.data.cliente;

                for (var i = 0; i < d.data.reservas.length; i++) {
                    if (d.data.reservas[i].estado === 'cumplida') {
                        vm.v_estadisticas.cumplidas = d.data.reservas[i].cantidad;
                    }
                    if (d.data.reservas[i].estado === 'incumplida') {
                        vm.v_estadisticas.incumplidas = d.data.reservas[i].cantidad;
                    }
                    if (d.data.reservas[i].estado === 'cancelada') {
                        vm.v_estadisticas.canceladas = d.data.reservas[i].cantidad;
                    }
                }

            }, function (err) {
                if (err.status == 401) {
                    toastr["error"](err.data.respuesta);
                } else {
                    toastr["error"]("Ha ocurrido un problema!");
                }
            });
        }
                function getReservas(){
                   var promisePost = reservasService.getHistorial(sessionService.getIdSitio(), vm.fecha1.toDateInputValue(), vm.fecha2.toDateInputValue());
                    promisePost.then(function (d) {
                        vm.reservas = d.data.reservas;
                        
                        google.charts.setOnLoadCallback(drawChart);
                        
                        vm.finanzas.expectativa = parseInt(d.data.finanzas.posibleEntrada);
                        vm.finanzas.realidad = parseInt(d.data.finanzas.dineroEntrante);
                        vm.finanzas.abonos = parseInt(d.data.finanzas.abonos);
                        
                    }, function (err) {
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
                }
                
                
                function drawChart(){
   // Create the data table.
   var incumplidas = 0;
   var canceladas = 0;
   var cumplidas = 0;
   var espera = 0;
                  var promisePost = reservasService.getEstadisticasByFecha(sessionService.getIdSitio(), vm.fecha1.toDateInputValue(), vm.fecha2.toDateInputValue());
                        promisePost.then(function (d) {
                            var i=0;
                            for(i=0; i<d.data.reservas.length; i++){
                                if(d.data.reservas[i].estado ==='confirmadasinabono' || d.data.reservas[i].estado ==='confirmadaconabono'){
                                    espera += parseInt(d.data.reservas[i].cantidad);
                                }
                                if(d.data.reservas[i].estado ==='cumplida' ){
                                    cumplidas = parseInt(d.data.reservas[i].cantidad);
                                }
                                if(d.data.reservas[i].estado ==='incumplida' ){
                                    incumplidas = parseInt(d.data.reservas[i].cantidad);
                                }
                                if(d.data.reservas[i].estado ==='cancelada' ){
                                    canceladas = parseInt(d.data.reservas[i].cantidad);
                                }
                            }
                            
                     var data = new google.visualization.DataTable();
                        data.addColumn('string', 'Topping');
                        data.addColumn('number', 'Slices');
                        data.addRows([
                          ['Incumplidas', incumplidas],
                          ['Canceladas', canceladas],
                          ['Cumplidas', cumplidas],
                          ['En Espera',espera]
                        ]);

                        // Set chart options
                        var options = {'title':'Estadisticas de historial',
                                       'width':280,
                                       'height':280,
                                       colors: ['#F8AC59','#ed5565','#1C84C6','#1AB394'],

                                      pieHole: 0.5,
                                        pieSliceTextStyle: {
                                          color: 'white',
                                        },
                                     legend: 'none'
                                   };

                            var chart = new google.visualization.PieChart(document.getElementById('chart_reservas'));
                            chart.draw(data, options);
                            
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



