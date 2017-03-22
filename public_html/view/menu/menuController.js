(function(){
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('MenuController', function($location,sitioService,$state,sessionService,API_URL,notificacion){
          
            var vm = this;
            vm.sitio = {};
            vm.getSitio = getSitio;
            vm.logout = logout;
            vm.pusher = pusher;
            vm.notificacion = {};
            
                         
             
             if (Notification.permission === 'default') {
                    Notification.requestPermission(function (permission) {
                        // callback
                        console.log(permission)
                        if (permission === 'granted') {
                            console.log("Permiso para usar notificaciones");
                        }
                    });
                }   
            function pusher(){   
                  Pusher.logToConsole = false;
                    var pusher = new Pusher('b4015226d5614422f631', {
                      encrypted: true,
                      authTransport: 'jsonp',
                      authEndpoint:API_URL+"/pusher_auth",
                      auth:{
                          userid:sessionService.getIdSitio()
                      }
                    });
                    
                    var socketId = null;
                    pusher.connection.bind('connected', function() {
                      console.log("Conectado: "+ pusher.connection.socket_id);
                        socketId = pusher.connection.socket_id;
                    });
                    pusher.connection.bind('state_change', function(states) {
                        console.log("Conexion a cambiado de estado:" + states.current);
                    });
                    pusher.connection.bind('disconnected', function() {
                        
                      console.log("desconectado: "+ socketId);
                    });                
                   var channel = pusher.subscribe('private-sitio_'+sessionService.getIdSitio());
                     channel.bind('nuevaReserva', function(data) {
                      showMensaje(data);
                    });
                    channel.bind('actualizacionReserva', function(data) {
                      showMensaje(data);
                    });
            }
            
            function showMensaje(data){
                if (data.usuario.image == 1) {
                var image = data.usuario.url;
                } else {
                    var image = "images/profile-user.png";
                }

                 swal({title: data.titulo,
                        text: "<img src='"+image+"'  class='img-circle' style='width:60px; heigth:60px;'><br><br><h3>" + data.usuario.nombres + " " + data.usuario.apellidos + "</h3>" + data.message,
                        html: true
                    });

                var opciones = {
                    iconUrl: image,
                    icon: image,
                    sound: "images/arbitro.mp3",
                    soundUrl: "images/arbitro.mp3",
                    body: data.usuario.nombres + " " + data.usuario.apellidos,
                    tag: "etiqueta"
                };

                vm.notificacion.titulo = data.titulo;
                vm.notificacion.opciones = opciones;
                vm.notificacion.url = data.url;

                var res = notificacion.show(vm.notificacion);
            }
            

                vm.isActive = function(viewLocation){
                    return viewLocation === $location.path();
                }
                
                vm.hoy = function (){
                    var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
                    var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
                    var f = new Date();
                    var hoy = diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
                    return hoy
               }
                
                 function getSitio(){
                     if(sessionStorage.getItem('data') == null){
                      sitioService.get().then(success, error);
                      function success(d) {
                           vm.sitio = d.data[0];
                           vm.sitio.email = sessionStorage.getItem('email');
                           sessionStorage.setItem('data',JSON.stringify(d.data[0]));
                          
                        }
                        function error(error) {
                           toastr['error']('No autorizado!');
                        }
                    }else{
                        vm.sitio = JSON.parse(sessionStorage.getItem('data'));
                        vm.sitio.email = sessionStorage.getItem('email');
                    }
                }
                
                function logout(){
                      sitioService.logout().then(success, error);
                      function success(d) {
                          localStorage.clear();
                          sessionStorage.clear();
                           toastr['success']("sesión finalizada!");
                           $state.go('auth',{},{reload: true});
                      
                        }
                        function error(error) {
                           toastr['error'](error.data.error);
                        }
                }
                
            });

})();


