"use strict";

// Vincent Vencill
// Lab 8 - Data Structures - Card Object

var cardSheet = new Image();
cardSheet.src = "allcards.png";

function card(rank,suit,x,y,visible)
{
	this.rank = rank;
	this.suit = suit;
	// Black = 0, Red = 1
	if(this.suit == "clubs" || this.suit == 3)
	{
		this.suit = 3;
		this.color = 0;
	}
	if(this.suit == "spades" || this.suit == 2)
	{
		this.suit = 2;
		this.color = 0;
	}
	if(this.suit == "hearts" || this.suit == 1)
	{
		this.suit = 1;
		this.color = 1;
	}
	if(this.suit == "diamonds" || this.suit == 0)
	{
		this.suit = 0;
		this.color = 1;
	}
	this.x = x;
	this.y = y;
	this.pixelWidth = 97;
	this.pixelHeight = 129;
	this.visible = visible;
}



card.prototype.getSuit = function()
{
	return this.suit;
}

card.prototype.getRank = function()
{
	return this.rank;
}

card.prototype.getColor = function()
{
	return this.color;
}

card.prototype.ifDifferentColor = function(c2)
{
	if(this.getColor() == 0 && c2.getColor() == 1)
		return true;
	if(this.getColor() == 1 && c2.getColor() == 0)
		return true;
	else
		return false;
}

card.prototype.setPosition = function(x,y)
{
	this.x = x;
	this.y = y;
}

card.prototype.togVisible = function(b)
{
	if(b == true)
		this.visible = true;
	if(b == false)
		this.visible = false;
}
	

card.prototype.isMouseOver = function(mouseX, mouseY)
{
	if(mouseX>this.x && mouseX<(this.x+this.pixelWidth) && mouseY>this.y && mouseY<(this.y+this.pixelHeight))
		return true;
	else
		return false;
}

card.prototype.draw = function(context)
{
	if(this.visible == true)
	{
		this.sheetX = ((this.rank - 1) * this.pixelWidth);
		this.sheetY = (this.suit * this.pixelHeight);
	}
	else
	{
		this.sheetX = 4 * this.pixelWidth;
		this.sheetY = 4 * this.pixelHeight;
	}
	context.drawImage(cardSheet, this.sheetX, this.sheetY, this.pixelWidth, this.pixelHeight, this.x, this.y, this.pixelWidth, this.pixelHeight);
}
