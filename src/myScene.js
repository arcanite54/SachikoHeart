//このへんグローバルにしていいのか？
var gameLayer;

var MyScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        gameLayer = new GameMainLayer();
        this.addChild(gameLayer);
    }
});

var GameMainLayer = cc.Layer.extend({
    //sprite:null,
    //コンストラクタ
    ctor: function () {
        this._super();
        //var backgroundLayer = new cc.LayerColor(cc.color(170, 202, 222, 255));
        //this.addChild(backgroundLayer);
        var back_img = new cc.Sprite(res.img_back);
        back_img.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2
        });
        this.addChild(back_img, 0);
        this.player = new Player();
        this.addChild(this.player, 0);
        this.time = 0;
        this.time2 = 0;
        this.cycle = 1200;
        this.fallSpeed = 5;
        this.hardLine = Math.round(Math.random() * 4.9);
        this.isDead = false;
        this.warnBox = new cc.Sprite(res.img_warn);
        this.addChild(this.warnBox, 2);
        //ここレイヤの外で定義したいけど。
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                //var target = event.getCurrentTarget();
                //var location = target.convertToNodeSpace(touch.getLocation());
                //var targetSize = target.getContentSize();
                //var targetRectangle = cc.rect(0,0,targetSize.width,targetSize.height);
                target.player.changeTargetX(touch.getLocation().x);
                return true;
            }
        });
        cc.eventManager.addListener(listener, this);

        this.scoreLabel = cc.LabelTTF.create("スコア:", "Arial", 40);
        this.scoreLabel.setPosition(cc.winSize.width - 120, cc.winSize.height - 90);
        this.scoreLabel.setColor(cc.color(255, 255, 255));

        this.resultLabel = cc.LabelTTF.create("スコア:", "Arial", 80);
        this.resultLabel.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.resultLabel.setColor(cc.color(255, 0, 0));
        this.resultLabel2 = cc.LabelTTF.create("ゲームオーバー", "Arial", 60);
        this.resultLabel2.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + 90);
        this.resultLabel2.setColor(cc.color(255, 0, 0));


        this.HPLabel = cc.LabelTTF.create("残りHP:", "Arial", 40);
        this.HPLabel.setPosition(cc.winSize.width - 120, cc.winSize.height - 50);
        this.HPLabel.setColor(cc.color(255, 255, 255));
        this.heartList = [];
        this.enemyList = [];
        this.addChild(this.scoreLabel, 1);
        this.addChild(this.HPLabel, 1);

        this.scheduleUpdate();

        //this.schedule(this.addHeart, 3);
        //this.schedule(this.addEnemy, 7);

    },
    update: function (dt) {
        if (this.isDead) return;
        this.time++;
        this.time2++;
        //this.player.update();
        this.scoreLabel.setString("スコア:" + Math.round(this.time / 60));
        this.HPLabel.setString("KP:" + this.player.getHP());

        if (this.player.getHP() <= 0) {
            //cc.director.runScene(new Result());
            this.resultLabel.setString("スコア:" + Math.round(this.time / 60));
            this.addChild(this.resultLabel, 1);
            this.addChild(this.resultLabel2, 1);
            //this.player.changeIsMove();
            this.isDead = true;
        }
        for (var i = 0; i < this.heartList.length; i++) {
            this.heartList[i]._update(this.player);
        }
        for (var i = 0; i < this.enemyList.length; i++) {
            this.enemyList[i]._update(this.player);
        }

        //var h_t = Math.round((Math.max(61, 120 - this.time / 50)));
        //var e_t = Math.round((Math.max(37, 370 - this.time / 10)));
        //var h_t = 107;
        //var e_t = 191;
        //var f_t = Math.max(1.5, 5 - this.time / 1000);
        //var f_t = 2;
        //console.log(f_t);
        //console.log(h_t, e_t);
        console.log(this.time2);
        //if (this.time2 < this.cycle * 3 / 5) {
        if (this.time2 % 90 == 0) this.normalPhase();
        //}
        if (Math.round(this.cycle * 3 / 5) == this.time2) {
            this.warnBox.runAction(new cc.fadeIn(0));
            this.warnBox.setPosition(this.hardLine * cc.winSize.width / 5 + cc.winSize.width / 10, cc.winSize.height - 50);
            this.warnBox.runAction(new cc.blink(3, 9));
        }
        if (this.cycle * 4 / 5 <= this.time2) this.hardPhase();


        if (this.time2 > this.cycle) {
            this.time2 = 0;
            this.cycle = Math.max(this.cycle - 60, 360);
            this.fallSpeed = Math.max(this.fallSpeed - 0.5, 1.2);
            this.hardLine = Math.round(Math.random() * 4.9);
            this.warnBox.runAction(new cc.fadeOut(0));

        }
    },
    normalPhase: function () {
        for (var i = 0; i < 5; i++) {
            var n = Math.floor(Math.random() * 10);
            if (n < 2) this.addHeart(i, this.fallSpeed);
            else if (7 <= n) this.addEnemy(i, this.fallSpeed);
        }
    },
    hardPhase: function () {
        this.addEnemy(this.hardLine, 1);
    },
    addHeart: function (_i, _t) {
        var heart = new Heart();
        heart.init(_i, _t);
        this.addChild(heart, 1);
        this.heartList.push(heart);
    },
    addEnemy: function (_i, _t) {
        var enemy = new Enemy();
        enemy.init(_i, _t);
        this.addChild(enemy, 1);
        this.enemyList.push(enemy);
    },
    preAddHeart: function (_t) {
        for (var i = 0; i < 5; i++) {
            if (Math.floor(Math.random() * 10) < 4) this.addHeart(i, _t);
        }
    },
    preAddEnemy: function (_t) {
        var k = Math.floor(Math.random() * 6.9);
        for (var i = 0; i < 5; i++) {
            if (i == k) continue;
            if (Math.floor(Math.random() * 10) < 7) {
                this.addEnemy(i, _t);
            }
        }

    },
    //この二つのremoveまとめられそうだけど．
    removeHeart: function (_obj) {
        this.removeChild(_obj);
        this.heartList.splice(this.heartList.indexOf(_obj), 1);
    },
    removeEnemy: function (_obj) {
        this.removeChild(_obj);
        this.enemyList.splice(this.enemyList.indexOf(_obj), 1);
    }

});
/*
var listener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function(touch,event)
    {
        //var target = event.getCurrentTarget();
        //var location = target.convertToNodeSpace(touch.getLocation());
        //var targetSize = target.getContentSize();
        //var targetRectangle = cc.rect(0,0,targetSize.width,targetSize.height);
        player.changeTargetX(touch.getLocation().x);

    }
});
*/

var Player = cc.Sprite.extend({
    ctor: function () {
        this._super();
        var size = cc.winSize;
        //this.initWithFile(res.img_sachiko);

        this.setPosition(size.width / 2, size.height / 6);
        this.targetX = this.getPosition().x;
        this.speed = 15;
        //this.score = 0;
        this.HP = 15000;
        this.actionList = [];
        this.preMoveX = 0;
        this.isMove = false;
    },
    update: function (dt) {
        this._super();
        var moveX = this.getPosition().x - this.targetX > 0 ? -this.speed : this.speed;
        var nextX = this.getPosition().x + moveX;
        if (Math.abs(this.getPosition().x - this.targetX) < this.speed) {
            //moveX = 0;
            //if (Math.abs(this.getPosition().x - this.targetX) < cc.winSize.width / 7) {
            moveX = 0;
            nextX = Math.floor(this.targetX / cc.winSize.width * 5) * cc.winSize.width / 5 + cc.winSize.width / 10;
            this.targetX = nextX;
        }
        //console.log(moveX);
        //console.log(Math.floor(this.targetX / cc.winSize.width * 7));

        //nextX = Math.round(this.targetX / cc.winSize.width) * 7 + 50;


        //var a = Math.floor(this.targetX / cc.winSize.width * 7) * 107;
        //if (moveX == 0 && a <= this.getPosition().x && this.getPosition().x < a + 107) nextX = a + 53;


        //console.log(nextX);
        this.setPosition(nextX, this.getPosition().y);
        //console.log(this.score);
        if (this.preMoveX != moveX) this.animation(moveX);
        this.preMoveX = moveX;
    },
    onEnter: function () {
        this._super();
        for (var j = 0; j < 3; j++) {
            var sprites = [];
            for (var i = 0; i < 2; i++) {
                sprites.push(new cc.SpriteFrame(res.img_sachiko, cc.rect(90 * i, 180 * j, 90, 180)));
            }
            this.actionList.push(new cc.RepeatForever(new cc.Animate(new cc.Animation(sprites, 0.2))));
        }
        this.runAction(this.actionList[0]);
        this.scheduleUpdate();
    },
    changeTargetX: function (_x) {
        this.targetX = _x;
    },
    scorePlus: function (_x) {
        //        this.score += _x;
        this.HP += _x;
    },
    damage: function () {
        this.HP -= 5;
    },
    getHP: function () {
        return this.HP;
    },
    animation: function (dx) {
        var act = dx > 0 ? 2 : 1;//ここもっとうまいこと書けそう感
        if (dx == 0) act = 0;
        //console.log("animation"+act);
        this.stopAllActions();
        this.runAction(this.actionList[act]);
    },
    changeIsMove: function () {
        this.isMove = true;
    }

});

var FallObj = cc.Sprite.extend({
    ctor: function (_x) {
        this._super();
    },
    init: function (_x, _t) {
        this.x = _x;
        this.t = _t;
    },
    onEnter: function () {
        this._super();
        var startX = this.x * cc.winSize.width / 5 + cc.winSize.width / 10;
        this.setPosition(startX, cc.winSize.height + 100);
        //console.log(startX);
        var moveAction = cc.MoveTo.create(this.t, new cc.Point(startX, -100));
        this.runAction(moveAction);
        this.scheduleUpdate();
    },
    _update: function (_player) {
        if (cc.rectIntersectsRect(_player.getBoundingBox(), this.getBoundingBox())) {
            this.hit(_player);
            this.removeObj(this);
            //console.log("hoge");
        }
        if (this.getPosition().y < -100) {
            this.removeObj(this);
        }
    },
    hit: function (_player) {
        //継承先で実装
    },
    removeObj: function () {
        //継承先で実装
    }
});

var Heart = FallObj.extend({
    ctor: function () {
        this._super();
        if (Math.floor(Math.random() * 5) == 0) {
            this.initWithFile(res.img_heart3);
            this.point = 3;
        }
        else {
            this.initWithFile(res.img_heart1);
            this.point = 1;
        }
    },
    hit: function (_player) {
        _player.scorePlus(this.point);
    },
    removeObj: function () {
        gameLayer.removeHeart(this);
    }
}
);

var Enemy = FallObj.extend({
    ctor: function () {
        this._super();
        this.initWithFile(res.img_enemy);
    },
    hit: function (_player) {
        _player.damage();
    },
    removeObj: function () {
        gameLayer.removeEnemy(this);
    }
}
);
