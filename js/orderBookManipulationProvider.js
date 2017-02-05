var module = angular.module("KomarTestApp");

module.factory("orderBookManipulationProvider", orderBookManipulationProvider);

    	orderBookManipulationProvider.$inject = [
    	   '_'
    	];

    	function orderBookManipulationProvider(_) {

	        var service = {
	            add: addData,
	            delete: deleteData,
	            replace: replaceData,
	            cancel: cancelData,
	            executed: executedData,
	            executedWithPrice: executedWithPriceData
	        };

	        return service;

	        function sortByPrice (a,b){
				return parseFloat(a.Price) < parseFloat(b.Price)
			}

			function insertData(array, data){
				if (array.length > 0){
					var isPushed = false;
					for (var i = 0; i < array.length; i++) {
						if(sortByPrice(array[i], data)){
							array.splice(i,0,data);
							isPushed = true;
							return;
						}
					}
					if (!isPushed)
						array.push(data);
				} else {
					array.push(data);
				}
			}

		 	function getIndex(orderBook, data){
		    	function isThisOrder(o){
	        		return o.OrderID == data.OrderID;
	        	};

	    		var index = _.findIndex(orderBook.ask, isThisOrder);
	    		if (index ==  -1){
	    		 	index = _.findIndex(orderBook.bid, isThisOrder);
	    			return index != -1 ? {
	    				index: index,
	    				array: "bid"
	    			} : undefined; 
	    		}
	    		else {
	    			return {
	    				index: index,
	    				array: "ask"
	    			}
	    		}
		    }

		    function addData(orderBook, data){
		 			if (data.Side == 'S'){
		 				insertData(orderBook.ask, data);
		        	} else if (data.Side == 'B'){
		 				insertData(orderBook.bid, data);
		        	}
		        	console.log("ADD" + JSON.stringify(data));
		 	}

		 	function deleteData(orderBook, data) {
		 		var indexObject = getIndex(orderBook, data);
				if (indexObject && indexObject.array == "bid")
					orderBook.bid.splice(indexObject.index, 1);
	    		else if (indexObject && indexObject.array == "ask")
	    			orderBook.ask.splice(indexObject.index, 1);
	        	console.log("DELETE" + JSON.stringify(data));
		 	}

		 	function replaceData(orderBook, data) {
		 		var indexObject = getIndex(orderBook, data);
		 		function replace(array, index, data){
		 			var item = array[index];

					item.OrderID = data.NewOrderID;
					item.Shares = data.Shares;
					item.Type = data.Type;
					if (item.Price != data.Price){
						item.Price = data.Price;
						array.splice(index, 1); 													
						insertData(array, item);
					}
		 		};
		 		if (indexObject && indexObject.array == "bid")
					replace(orderBook.bid, indexObject.index, data);
	    		else if (indexObject && indexObject.array == "ask")
					replace(orderBook.ask, indexObject.index, data);
	    		
	        	console.log("REPLACE" + JSON.stringify(data));
		 	}

		 	function cancelData(orderBook, data) {
		 		var indexObject = getIndex(orderBook, data);
		 		function cancel(array, index, data) {
		 			var item = array[index];

		 			item.Shares = item.Shares - data.CanceledShares;
					item.Type = data.Type;
		 		}
		 		if (indexObject && indexObject.array == "bid")
					cancel(orderBook.bid, indexObject.index, data);
	    		else if (indexObject && indexObject.array == "ask")
					cancel(orderBook.ask, indexObject.index, data);
	    		
	        	console.log("CANCEL" + JSON.stringify(data));
		 	}

		 	function executedData(orderBook, data) {
		 		var indexObject = getIndex(orderBook, data);
		 		function executed(array, index, data) {
		 			var item = array[index];

		 			item.Shares = item.Shares - data.ExecutedShares;
					item.Type = data.Type;
					if (item.Shares <= 0){
						array.splice(index, 1);
					}
		 		}
		 		if (indexObject && indexObject.array == "bid")
					executed(orderBook.bid, indexObject.index, data);
	    		else if (indexObject && indexObject.array == "ask")
					executed(orderBook.ask, indexObject.index, data);
	    	
	        	console.log("EXECUTED" + JSON.stringify(data));
		 	}

		 	function executedWithPriceData(orderBook, data) {
		 		var indexObject = getIndex(orderBook, data);
		 		function executedWithPrice(array, index, data) {
		 			var item = array[index];

		 			item.Shares = item.Shares - data.ExecutedShares;
					item.Price = data.ExecutionPrice;
					item.Type = data.Type;
					if (item.Shares <= 0){
						array.splice(index, 1);
					}
		 		}
		 		if (indexObject && indexObject.array == "bid")
					executedWithPrice(orderBook.bid, indexObject.index, data);
	    		else if (indexObject && indexObject.array == "ask")
					executedWithPrice(orderBook.ask, indexObject.index, data);
	    
	        	console.log("EXECUTED_WITH_PRICE" + JSON.stringify(data));
		 	}
        };