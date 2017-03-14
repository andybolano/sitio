(function () {
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('GestionController', function (reservasService, sessionService, clienteService,$state) {
                var vm = this;
                vm.getReservas = getReservas;
                vm.modalDetalle = modalDetalle;
                vm.actualizarEstadoGestion = actualizarEstadoGestion;
                vm.moverReserva = moverReserva;
                vm.nuevasSolicitudes = [];
                vm.esperandoConfirmacion = [];
                vm.confirmadas = [];
                vm.v_reserva = {};
          
                vm.dinero = {};
                vm.fechaHoy = "";
                
        Date.prototype.toDateInputValue = (function () {
            var local = new Date(this);
            local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
        });
        
        vm.fechaHoy = new Date().toDateInputValue();


function moverReserva(){
    $('#consult_reserva').modal('hide');
    vm.v_reserva.estadisticas = vm.v_estadisticas;
    localStorage.setItem("reservaMover",JSON.stringify(vm.v_reserva));
    $state.go("app.reserve");
}
                function getReservas() {
                     vm.nuevasSolicitudes = [];
                     vm.esperandoConfirmacion = [];
                     vm.confirmadas = [];
                    var promisePost = reservasService.getBySitio(sessionService.getIdSitio());
                    promisePost.then(function (d) {
                        if (d.data.length > 0) {
                            var i = 0;
                            for (i = 0; i < d.data.length; i++)
                            {
                         
                                if (d.data[i].estado == 'esperandorevision') {
                                    vm.nuevasSolicitudes.push(d.data[i]);
                                } else if (d.data[i].estado == "esperandoconfirmacion") {
                                    vm.esperandoConfirmacion.push(d.data[i]);
                                } else if (d.data[i].estado == "confirmadaconabono" || d.data[i].estado == "confirmadasinabono") {
                                    vm.confirmadas.push(d.data[i]);
                                }
                            }
                        } else {
                            toastr.warning("No hay reservas en proceso!");
                        }
                    }, function (err) {
                        if (err.status == 401) {
                            toastr["error"](err.data);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
                }

                function modalDetalle(reserva) {
                    $('#consult_reserva').modal('show');
                    vm.v_reserva = reserva;
                         if(document.getElementById("pago") !== null) {            
                            document.getElementById("pago").value = parseInt(vm.v_reserva.precio - vm.v_reserva.abonoLiquidado);
                        }
                   
                }

                function actualizarEstadoGestion(nuevoEstado, idReserva) {
                    var object = "";
                    var mensaje = "";
                    var bandera = true;
                    switch (nuevoEstado)
                    {
                        case 1:
                            if (vm.dinero.cancha == undefined) {
                                toastr.warning("Informale a tu cliente el valor de la cancha!");
                                bandera = false;
                            } else {
                                nuevoEstado = "esperandoconfirmacion";
                                object = {
                                    estado: nuevoEstado,
                                    idReserva: idReserva,
                                    valor: vm.dinero.cancha,
                                    abono: vm.dinero.abono
                                }
                                mensaje = "Se ha enviado la solicitud de confirmacion a tu cliente";
                            }
                            vm.dinero = "";
                            break;
                        case 2:
                            if (vm.dinero.abonoCancelado == undefined) {
                                toastr.warning("Debes registrar el abono!");
                                bandera = false;
                            } else {
                                nuevoEstado = "confirmadaconabono";
                                object = {
                                    estado: nuevoEstado,
                                    idReserva: idReserva,
                                    valor: false,
                                    abono: vm.dinero.abonoCancelado
                                }
                                mensaje = "Esta reserva ha sido confirmada y ha sido registrado su abono";
                            }
                            vm.dinero = "";
                            break;
                        case 21:
                            if (vm.dinero.abonoCancelado == undefined) {
                                toastr.warning("Debes registrar el abono!");
                                bandera = false;
                            } else {
                                nuevoEstado = "confirmadaconabono";
                                object = {
                                    estado: nuevoEstado,
                                    idReserva: idReserva,
                                    valor: false,
                                    abono: parseInt(vm.dinero.abonoCancelado)
                                }
                               
                                mensaje = "Esta reserva ha sido confirmada y ha sido registrado su abono";
                            }
                            vm.dinero = "";
                            break;
                        case 3:
                            nuevoEstado = "confirmadasinabono";
                            object = {
                                estado: nuevoEstado,
                                idReserva: idReserva,
                                valor: false,
                                abono: false
                            }
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
                            
                        case 5:
                            
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
                            break
                            
                        case 6:
                              nuevoEstado = "incumplida";
                                object = {
                                    estado: nuevoEstado,
                                    idReserva: idReserva,
                                    valor: false,
                                    abono: false
                                }
                                mensaje = "La reserva ha sido incumplida"
                            break
                    }
                    if (nuevoEstado === "cancelada") {
                        swal(
                                {title: "Cancelar reserva",
                                    text: "Esta seguro que desea Cancelar esta reserva",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "Si, Cancelar!",
                                    cancelButtonText: "No!",
                                    closeOnConfirm: false, closeOnCancel: false
                                }, function (isConfirm) {
                            if (isConfirm) {
                                if (bandera == true) {
                                    var promisePost = reservasService.updateReservas(object);
                                    promisePost.then(function (d) {
                                        if (d.data.respuesta == true) {
                                            $('#consult_reserva').modal('hide');
                                            swal("Buen Trabajo!", mensaje, "success");
                                            vm.dinero = {};
                                            vm.getReservas();
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
                                }
                            } else {
                                swal("Buen trabajo", "Has abortado la cancelacion de la reserva!", "error");
                            }
                        });
                    } else {
                        if (bandera === true) {
                            var promisePost = reservasService.updateReservas(object);
                            promisePost.then(function (d) {
                             
                                if (d.data.respuesta == true) {
                                    $('#consult_reserva').modal('hide');
                                    swal("Buen Trabajo!", mensaje, "success");
                                    vm.dinero = {};
                                    vm.getReservas();
                                }
                            }, function (err) {
                                if (err.status == 401) {
                                    sweetAlert('Oops', err.data.respuesta, "error");
                                    console.log(err.data.exception);
                                } else {
                                    sweetAlert("Oops...", "Ha ocurrido un problema!", "error");
                                }
                            });
                        }

                    }
                }
            });
})();


