(function () {
    'use strict';

    angular
        .module('BirriasSitios')
        .service('reservasService', reservasService);

    /* @ngInject */
    function reservasService($http,$q, API_URL) {

        var service = {
            post: post,
            getByFecha:getByFecha,
            getBySitio:getBySitio,
            updateReservas:updateReservas,
            getByFechaAll:getByFechaAll
        };
        return service;

        function updateReservas(object){
           var defered = $q.defer();
            var promise = defered.promise;
            $http.put(API_URL+'/reservas/'+object.idReserva, object).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        }
        
        function post(object){
            
           var defered = $q.defer();
            var promise = defered.promise;
            $http.post(API_URL+'/reservas', object).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        };
        
        function getByFecha(id,fecha){
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL+'/reservas/sitio/'+id+'/fecha/'+fecha).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        };
        
        function getByFechaAll(id,fecha){
           var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL+'/reservas/sitio/'+id+'/fecha/'+fecha+'/all').then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            } 
        }
        
        function getBySitio(id){
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL+'/reservas/sitio/'+id).then(success, error);
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




