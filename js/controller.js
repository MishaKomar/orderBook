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
		
		var data = [];
		data["SPY"] = SPYProvider.getData();
		data["EQL"] = EQLProvider.getData();

		$scope.init = function () {
			$scope.data = {};
			$scope.data.orderBooks = [];
			$scope.data.orderBooks["SPY"] = initOrderBook("SPY"); 
			$scope.data.orderBooks["EQL"] = initOrderBook("EQL"); 
			$scope.data.orderBooks["SPY"].intervalObj = initInterval($scope.data.orderBooks["SPY"]);
			$scope.data.orderBooks["EQL"].intervalObj = initInterval($scope.data.orderBooks["EQL"]);
		};

		function initInterval(orderBook) {
			return $interval(function(){
				$scope.$emit("NEXT", orderBook.name);
			}, orderBook.intervalSec, 0);
		}

		function initOrderBook(name) {
			return {
				name: name,
				bid: [],
				ask: [],
				lengthLimiter: 10, // length of table output
				intervalSec: 1000  // 1 sec
			};
		}

		$scope.getNext = function (orderBookName) { 
			if (data[orderBookName].length > 0 && (orderBookName == "SPY" || orderBookName == "EQL")){
				var item = data[orderBookName].shift(); // get next item from json
				item.Stock = orderBookName;
				$scope.$emit(item.Type, item);
			}
		}

		$scope.changeInterval = function (name) {
			if (name == "SPY" || name == "EQL"){
				$interval.cancel($scope.data.orderBooks[name].intervalObj);
				$scope.data.orderBooks[name].intervalObj = initInterval($scope.data.orderBooks[name]);
	    	    console.log(name + " interval changed");
			}
		}	 	

	 	/// listeners
	 	$scope.$on("NEXT", function (event, orderBookName) {
	 		$scope.getNext(orderBookName);
	    });

		$scope.$on("ADD", function (event, data) {
        	if (data.Stock == "SPY" || data.Stock == "EQL")
        		orderBookManipulationProvider.add($scope.data.orderBooks[data.Stock], data);
	    });

	    $scope.$on("DELETE", function (event, data) {
        	if (data.Stock == "SPY" || data.Stock == "EQL")
        		orderBookManipulationProvider.delete($scope.data.orderBooks[data.Stock], data);
	    });

	    $scope.$on("CANCEL", function (event, data) {
	    	if (data.Stock == "SPY" || data.Stock == "EQL")
        		orderBookManipulationProvider.cancel($scope.data.orderBooks[data.Stock], data);
	    });

	    $scope.$on("EXECUTED", function (event, data) {
	    	if (data.Stock == "SPY" || data.Stock == "EQL")
        		orderBookManipulationProvider.executed($scope.data.orderBooks[data.Stock], data);
	    });

	    $scope.$on("EXECUTED_WITH_PRICE", function (event, data) {
	    	if (data.Stock == "SPY" || data.Stock == "EQL")
        		orderBookManipulationProvider.executedWithPrice($scope.data.orderBooks[data.Stock], data);
	    });

	    $scope.$on("REPLACE", function (event, data) {
	    	data.OrderID = data.OriginalOrderID;
	    	if (data.Stock == "SPY" || data.Stock == "EQL")
        		orderBookManipulationProvider.replace($scope.data.orderBooks[data.Stock], data);
	    });

	};