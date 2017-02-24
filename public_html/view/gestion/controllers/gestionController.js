(function () {
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('GestionController', function (reservasService, sessionService, clienteService) {
                var vm = this;
                vm.getReservas = getReservas;
                vm.modalDetalle = modalDetalle;
                vm.actualizarEstado = actualizarEstado;
                vm.nuevasSolicitudes = [];
                vm.esperandoConfirmacion = [];
                vm.confirmadas = [];
                vm.v_reserva = {};
                vm.v_estadisticas = {};
                vm.dinero = {};


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

                    }, function (err) {
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
                }

                function actualizarEstado(nuevoEstado, idReserva, masAbono) {
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
                                    abono: parseInt(vm.dinero.abonoCancelado + masAbono)
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


