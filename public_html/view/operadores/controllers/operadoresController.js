(function() {
    'use strict';
    angular
        .module('BirriasSitios')
        .controller('OperadoresController', OperadoresController);

    function OperadoresController(sessionService, operadorService) {
        var vm = this;
        vm.operador = {};
        vm.Operadores = [];
        vm.getAll = function() {
            var promisePost = operadorService.getAll(sessionService.getIdSitio());
            promisePost.then(function(d) {

                for (var i = 0; i < d.data.operadores.length; i++) {
                    if (d.data.operadores[i].estado == 'ACTIVO') {
                        d.data.operadores[i].estado = true;
                    } else {
                        d.data.operadores[i].estado = false;
                    }
                }
                vm.Operadores = d.data.operadores;

                setTimeout(function() {
                    var oTable = $('#editableOperadores').DataTable();
                }, 500);
            }, function(err) {
                $('#registro').attr("disabled", false);
                if (err.status == 401) {
                    toastr["error"](err.data.respuesta);
                } else {
                    toastr["error"]("Ha ocurrido un problema!");
                }
            });
        }

        vm.save = function() {
            if (vm.operador.identificacion == undefined || vm.operador.nombres == undefined || vm.operador.apellidos == undefined || vm.operador.direccion == undefined || vm.operador.telefono == undefined || vm.operador.usuario == undefined) {
                toastr.error("Oops, falta información por registrar!");
                return 0;
            }

            if (vm.operador.password !== vm.operador.passwordConfirmada) {
                toastr.error("Oops, Las contraseñas ingresadas no coinciden!");
                return 0;
            }
            vm.operador.idSitio = sessionService.getIdSitio();
            $('#registro').attr("disabled", true);
            var promisePost = operadorService.post(vm.operador);
            promisePost.then(function(d) {
                vm.operador = {};
                $('#registro').attr("disabled", false);
                swal("Buen Trabajo!", d.data.message, "success");
                vm.getAll();
            }, function(err) {
                $('#registro').attr("disabled", false);
                if (err.status == 401) {
                    toastr["error"](err.data.respuesta);
                } else {
                    toastr["error"]("Ha ocurrido un problema!");
                }
            });
        }
        vm.updateState = function(operador) {
            if (document.getElementById('checkState' + operador.id).checked) {
                var estado = 'ACTIVO';
            } else {
                var estado = 'INACTIVO';
            }
            var object = {
                id: operador.idUsuario,
                nombres: operador.nombres,
                estado: estado
            };
            console.log(object)

            var promisePost = operadorService.updateState(object, operador.idUsuario);
            promisePost.then(function(d) {
                if (estado == 'ACTIVO') {
                    toastr["success"]("El operador ha sido activado");
                } else {
                    toastr["warning"]("Operador desactivado");
                }

                vm.getFranquicias();
            }, function(err) {
                if (err.status == 401) {
                    toastr["error"](err.data.respuesta);
                } else {
                    toastr["error"]("Ha ocurrido un problema");
                }
            });


        }
    }
})();