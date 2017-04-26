//denote Rook Knight Bishop Queen King Pawn 
//		 1	  2      3      4     5    6
//whiteSide 1
//blackSide -1
//Example blackRook = -1 whiteQueen = 4 blackKing = -5
function Recorder() {
	this.pieceCount = [];
	this.moveRecord = [];
	this.whiteAttackMap	= [];
	this.blackAttackMap = [];
	this.moveMap = [];
	// pieceCount, piecePositions are for the evaluator
	// the the 0 index in pieceCount is for player, the 1 index is for the opponent
	//							Rook:2, Knight:2, Bishop:3, Queen:1, King:1, Pawn:8
	this.pieceCount = {1:[0, 0], 2:[0, 0], 3:[0, 0], 4:[0, 0], 5:[0, 0], 6:[0, 0]};
	//need to fix moveMap
	//new moveMap will only keep the coordinate of each piece
	this.piecePositions = {"1":[], "2":[], "3":[], "4":[], "5":[], "6":[], "-1":[], "-2":[], "-3":[], "-4":[], "-5":[], "-6":[] };
	//initialize the attack maps for both sides and the move map
	for (var i = 0; i < 8; i++) {
		this.moveMap[i] = new Array(8);
		this.whiteAttackMap[i] = new Array(8);
		this.blackAttackMap[i] = new Array(8);
	}
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			this.moveMap[i][j] = 0;
			this.whiteAttackMap[i][j] = [];
			this.blackAttackMap[i][j] = [];
		}
	}
	this.removePiece = function(value, currentCol, currentRow) {
		this.moveMap[currentCol][currentRow] = 0;
		(value > 0) ? this.pieceCount[value][0]-- : this.pieceCount[-value][1]--;
		for (var index in this.piecePositions[value])
			if (this.piecePositions[value][index][0] == currentCol && this.piecePositions[value][index][1] == currentRow)
				this.piecePositions[value].splice(index, 1);
	}
	//need to fix this one too related to moveMap
	this.calculateAttackMap = function()
	{
		// attack map now will base on the piece position to process
		var recorder = this;
		var pieceValues = Object.keys(this.piecePositions);
		//for (pieceValue in this.piecePositions) 
		pieceValues.forEach(function(pieceValue) {
			if (pieceValue > 0)
				recorder.piecePositions[pieceValue].forEach(function(coordinate) {
					recorder.calculateWhiteAttackMap(pieceValue, coordinate[0], coordinate[1]);
				});
			else
				recorder.piecePositions[pieceValue].forEach(function(coordinate) {
					recorder.calculateBlackAttackMap(pieceValue, coordinate[0], coordinate[1]);
				});
		});
	}
	//the attack map is updated after every move 	
	this.updateAttackMap = function() {
		//add the move to moveRecord
		//recalculate the moveMap and attackMap
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				this.whiteAttackMap[i][j] = [];
				this.blackAttackMap[i][j] = [];
			}
		}
		this.calculateAttackMap();
	}
	this.calculateBlackAttackMap = function(value, col, row) {
		var pieceValue = parseInt(value);
		switch (pieceValue) {
			case -ROOK_VALUE: 	this.calculateAttackMapForRook(pieceValue, col, row, this.blackAttackMap); break;
			case -KNIGHT_VALUE: this.calculateAttackMapForKnight(pieceValue, col, row, this.blackAttackMap); break;
			case -BISHOP_VALUE: this.calculateAttackMapForBishop(pieceValue, col, row, this.blackAttackMap); break;
			case -QUEEN_VALUE: 	this.calculateAttackMapForQueen(pieceValue, col, row, this.blackAttackMap); break;
			case -KING_VALUE: 	this.calculateAttackMapForKing(pieceValue, col, row, this.blackAttackMap); break;
			case -PAWN_VALUE: 	this.calculateAttackMapForPawn(pieceValue, col, row, this.blackAttackMap); break;
		}
	}
	this.calculateWhiteAttackMap = function(value, col, row) {
		var pieceValue = parseInt(value);
		switch (pieceValue)	{
			case ROOK_VALUE: 	this.calculateAttackMapForRook(pieceValue, col, row, this.whiteAttackMap); break;
			case KNIGHT_VALUE: 	this.calculateAttackMapForKnight(pieceValue, col, row, this.whiteAttackMap); break;
			case BISHOP_VALUE: 	this.calculateAttackMapForBishop(pieceValue, col, row, this.whiteAttackMap); break;
			case QUEEN_VALUE: 	this.calculateAttackMapForQueen(pieceValue, col, row, this.whiteAttackMap); break;
			case KING_VALUE: 	this.calculateAttackMapForKing(pieceValue, col, row, this.whiteAttackMap); break;
			case PAWN_VALUE: 	this.calculateAttackMapForPawn(pieceValue, col, row, this.whiteAttackMap); break;
		}
	}
	
	this.updateMoveMap = function(value, prevCol, prevRow, clickedCol, clickedRow) {
		//update the piecePosition first
		this.updatePiecePositions(value, prevCol, prevRow, clickedCol, clickedRow);
		//update the moveMap
		if (prevCol != null && prevRow != null)
			this.moveMap[prevCol][prevRow] = 0;
		this.moveMap[clickedCol][clickedRow] = value;
	}
	//update the coordinate of each piece 
	this.updatePiecePositions = function(value, prevCol, prevRow, clickedCol, clickedRow) {
		//place the piece
		if (prevCol == null) this.piecePositions[value].push([clickedCol, clickedRow]);
		//move the piece
		else {
			if (this.moveMap[clickedCol][clickedRow] == 0) {
				this.piecePositions[value].forEach(function(array) {
					if (array[0] == prevCol && array[1] == prevRow) {
						array[0] = clickedCol;
						array[1] = clickedRow;
					}
				})
			} else {
				//when a piece takes down another
				//update the position of that piece
				//delete taken down piece's position
				this.removePiece(this.moveMap[clickedCol][clickedRow], clickedCol, clickedRow);
				//replace with the attack piece
				this.piecePositions[value].forEach(function(array) {
					if (array[0] == prevCol && array[1] == prevRow) {
						array[0] = clickedCol;
						array[1] = clickedRow;
					}
				})
			}
		}
	}
	this.updateMoveRecord = function(prevCol,prevRow,clickedCol,clickedRow) {
		this.moveRecord.push([this.moveMap[clickedCol][clickedRow],prevCol*10+prevRow,clickedCol*10+clickedRow]);
	}
	//CHECKED
	this.calculateAttackMapForRook = function(value, col, row, attackMap) {
		//need to fix this one 
		//only the attack range is limited at the first opponent piece it met 
		if (col != 0) {
			for (var i = col - 1; i >= 0 ; i--) {
				if (attackMap[i][row].indexOf(value) == -1) {
					if (this.moveMap[i][row] != 0) {
						attackMap[i][row].push(value);
						break;
					}
					else attackMap[i][row].push(value);
				}					
			}
		}
		if (col != 7) {
			for (var i = col + 1; i < 8; i++) {
				if (attackMap[i][row].indexOf(value) == -1) {
					if (this.moveMap[i][row] != 0) {
						attackMap[i][row].push(value);
						break;
					}
					else attackMap[i][row].push(value);
				}					
			}
		}
		if (row != 0) {
			for (var i = row - 1; i >= 0; i--) {
				if (attackMap[col][i].indexOf(value) == -1) {
					if (this.moveMap[col][i] != 0) {
						attackMap[col][i].push(value);
						break;
					}
					else attackMap[col][i].push(value);
				}					
			}
		}
		if (row != 7) {
			for (var i = row + 1; i < 8; i++)
			{
				if (attackMap[col][i].indexOf(value) == -1)
				{
					if (this.moveMap[col][i] != 0)
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
	//CHECKED !
	this.calculateAttackMapForKnight = function(value, col, row, attackMap)
	{
		if ((col + 1 <= 7 && row - 2 >= 0) && attackMap[col + 1][row - 2].indexOf(value) == -1 )
			attackMap[col + 1][row - 2].push(value);
		if ((col - 1 >= 0 && row - 2 >= 0) && attackMap[col - 1][row - 2].indexOf(value) == -1 )
			attackMap[col - 1][row - 2].push(value);
		if ((col + 1 <= 7 && row + 2 <= 7) && attackMap[col + 1][row + 2].indexOf(value) == -1 )
			attackMap[col + 1][row + 2].push(value);
		if ((col - 1 >= 0 && row + 2 <= 7) && attackMap[col - 1][row + 2].indexOf(value) == -1)
			attackMap[col - 1][row + 2].push(value);
		if ((col + 2 <= 7 && row - 1 >= 0) && attackMap[col + 2][row - 1].indexOf(value) == -1)
			attackMap[col + 2][row - 1].push(value);
		if (col - 2 >= 0 && row - 1 >= 0 && attackMap[col - 2][row - 1].indexOf(value) == -1)
			attackMap[col - 2][row - 1].push(value);
		if (col + 2 <= 7 && row + 1 <= 7 && attackMap[col + 2][row + 1].indexOf(value) == -1)
			attackMap[col + 2][row + 1].push(value);
		if (col - 2 >= 0 && row + 1 >= 0 && attackMap[col - 2][row + 1].indexOf(value) == -1)
			attackMap[col - 2][row + 1].push(value);
	}
	//CHECKED

	this.calculateAttackMapForBishop = function(value, col, row, attackMap)
	{
		var tlbrValue = col - row;//top-left ->> bottom-right
		var trblValue = col + row;//top-right ->> bottom-left
		if (col != 0) {
			for (var i = col - 1; i >= 0 && i - tlbrValue >= 0; i--) {
				//top-left
				currentRow = i - tlbrValue;
				if (attackMap[i][currentRow].indexOf(value) == -1) {
					if (this.moveMap[i][currentRow] != 0) {
						attackMap[i][currentRow].push(value);	
						break;
					}
					else attackMap[i][currentRow].push(value);	
				}					
			}
			for (var i = col - 1; i >= 0 && trblValue - i <= 7; i--)
			{
				//bottom-left
				currentRow = trblValue - i;
				if (attackMap[i][currentRow].indexOf(value) == -1)
				{
					if (this.moveMap[i][currentRow] != 0)
					{
						attackMap[i][currentRow].push(value);
						break;
					}
					else attackMap[i][currentRow].push(value);
				}					
			}
		}
		if (col != 7) {
			for (var i = col + 1; i < 8 && i - tlbrValue <= 7 ; i++) {
				//bottom-right
				currentRow = i - tlbrValue;
				if (attackMap[i][currentRow].indexOf(value) == -1) {
					if (this.moveMap[i][currentRow] != 0) {
						attackMap[i][currentRow].push(value);
						break;
					}
					else attackMap[i][currentRow].push(value);
				}					
			}
			for (var i = col + 1; i < 8 && trblValue - i >= 0 ; i++) {
				//top-left
				currentRow = trblValue - i;
				if (attackMap[i][currentRow].indexOf(value) == -1) {
					if (this.moveMap[i][trblValue - i] != 0) {
						attackMap[i][currentRow].push(value);
						break;
					}
					else attackMap[i][currentRow].push(value);
				}					
			}
		}
	}
	//CHECKED
	this.calculateAttackMapForQueen = function(value, col, row, attackMap) {
		this.calculateAttackMapForRook(value, col, row, attackMap);
		this.calculateAttackMapForBishop(value, col, row, attackMap);
	}
	//wrong at this one
	//CHECKED
	this.calculateAttackMapForKing = function(value, col, row, attackMap) {
		//special case
		if (col == 0) {
			if (row == 0) { // right down bottom right
				//right
				attackMap[col + 1][row].push(value);
				//bottom right
				attackMap[col + 1][row + 1].push(value);
				//down
				attackMap[col][row + 1].push(value);
				return;
			}
			if (row == 7) { // up top right right
				//up
				attackMap[col][row - 1].push(value);
				//top right
				attackMap[col + 1][row - 1].push(value);
				//right
				attackMap[col + 1][row].push(value);
				return;
			}
			else { // up top-right right bottom-right down
				//up
				attackMap[col][row - 1].push(value);
				//top right
				attackMap[col + 1][row - 1].push(value);
				//right
				attackMap[col + 1][row].push(value);
				//bottom right
				attackMap[col + 1][row + 1].push(value);
				//down
				attackMap[col][row + 1].push(value);
				return;
			}
		}
		if (col == 7) {
			if (row == 0) { // down bottom left left
				//down
				attackMap[col][row + 1].push(value);
				//bottom left
				attackMap[col - 1][row + 1].push(value);
				//left 
				attackMap[col - 1][row].push(value);
				return;
			}
			if (row == 7) { // up top left left
				//up
				attackMap[col][row - 1].push(value);
				//top left
				attackMap[col - 1][row - 1].push(value);
				//left
				attackMap[col - 1][row].push(value);
				return;
			}
			else { //up top left left bottom left down
				//up
				attackMap[col][row - 1].push(value);
				//top left
				attackMap[col - 1][row - 1].push(value);
				//left
				attackMap[col - 1][row].push(value);
				//bottom left
				attackMap[col - 1][row + 1].push(value);
				//down
				attackMap[col][row + 1].push(value);
				return;
			}
		} else {
			if (row == 0) {
				//left
				attackMap[col - 1][row].push(value);
				//bottom left
				attackMap[col - 1][row + 1].push(value);
				//down
				attackMap[col][row + 1].push(value);
				//bottom right
				attackMap[col + 1][row + 1].push(value);
				//right
				attackMap[col + 1][row].push(value);
				return;
			}
			else if (row == 7) { // left top left up top right right
				//left
				attackMap[col - 1][row].push(value);
				//top left
				attackMap[col - 1][row - 1].push(value);
				//up
				attackMap[col][row - 1].push(value);
				//top right
				attackMap[col + 1][row - 1].push(value);
				//right
				attackMap[col + 1][row].push(value);
				return;
			} else {
				//up
				attackMap[col][row - 1].push(value);
				//down
				attackMap[col][row + 1].push(value);
				//right
				attackMap[col + 1][row].push(value);
				//left
				attackMap[col - 1][row].push(value);
				//bottom right
				attackMap[col + 1][row + 1].push(value);
				//top left
				attackMap[col - 1][row - 1].push(value);
				//top right
				attackMap[col + 1][row - 1].push(value);	
				//bottom left
				attackMap[col - 1][row + 1].push(value);
				return;
			}
		}
	}
	//need to fix this one too 
	//CHECKED
	this.calculateAttackMapForPawn = function(value, col, row, attackMap) {
		if (value * playerSide < 0) {
			//computer
			if (col == 0) {
				if (attackMap[col + 1][row + 1].indexOf(value) == -1 && this.moveMap[col + 1][row + 1]*playerSide <= 0)
					attackMap[col + 1][row + 1].push(value);
				return;
			}
			if (col == 7) {
				if (attackMap[col - 1][row + 1].indexOf(value) == -1 && this.moveMap[col - 1][row + 1]*playerSide <= 0)
					attackMap[col - 1][row + 1].push(value);
				return;
			}
			else {
				if (attackMap[col - 1][row + 1].indexOf(value) == -1 && this.moveMap[col - 1][row + 1]*playerSide <= 0)
					attackMap[col - 1][row + 1].push(value);
				if (attackMap[col + 1][row + 1].indexOf(value) == -1 && this.moveMap[col - 1][row + 1]*playerSide <= 0)
					attackMap[col + 1][row + 1].push(value);
				return;
			}
		}
		else {
			//player
			if (col == 0) {
				if (attackMap[col + 1][row - 1].indexOf(value) == -1 && this.moveMap[col + 1][row - 1]*playerSide <= 0)
					attackMap[col + 1][row - 1].push(value);
				return;
			}
			if (col == 7) {
				if (attackMap[col - 1][row - 1].indexOf(value) == -1 && this.moveMap[col - 1][row - 1]*playerSide <= 0)
					attackMap[col - 1][row - 1].push(value);
				return;
			}
			else {
				if (attackMap[col - 1][row - 1].indexOf(value) == -1 && this.moveMap[col - 1][row - 1]*playerSide <= 0)
					attackMap[col - 1][row - 1].push(value);
				if (attackMap[col + 1][row - 1].indexOf(value) == -1 && this.moveMap[col + 1][row - 1]*playerSide <= 0)
					attackMap[col + 1][row - 1].push(value);
				return;
			}	
		}
	}
	//CHECKED
	this.findThePiece = function(value) {
		return this.piecePositions[value];
	}
}
