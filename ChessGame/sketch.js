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
	
	//controller.placeTheChessman(whiteRookSprite, 0, 7, ROOK_VALUE);
	controller.placeTheChessman(whiteRookSprite, 7, 7, ROOK_VALUE);
	controller.placeTheChessman(whiteKingSprite, 4, 7, KING_VALUE);
	controller.placeTheChessman(whiteBishopSprite, 7, 1, BISHOP_VALUE);
	//controller.placeTheChessman(whiteQueenSprite, 4, 1, QUEEN_VALUE);
	controller.placeTheChessman(whitePawnSprite, 1, 1, PAWN_VALUE);
	controller.placeTheChessman(blackPawnSprite, 3, 1, -PAWN_VALUE);
	/*controller.placeTheChessman(whitePawnSprite, 3, 6, PAWN_VALUE);
	controller.placeTheChessman(whiteKnightSprite, 3, 2, KNIGHT_VALUE);
	controller.placeTheChessman(blackRookSprite, 2, 2, -ROOK_VALUE);
	controller.placeTheChessman(blackRookSprite, 3, 2, -ROOK_VALUE);
	controller.placeTheChessman(blackKnightSprite, 6, 4, -KNIGHT_VALUE);
	controller.placeTheChessman(blackKingSprite, 4, 2, -KING_VALUE);
	controller.placeTheChessman(whiteKingSprite, 3, 7, 5);
	controller.placeTheChessman(blackRookSprite, 3, 1, -1);
	controller.placeTheChessman(whiteBishopSprite, floor(random(0, 7)), floor(random(0, 7)), 3);
	controller.placeTheChessman(whiteQueenSprite, floor(random(0, 7)), floor(random(0, 7)), 4);
	controller.placeTheChessman(whiteKnightSprite, floor(random(0, 7)), floor(random(0, 7)), 2);
	controller.placeTheChessman(whitePawnSprite, floor(random(0, 7)), floor(random(0, 7)), 6);
	*/
	
	// Initialize game board
	//playerSide = controller.createGameBoard();
	
	myCanvas.mouseClicked(makeAMove);
	noLoop();
}

function draw() {
	background(51);
	// Display chess board
	controller.render();
	if (!isPlayerTurn) moveGenerator.evaluate(); 
}

// When the human player make a move
function makeAMove() {
	var t0 = performance.now();
	clickedCol = floor(mouseX / w);
	clickedRow = floor(mouseY / h);
	// Validating the move
	if (isPlayerTurn) {
		// If player clicked on an empty grid
		if (prevCol != null && controller.grid[clickedCol][clickedRow].sprite == null) {
			// Player move the piece
			// Checking whether the move is valid or not
			// Need to fix this one
			var result = validator.validateMove(prevCol, prevRow, clickedCol, clickedRow);
			switch (result) {
				case INVALID_MOVE: break;
				case VALID_MOVE:
					if (validator.detectCheck(prevCol, prevRow, clickedCol, clickedRow)) {
						controller.moveTheChessman(prevCol, prevRow, clickedCol, clickedRow);
						prevCol = null; prevRow = null;
						//isPlayerTurn = false;
					}
					redraw();
					break;
				//special move
				case CAPTURE_MOVE: 
					controller.capture(prevCol, prevRow, clickedCol, clickedRow);
					prevCol = null; prevRow = null;
					//isPlayerTurn = false;
					redraw();
					break;
				case CASTLING_MOVE:
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
				case INVALID_MOVE:
					break;
				case VALID_MOVE:
					//player take down opponent piece
					//pieceCount need to update 
					if (validator.detectCheck(prevCol, prevRow, clickedCol, clickedRow)) {
						var opponentPieceValue = Math.abs(recorder.moveMap[clickedCol][clickedRow]);
						recorder.pieceCount[opponentPieceValue][1] -= 1;
						controller.moveTheChessman(prevCol, prevRow, clickedCol, clickedRow);
						prevCol = null;
						prevRow = null;
						//isPlayerTurn = false;
					}
					redraw();
					break;
				case CAPTURE_MOVE:
					controller.capture();
					//isPlayerTurn = false;
					redraw();
					break;
			}
		}
		//player clicked his piece
		else if (recorder.moveMap[clickedCol][clickedRow] * playerSide > 0) {
			//prevChessman = grid[clickedCol][clickedRow].chessman.copy();
			prevCol = clickedCol;
			prevRow = clickedRow;
		}
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
