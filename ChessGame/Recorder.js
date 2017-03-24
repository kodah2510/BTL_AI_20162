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
	
	this.calculateAttackMap = function()
	{
		for(var i = 0;i < 8;i++)
		{
			for(var j = 0;j < 8;j++)
			{
				if(this.moveMap[i][j] != 0)
				{
					(this.moveMap[i][j] < 0)? this.calculateBlackAttackMap(this.moveMap[i][j],i,j,BLACK_SIDE): this.calculateWhiteAttackMap(this.moveMap[i][j],i,j,WHITE_SIDE);
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
		this.calculateAttackMap();
	}
	
	this.calculateBlackAttackMap = function(value,col,row,side)
	{
		switch(value)
		{
			case -ROOK_VALUE ://Rook
				this.calculateAttackMapForRook(value,col,row,this.blackAttackMap,side);
				break;
			case -KNIGHT_VALUE ://Knight
				this.calculateAttackMapForKnight(value,col,row,this.blackAttackMap,side);
				break;
			case -BISHOP_VALUE ://Bishop
				this.calculateAttackMapForBishop(value,col,row,this.blackAttackMap,side)
				break;
			case -QUEEN_VALUE ://Queen
				this.calculateAttackMapForQueen(value,col,row,this.blackAttackMap,side);
				break;
			case -KING_VALUE ://King
				this.calculateAttackMapForKing(value,col,row,this.blackAttackMap,side);
				break;
			case -PAWN_VALUE ://Pawn
				this.calculateAttackMapForPawn(value,col,row,this.blackAttackMap);
				break;
		}
	}
	
	this.calculateWhiteAttackMap = function(value,col,row,side)
	{
		switch(value)
		{
			case ROOK_VALUE: //Rook
				this.calculateAttackMapForRook(value,col,row,this.whiteAttackMap,side);
				break;
			case KNIGHT_VALUE ://Knight
				this.calculateAttackMapForKnight(value,col,row,this.whiteAttackMap,side);
				break;
			case BISHOP_VALUE ://Bishop
				this.calculateAttackMapForBishop(value,col,row,this.whiteAttackMap,side);
				break;
			case QUEEN_VALUE ://Queen
				this.calculateAttackMapForQueen(value,col,row,this.whiteAttackMap,side);
				break;
			case KING_VALUE ://King
				this.calculateAttackMapForKing(value,col,row,this.whiteAttackMap,side);
				break;
			case PAWN_VALUE ://Pawn
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
		this.moveRecord.push([this.moveMap[clickedCol][clickedRow],prevCol*10+prevRow,clickedCol*10+clickedRow]);
	}
	this.calculateAttackMapForRook = function(value,col,row,attackMap,side)
	{
		//need to fix this one 
		//only the attack range is limited at the first opponent piece it met 
		if(col != 0)
		{
			for(var i = col - 1;i >= 0 && this.moveMap[i][row]*side <= 0;i--)
			{
				if(attackMap[i][row].indexOf(value) == -1)
				{
					if( this.moveMap[i][row]*side < 0)
					{
						attackMap[i][row].push(value);
						break;
					}
					else attackMap[i][row].push(value);
				}					
			}
		}
		if(col != 7)
		{
			for(var i = col + 1;i < 8 && this.moveMap[i][row]*side <= 0;i++)
			{
				if(attackMap[i][row].indexOf(value) == -1)
				{
					if(this.moveMap[i][row]*side < 0)
					{
						attackMap[i][row].push(value);
						break;
					}
					else attackMap[i][row].push(value);
				}					
			}
		}
		if(row != 0)
		{
			for(var i = row - 1;i >= 0 && this.moveMap[col][i]*side <= 0;i--)
			{
				if(attackMap[col][i].indexOf(value) == -1)
				{
					if(this.moveMap[col][i]*side < 0)
					{
						attackMap[col][i].push(value);
						break;
					}
					else attackMap[col][i].push(value);
					
				}					
			}
		}
		if(row != 7)
		{
			for(var i = row + 1;i < 8 && this.moveMap[col][i]*side <= 0;i++)
			{
				if(attackMap[col][i].indexOf(value) == -1)
				{
					if(this.moveMap[col][i]*side < 0)
					{
						attackMap[col][i].push(value);
						break;
					}
					else attackMap[col][i].push(value);
					
				}
			}
		}
	}
	//fix this one too
	this.calculateAttackMapForKnight = function(value,col,row,attackMap,side)
	{
		if((col + 1 <= 7 && row - 2 >= 0) && this.moveMap[col + 1][row - 2]*side <= 0 && attackMap[col + 1][row - 2].indexOf(value) == -1 )
		{
			attackMap[col + 1][row - 2].push(value);
		}
		if((col - 1 >= 0 && row - 2 >= 0) && this.moveMap[col - 1][row - 2]*side <= 0 && attackMap[col - 1][row - 2].indexOf(value) == -1 )
		{
			attackMap[col - 1][row - 2].push(value);
		}
		if((col + 1 <= 7 && row + 2 <= 7) && this.moveMap[col + 1][row + 2]*side <= 0 && attackMap[col + 1][row + 2].indexOf(value) == -1)
		{
			attackMap[col + 1][row + 2].push(value);
		}
		if((col - 1 >= 0 && row + 2 <= 7) && this.moveMap[col - 1][row + 2]*side <= 0 && attackMap[col - 1][row + 2].indexOf(value) == -1)
		{
			attackMap[col - 1][row + 2].push(value);
		}
		if((col + 2 <= 7 && row - 1 >= 0) && this.moveMap[col + 2][row - 1]*side <= 0 && attackMap[col + 2][row - 1].indexOf(value) == -1)
		{
			attackMap[col + 2][row - 1].push(value);
		}
		if(col - 2 >= 0 && row - 1 >= 0 && this.moveMap[col - 2][row - 1]*side <= 0 && attackMap[col - 2][row - 1].indexOf(value) == -1)
		{
			attackMap[col - 2][row - 1].push(value);
		}
		if(col + 2 <= 7 && row + 1 <= 7 && this.moveMap[col + 2][row + 1]*side <= 0 && attackMap[col + 2][row + 1].indexOf(value) == -1)
		{
			attackMap[col + 2][row + 1].push(value);
		}
		if(col - 2 >= 0 && row - 2 >= 0 && this.moveMap[col - 2][row - 2]*side <= 0 && attackMap[col - 2][row - 2].indexOf(value) == -1)
		{
			attackMap[col - 2][row - 2].push(value);
		}
	}
	this.calculateAttackMapForBishop = function(value,col,row,attackMap,side)
	{
		var tlbrValue = col - row;//top-left ->> bottom-right
		var trblValue = col + row;//top-right ->> bottom-left
		if(col != 0)
		{
			for(var i = col - 1;i >= 0 && this.moveMap[i][i - tlbrValue]*side <= 0;i--)
			{
				var currentRow = i - tlbrValue;
				if(attackMap[i][currentRow].indexOf(value) == -1)
				{
					if(this.moveMap[i][i - tlbrValue]*side < 0)
					{
						attackMap[i][currentRow].push(value);	
						break;
					}
					else attackMap[i][currentRow].push(value);	
				}					
			}
			for(var i = col - 1;i >= 0 && this.moveMap[i][trblValue - i]*side <= 0;i--)
			{
				var currentRow = trblValue - i;
				if(attackMap[i][currentRow].indexOf(value) == -1)
				{
					if(this.moveMap[i][trblValue - i]*side < 0)
					{
						attackMap[i][currentRow].push(value);
						break;
					}
					else attackMap[i][currentRow].push(value);
				}					
			}
		}
		if(col != 7)
		{
			for(var i = col + 1;i < 8 && this.moveMap[i][i - tlbrValue]*side <= 0;i++)
			{
				var currentRow = i - tlbrValue;
				if(attackMap[i][currentRow].indexOf(value) == -1)
				{
					if(this.moveMap[i][i - tlbrValue]*side < 0)
					{
						attackMap[i][currentRow].push(value);
						break;
					}
					else attackMap[i][currentRow].push(value);
				}					
			}
			for(var i = col + 1;i < 8 && this.moveMap[i][trblValue - i]*side <= 0;i++)
			{
				var currentRow = trblValue - i;
				if(attackMap[i][currentRow].indexOf(value) == -1)
				{
					if(this.moveMap[i][trblValue - i]*side < 0)
					{
						attackMap[i][currentRow].push(value);
						break;
					}
					else attackMap[i][currentRow].push(value);
				
				}					
			}
		}
		
	}
	this.calculateAttackMapForQueen = function(value,col,row,attackMap,side)
	{
		this.calculateAttackMapForRook(value,col,row,attackMap,side);
		this.calculateAttackMapForBishop(value,col,row,attackMap,side);
	}
	//wrong at this one
	this.calculateAttackMapForKing = function(value,col,row,attackMap,side)
	{
		//special case
		if(col == 0)
		{
			if(row == 0)// right down bottom right
			{
				//right
				if(this.moveMap[col + 1][row]*side <= 0) attackMap[col + 1][row].push(value);
				//bottom right
				if(this.moveMap[col + 1][row + 1]*side <= 0) attackMap[col + 1][row + 1].push(value);
				//down
				if(this.moveMap[col][row + 1]*side <= 0) attackMap[col][row + 1].push(value);
				return;
			}
			if(row == 7)// up top right right
			{
				//up
				if(this.moveMap[col][row - 1]*side <= 0 ) attackMap[col][row - 1].push(value);
				//top right
				if(this.moveMap[col + 1][row - 1]*side <= 0 ) attackMap[col + 1][row - 1].push(value);
				//right
				if(this.moveMap[col + 1][row]*side <= 0) attackMap[col + 1][row].push(value);
				return;
			}
			else// up top-right right bottom-right down
			{
				//up
				if(this.moveMap[col][row - 1]*side <= 0) attackMap[col][row - 1].push(value);
				//top right
				if(this.moveMap[col + 1][row - 1]*side <= 0) attackMap[col + 1][row - 1].push(value);
				//right
				if(this.moveMap[col + 1][row]*side <= 0) attackMap[col + 1][row].push(value);
				//bottom right
				if(this.moveMap[col + 1][row + 1]*side <= 0) attackMap[col + 1][row + 1].push(value);
				//down
				if(this.moveMap[col][row + 1]*side <= 0) attackMap[col][row + 1].push(value);
					
				return;
			}
		}
		if(col == 7)
		{
			if(row == 0)// down bottom left left
			{
				//down
				if(this.moveMap[col][row + 1]*side <= 0) attackMap[col][row + 1].push(value);
				//bottom left
				if(this.moveMap[col - 1][row + 1]*side <= 0) attackMap[col - 1][row + 1].push(value);
				//left 
				if(this.moveMap[col - 1][row]*side <= 0) attackMap[col - 1][row].push(value);
					
				return;
			}
			if(row == 7)// up top left left
			{
				//up
				if(this.moveMap[col][row - 1]*side <= 0) attackMap[col][row - 1].push(value);
				//top left
				if(this.moveMap[col - 1][row - 1]*side <= 0) attackMap[col - 1][row - 1].push(value);
				//left
				if(this.moveMap[col - 1][row]*side <= 0) attackMap[col - 1][row].push(value);
				return;
			}
			else//up top left left bottom left down
			{
				//up
				if(this.moveMap[col][row - 1]*side <= 0) attackMap[col][row - 1].push(value);
				//top left
				if(this.moveMap[col - 1][row - 1]*side <= 0) attackMap[col - 1][row - 1].push(value);
				//left
				if(this.moveMap[col - 1][row]*side <= 0) attackMap[col - 1][row].push(value);
				//bottom left
				if(this.moveMap[col - 1][row + 1]*side <= 0) attackMap[col - 1][row + 1].push(value);
				//down
				if(this.moveMap[col][row + 1]*side <= 0) attackMap[col][row + 1].push(value);
				return;
			}
		}
		else
		{
			if(row == 0)//left bottom left down bottom right right
			{
				//left
				if(this.moveMap[col - 1][row]*side <= 0) attackMap[col - 1][row].push(value);
				//bottom left
				if(this.moveMap[col - 1][row + 1]*side <= 0) attackMap[col - 1][row + 1].push(value);
				//down
				if(this.moveMap[col][row + 1]*side <= 0) attackMap[col][row + 1].push(value);
				//bottom right
				if(this.moveMap[col + 1][row + 1]*side <= 0) attackMap[col + 1][row + 1].push(value);
				//right
				if(this.moveMap[col + 1][row]*side <= 0) attackMap[col + 1][row].push(value);
				return;
			}
			else if(row == 7)// left top left up top right right
			{
				//left
				if(this.moveMap[col - 1][row]*side <= 0) attackMap[col - 1][row].push(value);
				//top left
				if(this.moveMap[col - 1][row - 1]*side <= 0) attackMap[col - 1][row - 1].push(value);
				//up
				if(this.moveMap[col][row - 1]*side <= 0) attackMap[col][row - 1].push(value);
				//top right
				if(this.moveMap[col + 1][row - 1]*side <= 0) attackMap[col + 1][row - 1].push(value);
				//right
				if(this.moveMap[col + 1][row]*side <= 0) attackMap[col + 1][row].push(value);
				return;
			}
			else
			{
				//up
				if(this.moveMap[col][row - 1]*side <= 0) attackMap[col][row - 1].push(value);
				//down
				if(this.moveMap[col][row + 1]*side <= 0) attackMap[col][row + 1].push(value);
				//right
				if(this.moveMap[col + 1][row]*side <= 0) attackMap[col + 1][row].push(value);
				//left
				if(this.moveMap[col - 1][row]*side <= 0) attackMap[col - 1][row].push(value);
				//bottom right
				if(this.moveMap[col + 1][row + 1]*side <= 0) attackMap[col + 1][row + 1].push(value);
				//top left
				if(this.moveMap[col - 1][row - 1]*side <= 0) attackMap[col - 1][row - 1].push(value);
				//top right
				if(this.moveMap[col + 1][row - 1]*side <= 0) attackMap[col + 1][row - 1].push(value);	
				//bottom left
				if(this.moveMap[col - 1][row + 1]*side <= 0) attackMap[col - 1][row + 1].push(value);
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
			if(row != 7)
			{
				if(col == 0)
				{
					if(attackMap[col + 1][row + 1].indexOf(value) == -1 && this.moveMap[col + 1][row + 1]*playerSide < 0) attackMap[col + 1][row + 1].push(value);
					return;
				}
				if(col == 7)
				{
					if(attackMap[col - 1][row + 1].indexOf(value) == -1 && this.moveMap[col - 1][row + 1]*playerSide < 0) attackMap[col - 1][row + 1].push(value);
					return;
				}
				else
				{
					if(attackMap[col - 1][row + 1].indexOf(value) == -1 && this.moveMap[col - 1][row + 1]*playerSide < 0) attackMap[col - 1][row + 1].push(value);
					if(attackMap[col + 1][row + 1].indexOf(value) == -1 && this.moveMap[col - 1][row + 1]*playerSide < 0) attackMap[col + 1][row + 1].push(value);
					return;
				}
			}
			
		}
		else
		{
			//player
			if(row != 0)
			{
				if(col == 0)
				{
					if(attackMap[col + 1][row - 1].indexOf(value) == -1 && this.moveMap[col + 1][row - 1]*playerSide < 0) attackMap[col + 1][row - 1].push(value);
					return;
				}
				if(col == 7)
				{
					if(attackMap[col - 1][row - 1].indexOf(value) == -1 && this.moveMap[col - 1][row - 1]*playerSide < 0) attackMap[col - 1][row - 1].push(value);
					return;
				}
				else
				{
					if(attackMap[col - 1][row - 1].indexOf(value) == -1 && this.moveMap[col - 1][row - 1]*playerSide < 0) attackMap[col - 1][row - 1].push(value);
					if(attackMap[col + 1][row - 1].indexOf(value) == -1 && this.moveMap[col + 1][row - 1]*playerSide < 0) attackMap[col + 1][row - 1].push(value);
					return;
				}	
			}
			
		}
	}
	this.findThePiece = function(value)
	{
		var piecePosition = [];
		for(var i = 0;i < 8;i++)
		{
			for(var j = 0;j < 8;j++)
			{
				if(this.moveMap[i][j] == value)
				{
					piecePosition.push(i);
					piecePosition.push(j);
					return piecePosition;
				}
			}
		}
	}
}