"use strict";

// Vincent Vencill - Lab 8 - Linked List Object

function List()
{
	this.head = undefined;
	this.tail = undefined;
	this.cursor = undefined;
}

function Node(v)
{
	this.data = v;
	this.next = undefined;
	this.prev = undefined;
}

/** Move cursor to start of list */
List.prototype.cursorToStart = function()
{
	this.cursor = undefined;
}

/** Move cursor to end of list*/
List.prototype.cursorToEnd = function()
{
	this.cursor = this.tail;
}

/** Advance cursor to next position. If cursor is already at end, do nothing.*/
List.prototype.advanceCursor = function()
{
	if (this.cursor == this.tail) return false;
	
	else if (this.cursor == undefined) this.cursor = this.head;
	
	else this.cursor = this.cursor.next;
}

/** Move cursor back one place. If cursor is already at the head, do nothing*/
List.prototype.unadvanceCursor = function()
{
	if (this.cursor == undefined) return false;
	
	if (this.cursor == this.head) this.cursor = undefined;
	
	else this.cursor = this.cursor.prev;
}

/** Return true if cursor is at start, false if not*/
List.prototype.cursorAtStart = function()
{
	if (this.cursor == undefined) return true;
	
	else return false;
}


/** Return true if cursor at end, false if not*/
List.prototype.cursorAtEnd = function()
{
	if (this.cursor == this.tail) return true;
	
	else return false;
}

/** Get item after cursor. If cursor is at end, return undefined*/
List.prototype.getAfterCursor = function()
{
	if (this.cursor == this.tail) return undefined;
	
	if (this.cursor == undefined) return this.head.data;
	
	else return this.cursor.next.data;
}

/** Get item before cursor. If cursor is at head, return undefined*/
List.prototype.getBeforeCursor = function()
{
	if (this.cursor == undefined) return undefined;
	
	else return this.cursor.data;
}

        
/** Insert v after the cursor. Cursor position is unchanged. */
List.prototype.insert = function(v)
{
	if (this.head == undefined && this.tail == undefined)
	{
		var N = new Node(v);
		this.head = N;
		this.tail = N;
		this.cursor = N;
	}
	else if (this.cursor == undefined)
	{
		var N = new Node(v);
		N.next = this.head;
		this.head.prev = N;
		this.head = N;
		this.cursor = N;
	}
	else if (this.cursor == this.head && this.head == this.tail)
	{
		var N = new Node(v);
		this.head.next = N;
		N.prev = this.head;
		this.tail = N;
		this.cursor = N;
	}
	else if (this.cursor == this.tail)
	{ 
		var N = new Node(v);
		this.tail.next = N;
		N.prev = this.tail;
		this.tail = N;
		this.cursor = N;
	}
	else
	{
		var N = new Node(v);
		N.next = this.cursor.next;
		N.prev = this.cursor;
		this.cursor.next.prev = N;
		this.cursor.next = N;
		this.cursor = N;
	}
	
}

/** Remove item after cursor; cursor is advanced to the one after
 * the removed element. If cursor is at the end: No action occurs. 
 */
List.prototype.remove = function()
{
	if (this.head == undefined && this.tail == undefined) return false;
	
	else if (this.cursor == this.head && this.head == this.tail)
	{
		this.head = undefined;
		this.tail = undefined;
		this.cursor = undefined;
	}
	else if (this.cursor == this.tail) return false;
	
	else if (this.cursor == undefined)
	{
		var node = this.head.next;
		if (this.head.next !== undefined)
		{
			this.head = node;
			node.prev = undefined;
			this.cursor = undefined;
		}
		else
		{
			this.head = undefined;
			this.tail = undefined;
			this.cursor = undefined;
		}
	}
	else if (this.cursor.next == this.tail)
	{
		this.cursor.next = undefined;
		this.tail = this.cursor;
	}
	else
	{
		var B = this.cursor.next;
		var C = B.next;
		this.cursor.next = C;
		C.prev = this.cursor;
	}
}

/** Execute the function ff for each element of the list.
 * The cursor is unaffected.*/
List.prototype.forEach = function(ff)
{
	if (this.head == undefined && this.tail == undefined) return false;
	
	else if (this.head == this.tail) ff(this.head.data);
	
	else
	{
		var node = this.head;
		for (var i = 0; node !== undefined; i++)
		{
			ff(node.data);
			node = node.next;
		}
	}
}

