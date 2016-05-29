(function() {
	// var toLoad = [];
	
	var g;
	var cells = [];
	var fromCell = undefined;
	var toCell = undefined;

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

	function buildCell(x, y) {
		return g.rectangle(32, 32, getColor(), "black", 1, x, y);
	}

	function setup() {
		// g.text("Game Start", "32px Futura", "black", 16, 32);
		g.state = play;
		for (var r = 0; r < 5; r++) {
			for (var c = 0; c < 5; c++) {
				var sp = buildCell(32 * c, 32 * r);
				cells.push({row: r, col: c, sprite: sp})
			}
		}

		g.pointer.tap = function() { 
			var p = {x: g.pointer.x, y: g.pointer.y}
			console.log(p); 
			for (var i in cells) {
				var cell = cells[i];
				if (g.hitTestPoint(p, cell.sprite)) {
					if (fromCell === undefined) {
						fromCell = cell;
					} else if (fromCell === toCell) {
						fromCell = undefined;
					} else {
						toCell = cell;						
					}
				}
			}
		};
	}

	function play() {
		if (fromCell !== undefined) {
			if (toCell === undefined) {
				g.shake(fromCell.sprite, 0.10, true);
			} else {
				var fromX = fromCell.sprite.x;
				var fromY = fromCell.sprite.y;
				var toX = toCell.sprite.x;
				var toY = toCell.sprite.y;
				[fromCell.sprite, toCell.sprite] = [toCell.sprite, fromCell.sprite];
				fromCell.sprite.x = fromX;
				fromCell.sprite.y = fromY;
				toCell.sprite.x = toX;
				toCell.sprite.y = toY;
				fromCell = undefined;
				toCell = undefined;
			}
		}
	}

	init();
}());