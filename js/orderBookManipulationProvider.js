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

	        function sortS (a,b){
				return parseFloat(a.Price) < parseFloat(b.Price)
			}
			function sortB (a,b){
				return parseFloat(a.Price) > parseFloat(b.Price)
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
		 		if (orderBook.ask.length + orderBook.bid.length < orderBook.lengthLimiter){
		 			if (data.Side == 'S'){
		    			orderBook.ask.push(data);	
		    			orderBook.ask.sort(sortS);	
		        	}
		        	else if (data.Side == 'B'){
		    			orderBook.bid.push(data);
		    			orderBook.bid.sort(sortB);	
		        	}
		        	console.log("ADD" + JSON.stringify(data));
		 		}
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
		 		if (indexObject && indexObject.array == "bid"){
					orderBook.bid[indexObject.index].OrderID = data.NewOrderID;
					if (orderBook.bid[indexObject.index].Price != data.Price){
						orderBook.bid[indexObject.index].Price = data.Price;
						orderBook.bid.sort(sortB); 								// can be better
					}
					orderBook.bid[indexObject.index].Shares = data.Shares;
					orderBook.bid[indexObject.index].Type = data.Type;
				}
	    		else if (indexObject && indexObject.array == "ask"){
	    			orderBook.ask[indexObject.index].OrderID = data.NewOrderID;
					if (orderBook.ask[indexObject.index].Price != data.Price){
						orderBook.ask[indexObject.index].Price = data.Price;
						orderBook.ask.sort(sortS);								// can be better
					}
					orderBook.ask[indexObject.index].Shares = data.Shares;
					orderBook.ask[indexObject.index].Type = data.Type;
	    		}
	        	console.log("REPLACE" + JSON.stringify(data));
		 	}

		 	function cancelData(orderBook, data) {
		 		var indexObject = getIndex(orderBook, data);
		 		if (indexObject && indexObject.array == "bid"){
					orderBook.bid[indexObject.index].Shares = orderBook.bid[indexObject.index].Shares - data.CanceledShares;
					orderBook.bid[indexObject.index].Type = data.Type;
				}
	    		else if (indexObject && indexObject.array == "ask"){
					orderBook.ask[indexObject.index].Shares = orderBook.ask[indexObject.index].Shares - data.CanceledShares;
					orderBook.ask[indexObject.index].Type = data.Type;
	    		}
	        	console.log("CANCEL" + JSON.stringify(data));
		 	}

		 	function executedData(orderBook, data) {
		 		var indexObject = getIndex(orderBook, data);
		 		if (indexObject && indexObject.array == "bid"){
					orderBook.bid[indexObject.index].Shares = orderBook.bid[indexObject.index].Shares - data.ExecutedShares;
					orderBook.bid[indexObject.index].Type = data.Type;
					if (orderBook.bid[indexObject.index].Shares <= 0){
						orderBook.bid.splice(indexObject.index, 1);
					}
				}
	    		else if (indexObject && indexObject.array == "ask"){
					orderBook.ask[indexObject.index].Shares = orderBook.ask[indexObject.index].Shares - data.ExecutedShares;
					orderBook.ask[indexObject.index].Type = data.Type;
					if (orderBook.ask[indexObject.index].Shares <= 0){
						orderBook.ask.splice(indexObject.index, 1);
					}
	    		}
	        	console.log("EXECUTED" + JSON.stringify(data));
		 	}

		 	function executedWithPriceData(orderBook, data) {
		 		var indexObject = getIndex(orderBook, data);
		 		if (indexObject && indexObject.array == "bid"){
					orderBook.bid[indexObject.index].Shares = orderBook.bid[indexObject.index].Shares - data.ExecutedShares;
					orderBook.bid[indexObject.index].Price = ExecutionPrice;
					orderBook.bid[indexObject.index].Type = data.Type;
					if (orderBook.bid[indexObject.index].Shares <= 0){
						orderBook.bid.splice(indexObject.index, 1);
					}
				}
	    		else if (indexObject && indexObject.array == "ask"){
					orderBook.ask[indexObject.index].Shares = orderBook.ask[indexObject.index].Shares - data.ExecutedShares;
					orderBook.ask[indexObject.index].Price = data.ExecutionPrice;
					orderBook.ask[indexObject.index].Type = data.Type;
					if (orderBook.ask[indexObject.index].Shares <= 0){
						orderBook.ask.splice(indexObject.index, 1);
					}
	    		}
	        	console.log("EXECUTED_WITH_PRICE" + JSON.stringify(data));
		 	}
        };