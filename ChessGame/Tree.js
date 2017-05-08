/*

*/
function Tree(moveMap, whiteAttackMap,blackAttackMap, pieceCount, piecePositions, moveRecord) {
    this.rootNode = new Node();
    this.moveMap = moveMap;
    this.blackAttackMap = blackAttackMap;
    this.whiteAttackMap = whiteAttackMap;
    this.piecePositions = piecePositions;
    this.pieceCount = pieceCount;
    this.moveRecord = moveRecord;
    //áp dụng alpha beta để tìm nước đi tiếp theo
    this.search = function() {
        var ply_1 = new Ply(this.moveMap, 
                                this.whiteAttackMap, this.blackAttackMap, 
                                this.pieceCount, this.piecePositions, this.moveRecord);
        //console.log("test:", this.maxValue(this.rootNode, ply_1, this.rootNode.alpha, this.rootNode.beta));
        console.log(ply_1);
        //alpha beta thực hiện ở đây
        this.rootNode.point = this.maxValue(this.rootNode, ply_1 , 1);
        //tìm nút tiếp theo 
        try {
            var min = this.rootNode.children[0].beta;
            var index = 0; 
            for(var i = 1; i < this.rootNode.children.length; i++) {
                if(this.rootNode.children[i].beta < min){
                    index = i;
                    min = this.rootNode.children[i].beta;
                }
            }
            return this.rootNode.children[index].record;
        }
        catch(err) {
            console.log(err);
            console.log("error: childrenlen ", this.rootNode.children.length);
            for(var i = 0; i < this.rootNode.children.length; i++) 
                console.log(this.rootNode.children[i].beta, this.rootNode.children[i].record);
            console.log("index: ", index ,"record ",this.rootNode.children[index]);
        }
       
    }
    this.maxValue = function(state, ply, depth) {
        //kiểm tra 1 nút cần đượcu cắt tỉa đi 
        //nếu bị cắt tỉa thì đánh giá bàn cờ tại độ sau hiện tại 
        var cutOff = this.cutOffTest(state, ply, depth);
        if(cutOff > 0) return cutOff;
        //tạo ra các nút con mới cho nút state
        this.successors(state, ply, depth); 
        for(var i = 0 ; i < state.children.length; i++) {
            var s = state.children[i];
            // mỗi một nút lại có một trạng thái bàn cờ khác nhau 
            var nextply = new Ply(ply.moveMap, 
                                    ply.whiteAttackMap, ply.blackAttackMap,
                                    ply.pieceCount, ply.piecePositions, ply.moveRecord);
            console.log(s.record);
            nextply.update(s.record);
            //lấy alpha dựa vào nút con 
            state.alpha = Math.max(state.alpha, this.minValue(s, nextply, depth+1));
            if(state.alpha >= state.beta) return state.beta;
        }
        console.log("alpha :", state.alpha);
        return state.alpha;
    }
    this.minValue = function(state, ply, depth) {
        var cutOff = this.cutOffTest(state, ply, depth);
        if(cutOff > 0) return cutOff;
        this.successors(state, ply, depth);
        for(var i = 0; i < state.children.length; i++) {
            var s = state.children[i];
            var nextply = new Ply(ply.moveMap, 
                                    ply.whiteAttackMap, ply.blackAttackMap,
                                    ply.pieceCount, ply.piecePositions, ply.moveRecord);
            nextply.update(s.record);
            state.beta = Math.min(state.beta, this.maxValue(s, nextply, depth+1));
            if(state.beta < state.alpha) return state.alpha;
        }
        console.log("beta: ", state.beta);
        return state.beta;
    }
    //kiểm tra xem có nên cắt tỉa ko 
    this.cutOffTest = function(state, ply, depth) {
        if(state.alpha >= state.beta) return this.eval(ply, depth);
        if(depth == TREE_DEPTH) {
            return this.quiesence(state.alpha, state.beta, ply, depth);
        }
        else return -1;
    }
    //tạo ra các nước đi mới 
    this.successors = function(state, ply, depth) {
        var branching = 20;
        for(var i = 0; i < branching; i++)
            ply.addNode(state, depth);
    }
    // đánh giá tại độ sâu hiện tại 
    this.eval = function(ply, depth) {
        return evaluator.evaluate( ply.pieceCount, ply.piecePositions, 
                            ply.whiteAttackMap, ply.blackAttackMap,
                            ply.moveMap, depth);
    }
    this.quiesence = function(alpha, beta, ply, depth) {
        var stand_pat = this.eval(ply, depth);
        if(stand_pat >= beta) return beta;
        if(alpha < stand_pat) alpha = stand_pat;
        var attackMap;
        if(depth % 2 == 0)
        {
            if(playerSide == WHITE_SIDE) attackMap = ply.whiteAttackMap;
            else attackMap = ply.blackAttackMap;
        } 
        else
        {
            if(playerSide == WHITE_SIDE) attackMap = ply.blackAttackMap;
            else attackMap = ply.whiteAttackMap;
        }
        var moveArr = ply.makeMove(attackMap, depth);
        var capArr = ply.makeCaptureMove(moveArr, depth);
        if(capArr.length == 0) return alpha;
        else 
        {
            for(var index in capArr)
            {
                var nextply = new Ply(ply.moveMap, 
                                    ply.whiteAttackMap, ply.blackAttackMap,
                                    ply.pieceCount, ply.piecePositions, ply.moveRecord);
                nextply.update(capArr[index]);
                var score = 0;
                score = -this.quiesence(-beta, -alpha, nextply, depth+1);
                if(score >= beta) return beta;
                if(score > alpha) return alpha = score;
            }
            return alpha;
        }
    }
    this.test = function() {
        var ply = new Ply(this.moveMap, this.whiteAttackMap, this.blackAttackMap, this.pieceCount, this.piecePositions);
        this.successors(this.rootNode, ply);
    }
}
