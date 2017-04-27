function Validator() {
	this.validateMove = function(prevCol, prevRow, clickedCol, clickedRow) {
		// First constraint is that the move follows the rule
		// CHECKED
		var value = recorder.moveMap[prevCol][prevRow];
		// Pawn is a little bit different, for it moves straight but attacks diagonally
		if (Math.abs(value) == PAWN_VALUE) {
			//opponent
			if (prevCol == clickedCol) {
				if (value * playerSide < 0) {
					if (clickedRow == 7)
						return CAPTURE_MOVE;
					if (prevRow == 1 && clickedRow == prevRow + 2)
						return VALID_MOVE;
					else if (clickedRow == prevRow + 1 )
						return VALID_MOVE;
				} else {
					if (clickedRow == 0)
						return CAPTURE_MOVE;
					if (prevRow == 6 && clickedRow == prevRow - 2)
						return VALID_MOVE;
					else if (clickedRow == prevRow - 1)
						return VALID_MOVE;
				}
			} else {
				// Opponent's pawn
				if (value * playerSide < 0) {
					if (value > 0) {
						if (recorder.whiteAttackMap[clickedCol][clickedRow].indexOf(value) != -1) {
							if (clickedRow == 7)
								return CAPTURE_MOVE;
							else
								return VALID_MOVE;
						}
					} else {
						if (recorder.blackAttackMap[clickedCol][clickedRow].indexOf(value) != -1) {
							if (clickedRow == 7)
								return CAPTURE_MOVE;
							else
								return VALID_MOVE;
						}	
					}
				} else {
				// Player's pawn
					if (value > 0) {
						if (recorder.whiteAttackMap[clickedCol][clickedRow].indexOf(value) != -1) {
							if (clickedRow == 0)
								return CAPTURE_MOVE;
							else
								return VALID_MOVE;
						}
					} else {
						if (recorder.blackAttackMap[clickedCol][clickedRow].indexOf(value) != -1) {
							if (clickedRow == 0)
								return CAPTURE_MOVE;
							else
								return VALID_MOVE;
						}
					}
				}
			}
		}
		// CHECKED
		else if (Math.abs(value) == KING_VALUE) {
			// Castling
			if (prevCol == 4) {
				if (clickedCol == prevCol - 2 || clickedCol == prevCol + 2)	{
					if (this.validateCastling(prevCol, prevRow, clickedCol, clickedRow))
						return CASTLING_MOVE;
					return INVALID_MOVE;
				}
			}
		}
		else if (Math.abs(value) == ROOK_VALUE) {
			if (prevCol != clickedCol && prevRow != clickedRow)
				return INVALID_MOVE;
		}
		else if (Math.abs(value) == BISHOP_VALUE) {
			if (prevCol - prevRow != clickedCol - clickedRow || prevCol + prevRow != clickedCol + clickedRow)
				return INVALID_MOVE;
		}
		else if (Math.abs(value) == QUEEN_VALUE) {
			if (prevCol != clickedCol || prevRow != clickedRow || prevCol - prevRow != clickedCol - clickedRow || prevCol + prevRow != clickedCol + clickedRow )
				return INVALiD_MOVE;
		}
			
		// CHECKED
		if (value < 0) {
			if (recorder.blackAttackMap[clickedCol][clickedRow].indexOf(value) != -1)
				return VALID_MOVE;
		} else {
			if (recorder.whiteAttackMap[clickedCol][clickedRow].indexOf(value) != -1)
				return VALID_MOVE;
		}
		// The second condition: the move cannot make the king in danger
		// bishop rook queen
		return INVALID_MOVE;
	}
	//CHECKED ! 
	this.detectCheck = function(prevCol, prevRow, clickedCol, clickedRow) {
		//each move made does put the king in checked situation ?
		var pieceValue = recorder.moveMap[prevCol][prevRow];
		var previousValueOfDestination = recorder.moveMap[clickedCol][clickedRow];
		var kingPostion; 
		var tempAttackMap = new Array(8);
		var isValid;

		for (var i = 0; i < 8; i++)
			tempAttackMap[i] = new Array(8);
		for (var i = 0; i < 8; i++)
			for (var j = 0; j < 8; j++)
				tempAttackMap[i][j] = [];
				
		if (Math.abs(pieceValue) == KING_VALUE) {
			if (pieceValue > 0)
				return (recorder.blackAttackMap[clickedCol][clickedRow].length == 0); 
			else
				return (recorder.whiteAttackMap[clickedCol][clickedRow].length == 0);
		}
		recorder.moveMap[prevCol][prevRow] = 0;
		recorder.moveMap[clickedCol][clickedRow] = pieceValue;
		//delete the previous position
		//update the attack map
		//forgot to reset the value back !!
		//create tempAttackMap
		
		if (pieceValue > 0) {
			//find the king position 
			kingPostion = recorder.findThePiece(KING_VALUE);
			//console.log(kingPostion);
			//update the attack map
			recorder.piecePositions[-ROOK_VALUE].forEach(function(coordinate) {
				recorder.calculateAttackMapForRook(-ROOK_VALUE, coordinate[0], coordinate[1], tempAttackMap, recorder.moveMap);
			});
			recorder.piecePositions[-BISHOP_VALUE].forEach(function(coordinate) {
				recorder.calculateAttackMapForBishop(-BISHOP_VALUE, coordinate[0], coordinate[1], tempAttackMap, recorder.moveMap);
			});
			recorder.piecePositions[-QUEEN_VALUE].forEach(function(coordinate) {
				recorder.calculateAttackMapForQueen(-QUEEN_VALUE, coordinate[0], coordinate[1], tempAttackMap, recorder.moveMap);
			});

		} else {
			kingPostion = recorder.findThsePiece(-KING_VALUE);
			recorder.piecePositions[ROOK_VALUE].forEach(function(coordinate) {
				recorder.calculateAttackMapForRook(ROOK_VALUE, coordinate[0], coordinate[1], tempAttackMap, recorder.moveMap);
			});
			recorder.piecePositions[BISHOP_VALUE].forEach(function(coordinate) {
				recorder.calculateAttackMapForBishop(BISHOP_VALUE, coordinate[0], coordinate[1], tempAttackMap, recorder.moveMap);
			});
			recorder.piecePositions[QUEEN_VALUE].forEach(function(coordinate) {
				recorder.calculateAttackMapForQueen(QUEEN_VALUE, coordinate[0], coordinate[1], tempAttackMap, recorder.moveMap);
			});
		}
		//console.log(kingPostion[0][0], kingPostion[0][1]);
		console.log(tempAttackMap);
		//fix the value back to the previous one
		recorder.moveMap[prevCol][prevRow] = pieceValue;
		recorder.moveMap[clickedCol][clickedRow] = previousValueOfDestination;
		//if the king is stay on the enemy attack map --> invalid
		return (tempAttackMap[kingPostion[0][0]][kingPostion[0][1]].length == 0);
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
