(function() {
    var toLoad = ["images/alienArmada.json",
                  "sounds/explosion.mp3",
                  "sounds/music.mp3",
                  "sounds/shoot.mp3",
                  "fonts/emulogic.ttf"];

    PIXI.utils._saidHello = true;

    var g = hexi(512, 512, setup, toLoad, load);
    g.border = "2px red dashed";
    g.start();

    var gameScene;
    var cannon;
    var alienData = [{x: 64, y: 64},
                     {x: 128, y: 128},
                     {x: 256, y: 200}, ];
    var alienSlide;
    var cbs = [];
    var bullets = [];
    var canvasRect = {x: 0, y: 0, width: 512, height: 512};
    var music;
    var shootSound;
    var explosionSound;
    var aliens = [];
    var message;

    function slide(sprite, xDest, yDest, frames, type, yoyo, cb) {
        cbs.push(cb);
        return g.slide(sprite, xDest, yDest, frames, type, yoyo);
    }

    function load() {
        g.loadingBar();
    }

    function setup() {
        message = g.text("Now playing", "24px emulogic", "red");
        message.setPosition(64, 32);

        gameScene = g.group();
        cannon = g.sprite("cannon.png");

        g.arrowControl(cannon, 2);
        g.keyboard(32).press = function() {
            g.shoot(cannon,
                    4.71,
                    cannon.halfWidth,
                    0,
                    g.stage,
                    5,
                    bullets,
                    function() {
                        return g.sprite("bullet.png");
                    });
            shootSound.play();
        };

        gameScene.addChild(cannon);

        alienData.forEach(function(data) {
            var alienFrames = ["alien.png", "explosion.png"];
            var alien = g.sprite(alienFrames);
            alien.setPosition(data.x, data.y);
            aliens.push(alien);
            var alienSlide = slide(alien, 512-64, data.y, 360, "smoothstep", true,
                               function() {
                                    if (g.hit(cannon, alien, true)) {
                                        alienSlide.pause();
                                    } else {
                                        alienSlide.play();
                                    }
                               });
        });

        music = g.sound("sounds/music.mp3");
        music.play();

        shootSound = g.sound("sounds/shoot.mp3");
        shootSound.pan = -0.5

        explosionSound = g.sound("sounds/explosion.mp3");
        explosionSound.pan = 0.5;

        g.state = play;
    }

    function play() {
        g.move(cannon);
        g.contain(cannon, g.stage);

        g.move(aliens);

        bullets.forEach(function(b) {
            var hit = false;
            aliens.forEach(function(e) {
                if (g.hit(b, e)) {
                    g.remove(e);
                    var index = aliens.indexOf(e);
                    aliens.splice(index, 1);
                    g.remove(b);
                    index = bullets.indexOf(b);
                    bullets.splice(index, 1);
                    hit = true;
                    explosionSound.play();
                }
            });
            if (!hit) {
                if (!g.hitTestPoint(b, canvasRect)) {
                    g.remove(b);
                    index = bullets.indexOf(b);
                    bullets.splice(index, 1);
                }
            }
        });

        if (aliens.length == 0) {
            message.text = "GAME OVER";
        }

        cbs.forEach(function(cb) {
            cb();
        });

        g.move(bullets);
    }
}());