(function () {
    'use strict';

    angular
        .module('BirriasSitios')
        .service('registreService', registreService);

    /* @ngInject */
    function registreService($http,$q, API_URL) {

        var service = {
            post: post,
        };
        return service;

        function post(sitio){
            
           var defered = $q.defer();
            var promise = defered.promise;
            $http.post(API_URL+'/sitio', sitio).then(success, error);
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

