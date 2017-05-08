function Evaluator() {
    this.whoToMove = null;
	//về sau phải điều chỉnh lại không phải dựa vào biến isPlayerTurn mà phải tính whoToMove theo độ sâu của cây gameTree.depth
    this.rookWeight = 5;		
    this.knightAndBishopWeight = 3; // quân mã và quân tượng được gán trọng số ngang nhau
    this.queenWeight = 9;
    this.pawnWeight = 1;
	this.kingWeight = 1000;
	// 8 + 10 + 12 + 9 = 39 
	this.getWhoToMove = function(depth) {
		(depth % 2 == 0) ? this.whoToMove = playerSide : this.whoToMove = -playerSide;
	}
	this.evaluate = function(pieceCount,piecePositions, whiteAttackMap, blackAttackMap, moveMap, depth) {        
		this.getWhoToMove(depth);
		var evaluateMaterial = this.evaluateMaterial(pieceCount);
		//var evaluateAttackMap = this.evaluateAttackMap(piecePositions, whiteAttackMap, blackAttackMap);
		//var checkEnemySide = this.checkEnemySide(moveMap);
		//var calculatePieceMove = this.calculatePieceMove(piecePositions);
		// console.log("materialEvaluate:",evaluateMaterial);
		// console.log("evaluateAttackMap:", evaluateAttackMap );
		// console.log("checkEnemySide:", checkEnemySide);
		// console.log("calculatePieceMove", calculatePieceMove);
		console.log("eval:", evaluateMaterial);
		return this.evaluateMaterial(pieceCount) + this.evaluateAttackMap(piecePositions, whiteAttackMap, blackAttackMap) 
				+ this.checkEnemySide(moveMap) + this.calculatePieceMove(piecePositions);
		//return evaluateMaterial * this.whoToMove;
    }
	//tính toán sự chênh lệch về đội hình dựa trên trọng số và số lượng của từng quân
    this.evaluateMaterial = function(pieceCount) {
        return  this.rookWeight * (pieceCount[1][0] - pieceCount[1][1]) +
                this.knightAndBishopWeight * (pieceCount[2][0] - pieceCount[2][1]) +
                this.knightAndBishopWeight * (pieceCount[3][0] - pieceCount[3][1]) +
                this.queenWeight * (pieceCount[4][0] - pieceCount[4][1]) +
                this.pawnWeight * (pieceCount[6][0] - pieceCount[6][1]);
    }
    //Đoạn này là của Lâm
	//tính điểm tấn công cho từng bên
	//dựa vào các quân cờ của đối phương có thể tấn công được
	//
    this.calculatePointAttack = function(pieceWeight, pieceValue, piecePositions, whiteAttackMap, blackAttackMap) {
		var attackPoint = 0;
		for(var i = 0; i < piecePositions[pieceValue].length;i++) {
			var col = piecePositions[pieceValue][i][0];
			var row = piecePositions[pieceValue][i][1];
			if(pieceValue < 0) {
				if(whiteAttackMap[col][row].length != 0)
					(pieceValue == -5) ? attackPoint += whiteAttackMap[col][row].length * pieceWeight : attackPoint += pieceWeight;
            } else {
				if(blackAttackMap[col][row].length != 0) 
					(pieceValue == 5) ? attackPoint -= blackAttackMap[col][row].length * pieceWeight : attackPoint += pieceWeight;
            }
		}
		return attackPoint;
	}
    this.getPieceWeight = function(pieceVal) {
		switch (pieceVal) {
			case ROOK_VALUE: return this.rookWeight;
			case KNIGHT_VALUE: return this.knightAndBishopWeight;
			case BISHOP_VALUE: return this.knightAndBishopWeight; 
			case QUEEN_VALUE: return this.queenWeight; 
			case KING_VALUE: return this.kingWeight; 
			case PAWN_VALUE: return this.pawnWeight;
		}
	}
	//những quân cờ nào có số nước đi dc < 2 thì bị trừ điểm 
	this.calculatePieceMove = function(piecePositions) {
		var point = 0;
		for (var pieceValueIndex = 1; pieceValueIndex <= 6; pieceValueIndex++) {
			var count = 0;
			for(var col = 0; col < 8; col++) {
				for(var row = 0; row < 8; row++)
					piecePositions[pieceValueIndex * this.whoToMove].forEach(function(coordinate) {
						if(validator.validateMove(coordinate[0],coordinate[1], col, row) != INVALID_MOVE) count++; 
					 });
			}
			if (count < 2 && pieceValueIndex != 5) point -= this.getPieceWeight(pieceValueIndex);
		}
		return point;
	}
	this.checkEnemySide  = function(moveMap) {
		var tmpPoint = 0;
		var side = 0;
		(isPlayerTurn) ? side = WHITE_SIDE : side = BLACK_SIDE;
		for(var row = 0 ; row < 8;row ++) {
			for(var col = 0; col < 8;col ++) {
				if(row < 4) {
					switch (moveMap[col][row]) {
						case ROOK_VALUE: tmpPoint += (this.rookWeight*side); break;
						case KNIGHT_VALUE: tmpPoint += (this.knightAndBishopWeight*side); break;
						case BISHOP_VALUE: tmpPoint += (this.knightAndBishopWeight*side); break;
						case QUEEN_VALUE: tmpPoint += (this.queenWeight*side); break;
						case KING_VALUE: break;
						case PAWN_VALUE: tmpPoint += (this.pawnWeight*side); break;
					}
				} else {
					switch(moveMap[col][row]) {
						case ROOK_VALUE: tmpPoint -= (this.rookWeight*side); break;
						case KNIGHT_VALUE: tmpPoint -= (this.knightAndBishopWeight*side); break;
						case BISHOP_VALUE: tmpPoint -= (this.knightAndBishopWeight*side); break;
						case QUEEN_VALUE: tmpPoint -= (this.queenWeight*side); break;
						case KING_VALUE: break;
						case PAWN_VALUE: tmpPoint -= (this.pawnWeight*side); break;
					}
				}
			}
		}
		return tmpPoint;
	}
	//
	this.evaluateAttackMap = function(piecePositions, whiteAttackMap, blackAttackMap) {
		var point = 0;
		for (var pieceValue in piecePositions) {
			if (this.whoToMove == WHITE_SIDE && pieceValue > 0) {
				switch (parseInt(pieceValue)) {
				case ROOK_VALUE: 
				point += this.calculatePointAttack(this.rookWeight,ROOK_VALUE, piecePositions, whiteAttackMap, blackAttackMap) - this.calculatePointAttack(this.rookWeight,-ROOK_VALUE, piecePositions, whiteAttackMap, blackAttackMap);break;
				case KNIGHT_VALUE: point += this.calculatePointAttack(this.knightAndBishopWeight,KNIGHT_VALUE, piecePositions, whiteAttackMap, blackAttackMap) - this.calculatePointAttack(this.knightAndBishopWeight,-KNIGHT_VALUE,piecePositions, whiteAttackMap, blackAttackMap);break;				
				case BISHOP_VALUE: point += this.calculatePointAttack(this.knightAndBishopWeight,BISHOP_VALUE,piecePositions, whiteAttackMap, blackAttackMap) - this.calculatePointAttack(this.knightAndBishopWeight,-BISHOP_VALUE,piecePositions, whiteAttackMap, blackAttackMap);break;
				case QUEEN_VALUE: point += this.calculatePointAttack(this.queenWeight,QUEEN_VALUE,piecePositions, whiteAttackMap, blackAttackMap) - this.calculatePointAttack(this.queenWeight,-QUEEN_VALUE,piecePositions, whiteAttackMap, blackAttackMap);break;
				case PAWN_VALUE: point += this.calculatePointAttack(this.pawnWeight,PAWN_VALUE,piecePositions, whiteAttackMap, blackAttackMap) - this.calculatePointAttack(this.pawnWeight,-PAWN_VALUE,piecePositions, whiteAttackMap, blackAttackMap);break;
				case KING_VALUE: point += this.calculatePointAttack(this.kingWeight,KING_VALUE,piecePositions, whiteAttackMap, blackAttackMap) - this.calculatePointAttack(this.kingWeight,-KING_VALUE,piecePositions, whiteAttackMap, blackAttackMap);break;
				}
			} else if(this.whoToMove == BLACK_SIDE && pieceValue < 0) {
				switch(parseInt(pieceValue)) {
				case -ROOK_VALUE: point += this.calculatePointAttack(this.rookWeight,-ROOK_VALUE,piecePositions, whiteAttackMap, blackAttackMap) - this.calculatePointAttack(this.rookWeight,ROOK_VALUE,piecePositions, whiteAttackMap, blackAttackMap); break;
				case -KNIGHT_VALUE: point += this.calculatePointAttack(this.knightAndBishopWeight,-KNIGHT_VALUE,piecePositions, whiteAttackMap, blackAttackMap) - this.calculatePointAttack(this.knightAndBishopWeight,KNIGHT_VALUE,piecePositions, whiteAttackMap, blackAttackMap); break;				
				case -BISHOP_VALUE: point += this.calculatePointAttack(this.knightAndBishopWeight,-BISHOP_VALUE,piecePositions, whiteAttackMap, blackAttackMap) - this.calculatePointAttack(this.knightAndBishopWeight,BISHOP_VALUE,piecePositions, whiteAttackMap, blackAttackMap); break;
				case -QUEEN_VALUE: point += this.calculatePointAttack(this.queenWeight,-QUEEN_VALUE,piecePositions, whiteAttackMap, blackAttackMap) - this.calculatePointAttack(this.queenWeight,QUEEN_VALUE,piecePositions, whiteAttackMap, blackAttackMap);break;
				case -PAWN_VALUE: point += this.calculatePointAttack(this.pawnWeight,-PAWN_VALUE,piecePositions, whiteAttackMap, blackAttackMap) - this.calculatePointAttack(this.pawnWeight,PAWN_VALUE,piecePositions, whiteAttackMap, blackAttackMap); break;
				case -KING_VALUE: point += this.calculatePointAttack(this.kingWeight,-KING_VALUE,piecePositions, whiteAttackMap, blackAttackMap) - this.calculatePointAttack(this.kingWeight,KING_VALUE,piecePositions, whiteAttackMap, blackAttackMap); break;
				}
			}
		}
		return point;
	}
	this.evaluateCenterControl = function(piecePositions, whiteAttackMap, blackAttackMap) {
		//kiểm tra vị trí các quân trong trung tâm 
		var pieceCount = 0;
		for(var pieceValue in piecePositions) {
			piecePositions[pieceValue].forEach(function(coordinate) {
				if(parseInt(pieceValue) > 0)
					if(coordinate[0] <=5 && coordinate[0] >= 2 && coordinate[1] <= 5 && coordinate[1] >= 2) 
						pieceCount+= this.getPieceWeight(pieceValue);
				else
					if(coordinate[0] <=5 && coordinate[0] >= 2 && coordinate[1] <= 5 && coordinate[1] >= 2) 
						pieceCount-= this.getPieceWeight(pieceValue);
			})
		}
		//kiểm tra attackMap
		var attackCount = 0;
		for(var col = 2; col <= 5; col++)
			for(var row = 2; row <= 5; row++)
			{
				if(whiteAttackMap[col][row].length != 0)
					for(var i in whiteAttackMap[col][row])
						attackCount += this.getPieceWeight(whiteAttackMap[col][row][i]);
				if(blackAttackMap[col][row].length != 0)
					for(var i in whiteAttackMap[col][row])
						attackCount -= this.getPieceWeight(whiteAttackMap[col][row][i]);
			}
		return pieceCount + attackCount;
	}
	this.evaluatePawn = function() {

	}
	this.evaluateKnight = function() {

	}
	this.evaluateBishop = function() {
	
	}
	this.evaluateQueen = function() {

	}
	this.evaluateKing = function() {
		
	}
}
