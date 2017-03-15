const ROOK_VALUE = 1, KNIGHT_VALUE = 2, BISHOP_VALUE = 3, QUEEN_VALUE = 4, KING_VALUE = 5, PAWN_VALUE = 6
const BLACK_SIDE = -1,WHITE_SIDE = 1;
var w,h;

var blackRookSprite
var blackKnightSprite;
var blackBishopSprite;
var blackQueenSprite;
var blackKingSprite;
var whitePawnSprite;
var blackKingSprite;
var blackPawnSprite;
var whiteRookSprite;
var whiteKnightSprite;
var whiteBishopSprite;
var whiteQueenSprite;
var whiteKingSprite;

var prevCol = null;
var prevRow = null;
//player can switch side
var playerSide = 1;;
var isPlayerTurn = true;

var controller = new Controller();
var recorder = new Recorder();
var validator = new Validator();