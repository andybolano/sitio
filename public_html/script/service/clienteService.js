(function () {
    'use strict';

    angular
        .module('BirriasSitios')
        .service('clienteService', clienteService);

    /* @ngInject */
    function clienteService($http,$q, API_URL) {

        var service = {
            get: get,
           getByPhone:getByPhone,
           getBySitio:getBySitio
        };
        return service;

        function get(id){
           var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL+'/cliente/'+id).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        };
        function getBySitio(idSitio){
             var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL+'/clientes/sitio/'+idSitio).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        }
         function getByPhone(phone){
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL+'/cliente/'+phone+'/telefono').then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        }
    }
})();



