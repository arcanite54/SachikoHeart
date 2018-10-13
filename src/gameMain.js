//このへんグローバルにしていいのか？
var gameLayer;

var GameMainScene = cc.Scene.extend({
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
        this.warnBox.runAction(new cc.fadeOut(0));
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

