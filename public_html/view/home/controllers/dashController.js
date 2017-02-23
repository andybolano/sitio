(function(){
    'use strict';
    angular
            .module('BirriasSitios')
            .controller('HomeController', function(){
          
              var vm = this;
              vm.sitio = {};
              vm.sitio = JSON.parse(sessionStorage.getItem('data'));
            });

})();




