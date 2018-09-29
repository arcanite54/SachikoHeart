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
        var backgroundLayer = new cc.LayerColor(cc.color(170, 202, 222, 255));
        this.addChild(backgroundLayer);

        this.player = new Player();
        this.addChild(this.player, 0);
        this.time = 0;
        this.isDead = false;
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
        //this.player.update();
        this.scoreLabel.setString("スコア:" + this.player.getScore());
        this.HPLabel.setString("残りHP:" + this.player.getHP());

        if (this.player.getHP() <= 0) {
            //cc.director.runScene(new Result());
            this.resultLabel.setString("スコア:" + this.player.getScore());
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
        var h_t = Math.round((Math.max(61, 120 - this.time / 50)));
        var e_t = Math.round((Math.max(37, 370 - this.time / 10)));
        console.log(h_t, e_t);
        if (this.time % h_t == 0) this.addHeart();
        if (this.time % e_t == 0) this.addEnemy();

    },
    addHeart: function (event) {
        var heart = new Heart();
        this.addChild(heart, 1);
        this.heartList.push(heart);
    },
    addEnemy: function (event) {
        var enemy = new Enemy();
        this.addChild(enemy, 1);
        this.enemyList.push(enemy);

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

        this.setPosition(size.width / 2, size.height / 4);
        this.targetX = this.getPosition().x;
        this.speed = 5;
        this.score = 0;
        this.HP = 3;
        this.actionList = [];
        this.preMoveX = 0;
        this.isMove = false;
    },
    update: function (dt) {
        this._super();
        var moveX = this.getPosition().x - this.targetX > 0 ? -this.speed : this.speed;
        if (Math.abs(this.getPosition().x - this.targetX) < this.speed) moveX = 0;
        this.setPosition(this.getPosition().x + moveX, this.getPosition().y);
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
        this.score += _x;
    },
    getScore: function () {
        return this.score;
    },
    damage: function () {
        this.HP -= 1;
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
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        var startX = Math.random() * cc.winSize.width;
        this.setPosition(startX, cc.winSize.height + 100);
        //console.log(startX);
        var moveAction = cc.MoveTo.create(5, new cc.Point(startX, -100));
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
