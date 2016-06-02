(function() {
	// var toLoad = [];

	var g;			// hexi instance
	var gb;			// game board instance
	var message;

	/**
	 * Cell class, it stores information for every board cell in the game.
	 */
	function Cell() {
		this.initialize.apply(this, arguments);
	}

	Cell.prototype.constructor = Cell;

	/**
	 * Cell Class initialization method.
	 * @param  {number} row    cell row value
	 * @param  {number} col    cell column value
	 * @param  {Sprite} sprite cell sprite instance
	 * @param  {Object} data   cell custom data instance
	 * @param  {Object} moves  cell possible moves instance
	 */
	Cell.prototype.initialize = function(row, col, sprite, data, moves) {
		this.row = row;
		this.col = col;
		this.data = data;
		this.sprite = sprite;
		this.moves = moves;
	};

	/**
	 * Cell class method to check equality between two cells.
	 * @param  {Cell} cell othe cell instance
	 * @return {boolean} true if cells are equal. false if cells are different.
	 */
	Cell.prototype.equal = function(cell) {
		return (this.data === cell.data);
	};

	/**
	 * Board Class, it stores all information related with the game board.
	 */
	function Board() {
		this.initialize.apply(this, arguments);
	}

	Board.prototype.constructor = Board;

	/**
	 * Board Class initialization method.
	 */
	Board.prototype.initialize = function() {
		this.board = [];
		this.fromCell = undefined;
		this.toCell = undefined;
		this.neighborTween = undefined;
		this.neighborCells = undefined;
	};

	/**
	 * Board class method that adds a new cell to the game board.
	 * @param {Cell} cell cell instance to add to the game board
	 */
	Board.prototype.addCell = function(cell) {
		this.board.push(cell);
	};

	/**
	 * Board class method that removes a cell from the game board at a given row
	 * and column position.
	 * @param  {number} row cell row value
	 * @param  {number} col cell column value
	 */
	Board.prototype.removeCell = function(row, col) {
		var cell = this.getCellFrom(row, col);
		if (cell) {
			var index = this.board.indexOf(cell);
			this.board.splice(index, 1);
		}
	};

	/**
	 * Board class method that retrieves a cell from the game board at a give
	 * row and column position
	 * @param  {number} row cell row value
	 * @param  {number} col cell column value
	 * @return {Array}     array with cells at the given position
	 */
	Board.prototype.getCellFrom = function(row, col) {
		return this.board.filter(function(cell) {
			return ((cell.row == row) && (cell.col == col));
		});
	};

	/**
	 * Board class method that retrieves all cell up, down, left and right for
	 * the game board cell at the given row and column position.
	 * @param  {number} row cell row position
	 * @param  {number} col cell column position
	 * @return {Array}     array with cells placed up, down, left and right
	 */
	Board.prototype.getNeighbors = function(row, col) {
		var retCells = [];
		var cell = this.getCellFrom(row-1, col);
		if (cell.length) retCells.push(cell[0]);
		cell = this.getCellFrom(row+1, col);
		if (cell.length) retCells.push(cell[0]);
		cell = this.getCellFrom(row, col-1);
		if (cell.length) retCells.push(cell[0]);
		cell = this.getCellFrom(row, col+1);
		if (cell.length) retCells.push(cell[0]);
		return retCells;
	};

	/**
	 * Game Initialization function.
	 * Initialized Hexi and load all resources required for the game.
	 */
	function init() {
		PIXI.utils._saidHello = true;
		gb = new Board();
		g = hexi(256, 256, setup);
		g.start();
	}

	/**
	 * Function that return a random move position.
	 * Move position identifies what possible movement the cell is allowed to
	 * take. It can allow movement in one direction (move), it can stop any
	 * movement from other cell in that direction (fixed), or it can allow
	 * movement from other cell in that direction, but not movement from that
	 * cell in that direction (none).
	 * @return {string} string with a random move
	 */
	function getMove() {
		var moves = ["move", "move", "move", "move", "move", "none", "none", "fixed"];
		var index = g.randomInt(0, moves.length);
		return moves[index];
	}

	/**
	 * Variable that stores values for drawing a sprite with defined moves.
	 * @type {Object}
	 */
	var drawMovePoints = { up: { move: [16, 10, 16, 2],
								 fixed: [8, 6, 24, 6],
								 none: undefined
								},
						   down: { move: [16, 22, 16, 30],
						   		   fixed: [8, 26, 24, 26],
						   		   none: undefined,
						   		},
						   left: { move: [10, 16, 2, 16],
						   		   fixed: [6, 8, 6, 24],
						   		   none: undefined,
						   		},
						   right: { move: [22, 16, 30, 16],
						   		    fixed: [26, 8, 26, 24],
						   		    none: undefined,
						   		},
						 };

	/**
	 * Function thar return a sprite with given move.
	 * @param  {number} row  sprite row position value
	 * @param  {number} col  sprite column position value
	 * @param  {string} side sprite side value
	 * @param  {string} move sprite move value
	 * @return {Sprite}      sprite with move drawn
	 */
	function drawMove(row, col, side, move) {
		var sp;
		var d = drawMovePoints[side][move];
		if (d) {
			sp = g.line("black", 1, 32*col + d[0], 32*row + d[1], 32*col + d[2], 32*row + d[3]);
		}
		return sp;
	}

	/**
	 * Function that returns a random color to be used to an sprite.
	 * @return {string} random color value
	 */
	function getColor() {
		var colors = ["red", "yellow", "blue", "green", "cyan", "magenta", "purple"];
		var index = g.randomInt(0, colors.length);
		return colors[index];
	}

	/**
	 * Function that creates a cell to be inserted in the game board.
	 * @param  {number} row cell row position value
	 * @param  {number} col cell column position value
	 * @return {Cell}     cell instance to be inserted in the game board
	 */
	function createCell(row, col) {
		var color = getColor();
		// var sp = g.group();
		var sp1 = g.rectangle(32, 32, color, "black", 1, 32 * col, 32 * row);
		// sp.addChild(sp1);
		moves = {up: getMove(),
				 right: getMove(),
				 down: getMove(),
				 left: getMove(),
				 tostr: function() {
				 	return (this.up + " " + this.right + " " + this.down + " " + this.left);
				 }};
		// sp1 = drawMove(row, col, 'up', moves.up);
		// if (sp1) sp.addChild(sp1);
		// sp1 = drawMove(row, col, 'down', moves.down);
		// if (sp1) sp.addChild(sp1);
		// sp1 = drawMove(row, col, 'left', moves.left);
		// if (sp1) sp.addChild(sp1);
		// sp1 = drawMove(row, col, 'right', moves.right);
		// if (sp1) sp.addChild(sp1);
		return new Cell(row, col, sp1, color, moves);
	}

	/**
	 * Function that checks if the given point hits the given cell.
	 * @param  {Object} point point instace
	 * @param  {Cell} cell  cell instance
	 */
	function checkHitCell(point, cell) {
		if (g.hitTestPoint(point, cell.sprite)) {
			message.content = "Cell: " + cell.moves.tostr();
			if (gb.fromCell === undefined) {
				gb.fromCell = cell;
				gb.neighborCells = gb.getNeighbors(gb.fromCell.row, gb.fromCell.col);
				gb.neighborTween = [];
				for (var i in gb.neighborCells) {
					gb.neighborTween.push(g.pulse(gb.neighborCells[i].sprite, 15, 0.25));
				}
			} else if (gb.fromCell === gb.toCell) {
				gb.fromCell = undefined;
				for (var i in gb.neighborTween) {
					gb.neighborTween[i].end();
				}
			} else if (gb.neighborCells.includes(cell)) {
				gb.toCell = cell;
			} else {
				console.log("Invalid selection!");
			}
		}
	}

	/**
	 * Game setup function.
	 */
	function setup() {
		g.state = play;
		for (var r = 0; r < 5; r++) {
			for (var c = 0; c < 5; c++) {
				gb.addCell(createCell(r, c));
			}
		}

		g.pointer.tap = function() {
			var p = {x: g.pointer.x, y: g.pointer.y};
			console.log(p);
			for (var i in gb.board) {
				checkHitCell(p, gb.board[i]);
			}
		};

		message = g.text("Cell: ", "12px Menlo", "black", 0, 180);
	}

	/**
	 * Game play function.
	 */
	function play() {
		if (gb.fromCell !== undefined) {
			if (gb.toCell === undefined) {
				g.shake(gb.fromCell.sprite, 0.10, true);
			} else {
				if (gb.fromCell.equal(gb.toCell)) {
					console.log('cells have the same color');
				} else {
					console.log('swapping cells');
					[gb.fromCell.sprite, gb.toCell.sprite] =
						[gb.toCell.sprite, gb.fromCell.sprite];
					[gb.fromCell.sprite.position, gb.toCell.sprite.position] =
						[gb.toCell.sprite.position, gb.fromCell.sprite.position];
				}
				gb.fromCell = undefined;
				gb.toCell = undefined;
			}
		}
	}

	init();
}());