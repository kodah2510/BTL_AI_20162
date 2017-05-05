const ROOK_VALUE = 1, KNIGHT_VALUE = 2, BISHOP_VALUE = 3, QUEEN_VALUE = 4, KING_VALUE = 5, PAWN_VALUE = 6
const WHITE_SIDE = 1, BLACK_SIDE = -1;
const PROMOTE_MOVE = 1,CASTLING_MOVE = 2, VALID_MOVE = 0, INVALID_MOVE = -1;
const TREE_DEPTH = 4;
var w,h;

var blackRookSprite, blackKnightSprite, blackBishopSprite, blackQueenSprite, blackKingSprite, blackPawnSprite;
var whiteRookSprite, whiteKnightSprite, whiteBishopSprite, whiteQueenSprite, whiteKingSprite, whitePawnSprite;

var clickedCol = null;
var clickedRow = null;
var prevCol = null;
var prevRow = null;
//player can switch side
var playerSide = undefined;
var isPlayerTurn = true;

var controller;
var recorder;
var validator;
var moveGenerator;
var evaluator;
//player chose the piece after the pawn has reach the end of the board
var isChecked;
//game tree
//var tree;
