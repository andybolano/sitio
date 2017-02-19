/* 
 * Controlador de canchas
 */
app.controller('canchasController', function($scope, canchaService) {
    $scope.Cancha = {};
    $scope.Canchas = [];
    
    $scope.guardar = function() {
        if ($scope.Cancha.nombre == undefined || $scope.Cancha.largo == undefined || $scope.Cancha.ancho == undefined || $scope.Cancha.techo == undefined || $scope.Cancha.numeroJugadores == undefined) {
            toastr.error("Oops, dale a tus clientes toda la informacion de tu cancha!");
        } else {
            if ($scope.Cancha.numeroJugadores > 11) {
                toastr.warning("Jugadores por equipo " + $scope.Cancha.numeroJugadores + "? estoy confundido, que clase de deporte se jugará en esta cancha!");
            } else {
                if ($scope.Cancha.ancho >= $scope.Cancha.largo) {
                    toastr.warning("Estoy confundido, revisa las medidas de tu cancha!");
                } else {
                    var formData = new FormData();
                    if ($scope.Cancha.imagen != undefined) {
                        formData.append('imagen', $scope.Cancha.imagen);
                    }
                    
                     var id= sessionStorage.getItem('id');
                  
                    formData.append('sitio', id);
                    formData.append('nombre', $scope.Cancha.nombre);
                    formData.append('largo', $scope.Cancha.largo);
                    formData.append('ancho', $scope.Cancha.ancho);
                    formData.append('techo', $scope.Cancha.techo);
                    formData.append('numeroJugadores', $scope.Cancha.numeroJugadores);
                    formData.append('imagen', $scope.Cancha.imagen);
              
                   var promisePost = canchaService.post(formData);
                    promisePost.then(function(d) {
                   
                        if(d.data.respuesta == true){
                        $scope.Cancha = "";
                        document.getElementById("image").innerHTML = "";
                        swal("Buen Trabajo!","Tu cancha ha sido registrada con exito" , "success");
                        
                        localStorage.removeItem('canchas');
                        
                        $scope.getCanchas();
                        }else if(d.data.respuesta == false){
                         sweetAlert('Oops', data.respuesta, "error");
                    }
                    }, function(err) {
                        if (err.status == 401) {
                            sweetAlert('Oops', err.data.respuesta, "error");
                            console.log(err.data.exception);
                        } else {
                            sweetAlert("Oops...", "Hemos ha ocurrido un problema!", "error");
                        }
                        console.log(err);
                    });
                }
            }
        }
    }
    
    $scope.getCanchas = function (){
           //var id= sessionStorage.getItem('id');
             var promisePost = canchaService.get(/*id*/);
                    promisePost.then(function(d) {
                            localStorage.setItem('canchas', JSON.stringify(d.data)); 
                            $scope.Canchas = d.data;
                        
                    }, function(err) {
                        if (err.status == 401) {
                            sweetAlert('Oops', err.data.respuesta, "error");
                            console.log(err.data.exception);
                        } else {
                            sweetAlert("Oops...", "Hemos ha ocurrido un problema!", "error");
                        }
                        console.log(err);
                    });
      
    }
    
    $scope.verCancha = function(item)
    {
        $scope.Cancha = item;
          $('#cancha').modal();
    }
});





