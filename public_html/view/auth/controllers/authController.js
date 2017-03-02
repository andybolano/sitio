(function() {
    'use strict';
    angular
        .module('BirriasSitios')
        .controller('AuthController', AuthController);

 function AuthController($state,HOME,authService) {
        var vm = this;
        vm.user = {};
        vm.login = function() {
            
            if( vm.user.email === undefined ||  vm.user.email === "" || vm.user.password === "" || vm.user.password === undefined){
                toastr["error"]("Es nesesario ingresar Usuario y contraseña");
            }else{
            var credentials = {
                email: vm.user.email,
                password: vm.user.password
            }
            $('#login').attr("disabled", true);
             authService.authenticate(credentials).then(success, error);
                      function success(d) {
                            $('#login').attr("disabled", false);
                            if(d.data.respuesta === false){
                                toastr["error"](d.data.message);
                                return false;
                            }
                            if(d.data.user){
                               
                                var data = JSON.parse("[" + d.data.user + "]");
                                sessionStorage.setItem('data',JSON.stringify(data[0].sitio));
                                sessionStorage.setItem('sitioId',data[0].sitio.id);
                                sessionStorage.setItem('userId',data[0].id);
                                sessionStorage.setItem('email',data[0].email);
                                sessionStorage.setItem('token',data[0].token);
                                sessionStorage.setItem('userIsLogin',true);
                                $state.go(HOME);
                            }
                        }
                        function error(error) {
$('#login').attr("disabled", false);
                            toastr["error"]("Ha ocurrido un problema");
                        }
                        
            }
        }
    }
})();
