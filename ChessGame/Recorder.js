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
			this.whiteAttackMap[i] = new Array(8);
			this.blackAttackMap[i] = new Array(8);
		}
		for(var i = 0;i < 8;i++)
		{
			for(var j =0;j < 8;j++)
			{
				this.moveMap[i][j] = 0;
				this.whiteAttackMap[i][j] = [];
				this.blackAttackMap[i][j] = [];
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
				if(this.moveMap[i][j] != null)
				{
					(this.moveMap[i][j] < 0)? this.calculateBlackAttackMap(this.moveMap[i][j],i,j): this.calculateWhiteAttackMap(this.moveMap[i][j],i,j);
				}
			}
		}
	}
	
	this.updateAttackMap = function()
	{
		//add the move to moveRecord
		//recalculate the moveMap and attackMap
		for(var i = 0; i < 8; i++)
		{
			for(var j = 0; j < 8;j++)
			{
				this.whiteAttackMap[i][j] = [];
				this.blackAttackMap[i][j] = [];
			}
		}
		this.initializeAttackMap();
	}
	
	this.calculateBlackAttackMap = function(value,col,row)
	{
		switch(value)
		{
			case -1://Rook
				this.calculateAttackMapForRook(value,col,row,this.blackAttackMap);
				break;
			case -2://Knight
				this.calculateAttackMapForKnight(value,col,row,this.blackAttackMap);
				break;
			case -3://Bishop
				this.calculateAttackMapForBishop(value,col,row,this.blackAttackMap)
				break;
			case -4://Queen
				this.calculateAttackMapForQueen(value,col,row,this.blackAttackMap);
				break;
			case -5://King
				this.calculateAttackMapForKing(value,col,row,this.blackAttackMap);
				break;
			case -6://Pawn
				this.calculateAttackMapForPawn(value,col,row,this.blackAttackMap);
				break;
		}
	}
	
	this.calculateWhiteAttackMap = function(value,col,row)
	{
		switch(value)
		{
			case 1://Rook
				this.calculateAttackMapForRook(value,col,row,this.whiteAttackMap);
				break;
			case 2://Knight
				this.calculateAttackMapForKnight(value,col,row,this.whiteAttackMap);
				break;
			case 3://Bishop
				this.calculateAttackMapForBishop(value,col,row,this.whiteAttackMap);
				break;
			case 4://Queen
				this.calculateAttackMapForQueen(value,col,row,this.whiteAttackMap);
				break;
			case 5://King
				this.calculateAttackMapForKing(value,col,row,this.whiteAttackMap);
				break;
			case 6://Pawn
				this.calculateAttackMapForPawn(value,col,row,this.whiteAttackMap);
				break;
		}
	}
	this.updateMoveMap = function(value,prevCol,prevRow,clickedCol,clickedRow)
	{
		if(prevCol != null && prevRow != null)
			this.moveMap[prevCol][prevRow] = 0;
		this.moveMap[clickedCol][clickedRow] = value;
	}
	this.updateMoveRecord = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		this.moveRecord.push([this.moveMap[prevCol][prevRow],prevCol*10+prevRow,clickedCol*10+clickedRow]);
	}
	this.calculateAttackMapForRook = function(value,col,row,attackMap)
	{
		for(var i = col;i > 0;i--)
		{
			if(col == 0) break;
			if(this.moveMap[i - 1][row] <= 0)
			{
				if(attackMap[i - 1][row].indexOf(value) != -1)
					attackMap[i - 1][row].push(value);
			}
			else
			{
				if(attackMap[i - 1][row].indexOf(value) != -1)
					attackMap[i - 1][row].push(value);
				break;
			}
		}
		for(var i = col;i < 7;i++)
		{
			if(col == 7) break;
			if(this.moveMap[i + 1][row] <= 0)
			{
				if(attackMap[i + 1][row].indexOf(value) != -1)
					attackMap[i + 1][row].push(value);
			}
			else
			{
				if(attackMap[i + 1][row].indexOf(value) != -1)
					attackMap[i + 1][row].push(value);
				break;
			}
		}
		for(var i = row;i > 0;i--)
		{
			if(row == 0) break;
			if(this.moveMap[col][i - 1] <= 0)
			{
				if(attackMap[col][i - 1].indexOf(value) != -1)
					attackMap[col][i - 1].push(value);
			}
			else
			{
				if(attackMap[col][i - 1].indexOf(value) != -1)
					attackMap[col][i - 1].push(value);
				break;
			}
		}
		for(var i = row;i < 7;i++)
		{
			if(row == 7) break;
			if(this.moveMap[col][i + 1] <= 0)
			{
				if(attackMap[col][i + 1].indexOf(value) != -1)
					atackMap[col][i + 1].push(value);
			}
			else
			{
				if(attackMap[col][i + 1].indexOf(value) != -1)
					atackMap[col][i + 1].push(value);
				break;
			}
		}
	}
	//fix this one too
	this.calculateAttackMapForKnight = function(value,col,row,attackMap)
	{
		if(col + 1 <= 7 && row - 2 >= 0)
		{
			if(attackMap[col + 1][row - 2].indexOf(value) != -1)
				attackMap[col + 1][row - 2].push(value);
		}
		if(col - 1 >= 0 && row - 2 >= 0)
		{
			if(attackMap[col - 1][row - 2].indexOf(value) != -1)
				attackMap[col - 1][row - 2].push(value);
		}
		if(col + 1 <= 7 && row + 2 <= 7)
		{
			if(attackMap[col + 1][row + 2].indexOf(value) != -1)
				attackMap[col + 1][row + 2].push(value);
		}
		if(col - 1 >= 0 && row + 2 <= 7)
		{
			if(attackMap[col - 1][row + 2].indexOf(value) != -1)
				attackMap[col - 1][row + 2].push(value);
		}
		if(col + 2 <= 7 && row - 1 >= 0)
		{
			if(attackMap[col + 2][row - 1].indexOf(value) != -1)
				attackMap[col + 2][row - 1].push(value);
		}
		if(col - 2 >= 0 && row - 1 >= 0)
		{
			if(attackMap[col - 2][row - 1].indexOf(value) != -1)
				attackMap[col - 2][row - 1].push(value);
		}
		if(col + 2 <= 7 && row + 1 <= 7)
		{
			if(attackMap[col + 2][row + 1].indexOf(value) != -1)
				attackMap[col + 2][row + 1].push(value);
		}
		if(col - 2 >= 0 && row - 2 >= 0)
		{
			if(attackMap[col - 2][row + 1].indexOf(value) != -1)
				attackMap[col - 2][row + 1].push(value);
		}
	}
	this.calculateAttackMapForBishop = function(value,col,row,attackMap)
	{
		var tlbrValue = col - row;//top-right ->> bottom-left
		var trblValue = col + row;//top-left ->> bottom-right
		for(var i = col;i >= 0;i--)
		{
			if(col == 0) break;
			if(this.moveMap[i][i - tlbrValue] <= 0)	
			{
				if(attackMap[i][i - tlbrValue].indexOf(value) != -1)
					attackMap[i][i - tlbrValue].push(value);
			}
			else
			{
				if(attackMap[i][i - tlbrValue].indexOf(value) != -1)
					attackMap[i][i - tlbrValue].push(value);
				break;
			}		
		}
		for(var i = col;i >= 0;i--)
		{
			if(col == 0) break;
			if(this.moveMap[i][trblValue - i] <= 0)
			{
				if(attackMap[i][trblValue - i].indexOf(value) != -1)
					attackMap[i][trblValue - i].push(value);
			}
			else
			{
				if(attackMap[i][trblValue - i].indexOf(value) != -1)
					attackMap[i][trblValue - i].push(value);
				break;
			}
		}
		for(var i = col;i < 8;i++)
		{
			if(col == 7) break;
			if(this.moveMap[i][i - tlbrValue] <= 0)
			{
				if(attackMap[i][i - tlbrValue].indexOf(value) != -1)
					attackMap[i][i - tlbrValue].push(value);
			}
			else
			{
				if(attackMap[i][i - tlbrValue].indexOf(value) != -1)
					attackMap[i][i - tlbrValue].push(value);
				break;
			}
		}
		for(var i = col;i < 8;i++)
		{
			if(col == 7) break;
			if(this.moveMap[i][i - tlbrValue] <= 0)
			{
				if(attackMap[i][trblValue - i].indexOf(value) != -1)
					attackMap[i][trblValue - i].push(value);
			}
			else
			{
				if(attackMap[i][trblValue - i].indexOf(value) != -1)
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
	//wrong at this one
	this.calculateAttackMapForKing = function(value,col,row,attackMap)
	{
		//special case
		if(col == 0)
		{
			if(row == 0)// right down bottom right
			{
				if(attackMap[col + 1][row].indexOf(value) != -1)//right
					attackMap[col + 1][row].push(value);
				if(attackMap[col + 1][row + 1].indexOf(value) != -1)//bottom right
					attackMap[col + 1][row + 1].push(value);
				if(attackMap[col][row + 1].indexOf(value) != -1)//down
					attackMap[col][row + 1].push(value);
				return;
			}
			if(row == 7)// up top right right
			{
				if(attackMap[col][row - 1].indexOf(value) != -1)//up
					attackMap[col][row - 1].push(value);
				if(attackMap[col + 1][row - 1].indexOf(value) != -1)//top right
					attackMap[col + 1][row - 1].push(value);
				if(attackMap[col + 1][row].indexOf(value) != -1)//right
					attackMap[col + 1][row].push(value);
				return;
			}
			else// up top-right right bottom-right down
			{
				if(attackMap[col][row - 1].indexOf(value) != -1)//up
					attackMap[col][row - 1].push(value);
				if(attackMap[col + 1][row - 1].indexOf(value) != -1)//top right
					attackMap[col + 1][row - 1].push(value);
				if(attackMap[col + 1][row].indexOf(value) != -1)//right
					attackMap[col + 1][row].push(value);
				if(attackMap[col + 1][row + 1].indexOf(value) != -1)//bottom right
					attackMap[col + 1][row + 1].push(value);
				if(attackMap[col][row + 1].indexOf(value) != -1)//down
					attackMap[col][row + 1].push(value);
				return;
			}
		}
		if(col == 7)
		{
			if(row == 0)// down bottom left left
			{
				if(attackMap[col][row + 1].indexOf(value) != -1)//down
					attackMap[col][row + 1].push(value);
				if(attackMap[col - 1][row + 1].indexOf(value) != -1)//bottom left
					attackMap[col - 1][row + 1].push(value);
				if(attackMap[col - 1][row].indexOf(value) != -1)//left
					attackMap[col - 1][row].push(value);
				return;
			}
			if(row == 7)// up top left left
			{
				if(attackMap[col][row - 1].indexOf(value) != -1)//up
					attackMap[col][row - 1].push(value);
				if(attackMap[col - 1][row - 1].indexOf(value) != -1)//top left
					attackMap[col - 1][row - 1].push(value);
				if(attackMap[col - 1][row].indexOf(value) != -1)//left
					attackMap[col - 1][row].push(value);
				return;
				
			}
			else//up top left left bottom left down
			{
				if(attackMap[col][row - 1].indexOf(value) != -1)//up
					attackMap[col][row - 1].push(value);
				if(attackMap[col - 1][row - 1].indexOf(value) != -1)//top left
					attackMap[col - 1][row - 1].push(value);
				if(attackMap[col - 1][row].indexOf(value) != -1)//left
					attackMap[col - 1][row].push(value);
				if(attackMap[col - 1][row + 1].indexOf(value) != -1)//bottom left
					attackMap[col - 1][row + 1].push(value);
				if(attackMap[col][row + 1].indexOf(value) != -1)//down
					attackMap[col][row + 1].push(value);
				return;
			}
		}
		else
		{
			if(row == 0)//left bottom left down bottom right right
			{
				if(attackMap[col - 1][row].indexOf(value) != -1)//left
					attackMap[col - 1][row].push(value);
				if(attackMap[col - 1][row + 1].indexOf(value) != -1)//bottom left
					attackMap[col - 1][row + 1].push(value);
				if(attackMap[col][row + 1].indexOf(value) != -1)//down
					attackMap[col][row + 1].push(value);
				if(attackMap[col + 1][row + 1].indexOf(value) != -1)//bottom right
					attackMap[col + 1][row + 1].push(value);
				if(attackMap[col + 1][row].indexOf(value) != -1)//right
					attackMap[col + 1][row].push(value);
				return;
			}
			else if(row == 7)// left top left up top right right
			{
				if(attackMap[col - 1][row].indexOf(value) != -1)//left
					attackMap[col - 1][row].push(value);
				if(attackMap[col - 1][row - 1].indexOf(value) != -1)//top left
					attackMap[col - 1][row - 1].push(value);
				if(attackMap[col][row - 1].indexOf(value) != -1)//up
					attackMap[col][row - 1].push(value);
				if(attackMap[col + 1][row - 1].indexOf(value) != -1)//top right
					attackMap[col + 1][row - 1].push(value);
				if(attackMap[col + 1][row].indexOf(value) != -1)//right
					attackMap[col + 1][row].push(value);
				return;
			}
			else
			{
				if(attackMap[col][row - 1].indexOf(value) != -1)//up
					attackMap[col][row - 1].push(value);
				if(attackMap[col][row + 1].indexOf(value) != -1)//down
					attackMap[col][row + 1].push(value);
				if(attackMap[col + 1][row].indexOf(value) != -1)//right
					attackMap[col + 1][row].push(value);
				if(attackMap[col - 1][row].indexOf(value) != -1)//left
					attackMap[col - 1][row].push(value);
				if(attackMap[col + 1][row + 1].indexOf(value) != -1)//bottom right
					attackMap[col + 1][row + 1].push(value);
				if(attackMap[col - 1][row - 1].indexOf(value) != -1)//top left
					attackMap[col - 1][row - 1].push(value);
				if(attackMap[col + 1][row - 1].indexOf(value) != -1)//top right
					attackMap[col + 1][row - 1].push(value);
				if(attackMap[col - 1][row + 1].indexOf(value) != -1)//bottom left
					attackMap[col - 1][row + 1].push(value);
				return;
			}
		}
	}
	//need to fix this one too 
	this.calculateAttackMapForPawn = function(value,col,row,attackMap)
	{
		if(value*playerSide < 0)
		{
			//computer
			if(row == 7) return;
			if(col == 0)
			{
				
			}
			if(col == 7)
			{
				
			}
			if(attackMap[col - 1][row + 1].indexOf(value) != -1)
				attackMap[col - 1][row + 1].push(value);
			if(attackMap[col + 1][row + 1].indexOf(value) != -1)
				attackMap[col + 1][row + 1].push(value);
		}
		else
		{
			//player
			
			if(row == 0) return;
			if(col == 0)
			{
				
			}
			if(col == 7)
			{
				
			}
			if(attackMap[col - 1][row - 1].indexOf(value) != -1)
				attackMap[col - 1][row - 1].push(value);
			if(attackMap[col + 1][row - 1].indexOf(value) != -1)
				attackMap[col + 1][row - 1].push(value);
		}
	}
}