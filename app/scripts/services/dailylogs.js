'use strict';

/**
 * @ngdoc service
 * @name uiApp.dailylogs
 * @description
 * # dailylogs
 * Factory in the uiApp.
 */
angular.module('uiApp').factory('dailylogs', dailylogs);

  dailylogs.$inject = ['$q', '$http'];
    // Service logic
    // ...

    function dailylogs($q, $http)
    {
      
      var service = {
          execute: execute
      };
      
      return service;
      
      //  Start-From  LIMIT   ASC | DESC SEARCH COLLECTION
      function execute(start, limit, employeeId)
      {
          //console.log(start, limit, order, search,'start, limit, order, search');
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
              url: 'http://localhost:3000/logs/solosearch/'+limit+'/'+start+'/'+employeeId,
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