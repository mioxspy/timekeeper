'use strict';

/**
 * @ngdoc service
 * @name uiApp.employeelogs
 * @description
 * # employeelogs
 * Factory in the uiApp.
 */
angular.module('uiApp').factory('employeelogs', employeelogs);
    // Service logic
    // ...

    employeelogs.$inject = ['$q', '$http'];

    function employeelogs($q, $http)
    {
      
      var service = {
          execute: execute
      };
      
      return service;
      
      //  Start-From  LIMIT   ASC | DESC SEARCH COLLECTION
      function execute(start, limit)
      {
          console.log(start, limit,'start, limit');
          //var sort = order.replace(/"/g,"");
          var defered = $q.defer();

          /*if (sort == 'asc') {
              sort = 'ascending';
          } else if (sort == 'desc') {
              sort = 'descending';
          }*/
  
          //Make a request to backend api and then call defered.resolve(result);
          // /SELECTSpecific/:TableName/:Start/:Length/:Order

          /*var term = search.value;
          if(term == ''){
              term = 'none';
          }else if(term == null){
              term = 'none';
          }*/

         // console.log('term',term);
         // console.log('search',search);
          $http({ 
               url: 'http://localhost:3000/logs/search/'+limit+'/'+start,
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

