(function () {

    'use strict';

    angular
            .module('BirriasSitios')
            .controller('RegistreController', RegistreController);


    function RegistreController($state, registreService) {
        var vm = this;
        vm.sitio = {};
        vm.registre = registre;
        

            $('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });
      
       function registre(){
            if (vm.sitio.nombre == undefined || vm.sitio.ciudad == undefined || vm.sitio.direccion == undefined || vm.sitio.telefono == undefined || vm.sitio.email == undefined || vm.sitio.pass == undefined) {
                toastr.error("Es necesario digilenciar todos los campos");
            } else {
                if ($("#terminos").is(':checked')) {
                    if (vm.sitio.pass !== vm.sitio.passConfirmada) {
                        toastr.error("Las contraseña ingresadas no coinciden!");
                    } else {
                        var sitio = {
                            nombre: vm.sitio.nombre,
                            ciudad: vm.sitio.ciudad,
                            direccion: vm.sitio.direccion,
                            telefono: vm.sitio.telefono,
                            email: vm.sitio.email,
                            password: vm.sitio.pass
                        }
                        
                     registreService.post(sitio).then(success, error);
                      function success(d) {
                            swal("Felicidades!", d.data.message, "success")
                             vm.sitio = "";
                        }
                        function error(error) {
                            sweetAlert("Oops...", d.data.message, "error");
                        }
                    }
                }else {
                    toastr.error("Es necesario aceptar los terminos y condiciones del servicio");
                }
            }
        }
    }
})();
