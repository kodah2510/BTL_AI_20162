function Node(value) {
    //value sẽ lưu trữ record cho nước đi tại 1 nút 
    //ví dụ record: [ROOK_VALUE, 10, 11];
    this.value = [];
    this.leftMostChild = null;
    this.rightSiblings = [];
    if (value != null)
        this.value = value;
}
