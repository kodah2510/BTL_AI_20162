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
            var index; 
            for(var i = 1; i < this.rootNode.children.length; i++) {
                if(this.rootNode.children[i].beta < min){
                    index = i;
                    min = this.rootNode.children[i].beta;
                }
            }
            return this.rootNode.children[index].record;
        }
        catch(err) {
            console.log("error: childrenlen ", this.rootNode.children.length);
            for(var i = 0; i < this.rootNode.children.length; i++) 
                console.log(this.rootNode.children[i].beta, this.rootNode.children[i].record);
            console.log("index: ", index ,"record ",this.rootNode.children[index]);
        }
       
    }
    this.maxValue = function(state, ply, depth) {
        //kiểm tra 1 nút cần đượcu cắt tỉa đi 
        //nếu bị cắt tỉa thì đánh giá bàn cờ tại độ sau hiện tại 
        if(this.cutOffTest(state, depth)) return this.eval(state, ply, depth);
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
        if(this.cutOffTest(state, depth)) return this.eval(state, ply);
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
    this.cutOffTest = function(state ,depth) {
        if(state.alpha >= state.beta || Math.abs(state.alpha) > 960 || Math.abs(state.beta) > 960 ) return true;
        if(depth == TREE_DEPTH) {
            //if(this.isQuiesence(state)) return false;
            return true;
        }
        else return false;
    }
    //tạo ra các nước đi mới 
    this.successors = function(state, ply, depth) {
        var branching = 5;
        for(var i = 0; i < branching; i++)
            ply.addNode(state, depth);
    }
    // đánh giá tại độ sâu hiện tại 
    this.eval = function(state, ply, depth) {
        return evaluator.evaluate( ply.pieceCount, ply.piecePositions, 
                            ply.whiteAttackMap, ply.blackAttackMap,
                            ply.moveMap, depth);
    }
    this.isQuiesence = function(state, ply) {
        
    }
    this.test = function() {
        var ply = new Ply(this.moveMap, this.whiteAttackMap, this.blackAttackMap, this.pieceCount, this.piecePositions);
        this.successors(this.rootNode, ply);
    }
}
