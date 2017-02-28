(function () {
    'use strict';

    angular
        .module('BirriasSitios')
        .service('authService', authService);

    /* @ngInject */
    function authService($q, API_URL,$http) {

        var service = {
            authenticate:authenticate
            
        };
        return service;

        function authenticate(credentials){
            var defered = $q.defer();
            var promise = defered.promise;
            $http.post(API_URL+'/authenticate', credentials).then(success, error);
            return promise;
             function success(p) {
                defered.resolve(p);
            }
            function error(error) {
                defered.reject(error);
            }
        }

    }
})();



