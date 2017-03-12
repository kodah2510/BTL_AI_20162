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
	
	controller.placeTheChessman(whiteRookSprite,3,6,1);
	controller.placeTheChessman(whiteKingSprite,3,7,5);
	controller.placeTheChessman(blackRookSprite,3,1,-1);
	
	//initialize game board
	//playerSide = controller.createGameBoard();
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
			if(prevChessman != null)
			{
				//checking whether the move is valid or not
				if(validator.validateMove(prevCol,prevRow,clickedCol,clickedRow))
				{
					recorder.updateMoveRecord(prevCol,prevRow,clickedCol,clickedRow);
					controller.moveTheChessman(prevCol,prevRow,clickedCol,clickedRow);
					prevChessman = null;
					prevCol = -1;
					prevRow = -1;
				}
			}
		}
		//player clicked opponent's piece
		else if(recorder.moveMap[clickedCol][clickedRow]*playerSide < 0)
		{
			if(validator.validateMove(prevChessman,prevCol,prevRow,clickedCol,clickedRow))
			{
				//grid[clickedCol][clickedRow].chessman = prevChessman.copy();
				recorder.updateMoveRecord();
				controller.moveTheChessman(prevCol,prevRow,clickedCol,clickedRow);
				prevChessman = null;
				prevCol = -1;
				prevRow = -1;
			}
		}
		//player clicked his piece
		else if(recorder.moveMap[clickedCol][clickedRow]*playerSide > 0)
		{
			//prevChessman = grid[clickedCol][clickedRow].chessman.copy();
			prevChessman = controller.grid[clickedCol][clickedRow].sprite;
			prevCol = clickedCol;
			prevRow = clickedRow;
		}
	}
	recorder.updateAttackMap();
	//isPlayerTurn = false;
	//update the game
	//UpdateTheGame();
	//Generate next move
	//GenerateNextMove();
	//update the game
	//UpdateTheGame();
}


