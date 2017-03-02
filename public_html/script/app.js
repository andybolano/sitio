(function() {

    'use strict';

    angular
        .module('BirriasSitios', ['ui.router'])
         .constant('API_URL', 'http://localhost/birrias/birrias/api/public/index.php/api')
        .constant('HOME', 'app.home')
        .config(function($stateProvider, $urlRouterProvider,$httpProvider) {
            
         $httpProvider.interceptors.push('Request');
         $urlRouterProvider.otherwise('/');
         
         $stateProvider
         //rutas privadas
              .state('app', {
                url: '',
                abstract: true,
                templateUrl: 'view/home/home.html'
                 })
                .state('app.home', {
                    url: '/',
                    templateUrl: 'view/home/dashboard.html',
                    controller: 'HomeController as vm'
                })
                .state('app.reserve', {
                    url: '/reserve',
                    templateUrl: 'view/reservas/reservas.html',
                      controller: 'ReservasController as vm'
                })
                .state('app.canchas', {
                    url: '/canchas',
                    templateUrl: 'view/canchas/canchas.html',
                     controller: 'CanchaController as vm'
                })
                .state('app.gestion', {
                    url: '/gestion',
                    templateUrl: 'view/gestion/gestion.html',
                     controller: 'GestionController as vm'
                })
                .state('app.historial', {
                    url: '/historial',
                    templateUrl: 'view/historial/historial.html',
                     controller: 'HistorialController as vm'
                })
                .state('app.canchasregistro', {
                    url: '/canchas/registro',
                     templateUrl: 'view/canchas/registro.html',
                     controller: 'CanchaController as vm'
                })
                 .state('app.configuracion', {
                    url: '/configuracion',
                     templateUrl: 'view/sitio/configuracion.html',
                     controller: 'ConfiguracionController as vm'
                })
                
              //rutas publicas  
                .state('auth', {
                    url: '/auth',
                    templateUrl: 'view/auth/auth.html',
                    controller: 'AuthController as auth'
                })
                .state('registre', {
                    url: '/registre',
                    templateUrl: 'view/auth/registre.html',
                    controller: 'RegistreController as r'
                })
                .state('terms', {
                    url: '/terms',
                    templateUrl: 'view/auth/terms.html'
                });
                
               
      }).run(function($location,sessionService,$rootScope){
          var rutasPrivadas = ['/','/canchas','/canchas/registro','/reserve','/canchas','/configuracion','/historial','/gestion'];
          $rootScope.$on('$stateChangeStart', function(){
             if(($.inArray($location.path(), rutasPrivadas)!== -1 ) && !sessionService.isLoggedIn()){
                 $location.path('/auth');
             } 
            });
          });
     
})();

 angular.module("BirriasSitios").factory("Request", function(sessionService)
{
      var request = function request(config)
      {
          config.headers["Token"] = sessionService.getToken();
          config.headers["Sitio"] = sessionService.getIdUser();
          return config;
      };
      return {
          request: request
      };
});

  angular.module('BirriasSitios').directive('ngEnter', function() {
        return function(scope, elements, attrs) {
            elements.bind('keydown keypress', function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });

   angular.module('BirriasSitios').filter('ifEmpty', function() {
        return function(input, defaultValue) {
            if (angular.isUndefined(input) || input === null || input === '') {
                return defaultValue;
            }
            return input;
        };
    });

  angular.module('BirriasSitios').directive('uploaderModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, iElement, iAttrs) {
                iElement.on('change', function(e) {
                    $parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
                });
            }
        };
    }]);
