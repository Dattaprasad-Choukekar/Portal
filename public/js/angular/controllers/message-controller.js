//Course - Controller
controllers.MessageCtrl = function ($location, $rootScope, $scope, MessageService, CourseCrudService, ClassCrudService, userCrudService) {
	if (!$rootScope.currentCourse) {
		return $location.path('/');
	}
	
	$scope.course = $rootScope.currentCourse;
	$scope.errorMessage = '';
	$scope.divAddElement = false;
		
	$scope.init =  function(){
		$scope.Action = 'Add';
		$scope.Heading = 'List of Messages';
		$scope.divErrMessage=false;
        $scope.divAction = false;
		$scope.orightml = '';
		$scope.htmlcontent = $scope.orightml;
		$scope.disabled = false;
		$scope.ActionBtn = true;
		$scope.divList = true;
		getAllMessages($scope.course._id);
	}
	
    function getAllMessages(course_id) {
		var message_data = MessageService.getAllMessages(course_id);
        message_data.then(function (messages) {
								$scope.messages = messages.data;
								console.log('Printing data');
								console.log($scope.messages);
							}, function (data) {
								console.error('Error in getting messages :' + data.data);
								$scope.errorMessage = 'Error in getting messages';
						});
    }
	
	$scope.AddElementDiv = function(){
		$scope.divList = false;
		$scope.ActionBtn = false;
		ClearFields();
		$scope.divAction = true;
		console.log('something');
	}
	
	$scope.deleteElement = function (element) {
		var element_data = MessageService.deleteMessage($scope.course._id, element._id);
        element_data.then(function (msg) {
            getAllMessages($scope.course._id);
        }, function (data) {
			console.error('Error in deleting message' + data.data);
			$scope.errorMessage = 'Error in deleting message';
        });
    }
	
	function ClearFields() {
        $scope.htmlcontent = "";
    }
	
    $scope.Cancel = function () {
        $scope.divAction = false;
		$scope.Action = 'Add';
		//$scope.Heading = 'List of Messages';
		$scope.divList = true;
		$scope.ActionBtn = true;
    };
	
	$scope.editElement = function (message) {
		ClearFields();
        var messsage_data = MessageService.getMessage($scope.course._id, message._id);
		messsage_data.then(function (data) {
				$scope._message = data.data;
				$scope.divList = false;
				$scope.Action = "Update";
				$scope.htmlcontent = data.data.content;
				$scope.divAction = true;
				$scope.ActionBtn = false;

		}, function (data) {
			console.error('Error in editing message' + data.data);
			$scope.errorMessage = 'Error in editing message';
        });
    }
	
	function ClearFields() {
        $scope.content = "";
		//$scope.previous_selection = [];
		//$scope.selected_classes = [];
    }
	
    $scope.Cancel = function () {
        $scope.divAction = false;
		$scope.Action = 'Add';
		$scope.Heading = 'List of Courses';
		$scope.divList = true;
		$scope.ActionBtn = true;
    };
	
	// Add and Edit options
	$scope.AddUpdateElement = function () {
        var message = {
			content: $scope.htmlcontent,
        };
        var getUserAction = $scope.Action;
		var result;
		
				
        if (getUserAction == "Update") {
            result = MessageService.updateMessage($scope.course._id, $scope._message._id, message);			
        } else {
            result = MessageService.addMessage($scope.course._id, message);
		}
            result.then(function (msg) {
                $scope.Action = 'Add';
				$scope.Heading = 'List of Messages';				
				$scope.init();
							
            }, function (data) {
				$scope.divErrMessage=true;
               console.error('Error in adding message : ' + data.data);
			   $scope.errorMessage = data.data;
            });
    }

};