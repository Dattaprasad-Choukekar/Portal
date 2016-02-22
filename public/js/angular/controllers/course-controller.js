//Course - Controller
controllers.CourseCrudOpsCtrl = function ($scope, CourseCrudService, ClassCrudService, userCrudService) {
	$scope.errorMessage = '';
    $scope.divAddElement = false;
	$scope.course_id = 0;
	$scope.previous_selection = [];
	$scope.totalItems = 0;
	$scope.currentPage = 1;
	$scope.numPerPage = 3;
	
	
	$scope.init =  function(){
		$scope.Action = 'Add';
		$scope.Heading = 'List of Courses';
		$scope.ActionBtn = true;
		getAllCourses();
	}
	
	
    //To Get all user records  
    function getAllCourses() {
		var courses_data = CourseCrudService.getAllCourses();
        courses_data.then(function (courses) {
								$scope.courses = courses.data;
								$scope.divList = true;
								$scope.paginate = function(value) {
									var begin, end, index;
									begin = ($scope.currentPage - 1) * $scope.numPerPage;
									end = begin + $scope.numPerPage;
									index = $scope.courses.indexOf(value);
									return (begin <= index && index < end);
								};
							}, function (data) {
								console.error('Error in getting classes :' + data.data);
								$scope.errorMessage = 'Error in getting classes';
						});
    }
	
	$scope.AddCourseDiv = function(){
		ClearFields();
		$scope.divList = false;
		$scope.divAction = true;
		$scope.ActionBtn = false;
		var i = 0;
		var teachers_data = userCrudService.getUsers();
		teachers_data.then(function(tdata){
			console.log(tdata);//| filter {role: 'TR'}
			$scope.teachers = tdata.data;
			var getClassData = ClassCrudService.getClasses();
			getClassData.then(function (data) {
				$scope.classes = data.data;				
				$scope.Heading = 'Add Course';
            }, function (data) {
               console.error('Error in adding user : ' + data.data);
			   $scope.errorMessage = 'Error in adding user';
            });
		});
	}
	
	
	
	$scope.deleteCourse = function (course) {
		var getClassData = CourseCrudService.deleteCourse(course._id);
        getClassData.then(function (msg) {
            getAllCourses();
        }, function (data) {
			console.error('Error in deleting user' + data.data);
			$scope.errorMessage = 'Error in deleting class';
        });
    }
	
	$scope.editCourse = function (course_data) {
		ClearFields();
        var get_course_data = CourseCrudService.GetCourse(course_data._id);
		get_course_data.then(function (_course) {
				$scope.course_var = _course.data;
				$scope.course_id = $scope.course_var._id;
				$scope.teachername = $scope.course_var.teacher._id;
				$scope.coursename = $scope.course_var.name;
				for(var i=0; i< $scope.course_var.classes.length; i++){
					$scope.previous_selection.push($scope.course_var.classes[i]._id);
				}//End of for()
			
				var teachers_data = userCrudService.getUsers();
				teachers_data.then(function(tdata){
				console.log(tdata);//| filter {role: 'TR'}
				$scope.teachers = tdata.data;
			
				ClassCrudService.getClasses().then(function(response) {
						$scope.classes = response.data;	
						$scope.Action = "Update";
						$scope.divList = false;
						$scope.divAction = true;
						$scope.ActionBtn = false;
				});
			});
        
        }, function (data) {
			console.error('Error in editing class' + data.data);
			$scope.errorMessage = 'Error in editing class';
        });
    }
	
	function ClearFields() {
        $scope.name = "";
		$scope.previous_selection = [];
		$scope.selected_classes = [];
    }
	
    $scope.Cancel = function () {
        $scope.divAction = false;
		$scope.divList = true;
		$scope.ActionBtn = true;
		$scope.Action = 'Add';
		$scope.Heading = 'List of Courses';
    };
	
	
	// Add and Edit options
	$scope.AddUpdateUser = function () {
		
        var course = {
			id: $scope.course_id,
            name: $scope.coursename,
			teacher : $scope.teachername,
			classes:$scope.previous_selection
        };
        var getUserAction = $scope.Action;
		var result;

        if (getUserAction == "Update") {
            result = CourseCrudService.updateCourse(course);			
        } else {
            result = CourseCrudService.addCourse(course);
		}
            result.then(function (msg) {
                $scope.Action = 'Add';
				$scope.Heading = 'List of Courses';
				 getAllCourses();
				$scope.divErrMessage=false;
                $scope.divUser = false;
				$scope.divAction = false;
				$scope.ActionBtn = true;				
            }, function (data) {
				$scope.divErrMessage=true;
               console.error('Error in adding user : ' + data.data);
			   $scope.errorMessage = data.data;
            });
    }
	
	
};