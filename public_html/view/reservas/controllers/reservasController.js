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
        vm.dias = [];
        vm.horas = ['05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
        vm.RESERVA = [];
        vm.Cliente = {};
        vm.Cliente.existe = false;
        vm.reservaMover = {};
        vm.reservaMover.existe = false;
        vm.v_reserva = {};
        vm.v_cliente = {};
        vm.r_recurrente = {};
        vm.r_reservas_recurrente = [];
        
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
        vm.cancelarActualizacion = cancelarActualizacion;
        vm.actualizarReserva = actualizarReserva;

        vm.showReservaRecurrente = function(){
            vm.dias = dias;
            $('#modalReservaRecurrente').modal('show');
        }
        
        vm.calcular_reservas_recurrentes = function(){
      
      
      if(!vm.r_recurrente.dia){
          toastr['warning']('Seleccionar dia');
          return ;
      }
      
      if(!vm.r_recurrente.hora){
          toastr['warning']('Seleccionar hora');
          return;
      }
      
      if(!vm.r_recurrente.fechaIni){
          toastr['warning']('Seleccionar fecha de inicio');
          return;
      }
      
       if(!vm.r_recurrente.fechaFin){
          toastr['warning']('Seleccionar fecha de final');
          return;
      }
      
      
       var nombreCancha = "";
       var precios = "";
        var data_canchas = JSON.parse(localStorage.getItem('canchas'));
         var data_precio = JSON.parse(localStorage.getItem('precios'));
          var i = 0;
      
                for (i = 0; i < data_canchas.length; i++)
                {
                  
                    if (parseInt(vm.r_recurrente.cancha) === parseInt(data_canchas[i].id))
                    {
                        nombreCancha = data_canchas[i].nombre;
      
                        if(parseInt(data_precio[i].cancha) === parseInt(vm.r_recurrente.cancha)){
                          precios = data_precio[i].precios;                    
                      } 
                    }
                } 
          var f1 = vm.r_recurrente.fechaIni.toDateInputValue();
          var f2 = vm.r_recurrente.fechaFin.toDateInputValue();
          var inicio = new Date(f1);
          var fin =  new Date(f2);
          
      
      if(fin.getTime() - inicio.getTime() < 0){
          toastr['warning']('Fecha "final" debe de ser mayor a la fecha de "inicio"');
          return;
      }
      vm.r_reservas_recurrente = [];
          var timeDiff = Math.abs(fin.getTime() - inicio.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); //Días entre las dos fechas
         

            for (var i=0; i <= diffDays; i++) 
            {
                if (inicio.getDay() == vm.r_recurrente.dia - 1) {
                     for(var y = 0; y < precios.length; y++){
                        var stringA = precios[y].HORA;
                        var stringB = vm.r_recurrente.hora+":00";
                                 if(stringA === stringB){
                                     
                                     diaSemana = dias[vm.r_recurrente.dia].replace(/á/gi,"a");
                                     var dia_ = diaSemana.toUpperCase();
                                     
                                     var msgList = precios[y];
                                     var msgsKeys = Object.keys(msgList);
                                  
                                    for(var x=0; x< msgsKeys.length; x++)
                                        {
                                            if(msgsKeys[x] === dia_){
                                            var msgType     = msgsKeys[x];
                                            var msgContent  = precios[y][msgType];
                                            msgContent = msgContent.toString()+".";
                                            var precio = parseInt(msgContent.split('.').join(''));
                                            break;
                                            }
                                        }
                                 }
                     }
                     
                    var dia = inicio.getDate();
                    var mes = parseInt(inicio.getMonth()+1);
                     
                    dia = dia.toString();if(dia.length < 2)dia = "0" + dia;
                    mes = mes.toString();if(mes.length < 2)mes = "0" + mes;
                    
                     
                   vm.r_reservas_recurrente.push({'fecha':inicio.getFullYear()+"-"+mes+"-"+dia,'diaSemana':dias[vm.r_recurrente.dia],'hora':vm.r_recurrente.hora,'nombreCancha':nombreCancha,'idcancha':vm.r_recurrente.cancha,'abonoRequerido':0,'precio':precio});
                }
                inicio.setDate(inicio.getDate() + 1);
            }
        }
        
        vm.reservar_recurrente = function(){
            var detalle = [];
            var item = "";
            if(vm.r_reservas_recurrente.length <= 0){
                toastr.warning("Por favor cargar reservas");
                return;
            }
            if (vm.Cliente.nombres === undefined || vm.Cliente.telefono === undefined) {
                toastr.warning("Aun faltan datos del cliente?");
                return;
            } 
            var i = 0;
            for (i = 0; i < vm.r_reservas_recurrente.length; i++) {
                        item = {
                            precio: parseInt(vm.r_reservas_recurrente[i].precio),
                            abonoRequerido: parseInt(vm.r_reservas_recurrente[i].abonoRequerido),
                            estado: 'confirmadasinabono'
                        };
                        detalle.push(item);
                    }
             var reserva = {
                        nombre: vm.Cliente.nombre,
                        telefono: vm.Cliente.telefono.toString(),
                        resenia:vm.Cliente.resenia,
                        reserva:vm.r_reservas_recurrente,
                        sitio: sessionService.getIdSitio(),
                        via: 'LOCAL',
                        tipo: 'RECURRENTE',
                        detalle: detalle
                    };
                    
               
                    $('#reservar_recurrente').attr("disabled", true);
                     var promisePost = reservasService.post(reserva);
                    promisePost.then(function (d) {
                        $('#reservar_recurrente').attr("disabled", false);
                   
                        if (d.data.respuesta === true) {
                            swal("Buen trabajo!", d.data.message, "success")
                            vm.r_reservas_recurrente = [];
                            vm.Cliente = {};
                            reserva = {};
                            detalle = [];
                            vm.Cliente.existe = false;
                            $("#modalReservaRecurrente").modal('hide');
                            getAgendaDiaByCancha();
                        } else {
                            toastr["error"](d.data.message);
                        }
                        
                         
                    }, function (err) {
                        $('#reservar_recurrente').attr("disabled", false);
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
            
            
        }
        
        function getCliente() {
       
            if (vm.Cliente.telefono !== undefined && vm.Cliente.telefono !== "") {
                var promisePost = clienteService.getByPhone(vm.Cliente.telefono);
                promisePost.then(function (d) {
                   
                    if (d.data.respuesta === false) {
                        vm.Cliente.nombres = "";
                        vm.Cliente.existe = false;
                        return false;
                    }
                    if (d.data.respuesta === true) {
                        vm.Cliente = d.data.cliente;
                        vm.Cliente.existe = true;
                     }
                }, function (err) {
                    if (err.status === 401) {
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

        function diaSemana() {
            var dia = dia_semana(vm.fecha.toDateInputValue());
            vm.diaSemana = dias[dia];
        }

        function moverReserva() {
            var reserva = JSON.parse(localStorage.getItem('reservaMover'));
          
            vm.RESERVA.push({
                "id": reserva.id,
                "idcancha": reserva.idCancha,
                "nombreCancha": reserva.nombrecancha,
                "fecha": reserva.fecha,
                "diaSemana": reserva.diaSemana,
                "hora": reserva.hora
            });
            vm.Cliente.existe = true;
            vm.Cliente.telefono = parseInt(reserva.telefono);
            vm.Cliente.nombres = reserva.nombres;
            vm.Cliente.cumplidas = reserva.cumplidas;
            vm.Cliente.incumplidas = reserva.incumplidas;
            vm.Cliente.canceladas = reserva.canceladas;
        }

        function cancelarActualizacion() {
            localStorage.removeItem('reservaMover');
            vm.reservaMover.existe = false;
            vm.RESERVA = [];
            vm.Cliente = {};
            vm.Cliente.existe = false;
            $("#reserva").modal('hide');
            getCanchas();

        }

        function getCanchas() {
            if (localStorage.getItem('reservaMover') !== null) {
                vm.reservaMover.existe = true;
                moverReserva();
            }

            if (localStorage.getItem('canchas') == null) {
                var promisePost = canchaService.get(sessionService.getIdSitio());
                promisePost.then(function (d) {
                    localStorage.setItem('precios', JSON.stringify(d.data.precios));
                    localStorage.setItem('canchas', JSON.stringify(d.data.canchas));
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
                var apellidos = agenda[i].apellidos;
                if(apellidos == null){
                    apellidos = "";
                }
                document.getElementById(element_hour).innerHTML = "<div class='content-reserva'  onclick='angular.element(this).scope().viewReserva(" + JSON.stringify(agenda[i]) + ")' ><i class='fa fa-eye' ></i>&nbsp;&nbsp;" + agenda[i].hora + ":00 " +agenda[i].nombres+" "+ apellidos  +"</div>";
            }
        }

        $scope.cargarReserva = function (horaCancha) {


            var fecha = document.getElementById("fechaReserva").value;
            var horacancha = horaCancha.split(",");
            var hora = horacancha[0];
            var cancha = horacancha[1];
            var nombreCancha = "";
            var precio = 0;
            var token = false;
            var dia = dia_semana(vm.fecha.toDateInputValue());
            var diaSemana = dias[dia];

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


            if (localStorage.getItem('reservaMover') !== null) {
                $scope.$apply(function () {
                    vm.RESERVA[0].idcancha = cancha;
                    vm.RESERVA[0].hora = hora;
                    vm.RESERVA[0].fecha = fecha;
                    var data_canchas = JSON.parse(localStorage.getItem('canchas'));
                    var i = 0;
                    for (i = 0; i < data_canchas.length; i++)
                    {

                        if (parseInt(cancha) === parseInt(data_canchas[i].id))
                        {
                            vm.RESERVA[0].nombreCancha = data_canchas[i].nombre;
                        }
                    }

                    vm.RESERVA[0].diaSemana = diaSemana;

                });
            } else {

              
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
                var data_canchas = JSON.parse(localStorage.getItem('canchas'));
                var data_precio = JSON.parse(localStorage.getItem('precios'));
                var i = 0;
                for (i = 0; i < data_canchas.length; i++)
                {
                    if (parseInt(cancha) === parseInt(data_canchas[i].id))
                    {
                        nombreCancha = data_canchas[i].nombre;
                    
                        if(parseInt(data_precio[i].cancha) === parseInt(cancha)){
                         var y = 0;
                          var precios = data_precio[i].precios;
                           for(y = 0; y < precios.length; y++){
                             if(precios[y].HORA === hora+':00'){
                                 diaSemana = diaSemana.replace(/á/gi,"a");
                                 var dia = diaSemana.toUpperCase();
                                 var msgList = precios[y];
                                 var msgsKeys = Object.keys(msgList);
                            for(var i=0; i< msgsKeys.length; i++)
                                {
                                    if(msgsKeys[i] === dia){
                                    var msgType     = msgsKeys[i];
                                    var msgContent  = precios[y][msgType];
                                    msgContent = msgContent.toString()+".";
                                    precio = parseInt(msgContent.split('.').join(''));
                                    break;
                                    }
                                }
                             }
                           }
                        }    
                    }
                }             
                var reserva = {"idcancha": cancha, "nombreCancha": nombreCancha, "fecha": fecha, "diaSemana": diaSemana, "hora": hora, "precio":parseInt(precio)};
                vm.RESERVA.push(reserva);
                }
                $scope.$apply(function () {
                    vm.RESERVA;
                });

            }
        }

        function reservar() {
            var token = false;
            var item = "";
            var detalle = [];

            if (vm.Cliente.nombres === undefined || vm.Cliente.telefono === undefined) {
                toastr.warning("Aun faltan datos del cliente?");
            } else {
                var tipo = "SIMPLE";

                if (vm.RESERVA.length > 1) {
                    tipo = "COMPUESTA";
                }
                var i = 0;
                for (i = 0; i < vm.RESERVA.length; i++) {
                    if (document.getElementById('precio' + i).value === "" || document.getElementById('abonoRequerido' + i).value === "") {
                        toastr.warning("No se ha ingresado el valor de la reserva o el abono requedo o abono liquidado?");
                        token = false;
                        return false;
                    } else {
                        token = true;
                    }
                }
                if (token === true) {
                    for (i = 0; i < vm.RESERVA.length; i++) {


                        item = {
                            precio: parseInt(document.getElementById('precio' + i).value.split('.').join('')),
                            abonoRequerido: parseInt(document.getElementById('abonoRequerido' + i).value.split('.').join('')),
                            estado: 'confirmadasinabono'
                        };
                        detalle.push(item);
                    }
                    var reserva = {
                        nombre: vm.Cliente.nombre,
                        telefono: vm.Cliente.telefono.toString(),
                        resenia:vm.Cliente.resenia,
                        reserva: vm.RESERVA,
                        sitio: sessionService.getIdSitio(),
                        via: 'LOCAL',
                        tipo: tipo,
                        detalle: detalle
                    };
                
                    $('#reservar').attr("disabled", true);
                    var promisePost = reservasService.post(reserva);
                    promisePost.then(function (d) {
                        $('#reservar').attr("disabled", false);
                   
                        if (d.data.respuesta === true) {
                            swal("Buen trabajo!", d.data.message, "success")
                            vm.RESERVA = [];
                            vm.Cliente = {};
                            reserva = {};
                            detalle = [];
                            vm.Cliente.existe = false;
                            $("#reserva").modal('hide');
                            getAgendaDiaByCancha();
                        } else {
                            toastr["error"](d.data.message);
                        }
                    }, function (err) {
                        $('#reservar').attr("disabled", false);
                        if (err.status == 401) {
                            toastr["error"](err.data.respuesta);
                        } else {
                            toastr["error"]("Ha ocurrido un problema!");
                        }
                    });
                }
            }
        }

        function actualizarReserva() {
            if (document.getElementById('precio' + 0).value === "" || document.getElementById('abonoRequerido' + 0).value === "") {
                toastr.warning("No se ha ingresado el valor de la reserva o el abono requedo o abono liquidado?");
                return false;
            }

            var object =
                    {
                        precio: parseInt(document.getElementById('precio' + 0).value.split('.').join('')),
                        abonoRequerido: parseInt(document.getElementById('abonoRequerido' + 0).value.split('.').join('')),
                        fecha: vm.RESERVA[0].fecha,
                        hora: vm.RESERVA[0].hora,
                        diaSemana: vm.RESERVA[0].diaSemana,
                        cancha: vm.RESERVA[0].idcancha,
                        idReserva: vm.RESERVA[0].id
                    }
            $('#actualizar').attr("disabled", true);

            var promisePost = reservasService.actualizarFecha(object);
            promisePost.then(function (d) {
                $('#actualizar').attr("disabled", false);

                if (d.data.respuesta === true) {
                    localStorage.removeItem('reservaMover');
                    vm.reservaMover.existe = false;
                    swal("Buen trabajo!", d.data.message, "success")
                    vm.RESERVA = [];
                    vm.Cliente = {};
                    vm.Cliente.existe = false;
                    $("#reserva").modal('hide');
                    getCanchas();
                } else {
                    toastr["error"](d.data.message);
                }
            }, function (err) {
                $('#actualizar').attr("disabled", true);
                if (err.status == 401) {
                    toastr["error"](err.data.respuesta);
                } else {
                    toastr["error"]("Ha ocurrido un problema!");
                }
            });

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


            var promisePost = clienteService.get(reserva.idCliente);
            promisePost.then(function (d) {
                vm.v_cliente = d.data.cliente;
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
