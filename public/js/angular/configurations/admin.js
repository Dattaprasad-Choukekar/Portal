var app = angular.module("UserCrudOps", ['ngRoute']);

app.config(function($routeProvider) {
		
        $routeProvider
            .when('/', {
                templateUrl : 'views/broadcast_messages.html',
                controller  : 'BroadcastCtrl'
            }).when('/manage_users', {
                templateUrl : 'views/user_management.html',
                controller  : 'UserCrudOpsCtrl'
            }).when('/manage_classes', {
                templateUrl : 'views/class_management.html',
                controller  : 'ClassCrudOpsCtrl'
            }).when('/manage_courses', {
                templateUrl : 'views/course_management.html',
                controller  : 'CourseCrudOpsCtrl'
            }).when('/broadcast_messages', {
                templateUrl : 'views/broadcast_messages.html',
                controller  : 'BroadcastCtrl'
            })
			.otherwise({redirectTo: '/login'});
			
			
    });

var controllers = {};