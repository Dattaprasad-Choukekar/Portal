
app.controller("UserCrudOpsCtrl", function ($scope, userCrudService) {
	$scope.roles = ['AD', 'ST', 'TR'];
	$scope.sexes = ['M', 'F', 'O'];
	$scope.errorMessage = '';
    $scope.divUser = false;
	GetAllUsers();
	
    //To Get all user records  
    function GetAllUsers() {
		var getUserData = userCrudService.getUsers();
        getUserData.then(function (users) {
			console.log(users);
            $scope.users = users.data;
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
				$scope.Action = 'Add User';
            }, function (data) {
				console.error('Error in updating user' + data.data);
				$scope.errorMessage = 'Error in updating user';
            });
			
        } else {
            var getUserData = userCrudService.AddUser(User);
            getUserData.then(function (msg) {
                GetAllUsers();
                $scope.divUser = false;
				$scope.Action = 'Add User';
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
    };
	
	
});


app.controller("ClassCrudOpsCtrl", function ($scope, ClassCrudService, StudentCrudService) {
	$scope.errorMessage = '';
    $scope.divAddElement = false;
	GetAllClasses();
	
	
    //To Get all user records  
    function GetAllClasses() {
		var getClassData = ClassCrudService.getClasses();
        getClassData.then(function (classes) {
			console.log(classes);
            $scope.classes = classes.data;
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
			console.log('haha');
			console.log(ClassVar);

			
            var getClassData = ClassCrudService.UpdateClass(ClassVar);
            getClassData.then(function (msg) {
                GetAllClasses();
                $scope.divAddElement = false;
				$scope.Action = 'Add Class';
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
				$scope.Action = 'Add User';
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