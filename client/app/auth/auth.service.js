angular.module('publicationTrackerApp').factory('AuthService',
	['$q', '$timeout','$http',
	function($q, $timeout, $http){
		var user = null;
		var userId = null;
		var username = "";

		return ({
			isLoggedIn: isLoggedIn,
			getUserName: getUserName,
			getUserStatus: getUserStatus,
			login: login,
			register: register
		});

		function isLoggedIn(){
			if(user){
				return true;
			}else{
				return false;
			}
		}

		function getUserName(){
			if(username.length > 0){
				return username;
			}
			if(user){
				return $http.get('/api/users/id/' + userId)
				.success(function(data){
					console.dir(data);
					username = data.fName;
					return username;
				})
				.error(function(data){

				});
			}
			return userId;
		}

		function getUserStatus(){
			return $http.get('/api/users/status')
			.success(function(data){
				if(data.status){
					user = true;
				}else{
					user = false;
				}
			})
			.error(function(data){
				user = false;
			});
		}

		function login(email, password) {
			var deferred = $q.defer();
			var sha1 = new Hashes.SHA1;
			password = sha1.hex(password);
			$http.post('/api/users/login',
				{email: email, password: password})
				.success(function(data, status){
					if(status === 200 && data.status){
						user = true;
						userId = data.id;
						getUserName();
						deferred.resolve();
					}else{
						user = false;
						deferred.reject();
					}
				})
				.error(function(data){
					user = false;
					deferred.reject();
				});

			return deferred.promise;
		}

		function register(email, fName, lName, password) {
			var deferred = $q.defer();
			var sha1 = new Hashes.SHA1;
			password = sha1.hex(password);
			$http.post('/api/users/register',
				{email: email, fName: fName, lName: lName, password: password})
				.success(function(data, status){
					if(status === 200 && data.status){
						user = true;
						userId = data.id;
						getUserName();
						deferred.resolve();
					}else{
						user = false;
						deferred.reject();
					}
				})
				.error(function(data){
					user = false;
					deferred.reject();
				});

			return deferred.promise;
		}

	}]);