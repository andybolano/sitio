(function() {

    'use strict';

    angular
        .module('BirriasSitios', ['ui.router', 'satellizer'])
        .constant('API_URL', 'http://localhost/birrias/birrias/api/public/index.php/api')
        .constant('HOME', 'app.home')
        .config(function($stateProvider, $urlRouterProvider, $authProvider, API_URL) {
            
          $authProvider.authHeader = 'x-access-token';
          $authProvider.httpInterceptor = true;
          $authProvider.loginUrl = API_URL+'/authenticate';

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
                })
                .state('app.reserve', {
                    url: '/reserve',
                    templateUrl: 'view/reservas/reservas.html'
                })
                .state('app.canchas', {
                    url: '/canchas',
                    templateUrl: 'view/canchas/canchas.html'
                })
                .state('app.canchasregistro', {
                    url: '/canchas/registro',
                     templateUrl: 'view/canchas/registro.html'
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
          var rutasPrivadas = ['/','/canchas','/canchas/registro','/reserve'];
          $rootScope.$on('$stateChangeStart', function(){
             if(($.inArray($location.path(), rutasPrivadas)!== -1 ) && !sessionService.isLoggedIn()){
                 $location.path('/auth');
             } 
            });
          });
     
})();

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
