(function() {
	var app = angular.module('iTunesSearch', ['ngRoute']);

	app.config(function($sceDelegateProvider, $routeProvider) {
	 $routeProvider
	 	.when('/search', {
	 		controller: 'SearchController',
	 		templateUrl: 'partials/search.html'
	 	})
	 	.when('/about', {
	 		templateUrl: 'partials/about.html'
	 	})
	 	.otherwise({
	 		redirectTo: '/search'
	 	});

	 $sceDelegateProvider.resourceUrlWhitelist([
	   'self',
	   'http://*.phobos.apple.com/**']);

	});

	app.controller('NavController', ['$scope', '$location', function($scope, $location) {
		$scope.appData = {};
		$scope.appData.checkLocation = function(path) {
			return ($location.path() === path);
		}
	}]);

	app.controller('SearchController', ['$scope', 'iTunesService', function($scope, iTunesService) {
		$scope.searchData = {};
		$scope.searchData.formSubmitted = false;
		$scope.searchData.searchResults = '';
		$scope.searchData.searchTerm = '';
		$scope.searchData.search = function() {
			$scope.searchData.searchResults = '';
			$scope.searchData.formSubmitted = true;
			iTunesService.getSearchResults($scope.searchData.searchTerm).then(function(data) {
				$scope.searchData.formSubmitted = false;
				$scope.searchData.searchResults = data;
			}, function(data) {
				$scope.searchData.formSubmitted = false;
				console.error(data);
			});
		}
	}]);

	app.directive('itSearchResults', function() {
		return {
			restrict: 'A',
			templateUrl: 'partials/itunes-results-list.html',
			scope: {},
			priority: 1001
		}
	}); 	

	app.service('iTunesService', ['$http', '$q', function($http, $q) {
		this.getSearchResults = function(searchTerm) {
			var baseUrl = "http://itunes.apple.com/search?term=";
			searchTerm = searchTerm.replace(/\s+/, '+');
			var fullUrl = baseUrl + searchTerm + '&callback=JSON_CALLBACK';
			var deferred = $q.defer();
			$http({method: 'JSONP', url: fullUrl}).success(function(data) {
				deferred.resolve(data.results);
			}).error(function() {
				deferred.reject('There was an error retrieving the data.');
			});
			return deferred.promise;
		} 
	}]);
})();