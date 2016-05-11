angular.module('publicationTrackerApp').factory('AuthService',
	['$q', '$timeout','$http',
	function($q, $timeout, $http){
		var user = null;

		return ({
			isLoggedIn: isLoggedIn,
			getUserStatus: getUserStatus,
			login: login
		});

		function isLoggedIn(){
			if(user){
				return true;
			}else{
				return false;
			}
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