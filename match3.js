(function() {
	// var toLoad = [];
	
	var g;
	var cells = [];
	var fromCell = undefined;
	var toCell = undefined;
	var message;

	function Cell() {
		this.initialize.apply(this, arguments);
	}

	Cell.prototype.constructor = Cell;

	Cell.prototype.initialize = function(row, col, sprite) {
		this.row = row;
		this.col = col;
		this.data = row + "-" + col;
		this.sprite = sprite;
	};

	function init() {
		PIXI.utils._saidHello = true;

		g = hexi(256, 256, setup);
		g.start();
	}

	function getColor() {
		var colors = ["red", "yellow", "blue", "green", "cyan", "magenta", "purple"];
		var index = g.randomInt(0, colors.length);
		return colors[index];
	}

	function createSprite(x, y) {
		return g.rectangle(32, 32, getColor(), "black", 1, x, y);
	}

	function createCell(row, col) {
		var sp = createSprite(32 * col, 32 * row);
		return new Cell(row, col, sp);		
	}

	function checkHitCell(point, cell) {
		if (g.hitTestPoint(point, cell.sprite)) {
			message.content = "Pointer at Cell: " + cell.data;			
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
				cells.push(createCell(r, c));
			}
		}

		g.pointer.tap = function() { 
			var p = {x: g.pointer.x, y: g.pointer.y}
			console.log(p); 
			for (var i in cells) {
				checkHitCell(p, cells[i])
			}
		};

		message = g.text("Pointer at Cell: ", "12px Menlo", "black", 0, 180);
	}

	function play() {
		if (fromCell !== undefined) {
			if (toCell === undefined) {
				g.shake(fromCell.sprite, 0.10, true);
			} else {
				[fromCell.sprite, toCell.sprite] = [toCell.sprite, fromCell.sprite];
				[fromCell.sprite.position, toCell.sprite.position] = 
					[toCell.sprite.position, fromCell.sprite.position];
				fromCell = undefined;
				toCell = undefined;
			}
		}
	}

	init();
}());