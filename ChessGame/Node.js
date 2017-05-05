function Node(record) {
    //value sẽ lưu trữ record cho nước đi tại 1 nút 
    //ví dụ record: [ROOK_VALUE, 10, 11];
    this.record = [];
    this.point = 0;
    this.parent;
    this.children = [];
    this.alpha = -960;
    this.beta = 960;
    if(record != null) this.record = record;
}
