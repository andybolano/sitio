(function () {
    'use strict';

    angular
        .module('BirriasSitios')
        .service('sessionService', sessionService);

    /* @ngInject */
    function sessionService() {

        var service = {
            isLoggedIn: isLoggedIn,
        };
        return service;

        function isLoggedIn(){
          return sessionStorage.getItem('userIsLogin') !== null;  
        };
    }
})();



