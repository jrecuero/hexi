(function() {
    var toLoad = ["images/cat.png",
                  "fonts/puzzler.otf"];

    PIXI.utils._saidHello = true;

    var g = hexi(512, 512, setup, toLoad, load);
    g.start();

    var gameScene;
    var cat;
    var enemies = [];
    var enemyData = [{x: 64, y: 64, fill: "blue", stroke: "cyan"},
                     {x: 128, y: 128, fill: "white", stroke: "red"},
                     {x: 256, y: 200, fill: "yellow", stroke: "black"}, ];
    var enemySlide;
    var cbs = [];

    function slide(sprite, xDest, yDest, frames, type, yoyo, cb) {
        cbs.push(cb);
        return g.slide(enemies[1], 512-64, 64, 360, "smoothstep", true);
    }

    function load() {
        g.loadingBar();
    }

    function setup() {
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
        gameScene.addChild(cat);

        enemyData.forEach(function(data) {
            var enemy = g.rectangle(64, 64, data.fill, data.stroke, 5, data.x, data.y);
            enemy.name = enemies.length;
            enemies.push(enemy);
            gameScene.addChild(enemy);
        });
        // enemySlide = g.slide(enemies[1], 512-64, 64, 360, "smoothstep", true);
        enemySlide = slide(enemies[1], 512-64, 64, 360, "smoothstep", true,
                           function() {
                                if (g.hit(cat, enemies[1], bounce=true)) {
                                    enemySlide.pause();
                                }
                           });

        g.state = play;
    }

    function play() {
        console.log('playing...');
        g.move(cat);
        g.contain(cat, g.stage);

        var playerHit = false;

        // enemies.forEach(function(e) {
        //     if (g.hit(cat, e, bounce=true)) {
        //         playerHit = true;
        //     }
        // });

        cbs.forEach(function(cb) {
            cb();
        });

        // if (playerHit) {
        //     enemySlide.pause();
        // } else {
        //     enemySlide.play();
        // }
    }
}());