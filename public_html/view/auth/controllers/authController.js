(function() {
    'use strict';
    angular
        .module('BirriasSitios')
        .controller('AuthController', AuthController);

    function AuthController($state,HOME,authService) {
        var vm = this;
        vm.user = {};
        vm.login = function() {
            var credentials = {
                email: vm.user.email,
                password: vm.user.password
            }
            
             authService.authenticate(credentials).then(success, error);
                      function success(d) {
                            if(d.data.respuesta === false){
                                toastr["error"](d.data.message);
                                return false;
                            }
                            if(d.data.user){
                                 var data = JSON.parse("[" + d.data.user + "]");
                                sessionStorage.setItem('userId',data[0].id);
                                sessionStorage.setItem('email',data[0].email);
                                sessionStorage.setItem('token',data[0].token);
                                sessionStorage.setItem('userIsLogin',true);
                                $state.go(HOME);
                            }
                        }
                        function error(error) {
                            toastr["error"](error.data.error);
                        }
                        
           
        }
    }
})();
