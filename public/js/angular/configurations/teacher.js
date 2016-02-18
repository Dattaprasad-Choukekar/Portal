var app = angular.module("TeacherPageApp", ['ngMaterial', 'ngRoute']);

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
            });
			
			
    });
	
var controllers = {};