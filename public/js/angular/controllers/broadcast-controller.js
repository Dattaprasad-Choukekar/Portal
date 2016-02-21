
//Course - Controller
controllers.BroadcastCtrl = function ($location, BroadcastService, $rootScope, $scope, ClassCrudService, userCrudService) {

	$scope.errorMessage = '';
	$scope.divAddElement = false;
	
	$scope.totalItems = 0;
	$scope.currentPage = 1;
	$scope.numPerPage = 3;
		
	$scope.init =  function(){
		$scope.Action = 'Add';
		$scope.Heading = 'List of Broadcast Messages';
		$scope.ActionBtn = true;
		$scope.divList = true;
		getAllMessages();
	}
	
    function getAllMessages() {
		var message_data = BroadcastService.getAllMessages();
        message_data.then(function (messages) {
								$scope.messages = messages.data;
								$scope.totalItems = $scope.messages.length;
								$scope.paginate = function(value) {
									var begin, end, index;
									begin = ($scope.currentPage - 1) * $scope.numPerPage;
									end = begin + $scope.numPerPage;
									index = $scope.messages.indexOf(value);
									return (begin <= index && index < end);
								};
		  
								var getClassData = ClassCrudService.getClasses();
								getClassData.then(function (data) {
									$scope.classes = data.data;				
									
								}, function (data) {
								   console.error('Error in getting classes : ' + data.data);
								   $scope.errorMessage = 'Error in getting classes';
								});
							
								
								
								
							}, function (data) {
								console.error('Error in getting messages :' + data.data);
								$scope.errorMessage = 'Error in getting messages';
						});
    }
	
	$scope.AddElementDiv = function(){
		ClearFields();
		$scope.divList = false;
		$scope.divAction = true;
		$scope.ActionBtn = false;
					var getClassData = ClassCrudService.getClasses();
								getClassData.then(function (data) {
									$scope.classes = data.data;				
									
								}, function (data) {
								   console.error('Error in getting classes : ' + data.data);
								   $scope.errorMessage = 'Error in getting classes';
								});

		var i = 0;
	}
	
	$scope.deleteElement = function (element) {
		var element_data = BroadcastService.deleteMessage(element._id);
        element_data.then(function (msg) {
            getAllMessages();
        }, function (data) {
			console.error('Error in deleting message' + data.data);
			$scope.errorMessage = 'Error in deleting message';
        });
    }
	
	
    $scope.Cancel = function () {
        $scope.divAction = false;
		$scope.divList = true;
		$scope.ActionBtn = true;
		$scope.Action = 'Add';
		$scope.Heading = 'List of Messages';
    };
	
	$scope.editElement = function (message) {
		ClearFields();
		
	
        var messsage_data = BroadcastService.getMessage(message._id);
		messsage_data.then(function (data) {
		
				$scope._message = data.data[0];
				$scope.content = data.data[0].content;
				$scope.title = data.data[0].title;
				
				for (var index in data.data[0].classes) {
					$scope.selected_classes.push(data.data[0].classes[index]._id);
				}
				$scope.Action = "Update";
				$scope.divList = false;
				$scope.divAction = true;
				$scope.ActionBtn = false;
				var getClassData = ClassCrudService.getClasses();
				getClassData.then(function (data) {
					$scope.classes = data.data;				
				
				}, function (data) {
				   console.error('Error in getting classes : ' + data.data);
				   $scope.errorMessage = 'Error in getting classes';
				});

		}, function (data) {
			console.error('Error in editing message' + data.data);
			$scope.errorMessage = 'Error in editing message';
        });
    }
	
	function ClearFields() {
		$scope.title = "";
        $scope.content = "";
		$scope.previous_selection = [];
		$scope.selected_classes = [];
		$scope.classes = [];
		$scope._message = null;
    }
	
    $scope.Cancel = function () {
		$scope.classes = [];
        $scope.divAction = false;
		$scope.divList = true;
		$scope.ActionBtn = true;
		$scope.Action = 'Add';
		$scope.selected_classes = [];
		$scope.classes = [];
		$scope._message = null;
		$scope.Heading = 'List of Broadcast Messages';
    };
	
	$scope.isChecked =  function (classRef) {
		
		if ($scope._message) {
		
		for (var index in $scope._message.classes) {
			if($scope._message.classes[index]._id.toString() == classRef._id.toString()) {
				return true;
			}
		}
		return false;
		}
	}
	
	
	$scope.toggleSelection = function toggleSelection(classRef, tickVal) {
			if (!tickVal) {
				var idx = $scope.selected_classes.indexOf(classRef._id);
				$scope.selected_classes.splice(idx,1);
			} else {
				$scope.selected_classes.push(classRef._id);
			}
	}
	// Add and Edit options
	$scope.AddUpdateElement = function () {
        
		var message = {
			title: $scope.title,
			content: $scope.content,
			classes : $scope.selected_classes
        };
        var getUserAction = $scope.Action;
		var result;

        if (getUserAction == "Update") {
            result = BroadcastService.updateMessage($scope._message._id, message);			
        } else {
            result = BroadcastService.addMessage(message);
		}
            result.then(function (msg) {
                $scope.Action = 'Add';
				$scope.Heading = 'List of Messages';
				$scope.init();
				$scope.divErrMessage=false;
                $scope.divList = true;
				$scope.divAction = false;
				$scope.ActionBtn = true;				
				$scope.selected_classes= [];
            }, function (data) {
				$scope.divErrMessage=true;
               console.error('Error in adding message : ' + data.data);
			   $scope.errorMessage = data.data;
            });
    }

};
