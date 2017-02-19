app.service('canchaService', function($http){
    
    this.post = function (cancha) {
        var req = $http.post(API_URL+'/canchas',cancha,{transformRequest: angular.identity, 
            headers: {'Content-Type': undefined}});
            return req;
    };
    this.get = function (id) {
        var req = $http.get(API_URL+'/canchas');
           return req;
    };

});  
    
    

