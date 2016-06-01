(function() {
	// var toLoad = [];

	var g;
	var gameBoard;
	var fromCell;
	var toCell;
	var message;

	function Cell() {
		this.initialize.apply(this, arguments);
	}

	Cell.prototype.constructor = Cell;

	Cell.prototype.initialize = function(row, col, sprite, data, moves) {
		this.row = row;
		this.col = col;
		this.data = data;
		this.sprite = sprite;
		this.moves = moves;
	};

	Cell.prototype.equal = function(cell) {
		return (this.data === cell.data);
	};

	function Board() {
		this.initialize.apply(this, arguments);
	}

	Board.prototype.constructor = Board;

	Board.prototype.initialize = function() {
		this.board = [];
	};

	Board.prototype.addCell = function(cell) {
		this.board.push(cell);
	};

	Board.prototype.removeCell = function(row, col) {
		var cell = this.getCellFrom(row, col);
		if (cell) {
			var index = this.board.indexOf(cell);
			this.board.splice(index, 1);
		}
	};

	Board.prototype.getCellFrom = function(row, col) {
		return this.board.filter(function(cell) {
			return ((cell.row == row) && (cell.col == col));
		});
	};

	Board.prototype.getNeighbors = function(row, col) {
		var retCells = [];
		var cell = this.getCellFrom(row-1, col);
		if (cell) retCell.push(cell);
		cell = this.getCellFrom(row+1, col);
		if (cell) retCell.push(cell);
		cell = this.getCellFrom(row, col-1);
		if (cell) retCell.push(cell);
		cell = this.getCellFrom(row, col+1);
		if (cell) retCell.push(cell);
		return retCells;
	};

	function init() {
		PIXI.utils._saidHello = true;

		gameBoard = new Board();
		g = hexi(256, 256, setup);
		g.start();
	}

	function getMove() {
		var moves = ["move", "move", "move", "move", "move", "none", "none", "fixed"];
		var index = g.randomInt(0, moves.length);
		return moves[index];
	}

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

	function drawMove(row, col, side, move) {
		var sp;
		var d = drawMovePoints[side][move];
		if (d) {
			sp = g.line("black", 1, 32*col + d[0], 32*row + d[1], 32*col + d[2], 32*row + d[3]);
		}
		return sp;
	}

	function getColor() {
		var colors = ["red", "yellow", "blue", "green", "cyan", "magenta", "purple"];
		var index = g.randomInt(0, colors.length);
		return colors[index];
	}

	function createSprite(x, y, color) {
		return g.rectangle(32, 32, color, "black", 1, x, y);
	}

	function createCell(row, col) {
		var color = getColor();
		var sp = g.group();
		var sp1 = g.rectangle(32, 32, color, "black", 1, 32 * col, 32 * row);
		sp.addChild(sp1);
		moves = {up: getMove(),
				 right: getMove(),
				 down: getMove(),
				 left: getMove(),
				 tostr: function() {
				 	return (this.up + " " + this.right + " " + this.down + " " + this.left);
				 }};
		// var sp2 = g.line("black", 1, 32 * col + 16, 32 * row + 10, 32 * col + 16, 32 * row + 2);
		// sp.addChild(sp2);
		// var sp3 = g.line("black", 1, 32 * col + 16, 32 * row + 22, 32 * col + 16, 32 * row + 30);
		// sp.addChild(sp3);
		// var sp4 = g.line("black", 1, 32 * col + 10, 32 * row + 16, 32 * col + 2, 32 * row + 16);
		// sp.addChild(sp4);
		// var sp5 = g.line("black", 1, 32 * col + 22, 32 * row + 16, 32 * col + 30, 32 * row + 16);
		// sp.addChild(sp5);
		// var sp2 = g.line("black", 1, 32 * col + 6, 32 * row + 8, 32 * col + 6, 32 * row + 24);
		// sp.addChild(sp2);
		// var sp3 = g.line("black", 1, 32 * col + 26, 32 * row + 8, 32 * col + 26, 32 * row + 24);
		// sp.addChild(sp3);
		// var sp4 = g.line("black", 1, 32 * col + 8, 32 * row + 6, 32 * col + 24, 32 * row + 6);
		// sp.addChild(sp4);
		// var sp5 = g.line("black", 1, 32 * col + 8, 32 * row + 26, 32 * col + 24, 32 * row + 26);
		// sp.addChild(sp5);
		var sp1 = drawMove(row, col, 'up', moves.up);
		if (sp1) sp.addChild(sp1);
		sp1 = drawMove(row, col, 'down', moves.down);
		if (sp1) sp.addChild(sp1);
		sp1 = drawMove(row, col, 'left', moves.left);
		if (sp1) sp.addChild(sp1);
		sp1 = drawMove(row, col, 'right', moves.right);
		if (sp1) sp.addChild(sp1);
		return new Cell(row, col, sp, color, moves);
	}

	function checkHitCell(point, cell) {
		if (g.hitTestPoint(point, cell.sprite)) {
			message.content = "Cell: " + cell.moves.tostr();
			if (fromCell === undefined) {
				fromCell = cell;
			} else if (fromCell === toCell) {
				fromCell = undefined;
			} else {
				toCell = cell;
			}
		}
	}

	function setup() {
		g.state = play;
		for (var r = 0; r < 5; r++) {
			for (var c = 0; c < 5; c++) {
				gameBoard.addCell(createCell(r, c));
			}
		}

		g.pointer.tap = function() {
			var p = {x: g.pointer.x, y: g.pointer.y};
			console.log(p);
			for (var i in gameBoard.board) {
				checkHitCell(p, gameBoard.board[i]);
			}
		};

		message = g.text("Cell: ", "12px Menlo", "black", 0, 180);
	}

	function play() {
		if (fromCell !== undefined) {
			if (toCell === undefined) {
				g.shake(fromCell.sprite, 0.10, true);
			} else {
				if (fromCell.equal(toCell)) {
					console.log('cells have the same color');
				} else {
					console.log('swapping cells');
					[fromCell.sprite, toCell.sprite] = [toCell.sprite, fromCell.sprite];
					[fromCell.sprite.position, toCell.sprite.position] =
						[toCell.sprite.position, fromCell.sprite.position];
				}
				fromCell = undefined;
				toCell = undefined;
			}
		}
	}

	init();
}());