'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:EmployeeLogsCtrl
 * @description
 * # EmployeeLogsCtrl
 * Controller of the uiApp
 */
angular.module('uiApp').controller('EmployeeLogsCtrl', 
	function (employeelogs, DTColumnBuilder, DTOptionsBuilder, $compile,
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

	    var contentFull = new Placeload('.placeloadcontent');

	    	contentFull.draw({
	    		width: '1200px',
	    		height: '40px',
	    		marginTop: '25px'
	    	});

	    	contentFull.draw({
	    		width: '1200px',
                height: '500px',
	    		marginTop: '23px'
	    	});
	    	

	    $scope.contentData = false;
	    $scope.contentPlaceholder = false;	

	    var contentHolder = function() {
	    	$scope.contentPlaceholder = true;
	    	$scope.contentData = true;
	    }

    	$timeout(contentHolder, 1000);

    });

    if ($cookies.getObject('loginUser')) {
        $rootScope.showLogout  = true;
        $scope.loginInfo = JSON.parse($cookies.get('loginUser'));
        //console.log($cookies.getObject('loginUser'))
    }else{
        $window.location.href = '/#/member/login/index';
    }
	/**		Begin Coding
	------------------------------**/

    /**
     * Display List of Records
     */
   
    $scope.selected = {};
    $scope.selectAll = false;
    $scope.toggleAll = toggleAll;
    $scope.toggleOne = toggleOne;
  
    var titleHtml = '<input type="checkbox" ng-model="selectAll" ng-click="toggleAll(selectAll, selected)">';

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
    
	/** Serverside config 
    $scope.dtOptions = DTOptionsBuilder
        .newOptions()
        .withFnServerData(serverData)
        .withDataProp('data') // tried data aswell
        .withOption('processing', true)
        .withOption('serverSide', true)
        .withOption('paging', true) 
        .withOption('bFilter', false) //Search
        .withOption('autoWidth', true)
        .withDisplayLength(10)
        .withPaginationType('simple_numbers')
        .withOption('createdRow', function(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        })
        .withOption('headerCallback', function(header) {
            if (!$scope.headerCompiled) {
                // Use this headerCompiled field to only compile header once
                $scope.headerCompiled = true;
                $compile(angular.element(header).contents())($scope);
            }
        })
       .withLightColumnFilter({
            '0': {
                html: 'input',
                type: 'text',
                attr: {}
            },
            '1' : {
                html: 'input',
                type: 'text',
                attr: {}
            },
            '2' : {
                html: 'input',
                type: 'text',
                attr: {}
            }
        });
    **/
    $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $http.get($rootScope.host+'/logs/all').then(function(result){
            defer.resolve(result.data);
        });
        return defer.promise;
    })
    .withPaginationType('simple_numbers')
    .withOption('createdRow', function(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    })
    .withOption('headerCallback', function(header) {
        if (!$scope.headerCompiled) {
            // Use this headerCompiled field to only compile header once
            $scope.headerCompiled = true;
            $compile(angular.element(header).contents())($scope);
        }
    })
    // .withOption('order', [1, 'desc'])
    .withLightColumnFilter({
        '0': {
            attr: {}
        },
        '1' : {
            html: 'input',
            type: 'text',
            attr: {}
        },
        '2' : {
            html: 'input',
            type: 'text',
            attr: {}
        },
        '3' : {
            html: 'input',
            type: 'text',
            attr: {}
        },
        '4' : {
            html: 'input',
            type: 'text',
            attr: {}
        }
    });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable()
            .renderWith(function(data, type, full, meta) {
                $scope.selected[full.id] = false;
                return '<input type="checkbox" ng-model="selected[' + data.id + ']" ng-click="toggleOne(selected)">';
                
            }),
        DTColumnBuilder.newColumn('firstname').withTitle('First name'),
        DTColumnBuilder.newColumn('lastname').withTitle('Last name'),
        DTColumnBuilder.newColumn('logDate').withTitle('Date'),
        DTColumnBuilder.newColumn('logTime').withTitle('Time')
    ];
    function toggleAll (selectAll, selectedItems) {
        console.log(selectAll, selectedItems);
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
    }
    function toggleOne (selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                if(!selectedItems[id]) {
                    $scope.selectAll = false;
                    return;
                }
            }
        }
        $scope.selectAll = true;
    }

    function serverData(sSource, aoData, fnCallback, oSettings) 
    {
        console.log(aoData,'aoData');
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
 

        //Then just call your service to get the records from server side
        employeelogs.execute(start, limit, order, search).then(function(result)
        {    
            //console.log(result,'result');
            var data = result.data.data;
            var records = {
                'draw': draw,
                'recordsTotal': result.data.recordsTotal, //Total records, before filtering (i.e. the total number of records in the database)
                'recordsFiltered': result.data.recordsFiltered, //Total records, after filtering (i.e. the total number of records after filtering has been applied - not just the number of records being returned for this page of data).
                'data': data  
            };  

            fnCallback(records);

        }); // end filterService
    } // end serverData


});
