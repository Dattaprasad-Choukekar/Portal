
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


app.controller("ClassCrudOpsCtrl", function ($scope, ClassCrudService) {
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
	
	$scope.AddElementDiv = function () {
        ClearFields();
        $scope.Action = "Add";
        $scope.divAddElement = true;
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
	
	$scope.editClass = function (classVar) {
        var getClassData = ClassCrudService.GetClass(classVar._id);
        getClassData.then(function (_class) {
            $scope.classVar = _class.data;
            $scope.classVar_id = classVar._id;
            $scope.name = classVar.name;
            $scope.Action = "Update";
            $scope.divAddElement = true;
        }, function (data) {
			console.error('Error in getting user' + data.data);
			$scope.errorMessage = 'Error in getting user';
        });
    }
	
	function ClearFields() {
        $scope.name = "";
    }
	
    $scope.Cancel = function () {
        $scope.divAddElement = false;
		$scope.Action = 'Add';
    };
	
	
});