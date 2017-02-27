(function () {
    'use strict';

    angular
        .module('BirriasSitios')
        .service('sessionService', sessionService);

    /* @ngInject */
    function sessionService() {

        var service = {
            isLoggedIn: isLoggedIn,
            getIdSitio: getIdSitio,
            getToken : getToken,
        };
        return service;

        function isLoggedIn(){
          return sessionStorage.getItem('userIsLogin') !== null;  
        };
        
         function getToken(){
          return sessionStorage.getItem('token') !== null;  
        };
        
        function getIdSitio(){
            var sitio = JSON.parse(sessionStorage.getItem('data'));
            return sitio.id;
        }
    }
})();



