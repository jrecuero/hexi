(function() {
    var toLoad = ["images/cat.png",
                  "images/alienArmada.json",
                  "fonts/puzzler.otf"];

    PIXI.utils._saidHello = true;

    var g = hexi(512, 512, setup, toLoad, load);
    g.border = "2px red dashed";
    g.start();

    var gameScene;
    var cat;
    var enemies = [];
    var enemyData = [{x: 64, y: 64, fill: "blue", stroke: "cyan"},
                     {x: 128, y: 128, fill: "white", stroke: "red"},
                     {x: 256, y: 200, fill: "yellow", stroke: "black"}, ];
    var enemySlide;
    var cbs = [];
    var bullets = [];
    var canvasRect = {x: 0, y: 0, width: 512, height: 512};

    function slide(sprite, xDest, yDest, frames, type, yoyo, cb) {
        cbs.push(cb);
        return g.slide(sprite, xDest, yDest, frames, type, yoyo);
    }

    function load() {
        g.loadingBar();
    }

    function setup() {
        // border = g.rectangle(511, 511, "white", "red", 1, 0, 0);
        var message = g.text("Now playing", "24px puzzler", "red");
        message.x = 64;
        message.y = 32;

        gameScene = g.group();
        cat = g.sprite("images/cat.png");
        // cat.setPosition(32, 32);
        // g.breathe(cat, 1.1, 1.1, 10);
        // g.pulse(cat, 30, 0.5);
        // cat.vx = 1;
        // cat.vy = 1;

        g.arrowControl(cat, 2);
        g.keyboard(32).press = function() {
            g.shoot(cat,
                    4.71,
                    cat.halfWidth,
                    0,
                    g.stage,
                    5,
                    bullets,
                    function() {
                        return g.sprite("bullet.png");
                    });
        };

        gameScene.addChild(cat);

        enemyData.forEach(function(data) {
            var enemy = g.rectangle(64, 64, data.fill, data.stroke, 1, data.x, data.y);
            enemy.name = enemies.length;
            enemies.push(enemy);
            gameScene.addChild(enemy);
            // g.slide(enemy, 512-64, data.y, 128, "smoothstep", true);
            var enemySlide = slide(enemy, 512-64, data.y, 360, "smoothstep", true,
                               function() {
                                    // if (g.hit(cat, enemy, bounce=true)) {
                                    // if (g.hitTestRectangle(cat, enemy)) {
                                    if (g.hit(cat, enemy, true, false, false,
                                              function(c, p) {
                                                    var x = 0;
                                              })) {
                                        enemySlide.pause();
                                    } else {
                                        enemySlide.play();
                                    }
                               });
        });
        // enemySlide = g.slide(enemies[1], 512-64, 128, 128, "sine", true, 1000);
        // enemySlide = slide(enemies[1], 512-64, 128, 360, "smoothstep", true,
        //                    function() {
        //                         if (g.hit(cat, enemies[1], bounce=true)) {
        //                             enemySlide.pause();
        //                         }
        //                    });

        g.state = play;
    }

    function play() {
        g.move(cat);
        g.contain(cat, g.stage);

        // var playerHit = false;
        // enemies.forEach(function(e) {
        //     if (g.hit(cat, e, bounce=true)) {
        //         playerHit = true;
        //     }
        // });
        // if (playerHit) {
        //     enemySlide.pause();
        // } else {
        //     enemySlide.play();
        // }

        bullets.forEach(function(b) {
            var hit = false;
            enemies.forEach(function(e) {
                if (g.hit(b, e)) {
                    g.remove(e);
                    var index = enemies.indexOf(e);
                    enemies.splice(index, 1);
                    g.remove(b);
                    index = bullets.indexOf(b);
                    bullets.splice(index, 1);
                    hit = true;
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

        cbs.forEach(function(cb) {
            cb();
        });

        g.move(bullets);
    }
}());