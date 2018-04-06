'use strict';

/**
 * @ngdoc function
 * @name uiApp.controller:EmployeeConfigCtrl
 * @description
 * # EmployeeConfigCtrl
 * Controller of the uiApp
 */
app.controller('EmployeeConfigCtrl', 
    function ($timeout, $scope, filterService, DTOptionsBuilder, DTColumnDefBuilder, 
        $cookies, $window, $rootScope, $http, DTColumnBuilder, $compile, $q) {
    /*$rootScope.setting.layout.pageBgWhite = true;*/
    if ($cookies.getObject('loginUser')) {
        // $state.go('app.dashboard.v1'); 
        // $rootScope.setting.layout.pageTopMenu = true;
        $rootScope.showLogout  = true;
        $scope.isupdate = 'false';
        $scope.loginInfo = JSON.parse($cookies.get('loginUser'));
        // console.log($scope.loginInfo,'---loginInfo----')
        if($scope.loginInfo.permissions.indexOf("update users") != -1 || $scope.loginInfo.permissions.indexOf("activate/deactivate users") != -1)
            $scope.isupdate = 'true';
        else
            $scope.isupdate ='false';
        // $window.location.href = '/#/app/dashboard/index';
        // $scope.loginUsername = $scope.loginInfo.firstname.toUpperCase();

    }else{
        $window.location.href = '/#/member/login/index';
    }
    angular.element(document).ready(function () {

        /*$('#employee_role').material_select();*/

        /**             Content Placeholder
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
    

    /**         Start Code
    --------------------------------**/

    $scope.employeeDetails = {
        id: Date.now(),
        employeeId: '',
        email: '',
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        middlename: '',
        birthdate: '',
        roleId: '',
        status: ''
    };
    $scope.usersEmailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    $scope.passwordFormat = /^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/;
    // $scope.passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{10,}/;

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

    $scope.setupdatepage = function(bol){
        $scope.updatepage = bol;
        $('.updateUser').removeClass('slideInDown').addClass('slideInUp');
        $('.createUser').addClass('animated fadeInDown')
    }

    function callback(json) {
        //console.log(json);
    };


    
    $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $http.get($rootScope.host+'/users/all').then(function(result){
            defer.resolve(result.data.data);
            // console.log(result)
        });
        return defer.promise;
    })
    .withOption('createdRow', createdRow)
    .withOption('rowCallback', rowCallback)
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
        });

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('employeeId').withTitle('Employee No.'),
        DTColumnBuilder.newColumn('email').withTitle('Email Address'),
        DTColumnBuilder.newColumn('firstname').withTitle('First name'),
        DTColumnBuilder.newColumn('lastname').withTitle('Last name'),
        DTColumnBuilder.newColumn('status').withTitle('Status').notSortable().renderWith(actionsHtml)
    ];

    $scope.isshow = 'false';

    function actionsHtml(data, type, full, meta) {
        if($scope.isupdate == 'true'){
            if(full.status === 1){
                // console.log(full.employeeId,'===employeeId=----full.status==1')
                return '<i class="fa fa-2x fa-toggle-on text-success" title="Active" ng-click="changeStatus(0,'+"'"+full.employeeId+"'"+');" ng-disabled=true></i>';
            }else{
                return '<i class="fa fa-2x fa-toggle-on fa-rotate-180 text-danger" title="Inactive"  ng-click="changeStatus(1,'+"'"+full.employeeId+"'"+');" ng-disabled=true></i>';
            }
        }else{
            if(full.status === 1){
                return '<i class="badge badge-success">Active</i>'
            }else{
                return '<i class="badge badge-danger">InActive</i>'
            }
        }
    }

    $scope.changeStatus = function(status, empid){
        console.log('---status=== '+status+',,,,, employeeId===== '+empid)
        $http({
            method: 'POST',
            data: {employeeId:empid, status:status},
            url: $rootScope.host+'/users/changeStatus', 
        }).then(function successCallback (response){
            if(response.data.success === true){
                $rootScope.displayToast('success',response.data.message);
                reloadData();
            }else{
                $rootScope.displayToast('error',response.data.message);
                reloadData();
            }
        
        },function errorCallback(response){
            $rootScope.displayToast('error',response.data.error.message);
            reloadData();
        });
    };    

    $scope.userStatusSocket = function (status, user) {
        $rootScope.socket.emit('user', {user:user, status:status});
    }; 

    function serverData(sSource, aoData, fnCallback, oSettings) 
        {
            //All the parameters you need is in the aoData variable
            var l  = aoData[4].value;
            var s  = aoData[3].value;
            
            var x = Math.ceil(s/l)+1;

            // console.log('x',x);
            var draw   = aoData[0].value;             
            var limit  = aoData[4].value;               // item per page
            // var order  = aoData[2].value[0].dir;    // order by asc or desc
            var start  = aoData[3].value;              // start from
            var search = aoData[5].value;           // search string
            // if(start){
                var start = start+1;
            // };


            //Then just call your service to get the records from server side
            filterService.execute(start, limit, search).then(function(result)
            {    
                // console.log(result);
                var data = result.data;
                var records = {
                    'draw': draw,
                    'recordsTotal': result.data.recordsTotal,
                    'recordsFiltered': result.data.recordsFiltered,
                    'data': data  
                };  

                fnCallback(records);
            });
        }

    $scope.addUser = function(userForm)
    {
        var userInfo = userForm;
        if(userInfo.middlename === false){
            userInfo.middlename = '';
        }

        // console.log(userInfo)
        $http({
            method: 'POST',
            data: userInfo,
            url: $rootScope.host+'/users/insert',
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available

            if(response.data.success === true){
                $scope.employeeDetails = {};
                $scope.regForm.$setPristine();
                $scope.regForm.$setUntouched();
                $rootScope.displayToast('success', response.data.message);
            }else{
                $rootScope.displayToast('error', response.data.error.message);
            }
            reloadData();

        }, function errorCallback(response) {
            $rootScope.displayToast('error', response.data.error.message);
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
    };
    
    $scope.updateUser = function(updateForm)
    {
        
        var userInfo = updateForm;
        if(userInfo.middlename === false){
            userInfo.middlename = '';
        }

        // console.log(userInfo)
        $http({
            method: 'POST', 
            data: userInfo,
            url: $rootScope.host+'/users/update/'+userInfo.id,
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available

            if(response.data.success === true){
                $scope.updateEmployee = {};
                $scope.updateForm.$setPristine();
                $scope.updateForm.$setUntouched();
                $rootScope.displayToast('success', response.data.message);
                $scope.updatepage = false;
            }else{
                $rootScope.displayToast('error', response.data.error.message);
            }
            reloadData();

        }, function errorCallback(response) {
            $rootScope.displayToast('error', response.data.error.message);
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });
    };
    
    function someClickHandler(info) {
        
        $scope.updatepage = true;

        $('.updateUser').removeClass('slideInUp').addClass('animated slideInDown');
        $('.createUser').removeClass('fadeInDown');

        $scope.updateEmployee = {
                'id': info.id,
                'employeeId': info.employeeId,
                'email': info.email,
                'birthdate': info.birthdate,
                'username': info.username,
                'password': '',
                'firstname': info.firstname,
                'lastname': info.lastname,
                'middlename': info.middlename,
                'roleId': info.roleId
            };
        // console.log($scope.updateEmployee)
    };

    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        
        // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td:not(:first-child, :last-child)', nRow).unbind('click');
        $('td:not(:first-child, :last-child)', nRow).bind('click', function() {
            $scope.$apply(function() {
                someClickHandler(aData);
            });
        });
        return nRow;
    }

    function createdRow(row, data, dataIndex) {
        // Recompiling so we can bind Angular directive to the DT
        $compile(angular.element(row).contents())($scope);
    }

    //get all created roles
    $http.get($rootScope.host+'/roles/all')
        .then(function (result) {
           $scope.roles = result.data
        });

});

