var toLoad = ["images/flappyFairy.json"];

var g = hexi(910, 512, setupTitleScreen, toLoad);

g.start();

g.enableFullScreen();

var pointer;
var canvas;
var fairy;
var sky;
var blocks;
var title;
var goButton;
var finish;
var dust;
var dustFrames;

function setupTitleScreen() {
	sky = g.tilingSprite("sky.png", g.canvas.width, g.canvas.height);

	title = g.sprite("title.png");
	g.stage.putCenter(title, 0, -70);

	goButton = g.button(["up.png", "over.png", "down.png"]);
	g.stage.putCenter(goButton, 0, 150);
	goButton.release = function() {
		g.state = setupGame;
	}

	g.state = playTitleScreen;
}

function playTitleScreen() {
	sky.tileX -= 1;
}

function setupGame() {
	title.visible = false;
	goButton.visible = false;
	goButton.enabled = false;

	blocks = g.group();
	var gapSize = 4;
	var numberOfPillars = 15;

	for (var i = 0; i < numberOfPillars; i++) {
		var startGapNumber = g.randomInt(0, 8 - gapSize);
		if (i > 0 && i % 5 === 0) gapSize -= 1;

		for (var j = 0; j < 8; j++) {
			if (j < startGapNumber || j > startGapNumber + gapSize - 1) {
				var block = g.sprite("greenBlock.png");
				blocks.addChild(block);
				block.x = (i * 384) + 512;
				block.y = j * 64;
			}
		}

		if (i == numberOfPillars - 1) {
			finish = g.sprite("finish.png");
			blocks.addChild(finish);
			finish.x = (i * 384) + 896;
			finish.y = 192;
		}
	}

	var fairyFrames = ["0.png", "1.png", "2.png"];
	fairy = g.sprite(fairyFrames);
	fairy.setPosition(232, 232);
	fairy.vy = 0;
	fairy.oldVy = 0;

	dustFrames = ["pink.png", "yellow.png", "green.png", "violet.png"];
	dust = g.particleEmitter(
		300,
		function() {
			g.createParticles(
				fairy.x + 8,
				fairy.y + fairy.halfHeight + 8,
				() => g.sprite(dustFrames),
				g.stage,
				3,
				0,
				true,
				2.4, 3.6,
				12, 18,
				1, 2,
				0.005, 0.01,
				0.005, 0.01,
				0.05, 0.1
				);
		}
	);

	dust.play();

	g.keyboard(38).press = function() {
		fairy.vy += 1.5;

	};
	// g.pointer.tap = function() {
	// 	fairy.vy += 2.5;
	// };

	g.state = play;
}

function play() {
	sky.tileX -= 1;

	if (finish.gx > 256) {
		blocks.x -= 1;
	}

	fairy.vy += -0.05;
	fairy.y -= fairy.vy;

	if (fairy.vy > fairy.oldVy) {
		if (!fairy.playing) {
			fairy.playAnimation();
			if (fairy.visible && !dust.playing) dust.play();
		}
	}

	if (fairy.vy < 0 && fairy.oldVy > 0) {
		if (fairy.playing) fairy.stopAnimation();
		fairy.show(0);
		if (dust.playing) dust.stop();
	}

	fairy.oldVy = fairy.vy;

	var fairyVsStage = g.contain(fairy, g.stage);
	if (fairyVsStage) {
		if (fairyVsStage.has("bottom") || fairyVsStage.has("top")) {
			fairy.vy = 0;
		}
	}

	var fairyVsBlock = blocks.children.some(function(block) {
		return g.hitTestRectangle(fairy, block, true);
	});

	if (fairyVsBlock && fairy.visible) {
		fairy.visible = false;
		g.createParticles(
			fairy.centerX, fairy.centerY,
			() => g.sprite(dustFrames),
			g.stage,
			20,
			0,
			false,
			0, 6.28,
			16, 32,
			1, 3
		);

		dust.stop();

		g.wait(3000, reset);
	}
}

function reset() {
	fairy.visible = true;
	fairy.y = 32;
	fairy.vy = 0;
	dust.play();
	blocks.x = 0;
	g.state = play;
}