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
	
	//need to fix this one too related to moveMap
	
	this.updateAttackMap = function(whiteAttackMap, blackAttackMap, piecePositions, moveMap) {
		if(whiteAttackMap == null && blackAttackMap == null && piecePositions == null && moveMap == null)
		{
			for(var i = 0; i < 8; i++)
				for(var j = 0; j < 8;j++) {this.whiteAttackMap[i][j] = [];this.blackAttackMap[i][j] = [];}
			this.calculateAttackMap(this.piecePositions, this.whiteAttackMap, this.blackAttackMap, this.moveMap);
		}
		else {
			for(var i = 0; i < 8; i++)
				for(var j = 0; j < 8;j++) {whiteAttackMap[i][j] = [];blackAttackMap[i][j] = [];}
			this.calculateAttackMap(piecePositions, whiteAttackMap, blackAttackMap, moveMap);
		}	
	}
	this.calculateAttackMap = function(piecePositions, whiteAttackMap, blackAttackMap, moveMap)
	{
		// attack map now will base on the piece position to process
		if(piecePositions == null && whiteAttackMap == null && blackAttackMap == null && moveMap == null)
		{
			var recorder = this;
			for(var pieceValues in this.piecePositions) {
				if(pieceValues > 0) 
					this.piecePositions[pieceValues].forEach(function(coordinate){
						recorder.calculateAttackMapForAPiece(pieceValues, coordinate[0], coordinate[1], this.whiteAttackMap, this.moveMap);
					});
				else
					this.piecePositions[pieceValues].forEach(function(coordinate){
						recorder.calculateAttackMapForAPiece(pieceValues, coordinate[0], coordinate[1], this.blackAttackMap, this.moveMap);
					});
			}
		}
		else {
			var recorder = this;
			for(var pieceValues in piecePositions) {
				if(pieceValues > 0) 
					piecePositions[pieceValues].forEach(function(coordinate){
						recorder.calculateAttackMapForAPiece(pieceValues, coordinate[0], coordinate[1], whiteAttackMap, moveMap);
					});
				else
					piecePositions[pieceValues].forEach(function(coordinate){
						recorder.calculateAttackMapForAPiece(pieceValues, coordinate[0], coordinate[1], blackAttackMap, moveMap);
					});
			}
		}
	}
	this.calculateAttackMapForAPiece = function(value,col,row, attackMap, moveMap) {
		var pieceValue = parseInt(value);
		switch(Math.abs(pieceValue))
		{
			case ROOK_VALUE: this.calculateAttackMapForRook(pieceValue,col,row, attackMap, moveMap); break;
			case KNIGHT_VALUE: this.calculateAttackMapForKnight(pieceValue,col,row, attackMap); break;
			case BISHOP_VALUE: this.calculateAttackMapForBishop(pieceValue,col,row,attackMap, moveMap); break;
			case QUEEN_VALUE: this.calculateAttackMapForQueen(pieceValue,col,row,attackMap, moveMap); break;
			case KING_VALUE: this.calculateAttackMapForKing(pieceValue,col,row,attackMap); break;
			case PAWN_VALUE: this.calculateAttackMapForPawn(pieceValue,col,row,attackMap, moveMap); break;
		}
	}
	this.updateMoveMap = function(value, prevCol, prevRow, clickedCol, clickedRow, moveMap, piecePositions) {
		if(moveMap == null && piecePositions == null) {
			//update the piecePosition first
			this.updatePiecePositions(value, prevCol, prevRow, clickedCol, clickedRow);
			//update the moveMap
			if (prevCol != null && prevRow != null)
				this.moveMap[prevCol][prevRow] = 0;
			this.moveMap[clickedCol][clickedRow] = value;
		}
		else {
			this.updatePiecePositions(value, prevCol, prevRow, clickedCol, clickedRow, moveMap, piecePositions);
			if (prevCol != null && prevRow != null)
				moveMap[prevCol][prevRow] = 0;
			moveMap[clickedCol][clickedRow] = value;
		}
	}
	//update the coordinate of each piece 
	this.updatePiecePositions = function(value, prevCol, prevRow, clickedCol, clickedRow, moveMap, piecePositions) {
		if(moveMap == null && piecePositions == null) {
			if (prevCol == null) this.piecePositions[value].push([clickedCol, clickedRow]);
		//move the piece	
			else {
				if (this.moveMap[clickedCol][clickedRow] == 0) {
					this.piecePositions[value].forEach(function(coordinate) {
						if (coordinate[0] == prevCol && coordinate[1] == prevRow) { coordinate[0] = clickedCol; coordinate[1] = clickedRow;}
					});
				} else {
					//when a piece takes down another
					//update the position of that piece
					//delete taken down piece's position
					this.removePiece(this.moveMap[clickedCol][clickedRow], clickedCol, clickedRow);
					//replace with the attack piece
					this.piecePositions[value].forEach(function(coordinate) {
						if (coordinate[0] == prevCol && coordinate[1] == prevRow) { coordinate[0] = clickedCol; coordinate[1] = clickedRow;}
					});
				}
			}
		}
		else {
			if (prevCol == null) piecePositions[value].push([clickedCol, clickedRow]);
		//move the piece	
			else {
				if (moveMap[clickedCol][clickedRow] == 0) {
					for(var i = 0; i < piecePositions[value].length; i++)
					{
						var coordinate = piecePositions[value][i];
						if (coordinate[0] == prevCol && coordinate[1] == prevRow) { coordinate[0] = clickedCol; coordinate[1] = clickedRow; break;}
					}
				} else {
					//when a piece takes down another
					//update the position of that piece
					//delete taken down piece's position
					this.removePiece(moveMap[clickedCol][clickedRow], clickedCol, clickedRow);
					//replace with the attack piece
					piecePositions[value].forEach(function(coordinate) {
						if (coordinate[0] == prevCol && coordinate[1] == prevRow) { coordinate[0] = clickedCol; coordinate[1] = clickedRow;}
					});
				}
			}
		}
		//place the piece
	}
	this.removePiece = function(value, currentCol, currentRow, moveMap, piecePositions) {
		if(moveMap == null && piecePositions == null) {
			this.moveMap[currentCol][currentRow] = 0;
			(value > 0) ? this.pieceCount[value][0]-- : this.pieceCount[-value][1]--;
			for (var index in this.piecePositions[value])
			if (this.piecePositions[value][index][0] == currentCol && this.piecePositions[value][index][1] == currentRow)
				this.piecePositions[value].splice(index, 1);
		}
		else {
			moveMap[currentCol][currentRow] = 0;
			(value > 0) ? pieceCount[value][0]-- : pieceCount[-value][1]--;
			for (var index in piecePositions[value])
			if (piecePositions[value][index][0] == currentCol && piecePositions[value][index][1] == currentRow)
				piecePositions[value].splice(index, 1);
		}
		
	}
	this.updateMoveRecord = function(prevCol, prevRow, clickedCol, clickedRow, moveRecord, record) {
		if(moveRecord == null && record == null) 
		{
			this.moveRecord.push([this.moveMap[clickedCol][clickedRow],prevCol*10+prevRow,clickedCol*10+clickedRow]);
		}
		else 
		{
			moveRecord.push(record);
		}	
	}
	this.findThePiece = function(value) {
		return this.piecePositions[value];
	}
	//CHECKED
	this.calculateAttackMapForRook = function(value,col,row,attackMap, moveMap) {
		//need to fix this one 
		//only the attack range is limited at the first opponent piece it met 
		if(col != 0) {
			for(var i = col - 1; i >= 0 ; i--) {
				if(attackMap[i][row].indexOf(value) == -1) {
					if(moveMap[i][row] != 0) { attackMap[i][row].push(value); break; }
					else attackMap[i][row].push(value);
				}					
			}
		}
		if(col != 7) {
			for(var i = col + 1;i < 8;i++) {
				if(attackMap[i][row].indexOf(value) == -1) {
					if(moveMap[i][row] != 0) { attackMap[i][row].push(value); break;}
					else attackMap[i][row].push(value);
				}					
			}
		}
		if(row != 0) {
			for(var i = row - 1; i >= 0; i--) {
				if(attackMap[col][i].indexOf(value) == -1) {
					if(moveMap[col][i] != 0) { attackMap[col][i].push(value); break; }
					else attackMap[col][i].push(value);
				}					
			}
		}
		if (row != 7) {
			for (var i = row + 1; i < 8; i++)
			{
				if (attackMap[col][i].indexOf(value) == -1) {
					if(moveMap[col][i] != 0) { attackMap[col][i].push(value); break;}
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

	this.calculateAttackMapForBishop = function(value,col,row,attackMap,moveMap) {
		var tlbrValue = col - row;//top-left ->> bottom-right
		var trblValue = col + row;//top-right ->> bottom-left
		if (col != 0) {
			for (var i = col - 1;i >= 0 && i - tlbrValue >= 0;i--) {
				//top-left
				currentRow = i - tlbrValue;
				if (attackMap[i][currentRow].indexOf(value) == -1) {
					if(moveMap[i][currentRow] != 0) {attackMap[i][currentRow].push(value);break;}
					else attackMap[i][currentRow].push(value);	
				}					
			}
			for (var i = col - 1;i >= 0 && trblValue - i <= 7;i--) {
				//bottom-left
				currentRow = trblValue - i;
				if (attackMap[i][currentRow].indexOf(value) == -1) {
					if(moveMap[i][currentRow] != 0) { attackMap[i][currentRow].push(value); break; }
					else attackMap[i][currentRow].push(value);
				}					
			}
		}
		if (col != 7) {
			for (var i = col + 1; i < 8 && i - tlbrValue <= 7 ; i++) {
				//bottom-right
				currentRow = i - tlbrValue;
				if (attackMap[i][currentRow].indexOf(value) == -1) {
					if(moveMap[i][currentRow] != 0) { attackMap[i][currentRow].push(value); break;}
					else attackMap[i][currentRow].push(value);
				}					
			}
			for (var i = col + 1; i < 8 && trblValue - i >= 0 ; i++) {
				//top-left
				currentRow = trblValue - i;
				if(attackMap[i][currentRow].indexOf(value) == -1) {
					if(moveMap[i][trblValue - i] != 0) { attackMap[i][currentRow].push(value); break;}
					else attackMap[i][currentRow].push(value);
				}					
			}
		}
	}
	//CHECKED
	this.calculateAttackMapForQueen = function(value,col,row,attackMap, moveMap)
	{
		this.calculateAttackMapForRook(value,col,row,attackMap, moveMap);
		this.calculateAttackMapForBishop(value,col,row,attackMap, moveMap);
	}
	//wrong at this one
	//CHECKED
	this.calculateAttackMapForKing = function(value, col, row, attackMap) {
		//special case

		if (col == 0) {
			if (row == 0) {// right down bottom right 
				attackMap[col + 1][row].push(value); //right
				attackMap[col + 1][row + 1].push(value); //bottom right
				attackMap[col][row + 1].push(value); //down
			}
			if (row == 7) {// up top right right 
				attackMap[col][row - 1].push(value); //up
				attackMap[col + 1][row - 1].push(value); //top right
				attackMap[col + 1][row].push(value); //right
			}
			else {// up top-right right bottom-right down
				attackMap[col][row - 1].push(value); //up
				attackMap[col + 1][row - 1].push(value); //top right
				attackMap[col + 1][row].push(value); //right
				attackMap[col + 1][row + 1].push(value); //bottom right
				attackMap[col][row + 1].push(value); //down
			}
		}
		if (col == 7){
			if (row == 0){// down bottom left left
				attackMap[col][row + 1].push(value);//down
				attackMap[col - 1][row + 1].push(value); //bottom left
				attackMap[col - 1][row].push(value); //left 
			}
			if (row == 7)
			{// up top left left
				attackMap[col][row - 1].push(value); //up
				attackMap[col - 1][row - 1].push(value); //top left
				attackMap[col - 1][row].push(value); //left		

			}
			else { //up top left left bottom left down
				attackMap[col][row - 1].push(value); //up
				attackMap[col - 1][row - 1].push(value); //top left
				attackMap[col - 1][row].push(value); //left
				attackMap[col - 1][row + 1].push(value); //bottom left
				attackMap[col][row + 1].push(value);//down
			}
		} else {
			if (row == 0) {
				attackMap[col - 1][row].push(value); //left
				attackMap[col - 1][row + 1].push(value);//bottom left
				attackMap[col][row + 1].push(value);//down
				attackMap[col + 1][row + 1].push(value);//bottom right
				attackMap[col + 1][row].push(value);//right
			}
			else if (row == 7) { // left top left up top right right
				attackMap[col - 1][row].push(value); //left
				attackMap[col - 1][row - 1].push(value);//top left
				attackMap[col][row - 1].push(value); //up
				attackMap[col + 1][row - 1].push(value); //top right
				attackMap[col + 1][row].push(value); //right
			} else {
				attackMap[col][row - 1].push(value); //up
				attackMap[col][row + 1].push(value); //down
				attackMap[col + 1][row].push(value); //right
				attackMap[col - 1][row].push(value); //left
				attackMap[col + 1][row + 1].push(value); //bottom right
				attackMap[col - 1][row - 1].push(value); //top left
				attackMap[col + 1][row - 1].push(value); //top right
				attackMap[col - 1][row + 1].push(value); //bottom left
			}
		}
		if(col == 4) {
			attackMap[col + 2][row].push(value);
			attackMap[col - 2][row].push(value);
		}		
	}
	//need to fix this one too 
	//CHECKED
	this.calculateAttackMapForPawn = function(value, col, row, attackMap, moveMap) {
		if (value * playerSide < 0) {
			//computer
			if(row == 1) {
				if(moveMap[col][row + 1] == 0) attackMap[col][row + 1].push(value);
				if(moveMap[col][row + 2] == 0) attackMap[col][row + 2].push(value);
			}
			else {
				if(moveMap[col][row + 1] == 0) attackMap[col][row + 1].push(value);
			}
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
			if(row == 7) {
				if(moveMap[col][row - 1] == 0) attackMap[col][row - 1].push(value);
				if(moveMap[col][row - 2] == 0) attackMap[col][row - 2].push(value);
			}
			else {
				if(moveMap[col][row - 1] == 0) attackMap[col][row - 1].push(value);
			}
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
	
}
