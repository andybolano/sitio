(function(){
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('ConfiguracionController',ConfiguracionController);
                
            function ConfiguracionController(sitioService) {
              var vm = this;
              vm.update = update;
              vm.getSitio = getSitio;
              vm.updateImage = updateImage;
              vm.sitio = {};
              
              function update(){
                  if(vm.sitio.pass == undefined || vm.sitio.pass == ""){
                        toastr['error']("Ingresar Contrseña");
                  }else{
                  if(vm.sitio.passNueva == undefined || vm.sitio.passNueva == ""){
                      vm.sitio.passNueva = false;
                  }  
                  vm.sitio.userId = sessionStorage.getItem('userId');
                     var promisePost = sitioService.update(vm.sitio);
                        promisePost.then(function (d) {
                            vm.sitio = {};
                           sessionStorage.removeItem('data');
                            vm.getSitio();
                            if(d.data.respuesta == false){
                                toastr['error'](d.data.message);
                            }
                             if(d.data.respuesta == true){
                                 toastr['success'](d.data.message);
                                 sessionStorage.setItem('data',d.data.request);
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
              
              function getSitio(){
              	if(sessionStorage.getItem('data') !== null){
                  vm.sitio = JSON.parse(sessionStorage.getItem('data'));
                  vm.sitio.email = sessionStorage.getItem('email');
                  }else{
                  
                 sitioService.get().then(success, error);
                      function success(d) {
                           vm.sitio = d.data[0];
                           vm.sitio.email = sessionStorage.getItem('email');
                           sessionStorage.setItem('data',JSON.stringify(d.data[0]));
                          
                        }
                        function error(error) {
                           toastr['error'](error.data.error);
                        }
                        
                  }
              }
              
              function updateImage(){
                     var formData = new FormData();
                                if (vm.sitio.imagen != undefined) {
                                    formData.append('imagen', vm.sitio.imagen);
                                    formData.append('id', vm.sitio.id);
                                }else{
                                    toastr['warning']("Es nesario cargar una imagen");
                                    return false;
                                }
                                var promisePost = sitioService.updateImage(formData);
                                promisePost.then(function (d) {
                                        vm.sitio = "";
                                        document.getElementById("image").innerHTML = "";
                                        swal("Buen Trabajo!",d.data.message, "success");
                                         sessionStorage.removeItem('data');
                                       vm.getSitio();
                                }, function (err) {
                                    if (err.status == 401) {
                                        toastr["error"](err.data.respuesta);
                                    } else {
                                        toastr["error"]("Ha ocurrido un problema!");
                                    }
                                });
                }
                
                setTimeout(function () {
                        document.getElementById('files').addEventListener('change', archivo, false);
                    }, 1000)
         }
         
         
          function archivo(evt) {
                    var files = evt.target.files;
                    for (var i = 0, f; f = files[i]; i++) {
                        if (!f.type.match('image.*')) {
                            continue;
                        }
                        var reader = new FileReader();
                        reader.onload = (function (theFile) {
                            return function (e) {
                                document.getElementById("image").innerHTML = ['<img  style="width:100%;" src="', e.target.result, '" title="', escape(theFile.name), '"/>'].join('');
                            };
                        })(f);
                        reader.readAsDataURL(f);
                    }
                }
                
             $(':file').change(function () {
                    var file = $("#files")[0].files[0];
                    var fileName = file.name;
                    fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
                    var fileSize = file.size;
                    var fileType = file.type;
                });

})();







