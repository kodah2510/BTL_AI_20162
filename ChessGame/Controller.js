function Controller()
{
	this.grid = [];

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
		if(recorder.moveMap[col][row] == 0)
		{
			this.grid[col][row].sprite = sprite;
			recorder.updateMoveMap(value,null,null,col,row);
		}
	}
	this.createGameBoard = function()
	{
		/*
		var playersConfirmation = confirm("White or Black (OK/CANCEL)");
		if(!playersConfirmation)
		{
			this.placeTheChessman(blackRookSprite,1,3,BLACK_ROOK_VALUE);
			this.placeTheChessman(blackKnightSprite,1,7,BLACK_KNIGHT_VALUE);
			this.placeTheChessman(blackBishopSprite,2,7,BLACK_BISHOP_VALUE);
			this.placeTheChessman(blackQueenSprite,3,7,BLACK_QUEEN_VALUE);
			this.placeTheChessman(blackKingSprite,4,7,BLACK_KING_VALUE);
			this.placeTheChessman(blackBishopSprite,5,7,BLACK_BISHOP_VALUE);
			this.placeTheChessman(blackKnightSprite,6,7,BLACK_KNIGHT_VALUE);
			this.placeTheChessman(blackRookSprite,7,7,BLACK_ROOK_VALUE);
			
			for(var i = 0; i < 8; i++)
			{
				this.placeTheChessman(blackPawnSprite,i,6,BLACK_PAWN_VALUE);
			}
			this.placeTheChessman(whiteRookSprite,6,3,WHITE_KNIGHT_VALUE);
			this.placeTheChessman(whiteKnightSprite,1,0,WHITE_KNIGHT_VALUE);
			this.placeTheChessman(whiteBishopSprite,2,0,WHITE_BISHOP_VALUE);
			this.placeTheChessman(whiteQueenSprite,3,0,WHITE_QUEEN_VALUE);
			this.placeTheChessman(whiteKingSprite,4,0,WHITE_KING_VALUE);
			this.placeTheChessman(whiteBishopSprite,5,0,WHITE_BISHOP_VALUE);
			this.placeTheChessman(whiteKnightSprite,6,0,WHITE_KNIGHT_VALUE);
			this.placeTheChessman(whiteRookSprite,7,0,WHITE_ROOK_VALUE);
			
			for(var i = 0; i < 8; i++)
			{
				this.placeTheChessman(whitePawnSprite,i,1,WHITE_PAWN_VALUE);
			}
			return -1;  
		}
		else
		{
			this.placeTheChessman(whiteRookSprite,0,7,WHITE_ROOK_VALUE);
			this.placeTheChessman(whiteKnightSprite,1,7,WHITE_ROOK_VALUE);
			this.placeTheChessman(whiteBishopSprite,2,7,WHITE_ROOK_VALUE);
			this.placeTheChessman(whiteQueenSprite,3,7,WHITE_ROOK_VALUE);
			this.placeTheChessman(whiteKingSprite,4,7,WHITE_ROOK_VALUE);
			this.placeTheChessman(whiteBishopSprite,5,7,WHITE_ROOK_VALUE);
			this.placeTheChessman(whiteKnightSprite,6,7,WHITE_ROOK_VALUE);
			this.placeTheChessman(whiteRookSprite,7,7,WHITE_ROOK_VALUE);
			
			for(var i = 0; i < 8; i++)
			{
				this.placeTheChessman(whitePawnSprite,i,6,WHITE_PAWN_VALUE);
			}
			
			this.placeTheChessman(blackRookSprite,0,0,BLACK_ROOK_VALUE);
			this.placeTheChessman(blackKnightSprite,1,0,BLACK_KNIGHT_VALUE);
			this.placeTheChessman(blackBishopSprite,2,0,BLACK_BISHOP_VALUE);
			this.placeTheChessman(blackQueenSprite,3,0,BLACK_QUEEN_VALUE);
			this.placeTheChessman(blackKingSprite,4,0,BLACK_KING_VALUE);
			this.placeTheChessman(blackBishopSprite,5,0,BLACK_BISHOP_VALUE);
			this.placeTheChessman(blackKnightSprite,6,0,BLACK_KNIGHT_VALUE);
			this.placeTheChessman(blackRookSprite,7,0,BLACK_ROOK_VALUE);
			
			for(var i = 0; i < 8; i++)
			{
				this.placeTheChessman(blackPawnSprite,i,1,BLACK_PAWN_VALUE);
			}
			return 1;
		}
		*/
	}
	this.moveTheChessman = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		//swap the sprite 
		var prevChessmanSprite = this.grid[prevCol][prevRow].sprite;
		this.grid[clickedCol][clickedRow].sprite = prevChessmanSprite;
		this.grid[prevCol][prevRow].sprite = null;
		//update game state
		recorder.updateMoveMap(recorder.moveMap[prevCol][prevRow],prevCol,prevRow,clickedCol,clickedRow);
		recorder.updateMoveRecord(prevCol,prevRow,clickedCol,clickedRow);
		recorder.updateAttackMap();		
	}
	//proceed castling if it's valid
	this.castling = function(prevCol,prevRow,clickedCol,clickedRow)
	{
		var rookCol;
		//move the king to ...
		this.moveTheChessman(prevCol,prevRow,clickedCol,clickedRow);
		recorder.updateMoveMap(recorder.moveMap[prevCol][prevRow],prevCol,prevRow,clickedCol,clickedRow);
		recorder.updateMoveRecord(prevCol,prevRow,clickedCol,clickedRow);
		//move the rook...
		//update the game state
		if(clickedCol == prevCol - 2)
		{
			rookCol = 0
			this.moveTheChessman(rookCol,prevRow,rookCol + 3,prevRow);
			recorder.updateMoveMap(recorder.moveMap[rookCol][prevRow],rookCol,prevRow,rookCol + 3,prevRow);
			recorder.updateMoveRecord(rookCol,prevRow,rookCol + 2,prevRow);
		}
		else if(clickedCol == prevCol + 2)
		{
			rookCol = 7;
			this.moveTheChessman(rookCol,prevRow,rookCol - 2,prevRow);
			recorder.updateMoveMap(recorder.moveMap[rookCol][prevRow],rookCol,prevRow,rookCol - 2,prevRow);
			recorder.updateMoveRecord(rookCol,prevRow,rookCol - 2,prevRow);
		}
		recorder.updateAttackMap();		
	}
	//when the pawn reach at the end of the board 
	this.capture = function(prevCol, prevRow, clickedCol, clickedRow)
	{
		//show the window for player to choose which piece to capture
		
		//replace sprite
		
		//update game states
		$('#myModal').modal();
		(playerSide == WHITE_SIDE) ? $('#blackSide').toggle() : $('#whiteSide').toggle();
		$('#modalBody').click(function(event)
		{
			var pieceValue
			if($(event.target).is('#whiteRook') 		|| $(event.target).is("#whiteRookImg")) 
				pieceValue = ROOK_VALUE;
			else if($(event.target).is('#whiteKnight') 	|| $(event.target).is("#whiteKnightImg")) 
				pieceValue = KNIGHT_VALUE;
			else if($(event.target).is('#whiteBishop') 	|| $(event.target).is("#whiteBishopImg")) 
				pieceValue = BISHOP_VALUE;
			else if($(event.target).is('#whiteQueen') 	|| $(event.target).is("#whiteQueenImg")) 
				pieceValue = QUEEN_VALUE;
			else if($(event.target).is('#blackRook') 	|| $(event.target).is("#blackRookImg")) 
				pieceValue = -ROOK_VALUE;
			else if($(event.target).is('#blackKnight') 	|| $(event.target).is("#blackKnightImg")) 
				pieceValue = -KNIGHT_VALUE;
			else if($(event.target).is('#blackBishop') 	|| $(event.target).is("#blackBishopImg")) 
				pieceValue = -BISHOP_VALUE;
			else if($(event.target).is('#blackQueen') 	|| $(event.target).is("#blackQueenImg")) 
				pieceValue = -QUEEN_VALUE;
			
			$("#myModal").modal('toggle');
			var newSprite;
			switch(pieceValue)
			{
				case ROOK_VALUE:
					newSprite = whiteRookSprite;
					break;
				case KNIGHT_VALUE:
					newSprite = whiteKnightSprite;
					break;
				case BISHOP_VALUE:
					newSprite = whiteBishopSprite;
					break;
				case QUEEN_VALUE:
					newSprite = whiteQueenSprite;
					break;
				case -ROOK_VALUE:
					newSprite = blackRookSprite;
					break;
				case -KNIGHT_VALUE:
					newSprite = blackKnightSprite;
					break;
				case -BISHOP_VALUE:
					newSprite = blackBishopSprite;
					break;
				case -QUEEN_VALUE:
					newSprite = blackQueenSprite;
					break;
			}
			recorder.moveMap[prevCol][prevRow] = pieceValue;
			controller.grid[prevCol][prevRow].sprite = null;
			controller.grid[prevCol][prevRow].sprite = newSprite;
			controller.moveTheChessman(prevCol,prevRow,clickedCol,clickedRow);
			redraw();
				
		});
		
	
	}
}