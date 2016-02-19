
app.service("userCrudService", function ($http) {

    //get All Users
    this.getUsers = function () {
        return $http.get("/api/Users");
    };
	
	 // Add User
    this.AddUser = function (user) {
        var response = $http({
            method: "post",
            url: "/api/Users",
            data: JSON.stringify(user)
        });
        return response;
    };
	
	this.UpdateUser = function (user) {
        var response = $http({
            method: "put",
            url: "/api/Users/" + user._id,
            data: JSON.stringify(user)
        });
        return response;
    };

    this.DeleteUser = function (userId) {
        var response = $http({
            method: "delete",
            url: "/api/Users/" + userId
        });
        return response;
    };
	
	this.GetUser = function (userId) {
        var response = $http({
            method: "get",
            url: "/api/Users/" + userId
        });
        return response;
    }
	
	});
	
	
app.service("ClassCrudService", function ($http) {

    this.getClasses = function () {
        return $http.get("/api/Classes");
    };
	
	this.GetClass = function (classId) {
        var response = $http({
            method: "get",
            url: "/api/Classes/" + classId
        });
        return response;
    };
	
		this.AddClass = function (classVar) {
			console.log(JSON.stringify(classVar));
        var response = $http({
            method: "post",
            url: "/api/Classes",
            data: JSON.stringify(classVar)
        });
        return response;
    };
	
	    this.DeleteClass = function (classId) {
        var response = $http({
            method: "delete",
            url: "/api/Classes/" + classId
        });
        return response;
    };
	
		this.UpdateClass = function (classVar) {
        var response = $http({
            method: "put",
            url: "/api/Classes/" + classVar._id,
            data: JSON.stringify(classVar)
        });
        return response;
    };
	
	});
	
app.service("StudentCrudService", function ($http) {

    this.getAllStudents = function () {
        return $http.get("/api/Students");
    };
	
	this.getStudentsNotBelongingToClass = function () {
         return $http.get("/api/Students");
		 /*
		.then(function(response) {

			for (var key in response.data) {
				if (response.data[key].classRef) {
					console.log('deleting');
					delete response.data[key];
				}				
			}
			console.log(response.data);
			return response.data;
		});
		*/
    };
});
	
app.service("CoursePageService", function ($http) {
/*
	this.uploadFile = function () {
        var response = $http({
            method: "post",
            url: "/api/upload",
            data: JSON.stringify(classVar)
        });
        return response;
    }; */
	
	
	this.getCourseFiles =  function (courseId) {
		var response = $http({
            method: "get",
            url: "/api/Courses/" + courseId + "/files"
        });
        return response;
	}
	
	this.deleteCourseFile =  function (courseId, fileID) {
		var response = $http({
            method: "delete",
            url: "/api/Courses/" + courseId + "/files/" + fileID
        });
        return response;
	}
});
//Services for the Courses
app.service("CourseCrudService", function ($http) {

    this.getAllCourses = function () {
        return $http.get("/api/Courses");
    };
	
	this.addCourse = function (course_var) {
			console.log(JSON.stringify(course_var));
        var response = $http({
            method: "post",
            url: "/api/Courses",
            data: JSON.stringify(course_var)
        });
        return response;
    };
	
	    this.deleteCourse = function (course_id) {
        var response = $http({
            method: "delete",
            url: "/api/Courses/" + course_id
        });
        return response;
    };
	
		this.updateCourse = function (course_var) {
        var response = $http({
            method: "put",
            url: "/api/Courses/" + course_var.id,
            data: JSON.stringify(course_var)
        });
        return response;
    };
	
	this.GetCourse = function (course_id) {
        var response = $http({
            method: "get",
            url: "/api/Courses/" + course_id
        });
        return response;
    };
});



app.service("MessageService", function ($http) {

    
    this.getAllMessages = function (course_id) {
        return $http.get("/api/Courses/" + course_id + "/messages");
    };
	
	 // Add User
    this.addMessage = function (course_id, message) {
        var response = $http({
            method: "post",
            url: "/api/Courses/"+ course_id + "/messages",
            data: JSON.stringify(message)
        });
        return response;
    };
	
	this.updateMessage = function (course_id, message_id, message) {
        var response = $http({
            method: "put",
            url: "/api/Courses/" + course_id + "/messages/" +message_id ,
            data: JSON.stringify(message)
        });
        return response;
    };

    this.deleteMessage = function (course_id, message_id) {
        var response = $http({
            method: "delete",
            url: "/api/Courses/" + course_id + "/messages/" +message_id 
        });
        return response;
    };
	
	this.getMessage = function (course_id, message_id) {
        var response = $http({
            method: "get",
            url: "/api/Courses/" + course_id + "/messages/" +message_id
        });
        return response;
    }
	
	});
