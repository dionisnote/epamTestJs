var productListView = function()
{
	this.model = {};
	this.filter = '';

	this.setModel = function(mdl)
	{
		this.model = mdl;
		return this;
	}

	//////////// RENDERS ///////////

	/**
	*	Render List of Elements
	*/
	this.renderProducts = function()
	{
		var html = '';
		var productsList = this.model.products;
		for (var i = 0; i < productsList.length; i++) {
			var oneProduct = productsList[i];
			html+= this.renderOne( oneProduct );
		}
		var listEl = document.getElementById('productsList');
		listEl.innerHTML = html; 
		this.listControls();
		return this;
	}

	this.renderOne = function( elem )
	{
		// console.log( this.filter );
		var filterVal = this.filter;
		var filter = new RegExp( '^' + filterVal , 'gi' );

		var str = elem.name;
		var tst = filter.test(str);
		var hiddenClass = (tst)?(''):('hide');

		return '<div class="product '+ hiddenClass +'"> <div class="nameCell"><div class="name">'+elem.name+'</div> '
				+'<div class="count">'+elem.cnt+'</div></div><div class="price">'+ this.priceToDisplay(elem.price)+'</div>'
				+'<div class="actions"><button class="edit">Edit</button>'
				+'<button class="delete">Delete</button></div></div>';
	}
	////////// Controls ////////////////

	this.initControls = function()
	{
		this.saveControls();
		this.priceSort();
		this.nameSort();
		this.filterAll();
		this.deleteControls();
		this.inputsWatch();
		return this;
	}

	/**
	*	edit and delete buttons
	*/
	this.listControls = function()
	{
		var List = this.model;
		var that = this;
		var editorFields = this.getEditorFields();
		
		// add New Button
		var addNewBtn = document.getElementById('addNew');
		addNewBtn.addEventListener('click', function(){
			// clear edit form values
			editorFields.name.value = '';
			editorFields.cnt.value = '';
			editorFields.price.value = '';
			// unselect to edit list element
			List.resetEdit();

			var saveBtn = document.getElementById('saveBtn');
			saveBtn.innerHTML = 'Add';
		});

		// edit Product button
		var editBtns = document.querySelectorAll('.edit');
		var editBtnsArr = Array.prototype.slice.call( editBtns ); // make array from list of Elements
		for ( var i in Object.keys(editBtns)) {
			var editBtn = editBtns[i];
			// Edit Button Click event
			editBtn.addEventListener('click', function(){
				// take index of element
				var num = editBtnsArr.indexOf(this);
				// set for editing
				List.editOne( num );
				// show actual values in editor
				editorFields.name.value = List.onEditElInfo.name;
				editorFields.cnt.value = List.onEditElInfo.cnt;
				editorFields.price.value = that.priceToDisplay( List.onEditElInfo.price );
				var saveBtn = document.getElementById('saveBtn');
				saveBtn.innerHTML = 'Update';
			});
		}

		// Delete Product button
		var deleteBtns = document.querySelectorAll('#productsList .delete');
		var deleteBtnsArr = Array.prototype.slice.call( deleteBtns ); // make array from list of Elements to find index
		for ( var i in Object.keys(deleteBtns)) {
			var deleteBtn = deleteBtns[i];
			// Edit Button Click event
			deleteBtn.addEventListener('click', function(){
				// index of current list-element
				var delNum = deleteBtnsArr.indexOf(this);
				// mark to delete
				List.toDeleteOne(delNum);
				// ask to confirm
				that.showDeleteConfirm();
			});
		}

	}

	/**
	*	Save button
	*/
	this.saveControls = function()
	{
		var that = this;
		var List = this.model;
		var editorFields = this.getEditorFields();
		// Save Button (edit/add)
		var saveBtn = document.getElementById('saveBtn');
		// add save event
		saveBtn.addEventListener('click', function(){
			// save in model
			var priceVal = that.priceToFloat( editorFields.price.value ); // covert price to float value
			var nameVal = editorFields.name.value;
			var cntVal = editorFields.cnt.value;
			
			// if fields values is valid -> save
			var nameValid = List.nameValidate(nameVal);
			var priceValid =  List.priceValidate(priceVal);

			if( nameValid && priceValid && cntVal) {
				//save
				List.saveOne({ name: nameVal, cnt: cntVal, price: priceVal });
				// if no selected element to edit (add New) -> clear fields after save
				if(List.onEditElIndex < 0) {
					// clear edit form values
					editorFields.name.value = '';
					editorFields.cnt.value = '';
					editorFields.price.value = '';
				}
				//re-render list
				that.renderProducts();
			} else {
				
				if(!nameValid) {
					if( List.validationErrs.indexOf( 'name_empty' ) > -1)
						that.showErrorMsg( editorFields.name.id, 'Заполните поле' );
					else if( List.validationErrs.indexOf( 'name_maxlen' ) > -1)
						that.showErrorMsg( editorFields.name.id, 'Не больше 15 символов' );
				}
				if( !priceValid ) {
					that.showErrorMsg( editorFields.price.id, 'Введите корректную цену' );
				}
				if (!cntVal ) {
					that.showErrorMsg( editorFields.cnt.id, 'Введите количество' );
				}

			}

		});

	}
	
	/**
	*	Sort by price button
	*/
	this.priceSort = function()
	{
		var sortBtn = document.getElementById('priceSort');
		var that = this;
		var List = this.model;
		var editorFields = this.getEditorFields();
		
		sortBtn.addEventListener('click', function(){
			if( this.className.indexOf('desc') > -1 ) {
				this.className = this.className.replace(' desc', '');
				this.className = this.className.replace('desc', '');
				this.className+= ' asc';
				List.sortByPrice('asc');
			} else {
				this.className = this.className.replace(' asc', '');
				this.className = this.className.replace('asc', '');
				this.className+= ' desc';
				List.sortByPrice('desc');
			}

			// clear edit form values
			editorFields.name.value = '';
			editorFields.cnt.value = '';
			editorFields.price.value = '';
			// unselect to edit list element
			List.resetEdit();

			that.renderProducts();
		});
	}
	/**
	*	Sort by name button
	*/
	this.nameSort = function()
	{
		var sortBtn = document.getElementById('nameSort');
		var that = this;
		var List = this.model;
		var editorFields = this.getEditorFields();
		
		sortBtn.addEventListener('click', function(){
			if( this.className.indexOf('desc') > -1 ) {
				this.className = this.className.replace(' desc', '');
				this.className = this.className.replace('desc', '');
				this.className+= ' asc';
				List.sortByName('asc');
			} else {
				this.className = this.className.replace(' asc', '');
				this.className = this.className.replace('asc', '');
				this.className+= ' desc';
				List.sortByName('desc');
			}

			// clear edit form values
			editorFields.name.value = '';
			editorFields.cnt.value = '';
			editorFields.price.value = '';
			// unselect to edit list element
			List.resetEdit();

			that.renderProducts();
		});
	}
	/**
	*	Search
	*/
	this.filterAll = function()
	{
		var searchEl = document.getElementById('search');
		var searchBtn = document.getElementById('searchBtn');
		var that = this;
		searchBtn.addEventListener('click', function(){
			// set filter value
			var filterVal = searchEl.value;
			that.filter = filterVal;
			// render list
			that.renderProducts();
		});

	}

	this.getEditorFields = function()
	{
		// editor fields
		var nameField = document.getElementById('editName');
		var countField = document.getElementById('editCount');
		var priceField = document.getElementById('editPrice');
		return {
			name: nameField,
			cnt: countField,
			price: priceField
		}
	}

	/**
	*	Delete controls (yes/cancel)
	*/
	this.deleteControls = function()
	{
		var that = this;
		var List = this.model;
		var cancelBtn = document.getElementById('cancelDelete');
		var yesBtn = document.getElementById('yesDelete');
		// cancel action
		cancelBtn.addEventListener('click', function(){
			that.hideDeleteConfirm();
			List.unDeleteOne(); //unmark to delete element
		});
		// delete action
		yesBtn.addEventListener('click', function(){
			// // if delete same element, wich was open to edit 
			if( parseInt(List.onEditElIndex) === parseInt(List.toDeleteIndex) ) {
				var editorFields = that.getEditorFields(); // get Editor Fields, clear them
				editorFields.name.value = '';
				editorFields.cnt.value = '';
				editorFields.price.value = '';
			} 

			List.deleteOne(); //delete element
			that.renderProducts().hideDeleteConfirm();

		});
	}

	/**
	*  Show delete confirm pop-up window
	*/
	this.showDeleteConfirm = function()
	{
		var popup = document.getElementById('deleteConfirm');
		var shadow = document.getElementById('elementaIncognita');

		shadow.className = shadow.className.replace(' hide','');
		shadow.className = shadow.className.replace('hide','');
		window.setTimeout( function(){
			shadow.style.opacity = 1;
			popup.style.opacity = 1;
		},100);

	}

	/**
	*  Hide delete confirm pop-up window
	*/
	this.hideDeleteConfirm = function()
	{
		var popup = document.getElementById('deleteConfirm');
		var shadow = document.getElementById('elementaIncognita');
		
		shadow.style.opacity = 0;
		popup.style.opacity = 0;
		window.setTimeout( function(){
			shadow.className+= ' hide';
		},100)
	}

	this.priceToDisplay = function(price)
	{
		var price = parseFloat(price);
		priceTiles = price.toString().split('.');

		// 
		for( var i = priceTiles[0].length; i > 0; i=i-3 ) {
			if (i === priceTiles[0].length )
				continue;
			var str = priceTiles[0];
			var symbolPos = i;
			str = str.substring(0, symbolPos) + ',' + str.substring(symbolPos, str.length);

			priceTiles[0] = str;
		}

		priceTiles[0] = '$' + priceTiles[0];
		var priceStr = priceTiles.join('.');

		return priceStr;

	}
	this.priceToFloat = function(priceStr)
	{
		priceStr = priceStr.split(',').join('');
		priceStr = priceStr.replace('$','');
		return parseFloat(priceStr);
	}

	this.inputsWatch = function()
	{
		var editorFields = this.getEditorFields();
		var List = this.model;
		var that = this;
		// NAME Field: hide error on keyUp if all is ok
		editorFields.name.addEventListener('keyup', function(e){
			if( List.nameValidate(this.value) ) {
				that.hideErrorMsg( this.id );
			}
			// console.log(List.nameValidate(this.value));
		});
		// NAME Field: show error on fucus out (blur) 
		editorFields.name.onblur =  function(e){
			// console.log(this.value);
			var nameValid =List.nameValidate(this.value) 
			if( !nameValid ) {
				that.showNameError();
			}
		};

		// PRICE Field:hide error oon keyUp if all is ok
		editorFields.price.addEventListener('keyup', function(e){
			if( List.priceValidate(this.value) ) {
				that.hideErrorMsg( this.id );
			}
		});
		// PRICE Field: show error on fucus out (blur) 
		editorFields.price.onblur =  function(e){
			// console.log(this.value);
			if( !List.priceValidate(this.value) ) {
				that.showPriceError( );
			} else {
				this.value = that.priceToDisplay(this.value);
				that.hideErrorMsg( this.id );
			}
		};
		// PRICE Field: value to float on focus 
		editorFields.price.onfocus = function(){
			if( this.value !== '' && this.value != undefined ) {
				this.value = that.priceToFloat(this.value);
			}
		};
		// CNT Field: show error on fucus out (blur) 
		editorFields.cnt.addEventListener('keyup', function(e){
			if( this.value !== '') {
				that.hideErrorMsg( this.id );
			}
		});
		// CNT Field: show error on fucus out (blur) 
		editorFields.cnt.onblur =  function(e){
			// console.log(this.value);
			if( this.value == '' ) {
				that.showCntError( );
			} else {
				that.hideErrorMsg( this.id );
			}
		};

	}
	/// ERRORS ///
	//	cnt error
	this.showCntError = function()
	{
		var editorFields = this.getEditorFields();
		this.showErrorMsg( editorFields.cnt.id, 'Введите количество' );
	}
	// price error
	this.showPriceError = function()
	{
		var editorFields = this.getEditorFields();
		this.showErrorMsg( editorFields.price.id, 'Введите корректную цену' );
	}
	this.showNameError = function()
	{
		var editorFields = this.getEditorFields();
		var List = this.model;
		if( List.validationErrs.indexOf( 'name_empty' ) > -1)
			this.showErrorMsg( editorFields.name.id, 'Заполните поле' );
		else if( List.validationErrs.indexOf( 'name_maxlen' ) > -1)
			this.showErrorMsg( editorFields.name.id, 'Не больше 15 символов' );
		// if( List.validationErrs.indexOf( 'name_symbols' ) > -1)
				// 	that.showErrorMsg( this.id, 'Допустимы буквы и числа' );
	} 

	// global show error
	this.showErrorMsg = function(idStr, msgStr)
	{
		var field = document.getElementById(idStr);
		var msgElem = document.createElement('div');
		msgElem.className = 'error';
		msgElem.innerHTML = msgStr;

		field.parentNode.appendChild(msgElem);
		if(field.className.indexOf('err') < 0 )
			field.className+= ' err';
	}	

	this.hideErrorMsg = function(idStr)
	{
		var field = document.getElementById(idStr);
		field.className = field.className.replace(' err','');
		field.className = field.className.replace('err','');
		var msgElems = field.parentNode.getElementsByClassName('error');
		for( var en in Object.keys(msgElems) ) {
			var errMsg = msgElems[en];
			if( errMsg !== undefined )
				errMsg.parentNode.removeChild(errMsg);
		}

	}
}