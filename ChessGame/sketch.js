//denote Rook Knight Bishop Queen King Pawn 
//		 1	  2      3      4     5    6
//whiteSide 1
//blackSide -1
//Example blackRook = -1 whiteQueen = 4 blackKing = -5

function preload()
{
	//testing github
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

function setup()
{
	var myCanvas = createCanvas(480,480);

	myCanvas.id("myCanvas");
	//colSize rowSize
	w = width/8;
	h = height/8;
	
	controller.init();
	recorder.init();
	
	controller.placeTheChessman(whiteRookSprite,0,0,WHITE_ROOK_VALUE);
	controller.placeTheChessman(blackRookSprite,3,1,BLACK_ROOK_VALUE);
	controller.placeTheChessman(whiteKingSprite,3,7,WHITE_KING_VALUE);
	controller.placeTheChessman(whiteBishopSprite,4,7,WHITE_BISHOP_VALUE);
	controller.placeTheChessman(whiteQueenSprite,7,4,WHITE_QUEEN_VALUE);
	controller.placeTheChessman(whitePawnSprite,5,6,WHITE_PAWN_VALUE);
	controller.placeTheChessman(whitePawnSprite,2,6,WHITE_PAWN_VALUE);
	controller.placeTheChessman(whiteKnightSprite,3,2,WHITE_KNIGHT_VALUE);
	/*
	controller.placeTheChessman(whiteKingSprite,3,7,5);
	controller.placeTheChessman(blackRookSprite,3,1,-1);
	controller.placeTheChessman(whiteBishopSprite,floor(random(0,7)),floor(random(0,7)),3);
	controller.placeTheChessman(whiteQueenSprite,floor(random(0,7)),floor(random(0,7)),4);
	controller.placeTheChessman(whiteKnightSprite,floor(random(0,7)),floor(random(0,7)),2);
	controller.placeTheChessman(whitePawnSprite,floor(random(0,7)),floor(random(0,7)),6);
	*/
	
	//initialize game board
	//playerSide = controller.createGameBoard();
	recorder.updateAttackMap();
	myCanvas.mouseClicked(makeAMove);
	
}

function draw()
{
	background(51);
	//display chess board
	controller.render();
}
//player make a move
function makeAMove()
{
	var t0 = performance.now();
	var clickedCol;
	var clickedRow;
	
	clickedCol = floor(mouseX/w);
	clickedRow = floor(mouseY/h);
	//validate the move
	if(isPlayerTurn)
	{
		//player clicked empty grid
		if(controller.grid[clickedCol][clickedRow].sprite == null)
		{
			//Player move the piece
			if(prevCol != -1)
			{
				//checking whether the move is valid or not
				//need to fix this one
				var result = validator.validateMove(prevCol,prevRow,clickedCol,clickedRow);
				switch(result)
				{
					case 1:
						controller.capture();
						break;
					case 2:
						controller.castling();
						break;
					case 0:
						controller.moveTheChessman(prevCol,prevRow,clickedCol,clickedRow);
						prevCol = -1;
						prevRow = -1;
						break;
					case -1:
						break;
				}
			}
		}
		//player clicked opponent's piece
		else if(recorder.moveMap[clickedCol][clickedRow]*playerSide < 0)
		{
			var result = validator.validateMove(prevCol,prevRow,clickedCol,clickedRow);
			switch(result)
			{
				case 0:
					controller.moveTheChessman(prevCol,prevRow,clickedCol,clickRow);
					prevCol = -1;
					prevRow = -1;
					break;
				case -1:
					break;
				case 1:
					controller.capture();
					break;
			}
		}
		//player clicked his piece
		else if(recorder.moveMap[clickedCol][clickedRow]*playerSide > 0)
		{
			//prevChessman = grid[clickedCol][clickedRow].chessman.copy();
			prevCol = clickedCol;
			prevRow = clickedRow;
		}
	}
	redraw();
	var t1 = performance.now();
	console.log(t1-t0);
	//isPlayerTurn = false;
	//update the game
	//UpdateTheGame();
	//Generate next move
	//GenerateNextMove();
	//update the game
	//UpdateTheGame();
}
