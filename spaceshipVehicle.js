var g = hexi(256, 256, setup);
g.scaleToWindow();

let ship, turret, message;

g.start();

function setup() {
	ship = g.rectangle(16, 16, "gray");
	turret = g.line("red", 4, 0, 0, 16, 0);
	ship.setPivot(0.5, 0.5);
	ship.addChild(turret);
	turret.x = 0;
	turret.y = 0;

	g.stage.putCenter(ship);

	ship.vx = 0;
	ship.vy = 0;
	ship.accelerationX = 0.2;
	ship.accelerationY = 0.2;
	ship.frictionX = 0.96;
	ship.frictionY = 0.96;
	ship.rotationSpeed = 0;
	ship.moveForward = false;

	var leftArrow = g.keyboard(37);
	var upArrow = g.keyboard(38);
	var rightArrow = g.keyboard(39);
	var downArrow = g.keyboard(40);

	leftArrow.press = function() {
		ship.rotationSpeed = -0.1;
	};
	leftArrow.release = function() {
		if (!rightArrow.isDown) ship.rotationSpeed = 0;
	};

	rightArrow.press = function() {
		ship.rotationSpeed = 0.1;
	};
	rightArrow.release = function() {
		if (!leftArrow.isDown) ship.rotationSpeed = 0;
	};

	upArrow.press = function() {
		ship.moveForward = true;
	};
	upArrow.release = function() {
		ship.moveForward = false;
	};

	message = g.text("", "12px", "black", 8, 8);

	g.state = play;
}

function play() {
	ship.rotation += ship.rotationSpeed;
	if (ship.moveForward) {
		ship.vx += ship.accelerationX * Math.cos(ship.rotation);
		ship.vy += ship.accelerationY * Math.sin(ship.rotation);
	} else {
		ship.vx *= ship.frictionX;
		ship.vy *= ship.frictionY;
	}

	ship.x += ship.vx;
	ship.y += ship.vy;

	g.contain(ship, g.stage);

	message.content = ship.rotation;
}