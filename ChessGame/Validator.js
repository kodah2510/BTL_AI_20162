function Validator()
{
	this.validateMove = function(prevCol, prevRow, clickedCol, clickedRow)
	{
		// First constraint is that the move follows the rule
		var value = recorder.moveMap[prevCol][prevRow];
		// Pawn is a little bit different, for it moves straight but attacks diagonally
		if (Math.abs(value) == PAWN_VALUE) {
			//opponent
			if (prevCol == clickedCol) {
				if (value * playerSide < 0) {
					if (clickedRow == 7) return CAPTURE_MOVE;
					if (prevRow == 1 && clickedRow == prevRow + 2) return VALID_MOVE;
					else if (clickedRow == prevRow + 1 ) return VALID_MOVE;
				} else {
					if (clickedRow == 0) return CAPTURE_MOVE;
					if (prevRow == 6 && clickedRow == prevRow - 2) return VALID_MOVE;
					else if (clickedRow == prevRow - 1) return VALID_MOVE;
				}
			}
			//else if (clickedRow == prevRow - 1 && recorder.moveMap[clickedCol][clickedRow] == 0) return 0;
		}
		//validate the castling move 
		else if (Math.abs(value) == KING_VALUE) {
			if (prevCol == 4) {
				if (clickedCol == prevCol - 2 || clickedCol == prevCol + 2)	{
					if (this.validateCastling(prevCol, prevRow, clickedCol, clickedRow)) return CASTLING_MOVE;
					return INVALID_MOVE;
				}
			}
		}
		if (value < 0)
		{
			if (recorder.blackAttackMap[clickedCol][clickedRow].indexOf(value) != -1) return VALID_MOVE;
		} else {
			if (recorder.whiteAttackMap[clickedCol][clickedRow].indexOf(value) != -1) return VALID_MOVE;
		}
		//second condition the move cannot make the king in danger
		//bishop rook queen
		return INVALID_MOVE;
	}
	this.detectCheck = function(prevCol, prevRow, clickedCol, clickedRow)
	{
		//each move made does put the king in checked situation ?
		var pieceValue = recorder.moveMap[prevCol][prevRow];
		var previousValueOfDestination = recorder.moveMap[clickedCol][clickedRow];
		var kingPostion; 
		var tempAttackMap = [];
		var isValid;
		//delete the previous position
		//update the attack map
		recorder.moveMap[prevCol][prevRow] = 0;
		recorder.moveMap[clickedCol][clickedRow] = pieceValue;
		//forgot to reset the value back !!
		//create tempAttackMap
		for (var i = 0; i < 8; i++)
			tempAttackMap[i] = new Array(8);
		for (var i = 0; i < 8;i++)
			for (var j = 0;j < 8; j++)
				tempAttackMap[i][j] = [];
		if (pieceValue > 0)
		{
			//find the king position 
			kingPostion = recorder.findThePiece(KING_VALUE);
			//dont have to do this way
			// for (var i = 0; i < 8; i++) {
			// 	for (var j = 0; j < 8; j++) {
			// 		if (recorder.moveMap[i][j] == -ROOK_VALUE)
			// 			recorder.calculateAttackMapForRook(-ROOK_VALUE, i, j, tempAttackMap, BLACK_SIDE);
			// 		else if (recorder.moveMap[i][j] == -BISHOP_VALUE)
			// 			recorder.calculateAttackMapForBishop(-BISHOP_VALUE, i, j, tempAttackMap, BLACK_SIDE);
			// 		else if (recorder.moveMap[i][j] == -QUEEN_VALUE)
			// 			recorder.calculateAttackMapForQueen(-QUEEN_VALUE, i, j, tempAttackMap, BLACK_SIDE);
			// 	}
			// }
			//update the attack map
			recorder.piecePositions[-ROOK_VALUE].foreach(function(coordinate) {
				recorder.calculateAttackMapForRook(-ROOK_VALUE, coordinate[0], coordinate[1], tempAttackMap, BLACK_SIDE);
			});
			recorder.piecePositions[-BISHOP_VALUE].foreach(function(coordinate) {
				recorder.calculateAttackMapForRook(-BISHOP_VALUE, coordinate[0], coordinate[1], tempAttackMap, BLACK_SIDE);
			});
			recorder.piecePositions[-QUEEN_VALUE].foreach(function(coordinate) {
				recorder.calculateAttackMapForRook(-QUEEN_VALUE, coordinate[0], coordinate[1], tempAttackMap, BLACK_SIDE);
			});

		} else {
			kingPostion = recorder.findThePiece(-KING_VALUE);
			// for (var i = 0; i < 8; i++) {
			// 	for (var j = 0; j < 8; j++) {
			// 		//rook queen bishop
			// 		//check whether the king stayed on attacked grid or not 
			// 		//concentrate on Bishop Rook Queen 
			// 		if (recorder.moveMap[i][j] == ROOK_VALUE)
			// 			recorder.calculateAttackMapForRook(ROOK_VALUE, i, j, tempAttackMap, WHITE_SIDE);
			// 		else if (recorder.moveMap[i][j] == BISHOP_VALUE)
			// 			recorder.calculateAttackMapForBishop(BISHOP_VALUE, i, j, tempAttackMap, WHITE_SIDE);
			// 		else if (recorder.moveMap[i][j] == QUEEN_SIDE)
			// 			recorder.calculateAttackMapForQueen(QUEEN_VALUE, i, j, tempAttackMap, WHITE_SIDE);
			// 	}
			// }
			recorder.piecePositions[ROOK_VALUE].foreach(function(coordinate) {
				recorder.calculateAttackMapForRook(-ROOK_VALUE, coordinate[0], coordinate[1], tempAttackMap, WHITE_SIDE);
			});
			recorder.piecePositions[BISHOP_VALUE].foreach(function(coordinate) {
				recorder.calculateAttackMapForRook(-BISHOP_VALUE, coordinate[0], coordinate[1], tempAttackMap, WHITE_SIDE);
			});
			recorder.piecePositions[QUEEN_VALUE].foreach(function(coordinate) {
				recorder.calculateAttackMapForRook(QUEEN_VALUE, coordinate[0], coordinate[1], tempAttackMap, WHITE_SIDE);
			});
		}
		
		//fix the value back to the previous one
		recorder.moveMap[prevCol][prevRow] = pieceValue;
		recorder.moveMap[clickedCol][clickedRow] = previousValueOfDestination;
		return (tempAttackMap[kingPostion[0]][kingPostion[1]].length == 0);
		
	}
	//Đức viết cái này nhé
	this.validateCastling = function(prevCol, prevRow, clickedCol, clickedRow) {
		//if king has moved ?
		//search in the moveRecord for the king's move history
		var value = recorder.moveMap[prevCol][prevRow];
		var attackMap;
		(value > 0) ? attackMap = recorder.blackAttackMap: attackMap = recorder.whiteAttackMap;
		for (var record in recorder.moveRecord)
			if (record[0] == KING_VALUE || record[0] == ROOK_VALUE)
				return false;
		//the squares between king and rook are attacked by any pieces ?
		if (clickedCol == prevCol - 2) {
			//queen-side castling
			for (var i = prevCol; i >= 0; i--)
				if (attackMap[i][prevRow].length != 0) return false;
		} else if (clickedCol == prevCol + 2) {
			//king-side castling
			for (var i = prevCol; i < 8 ; i++)
				if (attackMap[i][prevRow].length != 0) return false;
		}
		return true;
	}
	//call only when the king is checked
	this.validateCheckmate = function()
	{
		
	}
}