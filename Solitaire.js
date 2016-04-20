"use strict";

// Vincent Vencill
// Lab 8 - Data Structures

var cvs,ctx;
var d = [];
var foundations = [[],[],[],[]];
var piles = [[],[],[],[],[],[],[]];
var verticaldrop = 170;
var xgap = 15;
var ygap = 15;
var cardWidth = 97;
var cardHeight = 129;
var victory = false;
var vicp1 = new Image();
var vicp2 = new Image();
vicp1.src = "victory1.png";
vicp2.src = "victory2.png";
var viccount = 0;

// Adding all 52 cards to a deck and set them to not visible, then shuffle them
for (var r = 1; r < 14; r++)
{
	for (var s = 0; s < 4; s++)
	{
		d.push(new card(r, s, 0, 0, false));
	}
}

// Shuffle deck, change shuff_num to change number of shuffles
var shuff_num = 4;
for (var t = 0; t < shuff_num; t++)
{
	var d1 = d.slice(0,d.length/2);
	var d2 = d.slice(d.length/2, d.length);
	d = [];
	
	// Shuffle method
	while(d1.length > 0 || d2.length > 0)
	{
		var c = Math.floor(Math.random()*2);
		if(c >= 1 && d1.length > 0)
		{
			d.push(d1.pop());
		}
		c = Math.floor(Math.random()*2)
		if(c >= 1 && d2.length > 0)
		{
			d.push(d2.pop());
		}
	}
}


// Adding cards to piles
for (var p = 0; p < 7; p++)
{
	for (var c = 0; c < p+1; c++)
	{
		piles[p].push(d.pop());
	}
}

// Adjusting position of the piles
for (p = 0; p < piles.length; p++)
{
	for (c = 0; c < piles[p].length; c++)
	{
		piles[p][c].setPosition((xgap * (p+1)) + (cardWidth * p), (ygap * c) + verticaldrop);
	}
}

// Make cards at end of pile visible
for (p = 0; p < piles.length; p++)
{
	piles[p][piles[p].length-1].togVisible(true);
}

// Puts remaining cards in deck into a linked list
var deck = new List();
while (d.length > 0) deck.insert(d.pop());
deck.cursorToStart();
var drawPileTop = deck.getAfterCursor();
var withdrawPileTop = deck.getBeforeCursor();
drawPileTop.setPosition(xgap, ygap);

var mx, my;
var xoff, yoff;
var clicked = false;
var dragging;
var lastPileNum;
var validDrop;

function main()
{
	// Create context
	// and listen for mouse event.

	cvs = document.getElementById("canvas");
	ctx = cvs.getContext('2d');
	cvs.addEventListener("mousedown", mousedown_call);
	cvs.addEventListener("mouseup", mouseup_call);
	cvs.addEventListener("mousemove", mousemove_call);
	draw();
}

function mousemove_call(ev)
{
	// Checks to see if mouse is clicked, then checks to see
	// if mouse is within any of the cards boundaries, 
	// then sets card position while moving.
	mx = ev.clientX - cvs.offsetLeft;
	my = ev.clientY - cvs.offsetTop;
	
	if(clicked == true)
	{
		dragging.x = mx - xoff;
		dragging.y = my - yoff;
	}
	
	draw();
	
}

function mouseup_call(ev)
{
	// Set clicked flag to false and clear active cards when key is up.
	clicked = false;
	if (dragging !== undefined)
	{
		// Goes through piles to find which pile or foundation the card is over, then set position
		for (var p=0;p<piles.length;p++)
		{
			if (piles[p].length !== 0)
			{
				if (dragging.x > (xgap * (p+1)) - 15 + (cardWidth * p) && dragging.x < (xgap * (p+1)) + (cardWidth * (p+1)) - 40 && dragging.y > piles[p][piles[p].length - 1].y && dragging.y < piles[p][piles[p].length - 1].y + cardHeight)
				{
					if (dragging.getRank() == (piles[p][piles[p].length-1].getRank() - 1) && dragging.ifDifferentColor(piles[p][piles[p].length-1]) == true)
					{
						validDrop = true;
						piles[p].push(dragging);
						dragging.setPosition(xgap * (p+1) + (cardWidth * p), verticaldrop + ((piles[p].length-1) * ygap));
					}
				}
			}
			if (piles[p].length == 0)
			{
				if (dragging.x > (xgap * (p+1)) - 15 + (cardWidth * p) && dragging.x < (xgap * (p+1)) + (cardWidth * (p+1)) - 40 && dragging.y > verticaldrop - 10 && dragging.y < verticaldrop + cardHeight)
				{
					if (dragging.getRank() == 13)
					{
						validDrop = true;
						piles[p].push(dragging);
						dragging.setPosition(xgap * (p+1) + (cardWidth * p), verticaldrop);
					}
				}
			}
		}
		for (var f=0;f<foundations.length;f++)
		{
			if(dragging.x > (xgap * (f+4)) - 15 + (cardWidth * (f+3)) && dragging.x < (xgap * (f+4)) - 15 + (cardWidth * (f+4)) && dragging.y > ygap && dragging.y < ygap + cardHeight)
			{
				if (foundations[f].length == 0)
				{
					if (dragging.getRank() == 1)
					{
						validDrop = true;
						foundations[f].push(dragging);
						dragging.setPosition(xgap * (f+4) + (cardWidth * (f+3)), ygap);
					}
				}
				if (foundations[f].length !== 0)
				{
					if (dragging.getRank() == (foundations[f][foundations[f].length-1].getRank() + 1) && dragging.getSuit() == foundations[f][foundations[f].length-1].getSuit())
					{
						validDrop = true;
						foundations[f].push(dragging);
						dragging.setPosition(xgap * (f+4) + (cardWidth * (f+3)), ygap);
					}
				}
			}
		}
		// If not dropped in valid spot, return card to previous pile
		if (validDrop !== true)
		{
			if (lastPileNum == -1)
			{
				deck.insert(dragging);
				drawPileTop = deck.getAfterCursor();
				withdrawPileTop = deck.getBeforeCursor();
				withdrawPileTop.setPosition(xgap + cardWidth + xgap, ygap);
			}
			if (lastPileNum !== -1 && piles[lastPileNum].length !== 0)
			{
				dragging.setPosition(xgap + (xgap * lastPileNum) + (97 * lastPileNum), 170 + ((piles[lastPileNum].length) * ygap));
				piles[lastPileNum].push(dragging);
			}
			if (lastPileNum !== -1 && piles[lastPileNum].length == 0)
			{
				dragging.setPosition(xgap + (xgap * lastPileNum) + (97 * lastPileNum), 170);
				piles[lastPileNum].push(dragging);
			}
		}
	}
	
	for (p=0;p<piles.length;p++)
	{
		if (piles[p].length !==0)
		{
			if (piles[p][piles[p].length-1].visible == false)
			{
				piles[p][piles[p].length-1].togVisible(true);
			}
		}
	}
 
	validDrop = false;
	dragging = undefined;
	
	if (foundations[0].length == 13 && foundations[1].length == 13 && foundations[2].length == 13 && foundations[3].length == 13)
		victory = true;
	
}
	
function mousedown_call(ev)
{
	// Executed when left mouse button is clicked
	// then sets offset from where the mouse was clicked
	// to the corner of the card it's over.
	
	if(ev.button == 0)
	{
		for(var i=0;i < piles.length;i++)
		{
			if(piles[i].length !== 0)
			{
				if(piles[i][piles[i].length - 1].isMouseOver(mx,my))
				{
					clicked = true;
					dragging = piles[i].pop();
					lastPileNum = i;
					xoff=mx-dragging.x;
					yoff=my-dragging.y;
					break;
				}
			}
		}
		// When the deck pile is empty
		if (drawPileTop == undefined && mx >= xgap && mx <= xgap + cardWidth && my >= ygap && my <= ygap + cardHeight)
		{
			deck.cursorToStart();
			deck.forEach(function(card)
			{
				card.togVisible(false);
			});
			drawPileTop = deck.getAfterCursor();
			if (drawPileTop !== undefined) drawPileTop.setPosition(xgap, ygap);
			withdrawPileTop = deck.getBeforeCursor();
		}
		// For cards in the deck pile
		if (drawPileTop !== undefined && drawPileTop.isMouseOver(mx, my))
		{
			deck.advanceCursor();
			drawPileTop = deck.getAfterCursor();
			if (drawPileTop !== undefined) drawPileTop.setPosition(xgap, ygap);
			withdrawPileTop = deck.getBeforeCursor();
			if (withdrawPileTop !== undefined)
			{
				withdrawPileTop.setPosition(xgap + cardWidth + xgap, ygap);
				withdrawPileTop.togVisible(true);
			}
		}
		// When clicking on the withdraw pile
		if (withdrawPileTop !== undefined && withdrawPileTop.isMouseOver(mx, my))
		{
			clicked = true;
			dragging = withdrawPileTop;
			xoff=mx-dragging.x;
			yoff=my-dragging.y;
			deck.unadvanceCursor();
			deck.remove();
			drawPileTop = deck.getAfterCursor();
			withdrawPileTop = deck.getBeforeCursor();
			lastPileNum = -1;
		}
	}
}

function victory_animation()
{
	if (viccount == 0)
	{
		ctx.drawImage(vicp1, 180, 250);
		viccount = 1;
	}
	else if (viccount == 1)
	{
		ctx.drawImage(vicp2, 180, 250);
		viccount = 0;
	}
}	

function draw()
{
	// Draws a cyan canvas and the card images.
	ctx.fillStyle="lime";
	ctx.fillRect(0,0,cvs.width,cvs.height);
	// Draws dark spot if no cards are in pile
	ctx.fillStyle="green";
	for (var i=0;i<8;i++)
	{
		ctx.fillRect((i+1) * xgap + (i * cardWidth), 170, cardWidth, cardHeight);
	}
	ctx.fillRect(xgap, ygap, cardWidth, cardHeight);
	for (i=0;i<4;i++)
	{
		ctx.fillRect((i+4) * xgap + ((i+3) * cardWidth), ygap, cardWidth, cardHeight);
	}
	var withdrawCard = deck.getBeforeCursor();
	if (withdrawCard !== undefined) withdrawCard.draw(ctx);
	var drawCard = deck.getAfterCursor();
	if (drawCard !== undefined) drawCard.draw(ctx);
	for(i=0;i<piles.length;i++)
	{
		for(var j=0;j<piles[i].length;j++)
		{
			piles[i][j].draw(ctx);
		}
	}
	for(i=0;i<foundations.length;i++)
	{
		if (foundations[i].length !== 0)
		{
			foundations[i][foundations[i].length-1].draw(ctx);
		}
	}
	if (dragging !== undefined)
	{
		dragging.draw(ctx);
	}
	if (victory == true)
	{
		setInterval(victory_animation, 150);
	}
}


