function Validator()
{
	this.validateMove = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		//first condition the move follow the rule
		var value = recorder.moveMap[prevCol][prevRow];
		var result = (value < 0) ? recorder.blackAttackMap[clickedCol][clickedRow].indexOf(value):recorder.whiteAttackMap[clickedCol][clickedRow].indexOf(value);
		//second condition the move cannot make the king in danger
		//bishop rook queen
		
		
	}
	//predict the checking condition
}