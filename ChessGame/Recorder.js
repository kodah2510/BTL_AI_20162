//denote Rook Knight Bishop Queen King Pawn 
//		 1	  2      3      4     5    6
//whiteSide 1
//blackSide -1
//Example blackRook = -1 whiteQueen = 4 blackKing = -5
function Recorder() {
	this.moveRecord = [];
	this.whiteAttackMap	= [];
	this.blackAttackMap = [];
	this.moveMap = [];
	// pieceCount, piecePositions dành cho evaluator
	// phần tử đầu tiên trong pieceCount là của quân trắng 
	//							Rook:2, Knight:2, Bishop:3, Queen:1, King:1, Pawn:8
	this.pieceCount = [];
	this.pieceCount = {1:[0, 0], 2:[0, 0], 3:[0, 0], 4:[0, 0], 5:[0, 0], 6:[0, 0]};
	this.piecePositions = {"1":[], "2":[], "3":[], "4":[], "5":[], "6":[], "-1":[], "-2":[], "-3":[], "-4":[], "-5":[], "-6":[] };
	//khởi tạo attackMap
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
}
Recorder.prototype.updateAttackMap = function() {
	for(var i = 0; i < 8; i++)
		for(var j = 0; j < 8;j++) {this.whiteAttackMap[i][j] = [];this.blackAttackMap[i][j] = [];}
	this.calculateAttackMap(this.piecePositions, this.whiteAttackMap, this.blackAttackMap, this.moveMap);
}
Recorder.prototype.calculateAttackMap = function()
{
	var recorder = this;
	var whiteAttackMap = this.whiteAttackMap;
	var blackAttackMap = this.blackAttackMap;
	var moveMap = this.moveMap;
	for(var pieceValues in this.piecePositions) {
		if(pieceValues > 0) 
			this.piecePositions[pieceValues].forEach(function(coordinate){
				recorder.calculateAttackMapForAPiece(pieceValues, coordinate[0], coordinate[1], whiteAttackMap, moveMap);
			});
		else
			this.piecePositions[pieceValues].forEach(function(coordinate){
				recorder.calculateAttackMapForAPiece(pieceValues, coordinate[0], coordinate[1], blackAttackMap, moveMap);
			});
	}
}
Recorder.prototype.calculateAttackMapForAPiece = function(value,col,row, attackMap, moveMap) {
	var pieceValue = parseInt(value);
	switch(Math.abs(pieceValue))
	{
		case ROOK_VALUE: this.calculateAttackMapForRook(pieceValue,col,row, attackMap, moveMap); break;
		case KNIGHT_VALUE: this.calculateAttackMapForKnight(pieceValue,col,row, attackMap, moveMap); break;
		case BISHOP_VALUE: this.calculateAttackMapForBishop(pieceValue,col,row,attackMap, moveMap); break;
		case QUEEN_VALUE: this.calculateAttackMapForQueen(pieceValue,col,row,attackMap, moveMap); break;
		case KING_VALUE: this.calculateAttackMapForKing(pieceValue,col,row,attackMap); break;
		case PAWN_VALUE: this.calculateAttackMapForPawn(pieceValue,col,row,attackMap, moveMap); break;
	}
}
	
Recorder.prototype.updateMoveMap = function(value, prevCol, prevRow, clickedCol, clickedRow) {
	//update the piecePosition first
	this.updatePiecePositions(value, prevCol, prevRow, clickedCol, clickedRow);
	//update the moveMap
	if (prevCol != null && prevRow != null)
		this.moveMap[prevCol][prevRow] = 0;
	this.moveMap[clickedCol][clickedRow] = value;
}
	//cập nhật các tọa độ của quân cờ 
Recorder.prototype.updatePiecePositions = function(value, prevCol, prevRow, clickedCol, clickedRow) {
	if (prevCol == null) this.piecePositions[value].push([clickedCol, clickedRow]);
	//di chuyển một quân cờ
	else {
		if (this.moveMap[clickedCol][clickedRow] == 0) {
			for(var i = 0; i < this.piecePositions[value].length; i++) 
			{
				if(this.piecePositions[value][i][0] == prevCol && this.piecePositions[value][i][1] == prevRow )
				{
					this.piecePositions[value][i][0] = clickedCol;
					this.piecePositions[value][i][1] = clickedRow;
					break;
				}
			}
		} else {
			//when a piece takes down another
			//update the position of that piece
			//delete taken down piece's position
			this.removePiece(this.moveMap[clickedCol][clickedRow], clickedCol, clickedRow);
			//replace with the attack piece
			for(var i = 0; i < this.piecePositions[value].length;i++)
			{
				if(this.piecePositions[value][i][0] == prevCol && this.piecePositions[value][i][1] == prevRow)
				{
					this.piecePositions[value][i][0] = clickedCol;
					this.piecePositions[value][i][1] = clickedRow;
					break;
				}
			}
		}
	}
}
Recorder.prototype.removePiece = function(value, currentCol, currentRow) {
	this.moveMap[currentCol][currentRow] = 0;
	(value > 0) ? this.pieceCount[value][0]-- : this.pieceCount[-value][1]--;
	for (var index in this.piecePositions[value])
	if (this.piecePositions[value][index][0] == currentCol && this.piecePositions[value][index][1] == currentRow)
	{
		this.piecePositions[value].splice(index, 1);
		break;
	}
}
Recorder.prototype.updateMoveRecord = function(prevCol, prevRow, clickedCol, clickedRow, moveRecord, record) {
	(moveRecord == null && record == null) ? this.moveRecord.push([this.moveMap[clickedCol][clickedRow],prevCol*10+prevRow,clickedCol*10+clickedRow]) :
	moveRecord.push(record);
}
Recorder.prototype.findThePiece = function(value) {
	return this.piecePositions[value];
}

