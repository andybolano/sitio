(function(){
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('HomeController', function(reservasService,sessionService,clienteService,$scope){
          
              var vm = this;
              vm.sitio = {};
              vm.v_reserva = {};
              vm.v_estadisticas = {};
              vm.finanzas = {};
              $scope.time = "";
              $scope.hora = "";
              vm.getReservasHoy = getReservasHoy;
              vm.modalDetalle = modalDetalle;
              vm.actualizarEstado = actualizarEstado;
              vm.sitio = JSON.parse(sessionStorage.getItem('data'));
        
         Date.prototype.toDateInputValue = (function () {
            var local = new Date(this);
            local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
        });
        
  function hora() {
    var f = new Date();
    var hor = f.getHours();
    var min = f.getMinutes();
    var sec = f.getSeconds();

    if (hor < 10) {
      hor = 0 + String(hor);
    }
    if (min < 10) {
      min = 0 + String(min);
    }
    if (sec < 10) {
      sec = 0 + String(sec);
    }

  
     $scope.$apply(function () {
      $scope.time = hor + ":" + min + ":" + sec;
      $scope.hora = hor;
    });
    

  }



function drawChart(){
   // Create the data table.
   var incumplidas = 0;
   var canceladas = 0;
   var cumplidas = 0;
   var espera = 0;
   var fecha = new Date().toDateInputValue();
                  var promisePost = reservasService.getEstadisticasByFecha(sessionService.getIdSitio(), fecha, fecha);
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
                        var options = {'title':'Reservas hoy',
                                       'width':280,
                                       'height':280,
                                        colors: ['#F8AC59','#ed5565','#1C84C6','#1AB394'],

                                      pieHole: 0.5,
                                        pieSliceTextStyle: {
                                          color: 'white',
                                        },
                                     legend: 'none'
                                   };

                            var chart = new google.visualization.PieChart(document.getElementById('chart_reservas_hoy'));
                            chart.draw(data, options);
                            
                        }, function (err) {
                            if (err.status == 401) {
                                toastr["error"](err.data.respuesta);
                            } else {
                                toastr["error"]("Ha ocurrido un problema!");
                            }
                    });
}



              function getReservasHoy(){
               setInterval(hora, 1000);
               var fecha = new Date().toDateInputValue();
                  var promisePost = reservasService.getByFechaAll(sessionService.getIdSitio(), fecha);
                        promisePost.then(function (d) {
                             google.charts.setOnLoadCallback(drawChart);

                              vm.finanzas.expectativa = parseInt(d.data.finanzas.posibleEntrada);
                            vm.finanzas.realidad = parseInt(d.data.finanzas.dineroEntrante);
                            vm.finanzas.abonos = parseInt(d.data.finanzas.abonos);

                            if (d.data.length === 0) {
                                toastr['warning']("No hay reservas : " + fecha);
                                 vm.reservas = d.data.reservas;
                                  vm.finanzas.expectativa = 0;
                                   vm.finanzas.realidad = 0;
                            } else {
                               vm.reservas = d.data.reservas;
                          
                             
                              setTimeout(function () {
                                    $('.reloj').cuentaAtras();
                                }, 1000);
                            }
                        }, function (err) {
                            if (err.status == 401) {
                                toastr["error"](err.data.respuesta);
                            } else {
                                toastr["error"]("Ha ocurrido un problema!");
                            }
                    });
              }
              
              function modalDetalle(reserva) {
                    $('#consult_reserva').modal('show');
                    vm.v_reserva = reserva;

                    vm.v_estadisticas.cumplidas = 0;
                    vm.v_estadisticas.incumplidas = 0;
                    vm.v_estadisticas.canceladas = 0;

  
			
                    var promisePost = clienteService.get(reserva.idCliente);
                    promisePost.then(function (d) {
                        var i = 0;
                        for (i = 0; i < d.data.reservas.length; i++) {
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
                        
         if(document.getElementById("pago") !== null) {            
	document.getElementById("pago").value = parseInt(vm.v_reserva.precio - vm.v_reserva.abonoLiquidado);
    }
        
                    }, function (err) {
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
                }
                
                 function actualizarEstado(nuevoEstado, idReserva) {
                    var object = "";
                    var mensaje = "";
                    switch (nuevoEstado)
                    {
                        case 1:
                                nuevoEstado = "cumplida";
                                var pago = parseInt(document.getElementById("pago").value.split('.').join(''));
                                if(document.getElementById("pago").value === ""  || document.getElementById("pago").value === 0 ){
                                    toastr['warning']("Ingrese el valor que se pagó");
                                    return false;
                                }
                                object = {
                                    estado: nuevoEstado,
                                    idReserva: idReserva,
                                    valor: false,
                                    abono: false,
                                    pago: pago
                                }
                                mensaje = "La reserva ha sido cumplida";
                            break;
                        case 0:
                           
                                nuevoEstado = "incumplida";
                                object = {
                                    estado: nuevoEstado,
                                    idReserva: idReserva,
                                    valor: false,
                                    abono: false
                                }
                                mensaje = "La reserva ha sido incumplida";
     
                            break;
                        case 4:
                            nuevoEstado = "cancelada";
                            object = {
                                estado: nuevoEstado,
                                idReserva: idReserva,
                                valor: false,
                                abono: false,
                                emisor: 'SITIO'
                            }
                            mensaje = "Su reserva ha sido cancelada";
                            break;
                    }
                        swal(
                                {title: "Cambiar estado de reserva",
                                    text: "Esta seguro que desea cambiar el estado de esta reserva?",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "Si, Cambiar!",
                                    cancelButtonText: "No!",
                                    closeOnConfirm: false, closeOnCancel: false
                                }, function (isConfirm) {
                            if (isConfirm) {
          
                                    var promisePost = reservasService.updateReservas(object);
                                    promisePost.then(function (d) {
                                        if (d.data.respuesta === true) {
                                            $('#consult_reserva').modal('hide');
                                            swal("Buen Trabajo!", mensaje, "success");
                                            vm.getReservasHoy();
                                        }
                                    }, function (err) {
                                        if (err.status == 401) {
                                            sweetAlert('Oops', err.data.respuesta, "error");
                                            console.log(err.data.exception);
                                        } else {
                                            sweetAlert("Oops...", "Ha ocurrido un problema!", "error");
                                        }
                                        console.log(err);
                                    });
                             
                            } else {
                                swal("Buen trabajo", "Has abortado el cambio de estado de la reserva!", "error");
                            }
                        });
                }
            });
})();




