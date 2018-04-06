'use strict';

/**
 * @ngdoc service
 * @name uiApp.filterService
 * @description
 * # filterService
 * Factory in the uiApp.
 */
angular.module('uiApp').factory('filterService', filterService);
    // Service logic
    // ...
    filterService.$inject = ['$q', '$http','$rootScope'];

    function filterService($q, $http, $rootScope)
    {
      
      var service = {
          execute: execute
      };
      
      return service;
      
      //  Start-From  LIMIT   ASC | DESC SEARCH COLLECTION
      function execute(start, limit, term)
      {
          console.log(start, limit, term,'start, limit, term');
          //var sort = order.replace(/"/g,"");
          var defered = $q.defer();

          /*if (sort == 'asc') {
              sort = 'ascending';
          } else if (sort == 'desc') {
              sort = 'descending';
          }*/
  
          //Make a request to backend api and then call defered.resolve(result);
          // /SELECTSpecific/:TableName/:Start/:Length/:Order

          var term = term.value;
          if(term == ''){
              term = "";
          }else if(term == null){
              term = "";
          }

         // console.log('term',term);
         // console.log('search',search);
          $http({ 
              url: 'http://localhost:3000/users/searches/'+limit+'/'+start+'/'+term,
              // url: 'http://demo8773317.mockable.io/timekeeper',
              method: 'GET'
          })
                  .then(function(result) 
          {
              defered.resolve(result);
          })
                  .catch(function(err)
          {
              defered.reject(err);
          });
          return defered.promise;
      }
    };
