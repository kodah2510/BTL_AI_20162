function Validator()
{
	this.validateMove = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		switch(Math.abs(recorder.moveMap[prevCol][prevRow]))
		{	
			case 1:
			//Khoa
				return this.validateForRook(prevCol,prevRow,clickedCol,clickedRow);
				break;
			case 2:
				return this.validateForKnight(prevCol,prevRow,clickedCol,clickedRow);
				break;
			case 3:
			//Lâm
				return this.validateForBishop(prevCol,prevRow,clickedCol,clickedRow);
				break;
			case 4:
			//Minh
				return this.validateForQueen(prevCol,prevRow,clickedCol,clickedRow);
				break;
			case 5:
			//Đức 
				return this.validateForKing(prevCol,prevRow,clickedCol,clickedRow)
				break;
			case 6:
			//Minh
				return this.validataForPawn(prevCol,prevRow,clickedCol,clickedRow);
				break;
		}
	}
	
	this.validateForRook = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		if(clickedCol != prevCol && clickedRow != prevRow)
				return false;
			if(clickedRow == prevRow)
			{
				if(clickedCol < prevCol)
				{
					for(var i = prevCol - 1 ; i > clickedCol ; i--)
					{
						if(recorder.moveMap[i][prevRow] != 0)
							return false;
					}
				}
				if(clickedCol > prevCol)
				{
					for(var i = prevCol + 1 ; i < clickedCol ; i++)
					{
						if(recorder.moveMap[i][prevRow] != 0)
							return false;
					}
				}
			}
			if(clickedCol == prevCol)
			{
				if(clickedRow < prevRow)
				{
					for(var i = prevRow - 1; i > clickedRow ; i--)
					{
						if(recorder.moveMap[prevCol][i] != 0)
							return false;
					}
				}
				if(clickedRow > prevRow)
				{
					for(var i = prevRow + 1 ; i < clickedRow ; i++)
					{
						if(recorder.moveMap[prevCol][i] != 0)
							return false;
					}
				}
			}
			return true;
	}
	this.validateForKnight = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		if(clickedCol == prevCol + 1 && clickedRow == prevRow - 2)
				return true;
			else if(clickedCol == prevCol - 1 && clickedRow == prevRow - 2)
				return true;
			else if(clickedCol == prevCol + 1 && clickedRow == prevRow + 2)
				return true;
			else if(clickedCol == prevCol - 1 && clickedRow == prevRow + 2)
				return true;
			else if(clickedCol == prevCol + 2 && clickedRow == prevRow - 1)
				return true;
			else if(clickedCol == prevCol - 2 && clickedRow == prevRow - 1)
				return true;
			else if(clickedCol == prevCol + 2 && clickedRow == prevRow + 1)
				return true;
			else if(clickedCol == prevCol - 2 && clickedRow == prevRow + 1)
				return true;
			return false;
	}
	this.validateForBishop = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		if(clickedRow == prevRow || clickedCol == prevCol)
					return false;				
			if(clickedCol != prevCol && clickedRow != prevRow)
			{
				if(abs(clickedCol-prevCol) != abs(clickedRow - prevRow))
					return false;
				else
				{
					if(clickedRow > prevRow)
					{
						var tmpCol = prevCol;
						for(var i = prevRow + 1; i < clickedRow; i++)
						{
							if(clickedCol > prevCol)
									tmpCol += 1;
							else tmpCol -=1;
							if(recorder.moveMap[tmpCol][i] != 0)
									return false;
						}
					}
					if(clickedRow < prevRow)
					{
						var tmpCol = prevCol;
						for(var i = prevRow - 1; i > clickedRow; i--)
						{
							if(clickedCol > prevCol)
								tmpCol += 1;
							else tmpCol -=1;
								if(recorder.moveMap[tmpCol][i] != 0)
									return false;
						}
					}
				}
			}
			return true;
	}
	this.validateForQueen = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		var straightLine = validateForRook(prevCol,prevRow,clickedCol,clickedRow);
		if(!straightLine)
		{
			return validateForBishop(prevCol,prevRow,clickedCol,clickedRow);
		}
		else return straightLine;
	}
	this.validateForKing = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		if(Math.abs(clickedCol-prevCol)>=2 ||  Math.abs(clickedRow-prevRow)>=2)
				return false;
			return true;
	}
	this.validataForPawn = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		if (prevRow == 6 && prevCol == clickedCol && clickedRow >= 4)
				{
					for (var i = 5; i > 4; i--)
						if (recorder.moveMap[prevCol][i] != null)
							return false;
					return true;
				}
				if (clickedRow == prevRow - 1 	&& 
					clickedCol == prevCol 		&& 
					recorder.moveMap[clickedCol][clickedRow].chessman == null) {
					return true;
				}
				if (	Math.abs(clickedCol - prevCol) == 1 &&
						clickedRow == prevRow - 1 &&
						(grid[clickedCol][clickedRow].chessman != null && grid[clickedCol][clickedRow].chessman.isBlack == true))
				{
					return true;
				}
				return false;
	}
}