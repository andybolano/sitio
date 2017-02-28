(function () {

    'use strict';

    angular
            .module('BirriasSitios')
            .controller('ReservasController', ReservasController);


    function ReservasController(canchaService, sessionService, $scope, reservasService, $state, clienteService) {
        var vm = this;

        // var
        vm.sitio = {};
        vm.Canchas = [];
        vm.diaSemana = "";
        vm.fecha = "";
        var dias = new Array('', 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado');
        vm.RESERVA = [];
        vm.Cliente = {};
        vm.v_reserva = {};
        vm.v_cliente = {};
        vm.v_estadisticas = {};
        //methods
        vm.reservar = reservar;
        vm.getCanchas = getCanchas;
        vm.diaSemana = diaSemana;
        vm.showAgendaDiaByCancha = showAgendaDiaByCancha;
        vm.getAgendaDiaByCancha = getAgendaDiaByCancha;
        vm.showCanchas = showCanchas;
        vm.reservar = reservar;
        vm.moveToFecha = moveToFecha;
        vm.getCliente = getCliente;
        
        function getCliente(){
            if(vm.Cliente.telefono !== undefined && vm.Cliente.telefono !== ""){
            var promisePost = clienteService.getByPhone(vm.Cliente.telefono);
                promisePost.then(function (d) {
                    if(d.data.respuesta == false){
                        toastr["warning"](d.data.message);
                        vm.Cliente.nombre = "";
                    }
                    if(d.data.respuesta == true){
                       vm.Cliente.nombre = d.data.user.nombres;
                    }
                }, function (err) {
                    if (err.status == 401) {
                        toastr["error"](err.data.respuesta);
                    } else {
                        toastr["error"]("Ha ocurrido un problema!");
                    }
                });
            
            }
        }
        function moveToFecha(direction) {
            var f1 = new Date(vm.fecha);
            var fecha = "";
            if (direction === '+') {
                fecha = new Date(f1.getTime() + 24 * 60 * 60 * 1000);
            }
            if (direction === '-') {
                fecha = new Date(f1.getTime() - 24 * 60 * 60 * 1000);
            }
            vm.fecha = new Date(fecha);
            vm.showAgendaDiaByCancha();
        }

        $('.spin-icon').click(function () {
            $(".theme-config-box").toggleClass("show");
        });

        Date.prototype.toDateInputValue = (function () {
            var local = new Date(this);
            local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
            return local.toJSON().slice(0, 10);
        });

        vm.fecha = new Date();


        $('.i-checks').iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-green',
        });

        function diaSemana() {
            var dia = dia_semana(vm.fecha.toDateInputValue());
            vm.diaSemana = dias[dia];
        }

        function getCanchas() {
            if (localStorage.getItem('canchas') == null) {
                var promisePost = canchaService.get(sessionService.getIdSitio());
                promisePost.then(function (d) {
                    localStorage.setItem('canchas', JSON.stringify(d.data));
                    vm.Canchas = d.data;
                    vm.showCanchas();
                    if (vm.Canchas.length == 0) {
                        swal({
                            title: "No hay canchas!",
                            text: "Primero deberas registrar tus canchas.",
                            timer: 2000,
                            showConfirmButton: false
                        });

                        setTimeout(function () {
                            $state.go('app.canchas');
                        }, 2000)
                    } else {
                        showCanchas();
                    }
                }, function (err) {
                    if (err.status == 401) {
                        toastr["error"](err.data.respuesta);
                    } else {
                        toastr["error"]("Ha ocurrido un problema!");
                    }
                });

            } else {
                vm.Canchas = JSON.parse(localStorage.getItem('canchas'));
                if (vm.Canchas.length == 0) {
                    swal({
                        title: "No hay canchas!",
                        text: "Primero deberas registrar tus canchas.",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    setTimeout(function () {
                        $state.go('app.canchas');
                    }, 2000)
                } else {
                    showCanchas();
                }
            }
        }

        function showCanchas() {
            var canchas = "";
            var item = "";
            var over = "hidden";
            var i = 0;
            for (i = 0; i < vm.Canchas.length; i++) {
                if (i === 0) {
                    over = "auto";
                } else {
                    over = "hidden";
                }
                item = '<div class="col-md-2" style="margin:0;padding:1px">' +
                        '<div class="panel panel-default" style="border:0px solid #FF532D">' +
                        '<div class="panel-heading" style="background-color:#FF532D;color:#FFFFFF;font-weight:900;border-radius:0"> ' +
                        vm.Canchas[i].nombre +
                        '</div>' +
                        '<div class="panel-body"  style="overflow-y:' + over + ';padding:0;">' +
                        '<ul class="todo-list m-t small-list" id="lista_horas_' + vm.Canchas[i].id + '">' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>';

                canchas = item + canchas;
                item = "";
            }
            document.getElementById("canchas").innerHTML = canchas;
            showAgendaDiaByCancha();

        }

        function showAgendaDiaByCancha() {
            diaSemana();
            var fecha = vm.fecha.toDateInputValue();
            var array = vm.fecha.toDateInputValue().split("-");
            var anio = parseInt(array.splice(0, 1));
            var dia = parseInt(array.splice(1, 2));
            var mes = array;
            var data_canchas = JSON.parse(localStorage.getItem('canchas'));
            var horaReservas = "";
            var i = 0;
            var h = 0;
            for (i = 0; i < data_canchas.length; i++) {
                $('#lista_horas_' + data_canchas[i].id + '').html("");
            }
            for (i = 0; i < data_canchas.length; i++) {
                for (h = 5; h <= 23; h++) {
                    horaReservas = "<li id='li_" + data_canchas[i].id + "_" + h + "_" + fecha + "'>" +
                            "<input type='checkbox' id='check_" + data_canchas[i].id + "_" + h + "_" + fecha + "' value='" + h + "," + data_canchas[i].id + "' onclick='angular.element(this).scope().cargarReserva(this.value)'><i>" +
                            '<span class="m-l-xs" style="font-style:normal;font-weight:900;font-size:12px">' + h + ':00</span>' +
                            '</li>';
                    $('#lista_horas_' + data_canchas[i].id + '').append(horaReservas);
                }
            }


            getAgendaDiaByCancha();

            $(".panel-body").on("scroll", function () {
                $(".panel-body").scrollTop($(this).scrollTop());
            });
        }

        function getAgendaDiaByCancha() {

            //para cuando estoy reservando en varios dias checkear los dias donde me muevo
            if (vm.RESERVA.length > 0) {
                var i = 0;
                for (i = 0; i < vm.RESERVA.length; i++) {
                    if (vm.RESERVA[i].fecha === vm.fecha.toDateInputValue()) {
                        var idCheck = "check_" + vm.RESERVA[i].idcancha + "_" + vm.RESERVA[i].hora + "_" + vm.RESERVA[i].fecha;
                        document.getElementById(idCheck).checked = true;
                    }

                }
            }


            var fecha = vm.fecha.toDateInputValue();
            var promisePost = reservasService.getByFecha(sessionService.getIdSitio(), fecha);
            promisePost.then(function (d) {
                if (d.data.length === 0) {
                    toastr['warning']("No hay reservas : " + fecha);
                } else {
                    print_reservadas(d.data);
                }
            }, function (err) {
                if (err.status == 401) {
                    toastr["error"](err.data.respuesta);
                } else {
                    toastr["error"]("Ha ocurrido un problema!");
                }
            });


        }

        function print_reservadas(agenda) {
          
            var element_hour = "";
            var i = 0;
           for (i = 0; i < agenda.length; i++) {
                element_hour = "li_" + agenda[i].idCancha + "_" + agenda[i].hora + "_" + agenda[i].fecha;
                document.getElementById(element_hour).style.background = "#FF3F45";
                document.getElementById(element_hour).style.color = "#FFFFFF";
                document.getElementById(element_hour).innerHTML = "<a href='javascript:;' style='color:#FFF;' onclick='angular.element(this).scope().viewReserva(" + JSON.stringify(agenda[i]) + ")' ><i class='fa fa-eye' style='margin-top:4px;margin-bottom:5px;'></i>&nbsp;&nbsp;" + agenda[i].hora + ":00 </a>";
            }
        }

        $scope.cargarReserva = function (horaCancha) {

            var fecha = document.getElementById("fechaReserva").value;
            var horacancha = horaCancha.split(",");
            var hora = horacancha[0];
            var cancha = horacancha[1];
            var nombreCancha = "";
            var token = false;

            var f = new Date();
            var hoy = f.getFullYear() + "-" + (f.getMonth() + 1) + "-" + f.getDate();
            var resultado = dateComapreTo(hoy, document.getElementById("fechaReserva").value);
            var valid_hora = hora - f.getHours();

            if (resultado > 0) {
                toastr['error']("Imposible devolver el tiempo");
                var idCheck = "check_" + cancha + "_" + hora + "_" + fecha;
                document.getElementById(idCheck).checked = false;
                return false;
            }

            if (valid_hora < 0 && resultado >= 0) {
                toastr['error']("Imposible devolver el tiempo");
                var idCheck = "check_" + cancha + "_" + hora + "_" + fecha;
                document.getElementById(idCheck).checked = false;
                return false;
            }



            var data_canchas = JSON.parse(localStorage.getItem('canchas'));
            var i = 0;
            for (i = 0; i < data_canchas.length; i++)
            {

                if (parseInt(cancha) === parseInt(data_canchas[i].id))
                {
                    nombreCancha = data_canchas[i].nombre;
                }
            }
            var dia = dia_semana(vm.fecha.toDateInputValue());
            var diaSemana = dias[dia];
            var reserva = {"idcancha": cancha, "nombreCancha": nombreCancha, "fecha": fecha, "diaSemana": diaSemana, "hora": hora};
            if (vm.RESERVA.length > 0) {
                var i = 0;
                for (i = 0; i < vm.RESERVA.length; i++) {
                    if (vm.RESERVA[i].idcancha === cancha && vm.RESERVA[i].hora === hora && vm.RESERVA[i].fecha === fecha)
                    {
                        vm.RESERVA.splice(i, 1);
                        token = true;
                    }
                }
            }

            if (token === false) {
                vm.RESERVA.push(reserva);
            }
            $scope.$apply(function () {
                vm.RESERVA;
            });


        }

        function reservar() {
            var token = false;
            var item = "";
            var detalle = [];
            var estado = "";
            if (vm.Cliente.nombre === undefined || vm.Cliente.telefono === undefined) {
                toastr.warning("Aun faltan datos del cliente?");
            } else {
                var tipo = "SIMPLE";

                if (vm.RESERVA.length > 1) {
                    tipo = "COMPUESTA";
                }
                var i = 0;
                for (i = 0; i < vm.RESERVA.length; i++) {
                    if (document.getElementById('precio' + i).value === "" || document.getElementById('abonoRequerido' + i).value === "" || document.getElementById('abonoLiquidado' + i).value === "") {
                        toastr.warning("No se ha ingresado el valor de la reserva o el abono requedo o abono liquidado?");
                        token = false;
                        return false;
                    } else {
                        token = true;
                    }
                }
                if (token === true) {
                    for (i = 0; i < vm.RESERVA.length; i++) {
                        if (document.getElementById('abonoLiquidado' + i).value > 0) {
                            estado = 'confirmadaconabono';
                        } else {
                            estado = 'confirmadasinabono';
                        }
                        item = {
                            precio: parseInt(document.getElementById('precio' + i).value.split('.').join('')),
                            abonoRequerido: parseInt(document.getElementById('abonoRequerido' + i).value.split('.').join('')),
                            abonoLiquidado: parseInt(document.getElementById('abonoLiquidado' + i).value.split('.').join('')),
                            estado: estado
                        };
                        detalle.push(item);
                    }
                    var reserva = {
                        nombre: vm.Cliente.nombre,
                        telefono: vm.Cliente.telefono,
                        reserva: vm.RESERVA,
                        sitio: sessionService.getIdSitio(),
                        via: 'LOCAL',
                        tipo: tipo,
                        detalle: detalle
                    };

                    var promisePost = reservasService.post(reserva);
                    promisePost.then(function (d) {
                        if (d.data.respuesta === true) {
                            swal("Buen trabajo!", d.data.message, "success")
                            vm.RESERVA = [];
                            vm.Cliente = "";
                            reserva = "";
                            detalle = [];
                            $("#reserva").modal('hide');
                            getAgendaDiaByCancha();
                        } else {
                            toastr["error"](d.data.message);
                        }
                    }, function (err) {
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
                }
            }
        }

        $scope.viewReserva = function (reserva) {
            $('#consult_reserva').modal('show');

            var canchas = JSON.parse(localStorage.getItem('canchas'));
            for (var i = 0; i < canchas.length; i++) {
                if (canchas[i].id == reserva.idCancha) {
                    var cancha = canchas[i].nombre;
                    break;
                }
            }
            $scope.$apply(function () {
                vm.v_reserva = reserva;
                vm.v_reserva.cancha = cancha;
            });
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

    }
})();
