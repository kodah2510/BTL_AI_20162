function Evaluator() {
    //isPlayerTurn = true;
    /*
    Material balance
    Mobility, Board control
    Development
    Pawn formations
    King Safety - Tropism -> How easy it is for a piece to attack the opposing King
    f(p) = 200(K-K')
       + 9(Q-Q')
       + 5(R-R')
       + 3(B-B' + N-N')
       + 1(P-P')
       - 0.5(D-D' + S-S' + I-I')
       + 0.1(M-M') + ...
 
KQRBNP = number of kings, queens, rooks, bishops, knights and pawns
D,S,I = doubled, blocked and isolated pawns
M = Mobility (the number of legal moves)
     */
    this.whoToMove = null;
	//về sau phải điều chỉnh lại không phải dựa vào biến isPlayerTurn mà phải tính whoToMove theo độ sâu của cây gameTree.depth
	(isPlayerTurn) ? this.whoToMove = playerSide : this.whoToMove = -playerSide;
    this.rookWeight = 5;
    this.knightAndBishopWeight = 3; // quân mã và quân tượng được gán trọng số ngang nhau
    this.queenWeight = 9;
    this.pawnWeight = 1;
	this.kingWeight = 1000;

	this.evaluate =function()
    {        
        //return (this.materialEvaluate() + this.mobilityEvaluate()) * this.whoToMove;
		//return this.evaluateAttackMap() + this.checkEnemySide() + this.calculatePointAttack() + this.calculatePieceMove();
		console.log("materialEvaluate:", this.evaluateMaterial());
		console.log("evaluateAttackMap:", this.evaluateAttackMap());
		console.log("checkEnemySide:", this.checkEnemySide());
		console.log("calculatePieceMove", this.calculatePieceMove());
    }
	//tính toán sự chênh lệch về đội hình dựa trên trọng số và số lượng của từng quân
    this.evaluateMaterial = function()
    {
        return  this.rookWeight * (recorder.pieceCount[1][0] - recorder.pieceCount[1][1]) +
                this.knightAndBishopWeight * (recorder.pieceCount[2][0] - recorder.pieceCount[2][1]) +
                this.knightAndBishopWeight * (recorder.pieceCount[3][0] - recorder.pieceCount[3][1]) +
                this.queenWeight * (recorder.pieceCount[4][0] - recorder.pieceCount[4][1]) +
                this.pawnWeight * (recorder.pieceCount[6][0] - recorder.pieceCount[6][1]);
    }
    //Đoạn này là của Lâm
	//tính điểm tấn công cho từng bên
	//dựa vào các quân cờ của đối phương có thể tấn công được
	//
    this.calculatePointAttack = function(pieceWeight, pieceValue) {
		var attackPoint = 0;
		for(var i = 0; i < recorder.piecePositions[pieceValue].length;i++) {
			var col = recorder.piecePositions[pieceValue][i][0];
			var row = recorder.piecePositions[pieceValue][i][1];
			if(pieceValue < 0) {
				if(recorder.whiteAttackMap[col][row].length != 0)
				//đoạn này nên xem lại 
				//vì chỉ mới xét cho trường hợp chiếu tướng
				//nên xem các tiêu chí được comment ở đầu file có nhắc đến về độ an toàn của vua 
					(pieceValue == -5) ? attackPoint += recorder.whiteAttackMap[col][row].length * pieceWeight : attackPoint += pieceWeight;
            } else {
				if(recorder.blackAttackMap[col][row].length != 0) 
					(pieceValue == 5) ? attackPoint += recorder.blackAttackMap[col][row].length * pieceWeight : attackPoint += pieceWeight;
            }
		}
		return attackPoint;
	}
    this.getPieceWeight = function(pieceVal){
		switch(pieceVal){
			case ROOK_VALUE: return this.rookWeight; break;
			case KNIGHT_VALUE: return this.knightAndBishopWeight; break;
			case BISHOP_VALUE: return this.knightAndBishopWeight; break;
			case QUEEN_VALUE: return this.queenWeight; break;
			case KING_VALUE: return this.kingWeight; break;
			case PAWN_VALUE: return this.pawnWeight; break;
		}
	}
	//những quân cờ nào có số nước đi dc < 2 thì bị trừ điểm 
	this.calculatePieceMove = function() {
		var point = 0;
		for(var pieceValueIndex = 1; pieceValueIndex <= 6; pieceValueIndex++) {
			var count = 0;
			for(var col = 0; col < 8; col++) {
				for(var row = 0; row < 8; row++)
					recorder.piecePositions[pieceValueIndex * this.whoToMove].forEach(function(coordinate) {
						if(validator.validateMove(coordinate[0],coordinate[1], col, row) != INVALID_MOVE) count++; 
					 });
			}
			if(count < 2 && pieceValueIndex != 5) point -= this.getPieceWeight(pieceValueIndex);
		}
		return point;
	}
	this.checkEnemySide  = function(isPlayerTurn) {
		var tmpPoint = 0;
		var side = 0;
		(isPlayerTurn) ? side = WHITE_SIDE : side = BLACK_SIDE;
		for(var row = 0 ; row < 8;row ++) {
			for(var col = 0; col < 8;col ++){
					if(row < 4){
						switch(recorder.moveMap[col][row]){
							case ROOK_VALUE: tmpPoint += (this.rookWeight*side); break;
							case KNIGHT_VALUE: tmpPoint += (this.knightAndBishopWeight*side); break;
							case BISHOP_VALUE: tmpPoint += (this.knightAndBishopWeight*side); break;
							case QUEEN_VALUE: tmpPoint += (this.queenWeight*side); break;
							case KING_VALUE: break;
							case PAWN_VALUE: tmpPoint += (this.pawnWeight*side); break;
						}
					} else {
						switch(recorder.moveMap[col][row]){
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
	this.evaluateAttackMap = function() {
		var point = 0;
		for(var x in recorder.piecePositions) {
			if(this.whoToMove == WHITE_SIDE && x > 0) {
				switch(parseInt(x)) {
				case ROOK_VALUE: point += this.calculatePointAttack(this.rookWeight,ROOK_VALUE) - this.calculatePointAttack(this.rookWeight,-ROOK_VALUE);break;
				case KNIGHT_VALUE: point += this.calculatePointAttack(this.knightAndBishopWeight,KNIGHT_VALUE) - this.calculatePointAttack(this.knightAndBishopWeight,-KNIGHT_VALUE);break;				
				case BISHOP_VALUE: point += this.calculatePointAttack(this.knightAndBishopWeight,BISHOP_VALUE) - this.calculatePointAttack(this.knightAndBishopWeight,-BISHOP_VALUE);break;
				case QUEEN_VALUE: point += this.calculatePointAttack(this.queenWeight,QUEEN_VALUE) - this.calculatePointAttack(this.queenWeight,-QUEEN_VALUE);break;
				case PAWN_VALUE: point += this.calculatePointAttack(this.pawnWeight,PAWN_VALUE) - this.calculatePointAttack(this.pawnWeight,-PAWN_VALUE);break;
				case KING_VALUE: point += this.calculatePointAttack(this.kingWeight,KING_VALUE) - this.calculatePointAttack(this.kingWeight,-KING_VALUE);break;
				}
			}else if(this.whoToMove == BLACK_SIDE && x < 0) {
				switch(parseInt(x)) {
				case -ROOK_VALUE: point += this.calculatePointAttack(this.rookWeight,-ROOK_VALUE) - this.calculatePointAttack(this.rookWeight,ROOK_VALUE); break;
				case -KNIGHT_VALUE: point += this.calculatePointAttack(this.knightAndBishopWeight,-KNIGHT_VALUE) - this.calculatePointAttack(this.knightAndBishopWeight,KNIGHT_VALUE); break;				
				case -BISHOP_VALUE: point += this.calculatePointAttack(this.knightAndBishopWeight,-BISHOP_VALUE) - this.calculatePointAttack(this.knightAndBishopWeight,BISHOP_VALUE); break;
				case -QUEEN_VALUE: point += this.calculatePointAttack(this.queenWeight,-QUEEN_VALUE) - this.calculatePointAttack(this.queenWeight,QUEEN_VALUE);break;
				case -PAWN_VALUE: point += this.calculatePointAttack(this.pawnWeight,-PAWN_VALUE) - this.calculatePointAttack(this.pawnWeight,PAWN_VALUE); break;
				case -KING_VALUE: point += this.calculatePointAttack(this.kingWeight,-KING_VALUE) - this.calculatePointAttack(this.kingWeight,KING_VALUE); break;
				}
			}
		}
		return point;
	}
}
// turnerSide la mau quan cua luot di 