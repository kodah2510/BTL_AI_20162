//this will be the game tree
//depth % 2 == 0 --> max
//depth % 2 == 1 --> min
//
function Tree(currentState) {
    this.rootNode;
    //boardState contains piecePositions
    this.boardState = currentState;
    this.whiteMoveSet = [];
    this.blackMoveSet = [];
    // tạo ra tập các nước đi 
    // hàm sẽ kiểm tra các quân cờ đang có và khả năng di chuyển của xong 
    // để add vào trong mảng moveset ở trên
    this.initializeMoveSet = function() {
        var move = [];
        //xét từng quân cờ 
        for (var pieceValue in recorder.piecePositions) {
            //move sẽ có định dạng [VALUE, prevPos, curPos]
            //dưới đây là trường hợp cho bên trắng
            (pieceValue > 0) ? this.addMove(pieceValue, this.whiteMoveSet, recorder.whiteAttackMap) : this.addMove(pieceValue, this.blackMoveSet, recorder.blackAttackMap);
        }
        console.log(this.whiteMoveSet);
        console.log(this.blackMoveSet);
    }
    this.addMove = function(pieceValue, moveSet, attackMap) {
        //xét từng quân cờ 
        //move sẽ có định dạng [VALUE, prevPos, curPos]
        //dưới đây là trường hợp cho bên trắng
        var value = parseInt(pieceValue);
        // push [VALUE]
       
        recorder.piecePositions[value].forEach(function(coordinate){
            var prevCoordinate = coordinate[0]*10 + coordinate[1];
            // move [VALUE, prevPos]
          
            for(var col = 0; col < 8; col++) {
                for(var row = 0; row < 8; row++) {
                    var move = [];
                    move.push(value);
                    move.push(prevCoordinate);
                    if(attackMap[col][row].indexOf(value) != -1) {
                        switch (Math.abs(value)) {
                            //kiểm tra thêm các nước đi có thỏa mãn luật chơi không vì có trường hợp 2 quân cờ có cungf giá trị biểu diễn 
                            //nhưng các nước đi lại không đúng luật 
                            case ROOK_VALUE:
                                if(col == coordinate[0] && row != coordinate[1] || 
                                    col != coordinate[0] && row == coordinate[1]) move.push(col*10 + row);
                                break;
                            case BISHOP_VALUE:
                                if(col - row == coordinate[0] - coordinate[1] || col + row == coordinate[0] + coordinate[1]) move.push(col*10 + row);
                                break;
                            case QUEEN_VALUE:
                                if(col == coordinate[0] || row == coordinate[1] || 
                                    col - row == coordinate[0] - coordinate[1] || col + row == coordinate[0] + coordinate[1])
                                    move.push(col*10 + row);
                                    break;
                            case PAWN_VALUE:
                            // chỗ này khá là phức tạp vì phải xét thêm trường hợp ăn quân hoặc di chuyển quân
                                if(playerSide > 0) {
                                    if( (col == coordinate[0] - 1 && row == coordinate[1] - 1) ||
                                        (col == coordinate[0] + 1 && row == coordinate[1] - 1)) 
                                            move.push(col * 10 + row);
                                } else {
                                    if( col == coordinate[0] - 1 && row == coordinate[1] + 1 ||
                                        col == coordinate[0] + 1 && row == coordinate[1] + 1)
                                            move.push(col * 10 + row);
                                }
                                break;
                            default: 
                                move.push(col*10 + row);
                                break;
                            } // end of switch cass
                            if(move.length == 3) { 
                                //var nextMove = move;
                                moveSet.push(move);
                            }
                    } // end of if(recorder.whiteAttackMap[col][row].indexOf(pieceValue) != -1)  
                } // end of for loop row 
            } // end of for loop col
        });
    }
    this.initialize = function() {
        var depth = 1;
        this.rootNode = new Node();
        this.rootNode.leftMostChild = new Node();
        if (depth % 2 == 0) { // người chơi MAX
            //thưởng viết giúp tao phân này :)) 
            //có this.whiteMoveSet với cả this.blackMoveSet gán làm sao cho đúng với playerSide nhé
            //mỗi một phần tử của this.whiteMoveSet có dạng [PIECE_VALUE, prevCol * 10 + prevRow, clickedCol * 10 + clickedRow]
            //nhiệm vụ bh là thử gán các cái giá trị vào từng node và xếp các node cho đúng vào trong hàm này 
        }
        this.rootNode.leftMostChild.rightSiblings.push(new Node());
    }
    this.addNode = function(parentNode, childNode) {

    }
    this.removeNode = function(node) {

    }
    this.traverseDF = function(node) {
        var currentNode = node;
        var visitStack = [];
        while(currentNode.children.length != 0) {
            currentNode.children.forEach(function(child) {
                visitStack.push(child);
            }, this);
            currentNode = currentNode.children[0];
        }
        visitStack.forEach(function(node){console.log(node)});
    }
    this.traverseBF = function() {

    }
}
