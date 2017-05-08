function Ply(moveMap, whiteAttackMap, blackAttackMap, pieceCount, piecePositions, moveRecord) {
    this.moveMap = moveMap;
    this.whiteAttackMap = whiteAttackMap;
    this.blackAttackMap = blackAttackMap;
    this.pieceCount = pieceCount;
    this.piecePositions = piecePositions;
    this.moveRecord = moveRecord;
    this.generatedMoveSet = [];
}
Ply.prototype = Object(Recorder.prototype);
Ply.prototype.update = function(prevRecord) 
{
    try{
        var value = prevRecord[0];
        var prevCol;
        var prevRow;
        var clickedCol = floor(prevRecord[2] / 10);
        var clickedRow = floor(prevRecord[2] % 10);
        //những nước đi đặc biệt 
        if(prevRecord[1] < 0) 
        { 
            if(prevRecord[1] < -CASTLING_MOVE) 
            {
                var pos = Math.abs(prevRecord[1]);
                prevCol = floor(pos / 10);
                prevRow = floor(pos % 10);

                this.removePiece(this.moveMap[prevCol][prevRow], prevCol, prevRow);
                if(this.moveMap[clickedCol][clickedRow] != 0)
                    this.removePiece(this.moveMap[clickedCol][clickedRow], clickedCol, clickedRow);
                this.updateMoveMap(value, null, null, clickedCol, clickedRow);
                this.updateAttackMap();
                this.updateMoveRecord(null, null, null, null, this.moveRecord, prevRecord);
                return;
            }
            else if(prevRecord[1] == -CASTLING_MOVE) 
            {
                //Đoạn này bị lỗi cần xem lại 
                if(clickedCol > 4 )
                { 
                    this.updateMoveMap(value, clickedCol - 2, clickedRow, clickedCol, clickedRow);
                    this.updateMoveMap(ROOK_VALUE, clickedCol + 1, clickedRow, clickedCol - 1, clickedRow);
                    this.updateAttackMap();
                    this.updateMoveRecord(null, null, null, null, this.moveRecord, prevRecord);
                    return;
                }
                else 
                {
                    this.updateMoveMap(value, clickedCol + 2, clickedRow, clickedCol, clickedRow);
                    this.updateMoveMap(ROOK_VALUE, clickedCol - 2, clickedRow, clickedCol + 1, clickedRow);
                    this.updateAttackMap();
                    this.updateMoveRecord(null, null, null, null, this.moveRecord, prevRecord);
                    return;
                }
            }
        }
        else {
            var prevCol = floor(prevRecord[1] / 10);
            var prevRow = floor(prevRecord[1] % 10);
            //tìm xem trong cái mảng tempPiecePositions có thằng nào bị ăn ko 
            this.updateMoveMap(value, prevCol, prevRow, clickedCol, clickedRow);
            this.updateAttackMap();
            this.updateMoveRecord(null, null, null, null, this.moveRecord, prevRecord);
            return;
        }
    }   
    catch(err) {
        console.log(prevRecord);        
        console.log(err);
        console.log("error : ", value, prevCol, prevRow, clickedCol, clickedRow);
    }
}

Ply.prototype.makeCaptureMove = function(moveArray, depth) 
{
    var whoToMove;
    if(playerSide == WHITE_SIDE)
        if( depth % 2 == 0) whoToMove = WHITE_SIDE;
        else whoToMove = BLACK_SIDE;
    else 
        if(depth % 2 == 0) whoToMove = BLACK_SIDE;
        else whoToMove = WHITE_SIDE;
    var attackMap;
    var result = [];
    var moveMap = this.moveMap;
    moveArray.forEach(function(element) {
        if (whoToMove == WHITE_SIDE){
            if (moveMap[element[0]][element[1]] < 0)
                result.push([element[0], element[1]]);
        }
        else{
            if (moveMap[element[0]][element[1]] > 0)
                result.push([element[0], element[1]]);
        }
    });

    if (result.length === 0)
        return moveArray;
    else
        return result;
}
Ply.prototype.makeMove = function(attackMap,depth)
{
    //ưu tiên theo quân cờ
    //tìm ô tân công cho hậu
    var moveArray = [];
    var queen = [];
    var knight = [];
    var bishop = [];
    var rook = [];
    var pawn = [];
    var king = [];
    for(var col = 0; col < 8; col++)
        for(var row = 0; row < 8; row++)
        {
            if(attackMap[col][row].indexOf(QUEEN_VALUE) != -1) queen.push([QUEEN_VALUE, col, row]); 
            if(attackMap[col][row].indexOf(KNIGHT_VALUE) != -1) knight.push([KNIGHT_VALUE, col, row]);
            if(attackMap[col][row].indexOf(BISHOP_VALUE) != -1) bishop.push([BISHOP, col, row]);
            if(attackMap[col][row].indexOf(ROOK_VALUE) != -1) rook.push([ROOK_VALUE, col, row]);
            if(attackMap[col][row].indexOf(PAWN_VALUE) != -1) pawn.push([PAWN_VALUE, col, row]);
            if(attackMap[col][row].indexOf(KING_VALUE) != -1) king.push([KING_VALUE, col, row]);
        }
    
    moveArray = queen.concat(knight, bishop, rook, pawn, king);
    return moveArray;
}
Ply.prototype.generateMove = function(attackMap, piecePositions, depth, moveMap) {
    var record = [];
    var prevCol;
    var prevRow;
    var clickedCol;
    var clickedRow;
    var pieceValue;
    //lấy ra một nước đi random
    //tạo một hàm mới có xét nước đi theo độ ưu tiên 
    // var moveArray;
    // var captureArray;
    // moveArray = this.makeMove(attackMap, depth);
    // captureArray = this.makeCaptureMove(moveArray, depth);
    // for(var i = 0; i < captureArray.length; i++)
    // {
    //     var captureMove = captureArray[i];
    //     for(var j = 0; j < attackMap[coordinate[0]][coordinate[1]].length; j++)
    //     {
    //         if()
    //     }
    // }
    
    while(pieceValue == null) 
    {
        var col = floor(random(7));
        var row = floor(random(7));
        if(attackMap[col][row].length != 0) 
        {
            pieceValue = attackMap[col][row][floor(random(attackMap[col][row].length))];
            record.push(pieceValue);
            clickedCol = col;
            clickedRow = row;
        }
    }
    // pieceValue = -6;
    // clickedCol = 1;
    // clickedRow = 7;
    // record.push(pieceValue);

    for(var i = 0; i < piecePositions[pieceValue].length && !stop ; i++)
    {
        var stop = false;
        var coordinate = piecePositions[pieceValue][i];
        var absValue = Math.abs(pieceValue);
        switch(absValue) {
            case ROOK_VALUE:
                if (coordinate[0] == clickedCol && coordinate[1] != clickedRow || coordinate[0] != clickedCol && coordinate[1] == clickedRow) 
                {
                    if(!this.rookBlockageTest(coordinate[0], coordinate[1], clickedCol, clickedRow)) break;
                    record.push(coordinate[0]*10 + coordinate[1]);
                    stop = true;
                }
                break;
            case BISHOP_VALUE:
                if(coordinate[0] - coordinate[1] == clickedCol - clickedRow || coordinate[0] + coordinate[1] == clickedCol + clickedRow) {
                    if(!this.bishopBlockageTest(coordinate[0], coordinate[1], clickedCol, clickedRow)) break;
                    record.push(coordinate[0]*10 + coordinate[1]);
                    stop = true;
                }
                break;
            case QUEEN_VALUE:
                if(coordinate[0] == clickedCol && coordinate[1] != clickedRow || coordinate[0] != clickedCol && coordinate[1] == clickedRow || 
                (coordinate[0] - coordinate[1] == clickedCol - clickedRow || coordinate[0] + coordinate[1] == clickedCol + clickedRow)) {
                    if(!this.queenBlockageTest(coordinate[0], coordinate[1], clickedCol, clickedRow)) break;
                    record.push(coordinate[0]*10 + coordinate[1]);
                    stop = true;
                }
                break;
            case PAWN_VALUE:
                if(depth % 2 == 0) { // player
                    if(clickedRow == 0)  return this.generatePromoteMove(depth, coordinate[0], coordinate[1], clickedCol, clickedRow);
                    if((clickedCol == coordinate[0] && clickedRow == coordinate[1] - 2) ||
                        (clickedCol == coordinate[0] && clickedRow == coordinate[1] - 1)) {
                            if(this.moveMap[clickedCol][clickedRow] == 0){
                                record.push(coordinate[0]*10 + coordinate[1]);
                                stop = true;
                            }
                        }
                    if((clickedCol == coordinate[0] - 1 && clickedRow == coordinate[1] - 1) ||
                        (clickedCol == coordinate[0] + 1 && clickedRow == coordinate[1] - 1)){
                            if(this.moveMap[clickedCol][clickedRow]*pieceValue < 0) {
                                record.push(coordinate[0] * 10 + coordinate[1]);
                                stop = true;
                            }
                        }
                } 
                else { //computer
                    if(clickedRow == 7) return this.generatePromoteMove(depth, coordinate[0], coordinate[1], clickedCol, clickedRow);
                    if( (clickedCol == coordinate[0] && clickedRow == coordinate[1] + 2) ||
                        (clickedCol == coordinate[0] && clickedRow == coordinate[1] + 1))
                        {
                            if(this.moveMap[clickedCol][clickedRow] == 0) {
                                record.push(coordinate[0]*10 + coordinate[1]);
                                stop = true;
                            }
                        }   
                    if((clickedCol == coordinate[0] + 1 && clickedRow == coordinate[1] + 1) ||
                        (clickedCol == coordinate[0] - 1 && clickedRow == coordinate[1] + 1))
                        {
                            if(this.moveMap[clickedCol][clickedRow]*pieceValue < 0) {
                                record.push(coordinate[0]*10 + coordinate[1]);
                                stop = true;
                            }
                        }
                }
                break;
            case KING_VALUE:
                if(clickedCol == coordinate[0] + 2 && clickedRow == coordinate[1] ||
                    clickedCol == coordinate[0] - 2 && clickedRow == coordinate[1])
                    {
                        return this.generateCastleMove(coordinate[0], coordinate[1], clickedCol, clickedRow, depth, playerSide);
                    }
                else {
                    
                    record.push(coordinate[0]*10 + coordinate[1]);
                    stop = true;
                }
                break;
            default:
                record.push(coordinate[0]*10 + coordinate[1]);
                stop = true;
                break;
        }
        prevCol = coordinate[0];
        prevRow = coordinate[1];
    }
    record.push(clickedCol*10 + clickedRow);
    if(record.length == 3)
    {
        try
        {
            if(!this.isDuplicated(this.generatedMoveSet, record)) 
            {
                if(validator.detectCheck(prevCol, prevRow,clickedCol, clickedRow, 
                this.moveMap, this.whiteAttackMap, this.blackAttackMap, this.piecePositions))
                {    
                    this.generatedMoveSet.push(record);
                    console.log(record);            
                    return new Node(record);
                }
            }
        }
        catch(err)
        {
            console.log(record);
        }
    }
    else { return null; }
}
//hàm này nên được đặt vào trong validator 
//gọi lại prototype trong Ply
Ply.prototype.rookBlockageTest = function(prevCol, prevRow, clickedCol, clickedRow)
{
    if(clickedCol == prevCol)
    {
        if(clickedRow < prevRow)
        {
            for(var i = prevRow - 1; i > clickedRow; i++)
                if(this.moveMap[clickedCol][i] != 0) return false;
        }
        if(clickedRow > prevRow) 
        {
            for(var i = prevRow + 1; i < clickedRow; i++)
                if(this.moveMap[clickedCol][i] != 0) return false;
        }
    }
    if(clickedRow == prevRow)
    {
        if(clickedCol > prevCol)
        {
            for(var i = prevCol + 1; i < clickedCol; i++)
                if(this.moveMap[i][clickedRow] != 0) return false;                            
        }
        if(clickedCol < prevCol)
        {
            for(var i = prevCol - 1; i > clickedCol; i++)
                if(this.moveMap[i][clickedRow] != 0) return false;
        }
    }
    return true;
}
Ply.prototype.bishopBlockageTest = function(prevCol, prevRow, clickedCol, clickedRow)
{
    //bottom left -- top right
    if(prevCol - prevRow == clickedCol - clickedRow)
    {
        if(prevCol < clickedCol && prevRow > clickedRow)
        {
            for(var col = prevCol + 1; col < clickedCol; col++)
                for(var row = prevRow - 1; row > clickedRow; row++)
                    if(this.moveMap[col][row] != 0) return false;
        }
        else
        {
            for(var col = prevCol - 1; col > clickedCol; col++)
                for(var row = prevRow + 1; row < clickedRow; row++)
                    if(this.moveMap[col][row] != 0) return false;
        }
    }
    //top left -- bottom right
    if(prevCol + prevRow == clickedCol + clickedRow)
    {
        if(prevCol < clickedCol && prevRow < clickedRow)
        {
            for(var col = prevCol + 1; col < clickedCol; col++)
                for(var row = prevRow + 1; row < clickedRow; row++)
                    if(this.moveMap[col][row] != 0) return false;
        }
        else
        {
            for(var col = prevCol - 1; col > clickedCol; col++)
                for(var row = prevRow - 1; row > clickedRow; row++)
                    if(this.moveMap[col][row] != 0) return false;
        }
    }
    return true;
}
Ply.prototype.queenBlockageTest = function(prevCol, prevRow, clickedCol, clickedRow)
{
    if(prevCol == clickedCol || prevRow == clickedRow)
    {
        return this.rookBlockageTest(prevCol, prevRow, clickedCol, clickedRow);
    }
    else
    {
        return this.bishopBlockageTest(prevCol, prevRow, clickedCol, clickedRow);
    }
}
//chưa test
Ply.prototype.generatePromoteMove = function(depth, prevCol, prevRow, clickedCol, clickedRow) {
    var promoteMove = []; 
    var rand = random(0,1);
    (depth % 2 == 0) ?  this.promote(rand , promoteMove, playerSide, prevCol, prevRow, clickedCol, clickedRow) : 
    this.promote(rand, promoteMove, -playerSide, prevCol, prevRow, clickedCol, clickedRow);
    if(!this.isDuplicated(this.generatedMoveSet, promoteMove))
    {
        console.log(promoteMove);
        this.generatedMoveSet.push(promoteMove);
        return new Node(promoteMove);
    } else { return null; }
}
Ply.prototype.promote = function(rand, promoteMove, playerSide, prevCol, prevRow, clickedCol, clickedRow) {
    if(rand < 0.01) { promoteMove.push(KNIGHT_VALUE*playerSide, -(prevCol*10 + prevRow), clickedCol*10 + clickedRow);}
    else { promoteMove.push(QUEEN_VALUE*playerSide, -(prevCol*10 + prevRow) , clickedCol*10 + clickedRow);}
}
//chưa test
Ply.prototype.generateCastleMove = function(prevCol, prevRow, clickedCol, clickedRow, depth, playerSide) {
    var castleMove = [];
    var attackMap;
    (depth % 2 == 0) ? attackMap = this.blackAttackMap : attackMap = this.whiteAttackMap;
    if(validator.validateCastling(prevCol, prevRow, clickedCol, clickedRow, this.moveMap, attackMap, this.moveRecord)) {
        (depth % 2 == 0) ? castleMove.push(KING_VALUE*playerSide, -CASTLING_MOVE, clickedCol*10 + clickedRow) : 
        castleMove.push(-KING_VALUE*playerSide, -CASTLING_MOVE, clickedCol*10 + clickedRow) ;
        if(!this.isDuplicated(this.generatedMoveSet, castleMove))
        {
            console.log(castleMove);
            this.generatedMoveSet.push(castleMove);
            return new Node(castleMove);
        } else { return null; }
    }
}
Ply.prototype.isDuplicated = function(generatedMove, record) {
    for(var i = 0; i < this.generatedMoveSet.length; i ++) {
        var prevRecord = this.generatedMoveSet[i];
        if(prevRecord[0] == record[0] && prevRecord[1] == record[1] && prevRecord[2] == record[2])  
            return true;
    }
    return false;
}
Ply.prototype.addNode = function(parentNode, depth) {
    var newNode; 
    if(depth % 2 == 1) {
        //min
        (playerSide > 0) ? newNode = this.generateMove(this.blackAttackMap , this.piecePositions, depth) : 
        newNode = this.generateMove(this.whiteAttackMap , this.piecePositions, depth); 
    }
    else {
        //max
        (playerSide > 0) ? newNode = this.generateMove(this.whiteAttackMap, this.piecePositions, depth) :
        this.generateMove(this.blackAttackMap, this.piecePositions, depth);
    }
    if(newNode != null) {
        newNode.parent = parentNode;
        parentNode.children.push(newNode);
    }       
}