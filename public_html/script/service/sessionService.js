(function () {
    'use strict';

    angular
        .module('BirriasSitios')
        .service('sessionService', sessionService);

    /* @ngInject */
    function sessionService() {

        var service = {
            isLoggedIn: isLoggedIn,
            getIdUser: getIdUser,
            getIdSitio: getIdSitio,
            getToken : getToken,
            
        };
        return service;

      
        function isLoggedIn(){
          return sessionStorage.getItem('userIsLogin') !== null;  
        };
        
         function getToken(){
          if(sessionStorage.getItem('token') !== null){
              return sessionStorage.getItem('token');
          } 
        };
        function getIdUser(){
           if(sessionStorage.getItem('userId') !== null){
                return sessionStorage.getItem('userId');
           } 
          
        }
        function getIdSitio(){
           if(sessionStorage.getItem('sitioId') !== null){
                return sessionStorage.getItem('sitioId');
               
           } 
          
        }
    }
})();



