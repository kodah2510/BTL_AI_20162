function Controller() {
	// Game board
	this.grid = [];
	for (var i = 0; i < 8; i++)
		this.grid[i] = new Array(8);
	for (var i = 0; i < 8; i++)
		for(var j = 0;j < 8; j++)
			this.grid[i][j] = new Grid(i, j); //[col, row]
	// Method to show the game board in browser
	this.render = function() {
		for(var i = 0 ; i < 8; i++)
			for(var j = 0; j < 8; j++)
				this.grid[i][j].show();
	}
	// Method to place the chessmen on the board
	this.placeTheChessman = function(sprite, col, row, value) {
		if (recorder.moveMap[col][row] == 0) {
			this.grid[col][row].sprite = sprite;
			//increase the pieceCount
			(value > 0) ? recorder.pieceCount[value][0]++ : recorder.pieceCount[-value][1]++;
			recorder.updateMoveMap(value, null, null, col, row);
		}
	}
	// Method to initilise a new game
	this.createGameBoard = function() {
		// Choose black or white
		if (playerSide == BLACK_SIDE) { 
			this.placeTheChessman(blackRookSprite, 1, 3, -ROOK_VALUE);
			this.placeTheChessman(blackKnightSprite, 1, 7, -KNIGHT_VALUE);
			this.placeTheChessman(blackBishopSprite, 2, 7, -BISHOP_VALUE);
			this.placeTheChessman(blackQueenSprite, 3, 7, -QUEEN_VALUE);
			this.placeTheChessman(blackKingSprite, 4, 7 ,-KING_VALUE);
			this.placeTheChessman(blackBishopSprite, 5, 7, -BISHOP_VALUE);
			this.placeTheChessman(blackKnightSprite, 6, 7, -KNIGHT_VALUE);
			this.placeTheChessman(blackRookSprite, 7, 7, -ROOK_VALUE);
			// Place 8 Pawns
			for(var i = 0; i < 8; i++)
				this.placeTheChessman(blackPawnSprite, i, 6, -PAWN_VALUE);

			this.placeTheChessman(whiteRookSprite, 6, 3, KNIGHT_VALUE);
			this.placeTheChessman(whiteKnightSprite, 1, 0, KNIGHT_VALUE);
			this.placeTheChessman(whiteBishopSprite, 2, 0, BISHOP_VALUE);
			this.placeTheChessman(whiteQueenSprite, 3, 0, QUEEN_VALUE);
			this.placeTheChessman(whiteKingSprite, 4, 0, KING_VALUE);
			this.placeTheChessman(whiteBishopSprite, 5, 0, BISHOP_VALUE);
			this.placeTheChessman(whiteKnightSprite, 6, 0, KNIGHT_VALUE);
			this.placeTheChessman(whiteRookSprite, 7, 0, ROOK_VALUE);
			// Place 8 Pawns
			for(var i = 0; i < 8; i++)
				this.placeTheChessman(whitePawnSprite, i, 1, PAWN_VALUE);
		} else { // otherwise
			this.placeTheChessman(whiteRookSprite, 0, 7, ROOK_VALUE);
			this.placeTheChessman(whiteKnightSprite, 1, 7, KNIGHT_VALUE);
			this.placeTheChessman(whiteBishopSprite, 2, 7, BISHOP_VALUE);
			this.placeTheChessman(whiteQueenSprite, 3, 7, QUEEN_VALUE);
			this.placeTheChessman(whiteKingSprite, 4, 7, KING_VALUE);
			this.placeTheChessman(whiteBishopSprite, 5, 7, BISHOP_VALUE);
			this.placeTheChessman(whiteKnightSprite, 6, 7, KNIGHT_VALUE);
			this.placeTheChessman(whiteRookSprite, 7, 7, ROOK_VALUE);
			// Place 8 Pawns
			for(var i = 0; i < 8; i++)
				this.placeTheChessman(whitePawnSprite, i, 6, PAWN_VALUE);
			
			this.placeTheChessman(blackRookSprite, 0, 0, -ROOK_VALUE);
			this.placeTheChessman(blackKnightSprite, 1, 0, -KNIGHT_VALUE);
			this.placeTheChessman(blackBishopSprite, 2, 0,-BISHOP_VALUE);
			this.placeTheChessman(blackQueenSprite, 3, 0, -QUEEN_VALUE);
			this.placeTheChessman(blackKingSprite, 4, 0, -KING_VALUE);
			this.placeTheChessman(blackBishopSprite, 5, 0, -BISHOP_VALUE);
			this.placeTheChessman(blackKnightSprite, 6, 0, -KNIGHT_VALUE);
			this.placeTheChessman(blackRookSprite, 7, 0, -ROOK_VALUE);
			// Place 8 Pawns
			for(var i = 0; i < 8; i++)
				this.placeTheChessman(blackPawnSprite, i, 1, -PAWN_VALUE);  
		}
	}
	//Di chuyển quân cờ
	this.moveTheChessman = function(prevCol, prevRow, clickedCol, clickedRow, specialMove) {
		//đổi sprite của ô cờ 
		var prevChessmanSprite = this.grid[prevCol][prevRow].sprite;
		this.grid[clickedCol][clickedRow].sprite = prevChessmanSprite;
		this.grid[prevCol][prevRow].sprite = null;
		//cập nhật recorder
		recorder.updateMoveMap(recorder.moveMap[prevCol][prevRow], prevCol, prevRow, clickedCol, clickedRow);
		recorder.updateAttackMap();		
		if(specialMove == null) recorder.updateMoveRecord(prevCol, prevRow, clickedCol, clickedRow);
		else if(specialMove == CASTLING_MOVE) {
			if(Math.abs(recorder.moveMap[clickedCol][clickedRow]) == ROOK_VALUE) return;
			recorder.updateMoveRecord(null, null, null, null, recorder.moveRecord, 
			[recorder.moveMap[prevCol][prevRow], -CASTLING_MOVE, clickedCol*10 + clickedRow]);
		}
	}
	// Method that proceeds castling if the move is valid
	// CHECKED
	this.castling = function(prevCol, prevRow, clickedCol, clickedRow) {
		var rookCol;
		//move the king to ...
		this.moveTheChessman(prevCol, prevRow, clickedCol, clickedRow, CASTLING_MOVE);
		//move the rook...
		//update the game state
		if (clickedCol == prevCol - 2) {
			rookCol = 0
			this.moveTheChessman(rookCol, prevRow, rookCol + 3, prevRow, CASTLING_MOVE);
		} else if (clickedCol == prevCol + 2) {
			rookCol = 7;
			this.moveTheChessman(rookCol, prevRow, rookCol - 2, prevRow, CASTLING_MOVE);
		}
		recorder.updateAttackMap();		
	}

	//Promoting a pawn when reaching the end of the board 
	//CHECKED
	this.capture = function(prevCol,  prevRow,  clickedCol,  clickedRow) {
		//show the window for player to choose which piece to capture
		//replace sprite
		//update game states
		$('#myModal').modal();
		(playerSide == WHITE_SIDE) ? $('#blackSide').toggle() : $('#whiteSide').toggle();
		$('#modalBody').click(function(event) {
			var pieceValue
			if ($(event.target).is('#whiteRook') || $(event.target).is("#whiteRookImg")) pieceValue = ROOK_VALUE;
			else if ($(event.target).is('#whiteKnight') || $(event.target).is("#whiteKnightImg")) pieceValue = KNIGHT_VALUE;
			else if ($(event.target).is('#whiteBishop') || $(event.target).is("#whiteBishopImg")) pieceValue = BISHOP_VALUE;
			else if ($(event.target).is('#whiteQueen') || $(event.target).is("#whiteQueenImg")) pieceValue = QUEEN_VALUE;
			else if ($(event.target).is('#blackRook') || $(event.target).is("#blackRookImg")) pieceValue = -ROOK_VALUE;
			else if ($(event.target).is('#blackKnight') || $(event.target).is("#blackKnightImg"))pieceValue = -KNIGHT_VALUE;
			else if ($(event.target).is('#blackBishop') || $(event.target).is("#blackBishopImg")) pieceValue = -BISHOP_VALUE;
			else if ($(event.target).is('#blackQueen') || $(event.target).is("#blackQueenImg")) pieceValue = -QUEEN_VALUE;
			$("#myModal").modal('toggle');
			var newSprite;
			switch (pieceValue) {
				case ROOK_VALUE: newSprite = whiteRookSprite; break;
				case KNIGHT_VALUE:newSprite = whiteKnightSprite;break;
				case BISHOP_VALUE:newSprite = whiteBishopSprite;break;
				case QUEEN_VALUE:newSprite = whiteQueenSprite;break;
				case -ROOK_VALUE: newSprite = blackRookSprite;break;
				case -KNIGHT_VALUE:newSprite = blackKnightSprite;break;
				case -BISHOP_VALUE:newSprite = blackBishopSprite;break;
				case -QUEEN_VALUE:newSprite = blackQueenSprite;break;
			}
			controller.grid[prevCol][prevRow].sprite = null;
			recorder.removePiece(recorder.moveMap[prevCol][prevRow], prevCol, prevRow);
			if(recorder.moveMap[clickedCol][clickedRow] != 0) {
				controller.grid[clickedCol][clickedRow].sprite = null;
				recorder.removePiece(recorder.moveMap[clickedCol][clickedRow], clickedCol, clickedRow);
			}
			controller.placeTheChessman(newSprite,clickedCol, clickedRow, pieceValue);
			//record capture move is different than nomral move 
			recorder.moveRecord.push([pieceValue, -PROMOTE_MOVE ,clickedCol*10 + clickedRow]);
			recorder.updateAttackMap();
			prevCol = null; prevRow = null;
			//replace the pawn with the new piece
			//update piecePosition
			//update pieceCount
			//update the record too
			isPlayerTurn = false;
			redraw();
		});
	}
}
