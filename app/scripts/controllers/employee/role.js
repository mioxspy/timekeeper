'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:EmployeeRoleCtrl
 * @description
 * # EmployeeRoleCtrl
 * Controller of the uiApp
 */
angular.module('uiApp').controller('EmployeeRoleCtrl', 
		function ($timeout, $scope, $http, $rootScope, DTColumnDefBuilder, DTOptionsBuilder, DTColumnBuilder, $q, $compile,$cookies) {
    
	if ($cookies.getObject('loginUser')) {
        // $state.go('app.dashboard.v1'); 
        // $rootScope.setting.layout.pageTopMenu = true;
        $rootScope.showLogout  = true;
        $scope.isupdate = 'false';
        $scope.loginInfo = JSON.parse($cookies.get('loginUser'));
        console.log($scope.loginInfo,'---loginInfo----')
        if($scope.loginInfo.permissions.indexOf("update users") != -1)
            $scope.isupdate = 'true';
        else
            $scope.isupdate ='false';
        // $window.location.href = '/#/app/dashboard/index';
        // $scope.loginUsername = $scope.loginInfo.firstname.toUpperCase();

    }else{
        $window.location.href = '/#/member/login/index';
    }

    angular.element(document).ready(function () {

		/** 		Content Placeholder
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

	/** Coding Starts Here
	------------------------**/
	$scope.roleDetail = { 'id': Date.now(), 'roleName': '', 'permission': ['']}

	$scope.permissionArray = {
        "User": [
            {
                "id": 3,
                "name": "View User"
            },
            {
                "id": 2,
                "name": "Update User"
            }
        ],
        "Roles": [
            {
                "id": 1,
                "name" : "View Role"
            },
            {
                "id": 2,
                "name" : "Delete Role"
            } 
        ]
    };
		

	//console.log($scope.permissionArray);


	// $scope.items = [1,2,3,4,5];
	
	$http.get($rootScope.host+'/roles/permissions')
        .then(function (result) {
			$scope.listCheckers(result,[])
    });

    
    $scope.listCheckers = function(result,isSelected){
    	$scope.permItems =  result.data;
		$scope.plength = $scope.permItems.length;
		
		$scope.selected = isSelected;

		$scope.toggle = function (item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) {
				list.splice(idx, 1);
			}
			else {
				list.push(item);
			}
		};

		$scope.exists = function (item, list) {
			return list.indexOf(item) > -1;
		};
		$scope.isIndeterminate = function() {
			return ($scope.selected.length !== 0 &&
				$scope.selected.length !== $scope.plength);
		};
		$scope.isChecked = function() {
			return $scope.selected.length === $scope.plength;
		};
		$scope.toggleAll = function() {
			if ($scope.selected.length === $scope.plength) {
				$scope.selected = [];
			} else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
				$scope.selected = $scope.permItems.slice(0);
			}
		};
    };
	//console.log($scope.items);

	/** Data Table Configuration
	-------------------------------**/
	$scope.updatepage = false;

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

    $scope.setupdatepage = function(bol){
    	$scope.updatepage = bol;
		$('.updateRole').removeClass('slideInDown').addClass('slideInUp');
    	$('.createRole').addClass('animated fadeInDown')
    }

    $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $http.get($rootScope.host+'/roles/all').then(function(result){
            defer.resolve(result.data);
        });
        return defer.promise;
    })
    .withOption('createdRow', createdRow)
    .withOption('rowCallback', rowCallback)
    .withPaginationType('simple_numbers')
    .withLightColumnFilter({
    		'0': {
                html: 'input',
                type: 'text'
            },
            '1' : {
                html: 'input',
                type: 'text'
            },
        });

    $scope.dtColumns = [
	    DTColumnBuilder.newColumn('roleName').withTitle('Role Name'),
	    DTColumnBuilder.newColumn('permission').withTitle('Permission'),
	    // DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml).notVisible($scope.isupdate)
    ];

    
    /*$scope.dtColumnDefs = [  
	    DTColumnDefBuilder.newColumnDef([1,2]).withOption('type', 'date')
	];*/

    function actionsHtml(data, type, full, meta) {
	    return 	'<md-icon class="material-icons md-warn" ng-click="deleteRole('+data.id+')" ng-show="isupdate==true? true:false">delete_forever</md-icon>';
    }

	function someClickHandler(info) {
		// console.log(info);
		$scope.updatepage = true;

		$('.updateRole').removeClass('slideInUp').addClass('animated slideInDown');
		$('.createRole').removeClass('fadeInDown');

		// console.log(info.permission)
		$scope.permItems = [];
		$scope.permItems.push(info.permission);
		$scope.updaterole = { 'id': info.id, 'roleName': info.roleName, 'permission': $scope.permItems}

		$http.get($rootScope.host+'/roles/permissions')
	        .then(function (result) {
				$scope.listCheckers(result,info.permission)
	    });

	    // console.log(($scope.updaterole.permission).toString())
    }
    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
    	
        // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td', nRow).unbind('click');
        $('td', nRow).bind('click', function() {
            $scope.$apply(function() {
                someClickHandler(aData);
                // console.log(aData)
            });
        });
        return nRow;
    }

    $scope.permchecks = "";
    
    $scope.toggleSelection = function(item) {
	    var idx = $scope.selection.indexOf(item);

	    // is currently selected
	    if (idx > -1) {
	      $scope.selection.splice(idx, 1);
	    }

	    // is newly selected
	    else {
	      $scope.selection.push(item);
	    }
	    console.log($scope.selection)
	};

     $scope.addRole = function(roleForm)
    {
        var roleInfo = roleForm;
        var roleData = {};
        var ispermissions = ($scope.selected).toString();

		roleData = {
			roleName: roleInfo.roleName,
			permission: ispermissions
		}
		
		// console.log((roleInfo.permission))
        $http({
            method: 'POST',
            data: roleData,
            url: $rootScope.host+'/roles/insert',
        }).then(
        	function successCallback(response) {
	            // this callback will be called asynchronously
	            // when the response is available

	            if(response.data.success === true){
	            	
	            	$scope.roleDetail = {};
	            	$scope.roleForm.$setPristine();
	            	$scope.roleForm.$setUntouched();
	                $rootScope.displayToast('success', response.data.message);
	            }else{
	                $rootScope.displayToast('error', response.data.errors);
	            }
	            $scope.reloadData();
				// $scope.
	        }, function errorCallback(response) {
	            $rootScope.displayToast('error', response.data.errors);
	            // called asynchronously if an error occurs
	            // or server returns response with an error status.

	        }
	    );

    };

	$scope.updateRoles = function(updateForm)
    {
        var roleInfo = updateForm;
        var roleData = {};

        var permchecks=[];

		for (var i = 0; i < roleInfo.permission[0].length; i++) {
			var d;
			if(roleInfo.permission[0][i] !== ""){
				// console.log(roleInfo.permission[0][i]+" === true")
				d = roleInfo.permission[0][i];
				permchecks.push(d);
			}
			
		}

		// console.log((permchecks).toString())
		
		roleData = {
			roleName: roleInfo.roleName,
			permission: (permchecks).toString()
		}
		console.log(roleData)
        $http({
            method: 'POST',
            data: roleData,
            url: $rootScope.host+'/roles/update/'+roleInfo.id,
        }).then(
        	function successCallback(response) {
	            // this callback will be called asynchronously
	            // when the response is available

	            if(response.data.success === true){
	            	
	            	$scope.updaterole = {};
	            	$scope.updateForm.$setPristine();
	            	$scope.updateForm.$setUntouched();
	                $rootScope.displayToast('success', response.data.message);
	            }else{
	                $rootScope.displayToast('error', response.data.errors);
	            }
	            $scope.reloadData();
				// $scope.
	        }, function errorCallback(response) {
	            $rootScope.displayToast('error', response.data.errors);
	            // called asynchronously if an error occurs
	            // or server returns response with an error status.

	        }
	    );

    };

    $scope.deleteRole = function(id){ 
    	$http({
            method: 'POST',
            data: {id:id},
            url: $rootScope.host+'/roles/delete/'+id, 
        }).then(function successCallback (response){
        	
            $rootScope.displayToast('success',response.data.message);
            $scope.reloadData();
        
        },function errorCallback(response){
            $rootScope.displayToast('error',response.data.error);
            $scope.reloadData();
        });	
    }

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }
});
