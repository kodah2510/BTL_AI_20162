function MoveGenerator() {
    this.makeAMove = function(record) {
        var value, prevCol, prevRow, clickedCol, clickedRow;
        value = record[0];
        clickedCol = Math.floor(record[2] / 10);
        clickedRow = Math.floor(record[2] % 10);
        if(record[1] < 0) {
            if(record[1] < -CASTLING_MOVE) {
                var pos = Math.abs(record[1]);
                prevCol = floor(pos / 10);
                prevRow = floor(pos % 10);
                controller.grid[prevCol][prevRow].sprite = null;
                recorder.removePiece(recorder.moveMap[prevCol][prevRow], prevCol, prevRow);
                if(recorder.moveMap[clickedCol][clickedRow] != 0) {
                    controller.grid[clickedCol][clickedRow].sprite = null;
                    recorder.removePiece(recorder.moveMap[clickedCol][clickedRow], clickedCol, clickedRow);
                }
                var newSprite;
                switch(value)
                {
                    case KNIGHT_VALUE: newSprite = whiteKnightSprite; break;
                    case QUEEN_VALUE: newSprite = whiteQueenSprite; break;
                    case -KNIGHT_VALUE: newSprite = blackKnightSprite; break;
                    case -QUEEN_VALUE: newSprite = blackQueenSprite; break;
                }
                controller.placeTheChessman(newSprite, clickedCol, clickedRow, value);
                //record capture move is different than nomral move 
                recorder.updateMoveRecord(null, null, null, null, recorder.moveRecord, record);
                recorder.updateAttackMap();
                return;
                }
            else if(record[1] == -CASTLING_MOVE) {
                (clickedCol > 4) ? prevCol = clickedCol - 2 : prevCol = clickedCol + 2; 
                prevRow = clickedRow;
                controller.castling(prevCol, prevRow, clickedCol, clickedRow);
                return;
            }
        }
        prevCol = Math.floor(record[1] / 10);
        prevRow = Math.floor(record[1] % 10);
        controller.moveTheChessman(prevCol, prevRow, clickedCol, clickedRow);
    }
}
