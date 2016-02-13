
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
    }
	
	});