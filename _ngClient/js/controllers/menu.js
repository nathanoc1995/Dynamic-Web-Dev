var menuController = angular.module('menuController', []);

menuController.controller('MenuCtrl', ['$scope', '$http', 
  function($scope, $http) {

  	$scope.title= "Nathans Takeaway";


  	var aPromise;
  	var itmList, specialList, OrdList, totalCost;
  	var OrdNo = 0;

  	//--------

  	loadItems = function() 
		{ 
		    $scope.asynchWait = true;
			displayItems({});
			$scope.asynchWait = false;			 
		}

		function getItems()
		{
        	return $http.post('/api/items'); 			
		}		
		
		function displayItems(filters)
		{ 		
			aPromise = getItems(filters);
			
			aPromise.then(function(response) 
						  {
							$scope.items = response.data;
							itmList = response.data;
						  },
						  function error(error)
						  {
							  $scope.items = [];					  
						  });
		}

		$scope.getTemplateItems = function (item) {
			return 'displayitem';
		};

		//------

		//------

	loadDiscounts = function() 
		{ 
		    $scope.asynchWait = true;
			displayDiscounts({});
			$scope.asynchWait = false;			 
		}

		function getDiscounts()
		{
        	return $http.post('/api/discounts'); 			
		}		
		
		function displayDiscounts(filters)
		{ 		
			aPromise = getDiscounts(filters);
			
			aPromise.then(function(response) 
						  {
							$scope.discounts = response.data;
							specialList = response.data;
						  },
						  function error(error)
						  {
							  $scope.discounts = [];					  
						  });
		}

		$scope.getTemplateDiscounts = function (discount) {
			return 'displaydiscount';
		};

		//----------------
		//-----------


	initOrder = function(){
		OrdList = [];
		availspecialList = [];
		totalCost = 0;
		$scope.totalcost = totalCost;
		$scope.order = OrdList;
		$scope.specialavail = availspecialList;
	}

	//------------


	//Functions below ----------------------------------------------------------


		//add item, check if its item or special before adding!
	$scope.addItem = function (itemId) {
		//Call updateCheckoutBtn when done!!!
		var temp;
		var count = -1;
		//index of array set to -1 
		if(itemId >= 0 && itemId <= itmList.length){
			//essentially a loop for an array of items (for each loop)
			$scope.items.some(function(currentItem){

			if(currentItem._id === itemId){
				temp= {
					_id: currentItem._id,
					name: currentItem.name +" "+ currentItem.category_id,
					qty: 1,
					price: currentItem.price
				}
			}

			});

		}else{
			$scope.discounts.some(function(currentDis){

			if(currentDis._id === itemId){
				temp= {
					_id: currentDis._id,
					name: currentDis.title,
					qty: 1,
					price: currentDis.price
				}
			}

			});
		}

		if(OrdList.lenght === 0){

			OrdList.push(temp);
		}
		else{

			var real = false;

			OrdList.some(function(currentOrder){
				count++;
				if(currentOrder._id === temp._id){
					OrdList[count].qty++;
					real = true;
				}
			});

			if(!real){
				OrdList.push(temp);
			}

		}

		$scope.order=OrdList;

		updateCheckoutBtn();
		
	};


		//Remove item from order!
	$scope.removeItem = function (itemId) {

		var count= -1;

		OrdList.some(function(current){
			count++;
			if(itemId=== current._id){
			if(current.qty === 1){
				OrdList.splice(count,1);
			}
			else{
				OrdList[count].qty--;
			}
			}
		});

		updateCheckoutBtn();
			
	};


		//Template for the order, like the initial setup above!
	$scope.getTemplateOrder = function (order) {
			return 'displayorder';
	};

	//Load up the arrays!
	loadItems();
	loadDiscounts();
	initOrder();


		//Disable/Enable Checkout button!
	updateCheckoutBtn = function () {
		var checkoutBtn = document.getElementById("checkoutBtn");
		var clrCheckoutBtn = document.getElementById("clrCheckoutBtn");

		if(OrdList.length !== 0){
			clrCheckoutBtn.disabled = false;
			checkoutBtn.disabled = false;

		}
		else{
			clrCheckoutBtn.disabled = true;
			checkoutBtn.disabled = true;
		}

		totalCost = 0;

		OrdList.some(function(current){
			totalCost += (current.price * current.qty);
		});

		$scope.totalcost = totalCost;
		checkSpecials();
	};


		//Handle the checkout
	$scope.checkoutOrder = function () {

		OrdNo++;
		var OrderString="";
		var priceString = "";

		var popupWin = window.open('', '_blank', 'width=1000,height=750');
  		popupWin.document.open();
  		OrdList.some(function(item){
  			OrderString += ("<li>Item - "+item._id + "  -  " + item.name + ",    Qty. " + item.qty + ",    Price. &euro;" + (item.price*item.qty).toFixed(2) + "</li>");
  		}); 

  		priceString += "<br/><br/><h4>Total price = &euro;"+totalCost.toFixed(2)+"</h4>";


  		popupWin.document.write('<html><head><title>Order Number - '+OrdNo+'</title> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous"><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script> </head><body onload="window.print()"><h2>Order Number - '+OrdNo+'</h2><div class="row"><div class="col-xs-10 col-xs-offset-1"><ul>'
  		 + OrderString + '</ul></div></div>'+priceString+'</body></html>');
  		popupWin.document.close();

  		initOrder();
		updateCheckoutBtn();
		
	};

		//Clear the checkout
	$scope.clrCheckout = function () {

		initOrder();
		updateCheckoutBtn();

	};


	//Check if any specials match for items in order! 
	checkSpecials = function (){

		//POSSIBLE ADD FUNCTION TO SHOW DIFFERENCE BETWEEN SPECIAL AND ORDER!
		//I.E. SAVINGS!
		
		var tempList = [];
		var availList = [];

		//Check, for each item in the order, add the special which contains any of those items
		//into the temporary specials list (tempList)
		OrdList.some(function(item){
			specialList.some(function(specItem){
				specItem.items.some(function(tempDisItems){
					if(item._id === tempDisItems.items_id){
						tempList.push(specItem);
					}
				});
			});
		});

		//Removes duplicates for temp array and feeds single items into available array!
		$.each(tempList, function(i, e) {
        	if ($.inArray(e, availList) == -1) availList.push(e);
    	});

		//Sorts available list in order of index to match with the menu!
    	availList.sort(function (a, b) {
 			return a.index - b.index;
		});

		OrdList.some(function(orderItem){
			for(var i = 0; i<availList.length; i++){
				if(availList[i]._id === orderItem._id){
					availList.splice(i, 1);
				}
			}
		});

    	//Clears availables if the order list is empty, otherwise, show availables matching order
		if(OrdList.length === 0){
			availList = [];
			$scope.specialavail = availList;
		}else{
			$scope.specialavail = availList;
		}

	};

		//Template for discounts/specials!
	$scope.getTemplateDisAvail = function (specialavail) {
			return 'disavail';
		};


		//Swap in the spcial selected which matches item in order! 
	$scope.swapSpecialIn = function (itemId) {

		var temp; var count = -1;

		//Local variable for the current specials available
		var currentSpecials = $scope.specialavail;


		currentSpecials.some(function(current){
			if(current._id === itemId){
				temp= {
					_id: current._id,
					name: current.title,
					qty: 1,
					price: current.price
				}
			}
		});

		OrdList.some(function(item){
			if(item._id >= 0 && item._id <= itmList.length){
				OrdList.splice(count, 1);
			}
		});

		OrdList.push(temp);

		//Replace order in scope with new updated order
		$scope.order = OrdList;

		checkSpecials();

	};
  
  }]);