//this will be the game tree
//depth % 2 == 0 --> max
//depth % 2 == 1 --> min
// tao tạo ra một lớp Depth thế này đọc xem 

//việc tạo ra nút mới phaải truyền alpha beta của nút cha xuông nút con
//có thể triển khai qua addNode
function Tree(moveMap, whiteAttackMap,blackAttackMap, pieceCount, piecePositions, moveRecord) {
    this.rootNode = new Node();

    this.moveMap = moveMap;
    this.blackAttackMap = blackAttackMap;
    this.whiteAttackMap = whiteAttackMap;
    this.piecePositions = piecePositions;
    this.pieceCount = pieceCount;
    this.moveRecord = moveRecord;

    this.search = function() {
        var depth_1 = new Depth(this.moveMap, 
                                this.whiteAttackMap, this.blackAttackMap, 
                                this.pieceCount, this.piecePositions, this.moveRecord);
        this.rootNode.point = this.maxValue(this.rootNode, depth_1, this.rootNode.alpha, this.rootNode.beta);
    }
    this.maxValue = function(state, depth, alpha, beta) {
        //kiểm tra 1 nút cần đượcu cắt tỉa đi 
        //nếu bị cắt tỉa thì đánh giá bàn cờ tại độ sau hiện tại 
        if(this.cutOffTest(state)) return this.eval(depth);
        //tạo ra các nút con mới cho nút state
        this.succesors(state, depth); 
        for(var i = 0 ; i < state.children.length; i++) {
            var s = state.children[i];
            // mỗi một nút lại có một trạng thái bàn cờ khác nhau 
            var nextDepth = new Depth(depth.moveMap, 
                                    depth.whiteAttackMap, depth.blackAttackMap,
                                    depth.pieceCount, depth.piecePositions, depth.moveRecord);
            nextDepth.update(s.record);
            alpha = max(alpha, this.minValue(s, nextDepth, s.alpha, s.beta));
            if(alpha >= beta) return beta;
        }
        console.log(alpha);
        return alpha;
    }
    this.minValue = function(state, depth, alpha, beta) {
        if(this.cutOffTest(state)) return this.eval(depth);
        this.succesors(state, depth);
        for(var i = 0; i < state.children.length; i++) {
            var s = state.children[i];
            var nextDepth = new Depth(depth.moveMap, 
                                    depth.whiteAttackMap, depth.blackAttackMap,
                                    depth.pieceCount, depth.piecePositions, depth.moveRecord);
            nextDepth.update(s.record);
            beta = min(beta, this.maxValue(s, nextDepth, s.alpha, s.beta));
            if(beta < alpha) return alpha;
        }
        console.log(beta);
        return beta;
    }
    //kiểm tra xem có nên cắt tỉa ko 
    this.cutOffTest = function(state) {
        if(state.alpha > state.beta) return true;
        if(this.getDepth(state) == TREE_DEPTH) {
           // if(this.isQuiesence(state)) return false;
            return true;
        }
        else return false;
    }
    //tạo ra các nước đi mới 
    this.succesors = function(state, depth) {
        var branchingFactor = 3;
        for(var i = 0; i < branchingFactor; i++) {
            depth.addNode(state, this.getDepth(state) + 1);
        }
    }
    this.getDepth = function(state) {
        if(state.parent == null) return 0;
        var countDepth = 1;
        var curNode = state;
        while(curNode.parent != null) {
            countDepth++;
            curNode = curNode.parent;
        }
        console.log("depth: ", countDepth);
        return countDepth;
    }
    this.eval = function(depth) {
        evaluator.evaluate( depth.pieceCount, depth.piecePositions, 
                            depth.whiteAttackMap, depth.blackAttackMap,
                            depth.moveMap);
    }
    this.isQuiesence = function(state, depth) {

    }
    this.test = function() {
        var depth = new Depth(this.moveMap, this.whiteAttackMap, this.blackAttackMap, this.pieceCount, this.piecePositions);
        for(var i = 0; i < 20; i++) {
            depth.addNode(this.rootNode, 1);
        }
    }
}
