(function () {
    'use strict';

    angular
        .module('BirriasSitios')
        .service('canchaService', canchaService);

    /* @ngInject */
    function canchaService($http,$q, API_URL) {

        var service = {
            post: post,
            get:get,
            updateState:updateState,
            remove:remove,
            update:update,
            updateImage:updateImage
            
        };
        return service;

        function post(cancha){
           var defered = $q.defer();
            var promise = defered.promise;
           $http.post(API_URL+'/canchas',cancha,{transformRequest: angular.identity, 
            headers: {'Content-Type': undefined}}).then(success, error);
            return promise;
             function success(p) {
                 console.log(p)
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        };
        
        function get(id){ 
           var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL+'/canchas/'+id+'/sitio').then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        };
        
        function updateState(object,id){
           var defered = $q.defer();
            var promise = defered.promise;

            $http.put(API_URL+'/canchas/'+id+'/estado',object).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        };
        
         function remove(id){
           var defered = $q.defer();
            var promise = defered.promise;

            $http.delete(API_URL+'/canchas/'+id).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        };
        
        function update(id,object){
            var defered = $q.defer();
            var promise = defered.promise;

            $http.put(API_URL+'/canchas/'+id, object).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        };
        
        function updateImage(image){
           var defered = $q.defer();
            var promise = defered.promise;
           $http.post(API_URL+'/canchas/image/',image,{transformRequest: angular.identity, 
            headers: {'Content-Type': undefined}}).then(success, error);
            return promise;
             function success(p) {
                 console.log(p)
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        }
        
        
        
    }
})();


    
    

