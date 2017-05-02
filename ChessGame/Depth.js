function Depth(moveMap, whiteAttackMap, blackAttackMap, pieceCount, piecePositions, moveRecord) {
    this.moveMap = moveMap;
    this.whiteAttackMap = whiteAttackMap;
    this.blackAttackMap = blackAttackMap;
    this.pieceCount = pieceCount;
    this.piecePositions = piecePositions;
    this.moveRecord = moveRecord;
    this.generatedMoveSet = [];

    this.update = function(prevRecord) {
        var value = prevRecord[0];
        var prevCol;
        var prevRow;
        var clickedCol = floor(prevRecord[2] / 10);
        var clickedRow = prevRecord[2] % 10;
        //những nước đi đặc biệt 
        if(prevRecord[1] < 0) { 
            var moveCode = Math.abs(prevRecord[1]);
            if(moveCode == PROMOTE_MOVE) {
               prevCol = null;
               prevRow = null;
            }
            else if(moveCode == CASTLING_MOVE) {
                if(clickedCol > 4 )
                {
                    recorder.updateMoveMap(value, clickedCol - 2, clickedRow, clickedCol, clickedRow, this.moveMap,this.piecePositions);
                    recorder.updateMoveMap(ROOK_VALUE, clickedCol + 4, clickedRow, clickedCol + 1, clickedRow, this.moveMap, this.piecePositions);
                    recorder.updateAttackMap(this.whiteAttackMap, this,blackAttackMap, this.piecePositions, this.moveMap);
                    recorder.updateMoveRecord(null, null, null, null, this.moveRecord, prevRecord);
                    return;
                }
                else 
                {
                    recorder.updateMoveMap(value, clickedCol + 2, clickedRow, clickedCol, clickedRow, this.moveMap,this.piecePositions);
                    recorder.updateMoveMap(ROOK_VALUE, clickedCol - 4, clickedRow, clickedCol - 1, clickedRow, this.moveMap, this.piecePositions);
                    recorder.updateAttackMap(this.whiteAttackMap, this,blackAttackMap, this.piecePositions, this.moveMap);
                    recorder.updateMoveRecord(null, null, null, null, this.moveRecord, prevRecord);
                    return;
                }
            }
        }
        else {
            var prevCol = floor(prevRecord[1] / 10);
            var prevRow = prevRecord[1] % 10;
            //tìm xem trong cái mảng tempPiecePositions có thằng nào bị ăn ko 
            recorder.updateMoveMap(value, prevCol, prevRow, clickedCol, clickedRow, this.moveMap, this.piecePositions);
            recorder.updateAttackMap(this.whiteAttackMap, this.blackAttackMap, this.piecePositions, this.moveMap);
            recorder.updateMoveRecord(null, null, null, null, this.moveRecord, prevRecord);
            return;
        }   
       
    }
    this.generateMove = function(attackMap, piecePositions, depth) {
        var move = [];
        var clickedCol;
        var clickedRow;
        var pieceValue;
        //lấy ra một nước đi random
        while(pieceValue == null) {
            var col = floor(random(7));
            var row = floor(random(7));
            if(attackMap[col][row].length != 0) {
                pieceValue = attackMap[col][row][floor(random(attackMap[col][row].length))];
                move.push(pieceValue);
                clickedCol = col;
                clickedRow = row;
            }
        }
        //console.log(clickedCol, clickedRow);
        //kiểm tra quân nào phù hợp với nước đi đó
        for(var i = 0; i < piecePositions[pieceValue].length && !stop ; i++)
        {
            var stop = false;
            var coordinate = piecePositions[pieceValue][i];
            var absValue = Math.abs(pieceValue);
            switch(absValue) {
                case ROOK_VALUE:
                    if (coordinate[0] == clickedCol && coordinate[1] != clickedRow || coordinate[0] != clickedCol && coordinate[1] == clickedRow) {
                        move.push(coordinate[0]*10 + coordinate[1]);
                        stop = true;
                    }
                    break;
                case BISHOP_VALUE:
                    if(coordinate[0] - coordinate[1] == clickedCol - clickedRow || coordinate[0] + coordinate[1] == clickedCol + clickedRow) {
                        move.push(coordinate[0]*10 + coordinate[1]);
                        stop = true;
                    }
                    break;
                case QUEEN_VALUE:
                    if(coordinate[0] == clickedCol && coordinate[1] != clickedRow || coordinate[0] != clickedCol && coordinate[1] == clickedRow || 
                    (coordinate[0] - coordinate[1] == clickedCol - clickedRow || coordinate[0] + coordinate[1] == clickedCol + clickedRow)) {
                        move.push(coordinate[0]*10 + coordinate[1]);
                        stop = true;
                    }
                    break;
                case PAWN_VALUE:
                    if(depth % 2 == 0) { // player
                        if(clickedRow == 0)  return this.generatePromoteMove(depth, clickedCol, clickedRow);
                        if(clickedCol == coordinate[0] - 1 && clickedRow == coordinate[1] + 1 ||
                            clickedCol == coordinate[0] + 1 && clickedRow == coordinate[1] + 1||
                            clickedCol == coordinate[0] && clickedRow == coordinate[1] - 2 ||
                            clickedCol == coordinate[0] && clickedRow == coordinate[1] - 1) {
                                move.push(coordinate[0]*10 + coordinate[1]);
                                stop = true;
                                break;
                            }
                    } else { //computer
                        if(clickedRow == 7) return this.generatePromoteMove(depth, clickedCol, clickedRow);
                        if(clickedCol == coordinate[0] - 1 && clickedRow == coordinate[1] - 1 ||
                            clickedCol == coordinate[0] + 1 && clickedRow == coordinate[1] - 1 ||
                            clickedCol == coordinate[0] && clickedRow == coordinate[1] + 2 ||
                            clickedCol == coordinate[0] && clickedRow == coordinate[1] + 1)
                            {
                                move.push(coordinate[0]*10, coordinate[1]);
                                stop = true;
                                break;
                            }   
                    }
                case KING_VALUE:
                    if(clickedCol == coordinate[0] + 2 && clickedRow == coordinate[1] ||
                        clickedCol == coordinate[0] - 2 && clickedRow == coordinate[1])
                        {
                            return this.generateCastleMove(coordinate[0], coordinate[1], clickedCol, clickedRow, depth, playerSide);
                        }
                    else {
                        move.push(coordinate[0]*10 + coordinate[1]);
                        stop = true;
                    }
                    break;
                default:
                    move.push(coordinate[0]*10 + coordinate[1]);
                    stop = true;
                    break;
            }
        }
        move.push(clickedCol*10 + clickedRow);
       
        if(!this.isDuplicated(this.generatedMoveSet, move)) {
            this.generatedMoveSet.push(move);
            //console.log(move);
            //console.log(piecePositions[pieceValue][0], piecePositions[pieceValue][1]);
            return new Node(move);
        } else { return null; }
    }
    this.generatePromoteMove = function(depth, clickedCol, clickedRow) {
        var promoteMove = []; 
        var rand = random(0,1);
        (depth % 2 == 0) ?  this.promote(rand , promoteMove, playerSide, clickedCol, clickedRow) : this.promote(rand, promoteMove, - playerSide, clickedCol, clickedRow);
        if(!this.isDuplicated(this.generatedMoveSet, promoteMove))
        {
            console.log(promoteMove);
            this.generatedMoveSet.push(promoteMove);
            return new Node(promoteMove);
        } else { return null; }
    }
    this.promote = function(rand, promoteMove, playerSide, clickedCol, clickedRow) {
        if(rand < 0.01) { promoteMove.push(KNIGHT_VALUE*playerSide, -PROMOTE_MOVE, clickedCol*10 + clickedRow);}
        else { promoteMove.push(QUEEN_VALUE*playerSide, -PROMOTE_MOVE , clickedCol*10 + clickedRow);}
    }
    this.generateCastleMove = function(prevCol, prevRow, clickedCol, clickedRow, depth, playerSide) {
        var castleMove = [];
        if(validator.validateCastling(prevCol, prevRow, clickedCol, clickedRow)) {
            (depth % 2 == 0) ? castleMove.push(KING_VALUE*playerSide, -CASTLING_MOVE, clickedCol*10 + clickedRow) : 
            castleMove.push(KING_VALUE*playerSide, -CASTLING_MOVE, clickedCol*10 + clickedRow) ;
            if(!this.isDuplicated(this.generatedMoveSet, castleMove))
            {
                console.log(castleMove);
                this.generatedMoveSet.push(castleMove);
                return new Node(castleMove);
            } else { return null; }
        }
    }
    this.isDuplicated = function(generatedMove, record) {
        for(var i = 0; i < this.generatedMoveSet.length; i ++) {
            var prevRecord = this.generatedMoveSet[i];
            if(prevRecord[0] == record[0] && prevRecord[1] == record[1] && prevRecord[2] == record[2])  
                return true;
        }
        return false;
    }
    //gắn thêm nút vào độ sâu này
    this.addNode = function(parentNode, depth) {
        if(depth % 2 == 1) {
            //min 
            (playerSide > 0) ? newNode = this.generateMove(this.blackAttackMap , this.piecePositions, depth) : 
            newNode = this.generateMove(this.whiteAttackMap , this.piecePositions, depth); 
        }
        else {
            //max
            (playerSide > 0) ? newNode = this.generateMove(this.whiteAttackMap, this.piecePositions, depth) :
            newNode = this.generateMove(this.blackAttackMap, this.piecePositions, depth);
        }
        if(newNode == null) return false;
        else
        {
            parentNode.children.push(newNode);
            newNode.parent = parentNode;
            return true;
        }
    }
}