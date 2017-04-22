//denote Rook Knight Bishop Queen King Pawn 
//		 1	  2      3      4     5    6
//whiteSide 1
//blackSide -1
//Example blackRook = -1 whiteQueen = 4 blackKing = -5

function preload() {
	// load an external image into each variable
	blackRookSprite 	= loadImage("ChessSprite/blackRook.png");
	blackKnightSprite 	= loadImage("ChessSprite/blackKnight.png");
	blackBishopSprite 	= loadImage("ChessSprite/blackBishop.png");
	blackQueenSprite 	= loadImage("ChessSprite/blackQueen.png");
	blackKingSprite 	= loadImage("ChessSprite/blackKing.png");
	blackPawnSprite 	= loadImage("ChessSprite/blackPawn.png");
	whitePawnSprite 	= loadImage("ChessSprite/whitePawn.png");
	whiteRookSprite 	= loadImage("ChessSprite/whiteRook.png");
	whiteKnightSprite 	= loadImage("ChessSprite/whiteKnight.png");
	whiteBishopSprite 	= loadImage("ChessSprite/whiteBishop.png");
	whiteQueenSprite 	= loadImage("ChessSprite/whiteQueen.png");
	whiteKingSprite 	= loadImage("ChessSprite/whiteKing.png");
	whitePawnSprite 	= loadImage("ChessSprite/whitePawn.png");

	
}

function setup() {
	// Initialising game board
	var myCanvas = createCanvas(480, 480);
	myCanvas.id("myCanvas");

	// Column size and row size
	w = width / 8;
	h = height / 8;
	
	controller = new Controller();
	recorder = new Recorder();
	validator = new Validator();
	moveGenerator = new MoveGenerator();

	//chosing side
	$('#choseSideModal').modal();
	$('#choseSideModalBody').click(function(event) {
		if ($(event.target).is('#choseWhiteSide') || $(event.target).is('#whiteSideImg')) playerSide = WHITE_SIDE;
		else playerSide = BLACK_SIDE;
		$("#choseSideModal").modal('toggle');
		recorder.updateAttackMap();
		//create board game after player chose a side
	});	
	
	controller.placeTheChessman(whiteRookSprite, 0, 7, ROOK_VALUE);
	//controller.placeTheChessman(whiteRookSprite, 7, 7, ROOK_VALUE);
	controller.placeTheChessman(whiteKingSprite, 4, 7, KING_VALUE);
	controller.placeTheChessman(whiteBishopSprite, 7, 1, BISHOP_VALUE);
	//controller.placeTheChessman(whiteQueenSprite, 4, 1, QUEEN_VALUE);
	controller.placeTheChessman(whitePawnSprite, 1, 1, PAWN_VALUE);
	controller.placeTheChessman(blackPawnSprite, 3, 4, -PAWN_VALUE);
	controller.placeTheChessman(whitePawnSprite, 3, 6, PAWN_VALUE);
	controller.placeTheChessman(whiteKnightSprite, 3, 2, KNIGHT_VALUE);
	controller.placeTheChessman(blackRookSprite, 2, 0, -ROOK_VALUE);
	//controller.placeTheChessman(blackRookSprite, 0, 5, -ROOK_VALUE);
	controller.placeTheChessman(blackKnightSprite, 7, 4, -KNIGHT_VALUE);
	//controller.placeTheChessman(blackKingSprite, 4, 2, -KING_VALUE);
	controller.placeTheChessman(blackBishopSprite, 0, 1, -BISHOP_VALUE);
	controller.placeTheChessman(blackQueenSprite, 6, 1, -QUEEN_VALUE);
	// Initialize game board
	//playerSide = controller.createGameBoard();
	
	myCanvas.mouseClicked(makeAMove);
	noLoop();
}

function draw() {
	background(51);
	// Display chess board
	controller.render();
	if (!isPlayerTurn) moveGenerator.makeAMove(); 
}

// When the human player make a move
function makeAMove() {
	var t0 = performance.now();
	clickedCol = floor(mouseX / w);
	clickedRow = floor(mouseY / h);
	// Validating the move
	if (isPlayerTurn) {
		// If player clicked on an empty grid
		//CHECKED
		if (prevCol != null && controller.grid[clickedCol][clickedRow].sprite == null) {
			// Player move the piece
			// Checking whether the move is valid or not
			// Need to fix this one
			var result = validator.validateMove(prevCol, prevRow, clickedCol, clickedRow);
			switch (result) {
				case INVALID_MOVE: break;
				case VALID_MOVE:
				//CHECKED
					if (validator.detectCheck(prevCol, prevRow, clickedCol, clickedRow)) {
						controller.moveTheChessman(prevCol, prevRow, clickedCol, clickedRow);
						prevCol = null; prevRow = null;
						//isPlayerTurn = false;
					}
					redraw();
					break;
				//special move
				case CAPTURE_MOVE: 
					//CHECKED
					controller.capture(prevCol, prevRow, clickedCol, clickedRow);
					//isPlayerTurn = false;
					break;
				case CASTLING_MOVE:
				//CHECKED
					controller.castling(prevCol, prevRow, clickedCol, clickedRow);
					prevCol = null; prevRow = null;
					//isPlayerTurn = false;
					redraw();
					break;
			}
			// Opponent makes the next move
			
		}
		// Player clicked on opponent's piece
		else if (prevCol != null && recorder.moveMap[clickedCol][clickedRow] * playerSide < 0) {
			var result = validator.validateMove(prevCol, prevRow, clickedCol, clickedRow);
			switch (result) {
				case INVALID_MOVE: break;
				case VALID_MOVE:
					//player take down opponent piece
					//pieceCount need to update 
					if (validator.detectCheck(prevCol, prevRow, clickedCol, clickedRow)) {
						var opponentPieceValue = Math.abs(recorder.moveMap[clickedCol][clickedRow]);
						controller.moveTheChessman(prevCol, prevRow, clickedCol, clickedRow);
						//isPlayerTurn = false;
						prevCol = null; prevRow = null;
					}
					redraw();
					break;
				case CAPTURE_MOVE:
					controller.capture(prevCol, prevRow, clickedCol, clickedRow);
					//isPlayerTurn = false;
					break;
			}
		}
		//player clicked his piece
		else if (recorder.moveMap[clickedCol][clickedRow] * playerSide > 0) {prevCol = clickedCol; prevRow = clickedRow;}
	}
	
	var t1 = performance.now();
	console.log("makeAmove: " + (t1 - t0));
	//isPlayerTurn = false;
	//update the game
	//UpdateTheGame();
	//Generate next move
	//GenerateNextMove();
	//update the game
	//UpdateTheGame();
}
