function MoveGenerator()
{

    //isPlayerTurn = true;
    /*
    Material balance
    Mobility, Board control
    Development
    Pawn formations
    King Safety - Tropism -> How easy it is for a piece to attack the opposing King
    f(p) = 200(K-K')
       + 9(Q-Q')
       + 5(R-R')
       + 3(B-B' + N-N')
       + 1(P-P')
       - 0.5(D-D' + S-S' + I-I')
       + 0.1(M-M') + ...
 
KQRBNP = number of kings, queens, rooks, bishops, knights and pawns
D,S,I = doubled, blocked and isolated pawns
M = Mobility (the number of legal moves)
     */
    this.whoToMove = -1;
    this.pieceWeight = [];
    //this need to be synchronize with the moveArr which will be create later :P
    /*
    pieceWeight = { '1':[5, 5],'2':[3, 3],'3':[3, 3],'4':[9, 9],'6':[1, 1],
                    '-1':[5, 5],'-2':[3, 3],'-3':[3, 3],'-4':[9, 9],'-6':[1, 1]};
                    */
    this.rookWeight = 5;
    this.knightAndBishopWeight = 3;
    this.queenWeight = 9;
    this.pawnWeight = 1;

	this.evaluate =function()
    {        
        return (this.materialEvaluate() + this.mobilityEvaluate()) * this.whoToMove;
    }
    this.materialEvaluate = function()
    {
        return  this.rookWeight * (recorder.pieceCount[1][0] - recorder.pieceCount[1][1]) +
                this.knightAndBishopWeight * (recorder.pieceCount[2][0] - recorder.pieceCount[2][1]) +
                this.knightAndBishopWeight * (recorder.pieceCount[3][0] - recorder.pieceCount[3][1]) +
                this.queenWeight * (recorder.pieceCount[4][0] - recorder.pieceCount[4][1]) +
                this.pawnWeight * (recorder.pieceCount[6][0] - recorder.pieceCount[6][1]);
    }
    this.countAttackedSquare = function(attackMap)
    {
        var count = 0;
        for(var i = 0; i < 8; i++)
        {
            for(var j = 0; j < 8; j++)
            {
                if(attackMap[i][j].length != 0) count++;
            }
        }
        return count;
    }
    this.mobilityEvaluate = function()
    {
        //calculate how many possible attack squares
        var mobility = (playerSide == WHITE_SIDE) ? this.countAttackedSquare(recorder.blackAttackMap): this.countAttackedSquare(recorder.whiteAttackMap);
        return mobility;//something
    }
    /*
    the evaluator return the value for each state of the game
    */
}