
window.onload = function()
{

	/**
	*	Init List
	*/
	// list Object
	var pList = new productList();
	// load data
	pList.loadData(products);
	var listView = new productListView();
	
	listView.setModel(pList);

	listView.renderProducts().initControls();

	 /*
	 
	 если нажать кнопку редактирования
 		то
 			добавятся значения в поля редактора
	 если нажать кнопку сохранения
	 	то
	 		значения запишутся в модель
	 		перерендерится весь список
	 		перебиндятся события кнопок

	 */ 
	
}
