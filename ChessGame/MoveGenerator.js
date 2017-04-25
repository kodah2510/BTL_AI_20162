function MoveGenerator() {
    //get the move from evaluator
    this.nextMoveRecord = [];
    this.getTheNextMove = function() {
        
    }
    this.makeAMove = function() {
        var prevCol, prevRow, currentCol, currentRow;
        prevCol = this.nextMoveRecord[1] / 10;
        prevRow = this.nextMoveRecord[1] % 10;
        currentCol = this.nextMoveRecord[2] / 10;
        currentRow = this.nextMoveRecord[2] % 10;
        controller.moveTheChessman(prevCol, prevRow, currentCol, currentRow);
    }
}