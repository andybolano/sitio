(function () {
    'use strict';

    angular
        .module('BirriasSitios')
        .service('sitioService', sitioService);

    /* @ngInject */
    function sitioService(API_URL,$http,$q) {

        var service = {
            get: get,
            update:update,
            logout:logout,
            updateImage:updateImage
        };
        return service;

 function updateImage(image){
           var defered = $q.defer();
            var promise = defered.promise;
           $http.post(API_URL+'/sitio/image',image,{transformRequest: angular.identity, 
            headers: {'Content-Type': undefined}}).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        }
        
        function get(){ 
          
           var defered = $q.defer();
            var promise = defered.promise;
            var id = sessionStorage.getItem('userId');
            $http.get(API_URL+'/sitio/'+id+'/usuario').then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        };
        function update(object){ 
           var defered = $q.defer();
            var promise = defered.promise;
            var id = sessionStorage.getItem('sitioId');
            $http.put(API_URL+'/sitio/'+id, object).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        };
        function logout(){ 
           var defered = $q.defer();
            var promise = defered.promise;
            $http.post(API_URL+'/logout').then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        };
    }
})();


