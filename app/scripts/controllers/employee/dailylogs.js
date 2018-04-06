'use strict';

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
	"date-nl-pre": function ( date ) {
	    return moment(date, 'MMMM DD, YYYY');
	  }
} );

/**
 * @ngdoc function
 * @name uiApp.controller:EmployeeDailylogsCtrl
 * @description
 * # EmployeeDailylogsCtrl
 * Controller of the uiApp
 */
angular.module('uiApp')
  .controller('EmployeeDailylogsCtrl', 
  		function (dailylogs, DTColumnBuilder, DTOptionsBuilder, $compile,
		DTColumnDefBuilder, $scope, $rootScope, $http, $timeout, $cookies, $window, $q) {
			
   	angular.element(document).ready(function () {
	
    	/** 			Content Placeholder
   		-----------------------------------------------**/
   		var contentuiT = new Placeload('.placeloadtitle');
   			contentuiT.draw({
	    		width: '350px',
	    		height: '25px',
	    		marginTop: '5px',
	    	});
   		var contentuiB = new Placeload('.placeloadbread');
   			contentuiB.draw({
	    		width: '50px',
	    		height: '10px',
	    		marginTop: '10px',
	    	});
	    	contentuiB.draw({
	    		width: '160px',
	    		height: '10px',
	    		marginTop: '15px',
	    		marginLeft: '10px',
	    		right: true,
	    	});

	    var contentuiL = new Placeload('.placeloadleft');

	    	contentuiL.draw({
	    		width: '200px',
	    		height: '40px',
	    		marginTop: '45px'
	    	});

	    	contentuiL.draw({
	    		width: '430px',
	    		height: '50px',
	    		marginTop: '23px'
	    	});
	    	contentuiL.draw({
	    		width: '430px',
	    		height: '50px',
	    		marginTop: '28px'
	    	});
	    	contentuiL.draw({
	    		width: '430px',
	    		height: '50px',
	    		marginTop: '28px'
	    	});
	    	contentuiL.draw({ //Lastname
	    		width: '430px',
	    		height: '50px',
	    		marginTop: '30px'
	    	});
	    	contentuiL.draw({
	    		width: '430px',
	    		height: '50px',
	    		marginTop: '28px'
	    	});
	    	contentuiL.draw({
	    		width: '430px',
	    		height: '50px',
	    		marginTop: '28px'
	    	});

	    	var contentuiR = new Placeload('.placeloadright');
	    	
	    	contentuiR.draw({
	    		height: '500px',
	    		marginTop: '25px'
	    	});

	    $scope.contentData = false;
	    $scope.contentPlaceholder = false;	

	    var contentHolder = function() {
	    	$scope.contentPlaceholder = true;
	    	$scope.contentData = true;
	    }

    	$timeout(contentHolder, 1000);

    });

	/**		Begin Coding
	------------------------------**/

	if ($cookies.getObject('loginUser')) {
        $rootScope.showLogout  = true;
        $scope.user = JSON.parse($cookies.get('loginUser'));
        /*console.log($cookies.getObject('loginUser'))*/
    }else{
        $window.location.href = '/#/member/login/index';
    }

    $scope.passDetails = {
        password: ''
    };
	//get value from login user (session/cookie/localStorage)
	$scope.profile = {
		employeeno: $scope.user.employeeId,
		firstName: $scope.user.firstname,
		lastName: $scope.user.lastname,
		username: $scope.user.username,
		role: "Viewer" 
	};


	$scope.passwordFormat = /^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/;
	//$scope.passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/;
    /**
     * DataTable Config
     */

    $scope.dtInstance = {};
    $scope.rerender = rerender;
    $scope.reloadData = reloadData;

    function rerender () { //Call if serverside to reload table
        $scope.dtInstance.rerender();
    };

    function reloadData() { //Call if not serverside to reload table
        var resetPaging = false;
        $scope.dtInstance.reloadData(callback, resetPaging);
    };

    function callback(json) {
        //console.log(json);
    };
      
    /** not server side **/
    $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        // $http.get('http://demo8773317.mockable.io/timekeeper').then(function(result){
        $http.get($rootScope.host+'/logs/employee/all/'+$scope.profile.employeeno).then(function(result){
            defer.resolve(result.data.data);
            console.log(result)
        });
        return defer.promise;
    })
    .withPaginationType('simple_numbers')
    .withLightColumnFilter({
	        '0' : {
	            html: 'input',
	            type: 'text',
	            attr: {}
        	},
	        '1' : {
	            html: 'input',
	            type: 'text',
	            attr: {}
	        }
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('logDate').withTitle('Date').withOption("type","date-nl-pre"),
        DTColumnBuilder.newColumn('logTime').withTitle('Time')
    ];

	/**  Serverside Table Config
    $scope.dtOptions = DTOptionsBuilder
        .newOptions()
        .withFnServerData(serverData)
        .withDataProp('data') // tried data aswell
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('paging', true) 
        .withOption('bFilter', true) //Search
        .withOption('autoWidth', true)
        .withDisplayLength(10)
        .withPaginationType('simple_numbers')
    
    $scope.dtColumns = [
        DTColumnBuilder.newColumn('logDate').withTitle('Date').withOption("type","date-nl-pre"),
        DTColumnBuilder.newColumn('logTime').withTitle('Time')
    ];
    **/

    $scope.changePassword = function(password){
        var userPass = password;
        
        $http({
            method: 'POST',
            data: userPass,
            url: $rootScope.host+'/users/changePass/'+$scope.profile.employeeno,
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available

            if(response.data.success === true){
                $rootScope.displayToast('success', response.data.message);
            }else{
                $rootScope.displayToast('error', response.data.errors);
            }
            reloadData();
            $scope.passDetails={password:''}

        }, function errorCallback(response) {
            $rootScope.displayToast('error', response.data.errors);
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
    }

    function serverData(sSource, aoData, fnCallback, oSettings) 
    {
    	/*console.log(sSource,'---sSource');
    	console.log(aoData,'----aoData' );
    	console.log(fnCallback, '---fnCallback');
    	console.log(oSettings, '---oSettings');*/

        //All the parameters you need is in the aoData variable
        var l  = aoData[4].value;
        var s  = aoData[3].value;
        
        var x = Math.ceil(s/l)+1;

		// console.log('x',x);
		var colsearch   = aoData[1].value;		// search per column

        var draw   = aoData[0].value;             
        var limit  = aoData[4].value;           // item per page
        var order  = aoData[2].value[0].dir;    // order by asc or desc
        var start  = aoData[3].value;           // start from
        var search = aoData[5].value;           // search string


        console.log('empid='+$scope.user.employeeId)
        //Then just call your service to get the records from server side
        dailylogs.execute(start, limit, $scope.user.employeeId).then(function(result)
        {    
            console.log(result,'result');
            var data = result.data.data;
            var records = {
                'draw': draw,
                'recordsTotal': result.data.recordsTotal, //Total records, before filtering (i.e. the total number of records in the database)
                'recordsFiltered': result.data.recordsFiltered, //Total records, after filtering (i.e. the total number of records after filtering has been applied - not just the number of records being returned for this page of data).
                'data': data  
            };  

            fnCallback(records);
            
            // // console.log(records);

        }); // end filterService
    } // end serverData

});
