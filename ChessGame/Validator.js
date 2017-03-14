function Validator()
{
	this.validateMove = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		//first condition the move follow the rule
		var value = recorder.moveMap[prevCol][prevRow];
		if(value < 0)
		{
			if(recorder.blackAttackMap[clickedCol][clickedRow].indexOf(value) != -1)
				return true;
		}
		else
		{
			if(recorder.whiteAttackMap[clickedCol][clickedRow].indexOf(value) != -1)
				return true;
		}
		//second condition the move cannot make the king in danger
		//bishop rook queen
		return false;
	}
	//Lâm viết cái này nhé 
	this.detectCheck = function()
	{
		
	}
	//Đức viết cái này nhé
	this.validateCastling = function()
	{
		
	}
	//Minh viết cái này nhé
	this.validateCheckmate = function()
	{
		
	}
	//predict the checking condition
}