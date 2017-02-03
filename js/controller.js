var module = angular.module("KomarTestApp");

module.controller("TableCtrl", TableCtrl);
	
	TableCtrl.$inject = [
		'$scope',
		'$interval',
		'_',
		'EQLProvider',
		'SPYProvider',
		'orderBookManipulationProvider'
	];

	function TableCtrl($scope, $interval, _, EQLProvider, SPYProvider, orderBookManipulationProvider) {
		$scope.init = function () {
			$scope.data = {};
			$scope.data.SPY = SPYProvider.getData();
			$scope.data.EQL = EQLProvider.getData();
			$scope.data.orderBook = initOrderBook(); 
			$scope.interval = initInterval();
		};

		function initInterval() {
			return $interval(function(){
				$scope.$emit("NEXT");
			}, $scope.data.orderBook.interval, 0);
		}

		function initOrderBook() {
			return {
				bid: [],
				ask: [],
				lengthLimiter: 15, // length of table
				interval: 1000	   // 1 sec
			};
		}

		$scope.getNext = function () { // get next item from json
			if ($scope.data.SPY.length > 0 && $scope.data.EQL.length > 0){
				
				var nextSPY = $scope.data.SPY.shift();
				var nextEQL = $scope.data.EQL.shift();
				
				$scope.$emit(nextSPY.Type, nextSPY); // emit event
				$scope.$emit(nextEQL.Type, nextEQL);
			}
		}

		$scope.changeInterval = function () {
			$interval.cancel($scope.interval);
			$scope.interval = initInterval();
	        console.log("Сhange interval " + $scope.data.orderBook.interval);
		}	 	

	 	/// listeners
	 	$scope.$on("NEXT", function (event, data) {
	 		$scope.getNext();
	    });

		$scope.$on("ADD", function (event, data) {
        	if (!$scope.data.orderBook)
        		$scope.data.orderBook = initOrderBook();
        	
        	orderBookManipulationProvider.add($scope.data.orderBook, data);
	    });

	    $scope.$on("DELETE", function (event, data) {
        	if (!$scope.data.orderBook)
        		initOrderBook();

        	orderBookManipulationProvider.delete($scope.data.orderBook,data);
	    });

	    $scope.$on("CANCEL", function (event, data) {
        	orderBookManipulationProvider.cancel($scope.data.orderBook,data);
	    });

	    $scope.$on("EXECUTED", function (event, data) {
        	orderBookManipulationProvider.executed($scope.data.orderBook,data);
	    });

	    $scope.$on("EXECUTED_WITH_PRICE", function (event, data) {
        	orderBookManipulationProvider.executedWithPrice($scope.data.orderBook,data);
	    });

	    $scope.$on("REPLACE", function (event, data) {
	    	data.OrderID = data.OriginalOrderID;
        	orderBookManipulationProvider.replace($scope.data.orderBook,data);
	    });

	};