(function () {
    'use strict';

    angular
        .module('BirriasSitios')
        .service('reservasService', reservasService);

    /* @ngInject */
    function reservasService($http,$q, API_URL) {

        var service = {
            post: post,
        };
        return service;

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
    }
})();




