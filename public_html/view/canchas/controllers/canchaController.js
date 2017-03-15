(function () {
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('CanchaController', function (canchaService, sessionService, $location) {

                var vm = this;
                vm.sitio = {};
                vm.view = view;
                vm.viewPrice = viewPrice;
                vm.updatePrices = updatePrices;
                vm.getCanchas = getCanchas;
                vm.updateState = updateState;
                vm.guardar = guardar;
                vm.eliminar = eliminar;
                vm.update = update;
                vm.updateImage = updateImage;
                vm.Cancha = {};
                vm.precios = {};
                vm.Canchas = [];

                var path = $location.path();

                function viewPrice(cancha) {
                    vm.Cancha.nombre = cancha.nombre;
                    vm.Cancha.id = cancha.id;
                    var promisePost = canchaService.getPrecios(cancha.id);
                    promisePost.then(function (d) {
                        vm.precios = d.data;
                        $('#precios').modal('show');
                    }, function (err) {
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });

                }
                
                function updatePrices(cancha) {
                    var promisePost = canchaService.putPrecios(cancha, vm.precios);
                    promisePost.then(function (d) {
                        if (d.data.respuesta === true) {
                          $('#precios').modal('hide');
                            toastr["success"](d.data.message);
                           localStorage.removeItem('canchas');
                           vm.getCanchas();
                        } else {
                            toastr["error"]("Ha ocurrido un problema");
                        }
                    }, function (err) {
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
                }
                
                function updateState(id, state) {
                    var object = {
                        estado: state
                    }
                    var promisePost = canchaService.updateState(object, id);
                    promisePost.then(function (d) {
                        toastr['success'](d.data.message);
                        localStorage.removeItem('canchas');
                        vm.getCanchas();
                    }, function (err) {
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
                }
                
                function guardar() {
                    if (vm.Cancha.nombre == undefined || vm.Cancha.largo == undefined || vm.Cancha.ancho == undefined || vm.Cancha.techo == undefined || vm.Cancha.numeroJugadores == undefined) {
                        toastr.error("Oops, dale a tus clientes toda la informacion de tu cancha!");
                    } else {
                        if (vm.Cancha.numeroJugadores > 11) {
                            toastr.warning("Jugadores por equipo " + vm.Cancha.numeroJugadores + "? estoy confundido, que clase de deporte se jugará en esta cancha!");
                        } else {
                            if (vm.Cancha.ancho >= vm.Cancha.largo) {
                                toastr.warning("Estoy confundido, revisa las medidas de tu cancha!");
                            } else {
                                var formData = new FormData();
                                if (vm.Cancha.imagen != undefined) {
                                    formData.append('imagen', vm.Cancha.imagen);
                                }

                                formData.append('idSitio', sessionService.getIdSitio());
                                formData.append('nombre', vm.Cancha.nombre);
                                formData.append('largo', vm.Cancha.largo);
                                formData.append('ancho', vm.Cancha.ancho);
                                formData.append('techo', vm.Cancha.techo);
                                formData.append('jugadores', vm.Cancha.numeroJugadores);
                                formData.append('image', vm.Cancha.imagen);
                                $('#registro').attr("disabled", true);
                                var promisePost = canchaService.post(formData);
                                promisePost.then(function (d) {
                                    $('#registro').attr("disabled", false);
                                    vm.Cancha = "";
                                    document.getElementById("image").innerHTML = "";
                                    swal("Buen Trabajo!", d.data.message, "success");
                                    localStorage.removeItem('canchas');
                                    vm.getCanchas();
                                }, function (err) {
                                    $('#registro').attr("disabled", false);
                                    if (err.status == 401) {
                                        toastr["error"](err.data.respuesta);
                                    } else {
                                        toastr["error"]("Ha ocurrido un problema!");
                                    }
                                });
                            }
                        }
                    }
                }

                function getCanchas() {
                    if (localStorage.getItem('canchas') == null) {
                        var promisePost = canchaService.get(sessionService.getIdSitio());
                        promisePost.then(function (d) {
                            localStorage.setItem('precios', JSON.stringify(d.data.precios));
                             localStorage.setItem('canchas', JSON.stringify(d.data.canchas));
                            vm.Canchas = d.data.canchas;
                        }, function (err) {
                            if (err.status == 401) {
                                toastr["error"](err.data.respuesta);
                            } else {
                                toastr["error"]("Ha ocurrido un problema!");
                            }
                        });

                    } else {
                        vm.Canchas = JSON.parse(localStorage.getItem('canchas'));
                    }
                }

                function eliminar(id) {
                    swal({
                        title: "Confirmación",
                        text: "Esta seguro que desea eliminar esta cancha?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Si, Eliminar!",
                        cancelButtonText: "Mejor no",
                        closeOnConfirm: false
                    },
                            function () {

                                var promisePost = canchaService.remove(id);
                                promisePost.then(function (d) {

                                    swal("Eliminada!", d.data.message, "success");
                                    localStorage.removeItem('canchas');
                                    vm.getCanchas();

                                }, function (err) {
                                    if (err.status == 401) {
                                        toastr["error"](err.data.respuesta);
                                    } else {
                                        toastr["error"]("Ha ocurrido un problema!");
                                    }
                                });
                            });


                }

                function view(item){


                    vm.Cancha.id = item.id;
                    vm.Cancha.nombre = item.nombre;
                    vm.Cancha.largo = parseInt(item.largo);
                    vm.Cancha.ancho = parseInt(item.ancho);
                    vm.Cancha.jugadores = parseInt(item.jugadores);
                    vm.Cancha.techo = item.techo;
                    vm.Cancha.image = item.image;
                    vm.Cancha.ruta = item.ruta;

                    $('#cancha').modal('show');
                    setTimeout(function () {
                        document.getElementById('files').addEventListener('change', archivo, false);
                    }, 1000)
                }

                function update() {
                    var promisePost = canchaService.update(vm.Cancha.id, vm.Cancha);
                    promisePost.then(function (d) {
                        $('#cancha').modal('hide');
                        swal("Actualizada!", d.data.message, "success");
                        localStorage.removeItem('canchas');
                        vm.getCanchas();

                    }, function (err) {
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
                }

                function updateImage() {
                    var formData = new FormData();
                    if (vm.Cancha.imagen != undefined) {
                        formData.append('imagen', vm.Cancha.imagen);
                        formData.append('id', vm.Cancha.id);
                    } else {
                        toastr['warning']("Es nesario cargar una imagen");
                        return false;
                    }

                    var promisePost = canchaService.updateImage(formData);
                    promisePost.then(function (d) {
                        vm.Cancha = {};
                        $('#cancha').modal('hide');
                        document.getElementById("image").innerHTML = "";
                        swal("Buen Trabajo!", d.data.message, "success");
                        localStorage.removeItem('canchas');
                        vm.getCanchas();
                    }, function (err) {
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
                }

                if (path === '/canchas/registro') {
                    setTimeout(function () {
                        document.getElementById('files').addEventListener('change', archivo, false);
                    }, 1000)
                }

            });

    function archivo(evt) {
        var files = evt.target.files;
        for (var i = 0, f; f = files[i]; i++) {
            if (!f.type.match('image.*')) {
                continue;
            }
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    document.getElementById("image").innerHTML = ['<img  style="width:100%;" src="', e.target.result, '" title="', escape(theFile.name), '"/>'].join('');
                };
            })(f);
            reader.readAsDataURL(f);
        }
    }

    $(':file').change(function () {
        var file = $("#files")[0].files[0];
        var fileName = file.name;
        fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        var fileSize = file.size;
        var fileType = file.type;
    });
})();

