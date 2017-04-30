function Node(record) {
    //value sẽ lưu trữ record cho nước đi tại 1 nút 
    //ví dụ record: [ROOK_VALUE, 10, 11];
    this.record = [];
    this.point = 0;
    this.parent;
    this.children = [];
    this.alpha = Infinity;
    this.beta = -Infinity;
    if(record != null) this.record = record;
}
