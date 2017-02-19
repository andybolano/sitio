(function () {
    'use strict';

    angular
        .module('BirriasSitios')
        .service('sitioService', sitioService);

    /* @ngInject */
    function sitioService(API_URL,$http,$q) {

        var service = {
            get: get,
        };
        return service;

        function get(){ 
           var defered = $q.defer();
            var promise = defered.promise;
            var id = sessionStorage.getItem('userId');
            var config = 
                    
            $http.get(API_URL+'/sitio/'+id+'/usuario').then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error)
            }
        };
    }
})();


