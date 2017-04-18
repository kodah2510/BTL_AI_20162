function Grid(col, row)
{
	this.col = col;
	this.row = row;
	this.sprite;
	
	this.show = function() {
		if ((this.col + this.row) % 2 == 0) {
			noStroke();
			fill(255);
			rect(this.col * w, this.row * h, w, h);
		} else {
			noStroke();
			fill(color(0, 121, 35));
			rect(this.col * w, this.row * h, w, h);
		}
		
		if (this.sprite != null)
			image(this.sprite, this.col * w, this.row * h, w, h);
	}
}
