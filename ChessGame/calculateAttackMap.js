Recorder.prototype.calculateAttackMapForRook = function(value,col,row,attackMap, moveMap) { 
    //only the attack range is limited at the first opponent piece it met 
    if(col != 0) {
        for(var i = col - 1; i >= 0 && moveMap[i][row]*value <= 0; i--) {
            if(attackMap[i][row].indexOf(value) == -1) {
                if(moveMap[i][row]*value < 0) { attackMap[i][row].push(value); break; }
                attackMap[i][row].push(value);
            }					
        }
    }
    if(col != 7) {
        for(var i = col + 1;i < 8 && moveMap[i][row]*value <= 0;i++) {
            if(attackMap[i][row].indexOf(value) == -1) {
                if(moveMap[i][row]*value < 0) { attackMap[i][row].push(value); break;}
                else attackMap[i][row].push(value);
            }					
        }
    }
    if(row != 0) {
        for(var i = row - 1; i >= 0 && moveMap[col][i]*value <= 0; i--) {
            if(attackMap[col][i].indexOf(value) == -1) {
                if(moveMap[col][i]*value < 0) { attackMap[col][i].push(value); break; }
                else attackMap[col][i].push(value);
            }					
        }
    }
    if (row != 7) {
        for (var i = row + 1; i < 8 && moveMap[col][i]*value <= 0; i++)
        {
            if (attackMap[col][i].indexOf(value) == -1) {
                if(moveMap[col][i]*value < 0) { attackMap[col][i].push(value); break;}
                else attackMap[col][i].push(value);
            }
        }
    }
}
	
	//CHECKED !
Recorder.prototype.calculateAttackMapForKnight = function(value, col, row, attackMap, moveMap)
{
    if ((col + 1 <= 7 && row - 2 >= 0) && attackMap[col + 1][row - 2].indexOf(value) == -1 && moveMap[col + 1][row - 2]*value <= 0 )
        attackMap[col + 1][row - 2].push(value);
    if ((col - 1 >= 0 && row - 2 >= 0) && attackMap[col - 1][row - 2].indexOf(value) == -1 && moveMap[col - 1][row - 2]*value <= 0 )
        attackMap[col - 1][row - 2].push(value);
    if ((col + 1 <= 7 && row + 2 <= 7) && attackMap[col + 1][row + 2].indexOf(value) == -1 && moveMap[col + 1][row + 2]*value <= 0)
        attackMap[col + 1][row + 2].push(value);
    if ((col - 1 >= 0 && row + 2 <= 7) && attackMap[col - 1][row + 2].indexOf(value) == -1 && moveMap[col - 1][row + 2]*value <= 0)
        attackMap[col - 1][row + 2].push(value);
    if ((col + 2 <= 7 && row - 1 >= 0) && attackMap[col + 2][row - 1].indexOf(value) == -1 && moveMap[col + 2][row - 1]*value <= 0)
        attackMap[col + 2][row - 1].push(value);
    if (col - 2 >= 0 && row - 1 >= 0 && attackMap[col - 2][row - 1].indexOf(value) == -1 && moveMap[col - 2][row - 1]*value <= 0)
        attackMap[col - 2][row - 1].push(value);
    if (col + 2 <= 7 && row + 1 <= 7 && attackMap[col + 2][row + 1].indexOf(value) == -1 && moveMap[col + 2][row + 1]*value <= 0)
        attackMap[col + 2][row + 1].push(value);
    if (col - 2 >= 0 && row + 1 <= 7 && attackMap[col - 2][row + 1].indexOf(value) == -1 && moveMap[col - 2][row + 1]*value <= 0)
        attackMap[col - 2][row + 1].push(value);
}
	//CHECKED

Recorder.prototype.calculateAttackMapForBishop = function(value,col,row,attackMap,moveMap) {
    var tlbrValue = col - row;//top-left ->> bottom-right
    var trblValue = col + row;//top-right ->> bottom-left
    if (col != 0) {
        for (var i = col - 1;i >= 0 && i - tlbrValue >= 0 && moveMap[i][i - tlbrValue]*value <= 0;i--) {
            //top-left
            currentRow = i - tlbrValue;
            if (attackMap[i][currentRow].indexOf(value) == -1) {
                if(moveMap[i][currentRow]*value < 0) {attackMap[i][currentRow].push(value);break;}
                else attackMap[i][currentRow].push(value);	
            }					
        }
        for (var i = col - 1;i >= 0 && trblValue - i <= 7 && moveMap[i][trblValue - i]*value <= 0;i--) {
            //bottom-left
            currentRow = trblValue - i;
            if (attackMap[i][currentRow].indexOf(value) == -1) {
                if(moveMap[i][currentRow]*value < 0) { attackMap[i][currentRow].push(value); break; }
                else attackMap[i][currentRow].push(value);
            }					
        }
    }
    if (col != 7) {
        for (var i = col + 1; i < 8 && i - tlbrValue <= 7 && moveMap[i][i - tlbrValue]*value <= 0 ; i++) {
            //bottom-right
            currentRow = i - tlbrValue;
            if (attackMap[i][currentRow].indexOf(value) == -1) {
                if(moveMap[i][currentRow]*value < 0) { attackMap[i][currentRow].push(value); break;}
                else attackMap[i][currentRow].push(value);
            }					
        }
        for (var i = col + 1; i < 8 && trblValue - i >= 0 && moveMap[i][trblValue - i]*value <=0; i++) {
            //top-left
            currentRow = trblValue - i;
            if(attackMap[i][currentRow].indexOf(value) == -1) {
                if(moveMap[i][currentRow]*value < 0) { attackMap[i][currentRow].push(value); break;}
                else attackMap[i][currentRow].push(value);
            }					
        }
    }
}
//CHECKED
Recorder.prototype.calculateAttackMapForQueen = function(value,col,row,attackMap, moveMap)
{
    this.calculateAttackMapForRook(value,col,row,attackMap, moveMap);
    this.calculateAttackMapForBishop(value,col,row,attackMap, moveMap);
}

//CHECKED
Recorder.prototype.calculateAttackMapForKing = function(value, col, row, attackMap) {
    //special case
    if (col == 0) {
        if (row == 0) {// right down bottom right 
            if(this.moveMap[col + 1][row]*value <= 0) attackMap[col + 1][row].push(value); //right
            if(this.moveMap[col + 1][row + 1]*value <= 0) attackMap[col + 1][row + 1].push(value); //bottom right
            if(this.moveMap[col][row + 1]*value <= 0) attackMap[col][row + 1].push(value); //down
            return;
        }
        if (row == 7) {// up top right right 
            if(this.moveMap[col][row - 1]*value <= 0) attackMap[col][row - 1].push(value); //up
            if(this.moveMap[col + 1][row - 1]*value <= 0) attackMap[col + 1][row - 1].push(value); //top right
            if(this.moveMap[col + 1][row]*value <= 0) attackMap[col + 1][row].push(value); //
            return;
        }
        else {// up top-right right bottom-right down
            if(this.moveMap[col][row - 1]*value <= 0) attackMap[col][row - 1].push(value); //up
            if(this.moveMap[col + 1][row - 1]*value <= 0) attackMap[col + 1][row - 1].push(value); //top right
            if(this.moveMap[col + 1][row]*value <= 0) attackMap[col + 1][row].push(value); //right
            if(this.moveMap[col + 1][row + 1]*value <= 0) attackMap[col + 1][row + 1].push(value); //bottom right
            if(this.moveMap[col][row]*value <= 0) attackMap[col][row + 1].push(value); //
            return;
        }
    }
    if (col == 7) {
        if (row == 0){// down bottom left left
            if(this.moveMap[col][row + 1]*value <= 0) attackMap[col][row + 1].push(value);//down
            if(this.moveMap[col - 1][row + 1]*value <= 0) attackMap[col - 1][row + 1].push(value); //bottom left
            if(this.moveMap[col - 1][row]*value <= 0) attackMap[col - 1][row].push(value); //left 
            return;
        }
        if (row == 7)
        {// up top left left
            if(this.moveMap[col][row - 1]*value <= 0) attackMap[col][row - 1].push(value); //up
            if(this.moveMap[col - 1][row - 1]*value <= 0) attackMap[col - 1][row - 1].push(value); //top left
            if(this.moveMap[col - 1][row]*value <= 0) attackMap[col - 1][row].push(value); //left		
            return;
        }
        else { //up top left left bottom left down
            if(this.moveMap[col][row - 1]*value <= 0) attackMap[col][row - 1].push(value); //up
            if(this.moveMap[col - 1][row - 1]*value <= 0) attackMap[col - 1][row - 1].push(value); //top left
            if(this.moveMap[col - 1][row]*value <= 0) attackMap[col - 1][row].push(value); //left
            if(this.moveMap[col - 1][row + 1]*value <= 0) attackMap[col - 1][row + 1].push(value); //bottom left
            if(this.moveMap[col][row + 1]*value <= 0) attackMap[col][row + 1].push(value);//down
            return;
        }
    } 
    else {
        if(col == 4) {
            attackMap[col + 2][row].push(value);
            attackMap[col - 2][row].push(value);
        }
        if (row == 0) {
            if(this.moveMap[col - 1][row]*value <= 0) attackMap[col - 1][row].push(value); //left
            if(this.moveMap[col - 1][row + 1]*value <= 0) attackMap[col - 1][row + 1].push(value);//bottom left
            if(this.moveMap[col][row + 1]*value <= 0) attackMap[col][row + 1].push(value);//down
            if(this.moveMap[col + 1][row + 1]*value <= 0) attackMap[col + 1][row + 1].push(value);//bottom right
            if(this.moveMap[col + 1][row]*value <= 0) attackMap[col + 1][row].push(value);//right
            return;
        }
        else if (row == 7) { // left top left up top right right
            if(this.moveMap[col - 1][row]*value <= 0) attackMap[col - 1][row].push(value); //left
            if(this.moveMap[col - 1][row - 1]*value <= 0) attackMap[col - 1][row - 1].push(value);//top left
            if(this.moveMap[col][row - 1]*value <= 0) attackMap[col][row - 1].push(value); //up
            if(this.moveMap[col + 1][row - 1]*value <= 0) attackMap[col + 1][row - 1].push(value); //top right
            if(this.moveMap[col + 1][row]*value <= 0) attackMap[col + 1][row].push(value); //right
            return;
        } 
        else {
            if(this.moveMap[col][row - 1]*value <= 0) attackMap[col][row - 1].push(value); //up
            if(this.moveMap[col][row + 1]*value <= 0) attackMap[col][row + 1].push(value); //down
            if(this.moveMap[col + 1][row]*value <= 0) attackMap[col + 1][row].push(value); //right
            if(this.moveMap[col - 1][row]*value <= 0) attackMap[col - 1][row].push(value); //left
            if(this.moveMap[col + 1][row + 1]*value <= 0) attackMap[col + 1][row + 1].push(value); //bottom right
            if(this.moveMap[col - 1][row - 1]*value <= 0) attackMap[col - 1][row - 1].push(value); //top left
            if(this.moveMap[col + 1][row - 1]*value <= 0) attackMap[col + 1][row - 1].push(value); //top right
            if(this.moveMap[col - 1][row + 1]*value <= 0) attackMap[col - 1][row + 1].push(value); //bottom left
            return;
        }
    }
            
}

//CHECKED
Recorder.prototype.calculateAttackMapForPawn = function(value, col, row, attackMap, moveMap) {
    if (value * playerSide < 0) {
        //computer
        if(row == 1) {
            if(moveMap[col][row + 1] == 0) attackMap[col][row + 1].push(value);
            if(moveMap[col][row + 2] == 0) attackMap[col][row + 2].push(value);
        }
        else {
            if(moveMap[col][row + 1] == 0) attackMap[col][row + 1].push(value);
        }
        if (col == 0) {
            if (attackMap[col + 1][row + 1].indexOf(value) == -1 && this.moveMap[col + 1][row + 1]*playerSide > 0)
                attackMap[col + 1][row + 1].push(value);
            return;
        }
        else if (col == 7) {
            if (attackMap[col - 1][row + 1].indexOf(value) == -1 && this.moveMap[col - 1][row + 1]*playerSide > 0)
                attackMap[col - 1][row + 1].push(value);
            return;
        }
        else {
            if (attackMap[col - 1][row + 1].indexOf(value) == -1 && this.moveMap[col - 1][row + 1]*playerSide > 0)
                attackMap[col - 1][row + 1].push(value);
            if (attackMap[col + 1][row + 1].indexOf(value) == -1 && this.moveMap[col - 1][row + 1]*playerSide > 0)
                attackMap[col + 1][row + 1].push(value);
            return;
        }
    }
    else {
        //player
        if(row == 7) {
            if(moveMap[col][row - 1] == 0) attackMap[col][row - 1].push(value);
            if(moveMap[col][row - 2] == 0) attackMap[col][row - 2].push(value);
        }
        else {
            if(moveMap[col][row - 1] == 0) attackMap[col][row - 1].push(value);
        }
        if (col == 0) {
            if (attackMap[col + 1][row - 1].indexOf(value) == -1 && this.moveMap[col + 1][row - 1]*playerSide < 0)
                attackMap[col + 1][row - 1].push(value);
            return;
        }
        if (col == 7) {
            if (attackMap[col - 1][row - 1].indexOf(value) == -1 && this.moveMap[col - 1][row - 1]*playerSide < 0)
                attackMap[col - 1][row - 1].push(value);
            return;
        }
        else {
            if (attackMap[col - 1][row - 1].indexOf(value) == -1 && this.moveMap[col - 1][row - 1]*playerSide < 0)
                attackMap[col - 1][row - 1].push(value);
            if (attackMap[col + 1][row - 1].indexOf(value) == -1 && this.moveMap[col + 1][row - 1]*playerSide < 0)
                attackMap[col + 1][row - 1].push(value);
            return;
        }	
        
    }
}