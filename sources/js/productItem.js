var productItem = function()
{
	this.setVals = function(param)
	{

		if( param.name != undefined )
			this.name = param.name.trim();
		if( param.cnt != undefined )
			this.cnt = param.cnt;
		if( param.price != undefined )
			this.price = param.price;
		if( param.id != undefined )
			this.id = param.id;
		return this;
	}

}