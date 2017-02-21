(function () {

    'use strict';

    angular
            .module('BirriasSitios')
            .controller('ReservasController', ReservasController);


    function ReservasController(canchaService, sessionService, $scope, reservasService) {
        var vm = this;

        // var
        vm.sitio = {};
        vm.Canchas = [];
        vm.diaSemana = "";
        vm.fecha = "";
        var dias = new Array('', 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado');
        vm.RESERVA = [];
        vm.Cliente = {};
        //methods
        vm.reservar = reservar;
        vm.getCanchas = getCanchas;
        vm.diaSemana = diaSemana;
        vm.showAgendaDiaByCancha = showAgendaDiaByCancha;
        vm.getAgendaDiaByCancha = getAgendaDiaByCancha;
        vm.showCanchas = showCanchas;
        vm.showReserva = showReserva;
        vm.reservar = reservar;


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


        function reservar() {

        }

        function getCanchas() {
            if (localStorage.getItem('canchas') == null) {
                var promisePost = canchaService.get(sessionService.getIdSitio());
                promisePost.then(function (d) {
                    localStorage.setItem('canchas', JSON.stringify(d.data));
                    vm.Canchas = d.data;
                    vm.showCanchas();
                }, function (err) {
                    if (err.status == 401) {
                        toastr["error"](err.data.respuesta);
                    } else {
                        toastr["error"]("Ha ocurrido un problema!");
                    }
                });

            } else {
                vm.Canchas = JSON.parse(localStorage.getItem('canchas'));
                showCanchas();
            }
        }




        function showCanchas() {
            var canchas = "";
            var item = "";
            var over = "hidden";
            for (var i = 0; i < vm.Canchas.length; i++) {
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
                        '<div class="panel-body"  style="overflow-y:' + over + ';height:450px;padding:0;">' +
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
            for (var i = 0; i < data_canchas.length; i++) {
                $('#lista_horas_' + data_canchas[i].id + '').html("");
            }
            for (var i = 0; i < data_canchas.length; i++) {
                for (var h = 0; h <= 23; h++) {
                    horaReservas = "<li id='li_" + data_canchas[i].id + "_" + h + ":00_" + fecha + "'>" +
                            "<input type='checkbox' id='check_" + data_canchas[i].id + "_" + h + ":00_" + fecha + "' value='" + h + "," + data_canchas[i].id + "' onclick='angular.element(this).scope().cargarReserva(this.value)'><i>" +
                            '<span class="m-l-xs" style="font-style:normal;font-weight:900;font-size:12px">' + h + ':00</span>' +
                            '</li>';
                    $('#lista_horas_' + data_canchas[i].id + '').append(horaReservas);
                }
            }
            for (var r = 0; r < data_canchas.length; r++) {
                getAgendaDiaByCancha(data_canchas[r]._id, fecha);
            }



            $(".panel-body").on("scroll", function () {
                $(".panel-body").scrollTop($(this).scrollTop());
            });
        }


        function getAgendaDiaByCancha(cancha, fecha) {
            var fechaShow = "";
            var idColor = "";
            var idCheck = "";
            var listaAgenda = "";
        }

        $scope.cargarReserva = function (horaCancha) {
            var fecha = document.getElementById("fechaReserva").value;
            var horacancha = horaCancha.split(",");
            var hora = horacancha[0];
            var cancha = horacancha[1];
            var nombreCancha = "";
            var token = false;
            var data_canchas = JSON.parse(localStorage.getItem('canchas'));

            for (var i = 0; i < data_canchas.length; i++)
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
                for (var i = 0; i < vm.RESERVA.length; i++) {
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

        function showReserva() {
            $("#reserva").modal('show');
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
                for (var i = 0; i < vm.RESERVA.length; i++) {
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
                            abonoRequerido:parseInt(document.getElementById('abonoRequerido' + i).value.split('.').join('')),
                            abonoLiquidado:parseInt(document.getElementById('abonoLiquidado' + i).value.split('.').join('')),
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
                                       if(d.data.respuesta === true){
                                           swal("Buen trabajo!", d.data.message, "success")
                                           vm.RESERVA = [];
                                           reserva = "";
                                           detalle = [];
                                           $("#reserva").modal('hide');
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

    }
})();



/*
 *   $insertSQL = $insertSQL.sprintf("['idSitio' => ".$sitio."], 'idCancha' => ".$reserva->idcancha." , 'idCliente' => ".$cliente_insert." , 'fecha' => ".$reserva->fecha.", 'hora' => ".$reserva->hora." , 'diaSemana' => ".$reserva->diaSemana.", 'via'  => ".$via.", 'tipo' => ".$tipo.", 'precio' => ".$detalle[$key]."");
 */

 //var_dump($detalle[0]['precio']);