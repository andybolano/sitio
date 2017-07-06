(function() {
    'use strict';

    angular
        .module('BirriasSitios')
        .service('operadorService', operadorService);

    /* @ngInject */
    function operadorService($http, $q, API_URL) {

        var service = {
            post: post,
            getAll: getAll,
            updateState: updateState,
            remove: remove,
            update: update,
        };
        return service;

        function post(object) {
            var defered = $q.defer();
            var promise = defered.promise;
      
            $http.post(API_URL + '/operador', object).then(success, error);
            return promise;

            function success(p) {

                defered.resolve(p);
            }

            function error(error) {
                defered.reject(error)
            }
        };


        function getAll(idSitio) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get(API_URL + '/operador/' + idSitio + '/sitio').then(success, error);
            return promise;

            function success(p) {
                defered.resolve(p);
            }

            function error(error) {
                defered.reject(error)
            }
        };

        function updateState(object, id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.put(API_URL + '/operador/' + id + '/estado', object).then(success, error);
            return promise;

            function success(p) {
                defered.resolve(p);
            }

            function error(error) {
                defered.reject(error);
            }
        };


        function remove(id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.delete(API_URL + '/operador/' + id).then(success, error);
            return promise;

            function success(p) {
                defered.resolve(p);
            }

            function error(error) {
                defered.reject(error);
            }
        };

        function update(id, object) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.put(API_URL + '/operador/' + id, object).then(success, error);
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