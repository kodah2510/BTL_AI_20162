//denote Rook Knight Bishop Queen King Pawn 
//		 1	  2      3      4     5    6
//whiteSide 1
//blackSide -1
//Example blackRook = -1 whiteQueen = 4 blackKing = -5
function Recorder()
{
	this.moveRecord = [];
	this.whiteAttackMap	= [];
	this.blackAttackMap = [];
	this.moveMap = [];
	
	this.init = function()
	{
		for(var i = 0;i < 8;i++)
		{
			this.moveMap[i] = new Array(8);
		}
		for(var i = 0;i < 8;i++)
		{
			for(var j =0;j < 8;j++)
			{
				this.moveMap[i][j] = 0;
			}
		}
				
		//initialize attackMap
		//this.calculateBlackAttackMap();
		//this.calculateWhiteAttackMap();
	}
	this.initializeAttackMap = function()
	{
		for(var i = 0;i < 8;i++)
		{
			for(var j = 0;j < 8;j++)
			{
				if(moveMap[i][j] != null)
				{
					(moveMap[i][j] < 0)? this.calculateBlackAttackMap(moveMap[i][j],i,j): this.calculateWhiteAttackMap(moveMap[i][j],i,j);
				}
				
			}
		}
	}
	this.updateAttackMap = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		//add the move to moveRecord
		//recalculate the moveMap and attackMap
		
		
	}
	this.calculateBlackAttackMap = function(value,col,row)
	{
		switch(value)
		{
			case -1://Rook
				this.calculateAttackMapForRook(value,col,row,blackAttackMap);
				break;
			case -2://Knight
				this.calculateAttackMapForKnight(value,col,row,blackAttackMap);
				break;
			case -3://Bishop
				this.calculateAttackMapForBishop(value,col,row,blackAttackMap)
				break;
			case -4://Queen
				this.calculateAttackMapForQueen(value,col,row,blackAttackMap);
				break;
			case -5://King
				this.calculateAttackMapForKing(value,col,row,blackAttackMap);
				break;
			case -6://Pawn
				if(playerSide  == 1)
				this.calculateAttackMapForPawn(value,col,row,blackAttackMap);
				break;
		}
		
	}
	this.calculateWhiteAttackMap = function(value,col,row)
	{
		switch(value)
		{
			case 1://Rook
				this.calculateAttackMapForRook(value,col,row,whiteAttackMap);
				break;
			case 2://Knight
				this.calculateAttackMapForKnight(value,col,row,whiteAttackMap);
				break;
			case 3://Bishop
				this,calculateAttackMapForBishop(value,col,row,whiteAttackMap);
				break;
			case 4://Queen
				this.calculateAttackMapForQueen(value,col,row,whiteAttackMap);
				break;
			case 5://King
				this.calculateAttackMapForKing(value,col,row,whiteAttackMap);
				break;
			case 6://Pawn
			this.calculateAttackMapForPawn(value,col,row,whiteAttackMap);
				break;
		}
	}
	this.updateMoveMap = function(value,prevCol,prevRow,clickedCol,clickedRow)
	{
		this.moveMap[prevCol][prevRow] = 0;
		this.moveMap[clickedCol][clickedRow] = value;
	}
	this.updateMoveRecord = function()
	{
		moveRecord.push([moveMap[prevCol][prevRow],prevCol*10+prevRow,clickedCol*10+clickedRow]);
	}
	this.calculateAttackMapForRook = function(value,col,row,attackMap)
	{
		for(var i = col;i >= 0;i--)
				{
					if(col == 0) break;
					if(moveMap[i - 1][row] <= 0)
							attackMap[i - 1][row].push(value);
						else
						{
							attackMap[i - 1][row].push(value);
							break;
						}
				}
				for(var i = col;i < 8;i++)
				{
					if(col == 7) break;
					if(moveMap[i + 1][row] <= 0)
						attackMap[i + 1][row].push(value);
					else
					{
						attackMap[i - 1][row].push(value);
						break;
					}
				}
				for(var i = row;i >= 0;i--)
				{
					if(row == 0) break;
					if(moveMap[col][i - 1] <= 0)
							attackMap[col][i - 1].push(value);
						else
						{
							attackMap[col][i - 1].push(value);
							break;
						}
				}
				for(var i = row;i <= 6;i++)
				{
					if(row == 7) break;
					if(moveMap[col][i + 1] <= 0)
						atackMap[col][i + 1].push(value);
					else
					{
						attackMap[col][i + 1].push(value);
						break;
					}
				}
	}
	this.calculateAttackMapForKnight = function(value,col,row,attackMap)
	{
		if(col + 1 <= 7 && row - 2 >= 0)
			attackMap[col + 1][row - 2].push(value);
		if(col - 1 >= 0 && row - 2 >= 0)
			attackMap[col - 1][row - 2].push(value);
		if(col + 1 <= 7 && row + 2 <= 7)
			attackMap[col + 1][row + 2].push(value);
		if(col - 1 >= 0 && row + 2 <= 7)
			attackMap[col - 1][row + 2].push(value);
		if(col + 2 <= 7 && row - 1 >= 0)
			attackMap[col + 2][row - 1].push(value);
		if(col - 2 >= 0 && row - 1 >= 0)
			attackMap[col - 2][row - 1].push(value);
		if(col + 2 <= 7 && row + 1 <= 7)
			attackMap[col + 2][row + 1].push(value);
		if(col - 2 >= 0 && row - 2 >= 0)
			attackMap[col - 2][row + 1].push(value);
	}
	this.calculateAttackMapForBishop = function(value,col,row,attackMap)
	{
		var tlbrValue = col - row;//top-right ->> bottom-left
				var trblValue = col + row;//top-left ->> bottom-right
				for(var i = col;i >= 0;i--)
				{
					if(col == 0) break;
					if(moveMap[i][i - tlbrValue] <= 0)
						attackMap[i][i - tlbrValue].push(value);
					else
					{
						attackMap[i][i - tlbrValue].push(value);
						break;
					}
				}
				for(var i = col;i >= 0;i--)
				{
					if(col == 0) break;
					if(moveMap[i][trblValue - i] <= 0)
						attackMap[i][trblValue - i].push(value);
					else
					{
						attackMap[i][trblValue - i].push(value);
						break;
					}
				}
				for(var i = col;i < 8;i++)
				{
					if(col == 7) break;
					if(moveMap[i][i - tlbrValue] <= 0)
						attackMap[i][i - tlbrValue].push(value);
					else
					{
						attackMap[i][i - tlbrValue].push(value);
						break;
					}
				}
				for(var i = col;i < 8;i++)
				{
					if(col == 7) break;
					if(moveMap[i][i - tlbrValue] <= 0)
						attackMap[i][trblValue - i].push(value);
					else
					{
						attackMap[i][trblValue - i].push(value);
						break;
					}
				}
	}
	this.calculateAttackMapForQueen = function(value,col,row,attackMap)
	{
		this.calculateAttackMapForRook(value,col,row,attackMap);
		this.calculateAttackMapForBishop(value,col,row,attackMap);
	}
	this,calculateAttackMapForKing = function(value,col,row,attackMap)
	{
		attackMap[col][row - 1].push(value);
		attackMap[col][row + 1].push(value);
		attackMap[col + 1][row].push(value);
		attackMap[col - 1][row].push(value);
		attackMap[col + 1][row + 1].push(value);
		attackMap[col - 1][row - 1].push(value);
		attackMap[col + 1][row - 1].push(value);
		attackMap[col - 1][row + 1].push(value);
	}
	this.calculateAttackMapForPawn = function(value,col,row,attackMap)
	{
		if(value*playerSide < 0)
		{
			attackMap[col - 1][row + 1].push(value);
			attackMap[col + 1][row + 1].push(value);
		}
		else
		{
			attackMap[col - 1][row - 1].push(value);
			attackMap[col + 1][row - 1].push(value);
		}
	}
}

