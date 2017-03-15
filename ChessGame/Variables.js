const BLACK_ROOK_VALUE = -1;
const BLACK_KNIGHT_VALUE = -2;
const BLACK_BISHOP_VALUE = -3;
const BLACK_QUEEN_VALUE = -4;
const BLACK_KING_VALUE = -5;
const BLACK_PAWN_VALUE = -6;

const WHITE_ROOK_VALUE = 1;
const WHITE_KNIGHT_VALUE = 2;
const WHITE_BISHOP_VALUE = 3;
const WHITE_QUEEN_VALUE = 4;
const WHITE_KING_VALUE = 5;
const WHITE_PAWN_VALUE = 6;
var w,h;

var blackRookSprite;
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


var prevChessman;
var prevCol;
var prevRow;
//player can switch side
var playerSide = 1;;
var isPlayerTurn = true;

var controller = new Controller();
var recorder = new Recorder();
var validator = new Validator();