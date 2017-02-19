(function() {
    'use strict';
    angular
        .module('BirriasSitios')
        .controller('AuthController', AuthController);

    function AuthController($auth,$state,HOME) {
        var vm = this;
        vm.user = {};
        vm.login = function() {
            var credentials = {
                email: vm.user.email,
                password: vm.user.password
            }
            $auth.login(credentials).then(function(d) {
               if(d.data.result === false){
                   toastr["error"](d.data.message);
                   return false;
               }
               if(d.data.user){
                   sessionStorage.setItem('userId',d.data.user.id);
                   sessionStorage.setItem('email',d.data.user.email);
                   sessionStorage.setItem('userIsLogin',true);
                   $state.go(HOME);
               }
            });
        }
    }
})();
