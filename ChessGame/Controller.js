function Controller()
{
	this.grid = [];
	this.init = function()
	{
		for(var i = 0;i < 8;i++)
		{
			this.grid[i] = new Array(8);
		}
		for(var i = 0; i < 8; i++)
		{
			for(var j = 0;j < 8; j++)
			{
				this.grid[i][j] = new Grid(i,j);//[col,row]
			}
		}
	}
	this.render = function()
	{
		for(var i = 0 ; i < 8; i++)
		{
			for(var j = 0; j < 8; j++)
			{
				this.grid[i][j].show();
			}
		}
	}
	this.placeTheChessman = function(sprite,col,row,value)
	{
		this.grid[col][row].sprite = sprite;
		recorder.updateMoveMap(value,null,null,col,row);
	}
	this.createGameBoard = function()
	{
		var playersConfirmation = confirm("White or Black (OK/CANCEL)");
		if(!playersConfirmation)
		{
			this.placeTheChessman(blackRook,1,3);
			/*
			placeTheChessman(blackKnight,1,7);
			placeTheChessman(blackBishop,2,7);
			placeTheChessman(blackQueen,3,7);
			placeTheChessman(blackKing,4,7);
			placeTheChessman(blackBishop,5,7);
			placeTheChessman(blackKnight,6,7);
			placeTheChessman(blackRook,7,7);
			
			for(var i = 0; i < 8; i++)
			{
				placeTheChessman(blackPawn,i,6);
			}
			*/
			this.placeTheChessman(whiteKing,7,3)
			this.placeTheChessman(whiteRook,6,3);
			/*
			placeTheChessman(whiteKnight,1,0);
			placeTheChessman(whiteBishop,2,0);
			placeTheChessman(whiteQueen,3,0);
			placeTheChessman(whiteKing,4,0);
			placeTheChessman(whiteBishop,5,0);
			placeTheChessman(whiteKnight,6,0);
			placeTheChessman(whiteRook,7,0);
			
			for(var i = 0; i < 8; i++)
			{
				placeTheChessman(whitePawn,i,1);
			}
			*/
			return -1;  
		}
		else
		{
			this.placeTheChessman(whiteRook,0,7,1);
			/*
			placeTheChessman(whiteKnight,1,7);
			placeTheChessman(whiteBishop,2,7);
			placeTheChessman(whiteQueen,3,7);
			placeTheChessman(whiteKing,4,7);
			placeTheChessman(whiteBishop,5,7);
			placeTheChessman(whiteKnight,6,7);
			placeTheChessman(whiteRook,7,7);
			
			for(var i = 0; i < 8; i++)
			{
				placeTheChessman(whitePawn,i,6);
			}*/
			
			this.placeTheChessman(blackRook,0,0,-1);
			/*
			placeTheChessman(blackKnight,1,0);
			placeTheChessman(blackBishop,2,0);
			placeTheChessman(blackQueen,3,0);
			placeTheChessman(blackKing,4,0);
			placeTheChessman(blackBishop,5,0);
			placeTheChessman(blackKnight,6,0);
			placeTheChessman(blackRook,7,0);
			
			for(var i = 0; i < 8; i++)
			{
				placeTheChessman(blackPawn,i,1);
			}
			*/
			return 1;
		}
	}
	this.moveTheChessman = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		var prevChessmanSprite = this.grid[prevCol][prevRow].sprite;
		this.grid[clickedCol][clickedRow].sprite = prevChessmanSprite;
		this.grid[prevCol][prevRow].sprite = null;
		recorder.updateMoveMap(recorder.moveMap[prevCol][prevRow],prevCol,prevRow,clickedCol,clickedRow);	
	}
	
}