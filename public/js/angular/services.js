
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