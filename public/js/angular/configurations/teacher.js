var app = angular.module("TeacherPageApp", ['ngMaterial', 'ngRoute', 'ui.bootstrap', 'ngResource']);

app.config(function($routeProvider) {
		
        $routeProvider
            .when('/', {
                templateUrl : 'views/my_courses.html',
                controller  : 'TeacherCtrl'
            }).when('/course', {
                templateUrl : 'views/course.html',
                controller  : 'CourseCtrl'
            }).when('/my_courses', {
                templateUrl : 'views/my_courses.html',
                controller  : 'TeacherCtrl'
            }).when('/broadcast_messages', {
                templateUrl : 'views/my_broadcast_messages.html',
                controller  : 'BroadcastCtrl'
            });
			
			
    });
	
var controllers = {};