var productList = function()
{
	// array with products objects ( productItem )
	this.products = [];
	this.onEditElIndex = -1; // Index of Product to edit
	this.onEditElInfo = {}; // Object Product to edit
	this.toDeleteIndex = -1; // Object Product to edit
	this.validationErrs = []; 

	/**
	*	load data from array
	*/
	this.loadData = function(arr)
	{
		this.products = [];
		// for each product
		for ( var i = 0; i < arr.length; i++) {
			//create new productItem object and set data
			this.addOne( arr[i] );
		}
		return this;
	}

	this.addOne = function(elemObj)
	{
		var newItem = new productItem();
		newItem.setVals( elemObj );
		this.products.push( newItem);
		return this;
	}

	this.editOne = function(num)
	{
		var num = parseInt(num);
		this.onEditElIndex = parseInt(num);
		this.onEditElInfo = this.products[this.onEditElIndex];
		return this;
	}

	this.resetEdit = function()
	{
		this.onEditElIndex = -1;
		this.onEditElInfo = {};
		return this;
	}

	// mark element to delete
	this.toDeleteOne = function(num)
	{
		//remember index
		this.toDeleteIndex = parseInt(num);
	}
	// unmark elment to delete
	this.unDeleteOne = function()
	{
		this.toDeleteIndex = -1;
	}

	// delete delement
	this.deleteOne = function()
	{
		var num = this.toDeleteIndex;
		if( num >= 0 ) {
			// remove from list
			var deleted = this.products.splice( num , 1 );
			// refresh to edit element index
			if( num <  this.onEditElIndex) {
				this.onEditElIndex = this.onEditElIndex - 1;
			} else if(  parseInt(num) ===  parseInt(this.onEditElIndex ) ) {
				this.resetEdit();
			}
		}

		return this;

	}
	/**
	*	sort elements of list by price
	*/
	this.sortByPrice = function(way)
	{
		if( way == 'desc' ) {
			this.products.sort(function(a,b) {
				return parseFloat(b.price) - parseFloat(a.price);
			})
		} else {
			this.products.sort(function(a,b) {
				return parseFloat(a.price) - parseFloat(b.price);
			})
		}
		return this;
	}


	this.sortByName = function(way)
	{
		if( way == 'desc' ) {
			this.products.sort(function(a,b) {
				if(a.name > b.name)
					return - 1;
				else
					return 1;  
			})
		} else {
			this.products.sort(function(a,b) {
				if(a.name < b.name)
					return - 1;
				else
					return 1;
			})
		}
		return this;
	}

	this.saveOne = function(params)
	{
		// if choosed element to edit
		if( this.onEditElIndex > -1) {
			var el = this.products[this.onEditElIndex];
			el.setVals( params );
		} else {
			this.addOne(params);
		}
	}

	this.nameValidate = function(nm)
	{
		this.validationErrs = [];

		// var rx = /^[a-z\s0-9а-я]{1,15}$/gi;
		var rx = /.*/gi;
		var isValid = false;

		var isEmpty = nm.trim() === '';
		var isTooLong = nm.trim().length > 15;
		var isWrongsymbols =  !rx.test(nm);

		if(isEmpty)
			this.validationErrs.push('name_empty');
		if(isTooLong)
			this.validationErrs.push('name_maxlen');
		if(isWrongsymbols)
			this.validationErrs.push('name_symbols');

		isValid = (!isEmpty && !isTooLong && !isWrongsymbols);

		return isValid;
	}

	this.priceValidate = function(prc)
	{
		var isEmpty = prc.toString().trim() === '';
		var isFloat = parseFloat(prc).toString() === prc.toString();
		return ( !isEmpty && isFloat && !isNaN(prc));
	}

}