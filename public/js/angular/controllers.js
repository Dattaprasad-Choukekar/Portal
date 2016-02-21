app.controller(controllers); //Includes all the controllers
app.controller("UserCrudOpsCtrl", function ($scope, userCrudService) {
	$scope.roles = ['AD', 'ST', 'TR'];
	$scope.sexes = ['M', 'F', 'O'];
	$scope.Action = "Add";
	$scope.errorMessage = '';
    $scope.divUser = false;
	$scope.divList = true;
	$scope.totalItems = 0;
	$scope.currentPage = 1;
	$scope.numPerPage = 7;
	GetAllUsers();
	
    //To Get all user records  
    function GetAllUsers() {
		var getUserData = userCrudService.getUsers();
        getUserData.then(function (users) {
			console.log(users);
            $scope.users = users.data;			
			$scope.totalItems = $scope.users.length;
			$scope.paginate = function(value) {
				var begin, end, index;
				begin = ($scope.currentPage - 1) * $scope.numPerPage;
				end = begin + $scope.numPerPage;
				index = $scope.users.indexOf(value);
				return (begin <= index && index < end);
		  };
			
        }, function (data) {
            console.error('Error in getting users :' + data.data);
			$scope.errorMessage = 'Error in getting users';
        });
    }
	
	$scope.AddUpdateUser = function () {
		
        var User = {
            username: $scope.username,
            password: $scope.password,
			role:$scope.role,
			firstName:$scope.firstName,
			lastName:$scope.lastName,
			email:$scope.email,
			birthDate:$scope.birthDate,
			sex:$scope.sex,
        };
        var getUserAction = $scope.Action;

        if (getUserAction == "Update") {
           
		    User._id = $scope.user_id;
            var getUserData = userCrudService.UpdateUser(User);
            getUserData.then(function (msg) {
                GetAllUsers();
                $scope.divUser = false;
				$scope.Action = 'Add';
				$scope.divList = true;
            }, function (data) {
				console.error('Error in updating user' + data.data);
				$scope.errorMessage = 'Error in updating user';
            });
			
        } else {
            var getUserData = userCrudService.AddUser(User);
            getUserData.then(function (msg) {
                GetAllUsers();
                $scope.divUser = false;
				$scope.divList = true;
				$scope.Action = 'Add';
            }, function (data) {
               console.error('Error in adding user : ' + data.data);
			   $scope.errorMessage = 'Error in adding user';
            });
        }
    }
	
	$scope.AddUserDiv = function () {
        ClearFields();
        $scope.Action = "Add";
        $scope.divUser = true;
		$scope.role = 'AD';
		$scope.sex = 'M';
		$scope.divList = false;
    }
	
	
	$scope.deleteUser = function (user) {
        var getUserData = userCrudService.DeleteUser(user._id);
        getUserData.then(function (msg) {
            GetAllUsers();
        }, function (data) {
			console.error('Error in deleting user' + data.data);
			$scope.errorMessage = 'Error in deleting user';
        });
    }
	
	$scope.editUser = function (user) {
        var getUserData = userCrudService.GetUser(user._id);
        getUserData.then(function (_user) {
            $scope.user = _user.data;
            $scope.user_id = user._id;
            $scope.username = user.username;
			$scope.role = user.role;
            $scope.password = user.password;
			$scope.firstName = user.firstName;
			$scope.lastName = user.lastName;
			$scope.email = user.email;
			$scope.birthDate = user.birthDate;
			$scope.sex = user.sex;
            $scope.Action = "Update";
            $scope.divUser = true;
			$scope.divList = false;
        }, function (data) {
			console.error('Error in getting user' + data.data);
			$scope.errorMessage = 'Error in getting user';
        });
    }
	
	function ClearFields() {
        $scope.username = "";
        $scope.password = "";
		$scope.firstName = "";
		$scope.lastName = "";
		$scope.birthDate = "";
		$scope.email = "";
		$scope.sex = "";
		$scope.role = "";
    }
	
    $scope.Cancel = function () {
        $scope.divUser = false;
		$scope.Action = 'Add';
		$scope.divList = true;
    };
	
	
});

//Class - Controller
app.controller("ClassCrudOpsCtrl", function ($scope, ClassCrudService, StudentCrudService) {
	$scope.errorMessage = '';
    $scope.divAddElement = false;
	$scope.Action = "Add";
	GetAllClasses();
	
	
    //To Get all user records  
    function GetAllClasses() {
		var getClassData = ClassCrudService.getClasses();
        getClassData.then(function (classes) {
			console.log(classes);
            $scope.classes = classes.data;
			console.log('sssssssss');
			console.log($scope.classes);
        }, function (data) {
            console.error('Error in getting classes :' + data.data);
			$scope.errorMessage = 'Error in getting classes';
        });
    }
	
	$scope.AddUpdateElement = function () {
		
        var ClassVar = {
            name: $scope.name,
            students: $scope.selected_students,
        };
        var getUserAction = $scope.Action;

        if (getUserAction == "Update") {
           
		    ClassVar._id = $scope.classVar_id;
            var getClassData = ClassCrudService.UpdateClass(ClassVar);
            getClassData.then(function (msg) {
                GetAllClasses();
                $scope.divAddElement = false;
				$scope.Action = 'Add';
            }, function (data) {
				console.error('Error in updating class' + data.data);
				$scope.errorMessage = 'Error in updating class';
            });
			
			
        } else {
			console.log(ClassVar);
			
            var getClassData = ClassCrudService.AddClass(ClassVar);
            getClassData.then(function (msg) {
                GetAllClasses();
				$scope.selection_watch();
                $scope.divAddElement = false;
				$scope.Action = 'Add';
            }, function (data) {
               console.error('Error in adding user : ' + data.data);
			   $scope.errorMessage = 'Error in adding user';
            });
			
        }
    }
	
	$scope.AddElementDiv = function () {
		ClearFields();
		getRemainingStudents();

		$scope.selection_watch = $scope.$watch('selection', function () {
		$scope.selected_students = [];
		
		angular.forEach($scope.selection, function (value, index) {
			
			if (value) {
				$scope.selected_students.push($scope.remaining_students[index]._id);
			} else {
				$scope.selected_students.splice(index, 1);
			}
		
		}); 
		//console.log($scope.selected_students);
		}, true);
       
        $scope.Action = "Add";
		$scope.divAddElement = true;
    }
	function getRemainingStudents() {
		StudentCrudService.getStudentsNotBelongingToClass()
		.then(function(response) {
			$scope.remaining_students = [];
			for (var key in response.data) {
				console.log('ssss');
				console.log(response.data[key]);
				if (!response.data[key].classRef) {
					$scope.remaining_students.push(response.data[key]);
				} 	 			
			}
			
			console.log($scope.remaining_students.length);
			

		});
	}
	
	
	
	$scope.deleteClass = function (classVar) {
        var getClassData = ClassCrudService.DeleteClass(classVar._id);
        getClassData.then(function (msg) {
            GetAllClasses();
        }, function (data) {
			console.error('Error in deleting user' + data.data);
			$scope.errorMessage = 'Error in deleting class';
        });
    }
	
	$scope.editClass = function (classVar) {
		ClearFields();
        var getClassData = ClassCrudService.GetClass(classVar._id);
        getClassData.then(function (_class) {
            $scope.classVar = _class.data;
            $scope.classVar_id = _class.data._id;
            $scope.name = classVar.name;
			$scope.selected_students = [];
		StudentCrudService.getAllStudents()
		.then(function(response) {
			$scope.remaining_students = [];
			for (var key in response.data) {
				console.log('ssssss');
				console.log(response.data[key]);
				if (!response.data[key].classRef ) {
					$scope.remaining_students.push(response.data[key]);	
				}else if (response.data[key].classRef._id == classVar._id) {
					$scope.remaining_students.push(response.data[key]);	
					$scope.selected_students.push(response.data[key]._id);
				}				
			}
			
			console.log($scope.remaining_students.length);
			$scope.toggleSelection = function toggleSelection(student, tickVal) {
			
			if (!tickVal) {
			
				var idx = $scope.selected_students.indexOf(student._id);
				$scope.selected_students.splice(idx,1);
		
			} else {
				$scope.selected_students.push(student._id);
			}

			};
			
			$scope.Action = "Update";
            $scope.divAddElement = true;
		});
			
			
			
        
        }, function (data) {
			console.error('Error in editing class' + data.data);
			$scope.errorMessage = 'Error in editing class';
        });
    }
	
	function ClearFields() {
        $scope.name = "";
		$scope.selection = [];
		$scope.selected_students = [];
		//$scope.selected_students = [];
    }
	
    $scope.Cancel = function () {
        $scope.divAddElement = false;
		$scope.selection_watch();
		$scope.Action = 'Add';
    };
	
	
});




app.controller("TeacherCtrl", function ($scope, $rootScope,$http, $location) {
	$scope.errorMessage = "";
	$scope.totalItems = 0;
	$scope.currentPage = 1;
	$scope.numPerPage = 5;
	GetAllCourses();
	
	
    //To Get all user records  
    function GetAllCourses() {
		$http.get("/api/Courses").then(function (courses) {
			console.log(courses);
            $scope.courses = courses.data;			
			$scope.totalItems = $scope.courses.length;
			$scope.paginate = function(value) {
				var begin, end, index;
				begin = ($scope.currentPage - 1) * $scope.numPerPage;
				end = begin + $scope.numPerPage;
				index = $scope.courses.indexOf(value);
				return (begin <= index && index < end);
		  };
		  
        }, function (data) {
            console.error('Error in getting Courses :' + data.data);
			$scope.errorMessage = 'Error in getting Courses';
        });

    }
	
	$scope.showCoursePage =  function (course) {
	  
       $http({method: "get", url: "/api/Courses/" + course._id })
        .then(function (data) {
            $rootScope.currentCourse = data.data;
			$location.path('course');
        }, function (data) {
            console.error('Error in getting Course with id :'+ course._id  + data.data);
			$scope.errorMessage = 'Error in getting Course'+ course._id;
        });
    
	};
	
});

app.controller("CourseCtrl", function ($scope,$rootScope,$timeout, $http, $location, CoursePageService) {
	$scope.errorMessage = "";
	$scope.successMessage = "";
	$scope.totalItems = 0;
	$scope.currentPage = 1;
	$scope.numPerPage = 2;
	$scope.showFilesSection = true;
	if (!$rootScope.currentCourse) {
		return $location.path('/');
	}
	$scope.course = $rootScope.currentCourse;
	$scope.formActionPath = "/api/courses/" + $scope.course._id + "/files";
	
	getCourseFiles($scope.course._id) ;
	function getCourseFiles(courseId) {
	
		var getCourseFilesData = CoursePageService.getCourseFiles(courseId);
            getCourseFilesData.then(function (msg) {
				$scope.files = msg.data;
				$scope.totalItems = $scope.files.length;
				$scope.paginate = function(value) {
				var begin, end, index;
				begin = ($scope.currentPage - 1) * $scope.numPerPage;
				end = begin + $scope.numPerPage;
				index = $scope.files.indexOf(value);
				return (begin <= index && index < end);
		  };
            }, function (data) {
               console.error('Error in getting course files : ' + data.data);
			   $scope.errorMessage = 'Error in getting course files :';
            });
	};
	
	$scope.refreshFilesList = function () {
		 $timeout(function() {
				getCourseFiles($scope.course._id) ;
				if (!($scope.$$phase)) { // most of the time it is "$digest"
					$scope.$apply();
				} 
			}, 500);
		
	};
	
	$scope.deleteFile = function (file) {
		var deleteCourseFilesData = CoursePageService.deleteCourseFile($scope.course._id, file._id);
		deleteCourseFilesData.then(function (msg) {
			console.log('deleted file');
			$scope.refreshFilesList();
		}, function (data) {
		   console.error('Error in deleting file : ' + data.data);
		   $scope.errorMessage = 'Error in deleting file';
		});
	};
	

});