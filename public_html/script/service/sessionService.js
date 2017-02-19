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
        };
        return service;

        function isLoggedIn(){
          return sessionStorage.getItem('userIsLogin') !== null;  
        };
        
        function getIdSitio(){
            var sitio = JSON.parse(sessionStorage.getItem('data'));
            return sitio.id;
        }
    }
})();



