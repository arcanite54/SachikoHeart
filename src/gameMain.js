var gameLayer; //グローバルでいいのかなあ

var GameMainScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        gameLayer = new GameMainLayer();
        this.addChild(gameLayer);
    }
});

var GameMainLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        cc.audioEngine.playMusic(res.bgm_main, true);
        var back_img = new cc.Sprite(res.img_back);
        back_img.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2
        });
        this.addChild(back_img, 0);

        this.effectCircleList = [];
        this.effectHeartList = [];
        this.player = new Player();
        this.addChild(this.player, 0);
        this.time = 0;
        this.time2 = 0;
        this.cycle = 1200;
        this.fallSpeed = 5;
        this.fallCycle = 180;
        this.hardLineList = [false, false, false, false, false];
        this.hardLineList[Math.floor(Math.random() * 5)] = true;
        this.hardStartTime = this.cycle - 10;
        this.hardEndTime = this.cycle;
        this.isDead = false;
        this.isHard = true; //trueなら警告通りにenemyが飛んでくる

        //本当は外で定義したい↓
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();

                target.player.changeTargetX(touch.getLocation().x); //ここなんでtargetなんだろう
                //書いてあった↓
                //http://mmorley.hatenablog.com/entry/2015/09/22/230549
                target.addEffectCircle(touch.getLocation());
                return true;
            }
        });
        cc.eventManager.addListener(listener.clone(), this);

        this.scoreLabel = cc.LabelTTF.create("スコア:", "Arial", 30);
        this.scoreLabel.setPosition(
            cc.winSize.width - 100,
            cc.winSize.height - 30
        );
        this.scoreLabel.setColor(cc.color(0, 0, 0));

        this.resultLabel = cc.LabelTTF.create("スコア:", "Arial", 80);
        this.resultLabel.setPosition(
            cc.winSize.width / 2,
            cc.winSize.height / 2 + 100
        );
        this.resultLabel.setColor(cc.color(255, 0, 0));
        this.resultLabel2 = cc.LabelTTF.create("ゲームオーバー", "Arial", 60);
        this.resultLabel2.setPosition(
            cc.winSize.width / 2,
            cc.winSize.height / 2 + 190
        );
        this.resultLabel2.setColor(cc.color(255, 0, 0));

        this.HPLabel = cc.LabelTTF.create("", "Arial", 40);
        this.HPLabel.setPosition(
            cc.winSize.width - 120,
            cc.winSize.height - 50
        );
        this.HPLabel.setColor(cc.color(0, 0, 0));
        this.heartList = [];
        this.enemyList = [];
        this.addChild(this.scoreLabel, 1);
        this.addChild(this.HPLabel, 1);

        this.scheduleUpdate();
    },
    update: function (dt) {
        this.HPLabel.setPosition(
            this.player.getPosition().x,
            this.player.getPosition().y + 120
        );
        for (var i = 0; i < this.effectHeartList.length; i++) {
            this.effectHeartList[i].changePosition(
                this.player.getPosition().x,
                this.player.getPosition().y
            );
        }

        if (this.isDead) return;
        score = Math.round(this.time / 60) + this.player.getScore();
        this.scoreLabel.setString("スコア:" + score);
        this.HPLabel.setString(this.player.getHP());
        if (this.player.getHP() <= 0) {
            this.resultLabel.setString("スコア:" + score);
            this.addChild(this.resultLabel, 1);
            this.addChild(this.resultLabel2, 1);
            var retry = new RetryBox();
            this.addChild(retry, 2);
            var tweet = new TweetBox(score);
            this.addChild(tweet, 2);

            this.isDead = true;
        }
        for (var i = 0; i < this.heartList.length; i++) {
            this.heartList[i]._update(this.player);
        }
        for (var i = 0; i < this.enemyList.length; i++) {
            this.enemyList[i]._update(this.player);
        }

        if (this.time2 % this.fallCycle == 0) this.normalPhase();

        var preWarn = Math.max(
            Math.floor(this.hardStartTime - (180 * this.cycle) / 1200),
            0
        );
        if (preWarn == this.time2) {
            //forEachがつかえないっぽい
            var j = 0;
            for (var i = 0; i < 5; i++) {
                if (this.hardLineList[i] != this.isHard) continue;
                var w = this.isHard ? new WarnBox1() : new WarnBox2();
                w.init(i, this.hardStartTime - preWarn, j);
                this.addChild(w, 2);
                j++;
            }
        }
        if (this.hardStartTime <= this.time2 && this.time2 <= this.hardEndTime)
            for (var i = 0; i < 5; i++) {
                if (!this.hardLineList[i]) continue;
                this.hardPhase(i);
            }

        this.time++;
        this.time2++;
        if (this.time2 > this.cycle) {
            this.endPhase();
        }
    },
    normalPhase: function () {
        var k = Math.floor(Math.random() * 6);
        this.addHeart(k, this.fallSpeed + (Math.random() * 2 - 1));
        for (var i = 0; i < 5; i++) {
            if (i == k) continue;
            var n = Math.floor(Math.random() * 10);
            if (n < 2)
                this.addHeart(i, this.fallSpeed + (Math.random() * 2 - 0.5));
            else if (7 <= n)
                this.addEnemy(
                    i,
                    this.fallSpeed + (Math.random() * 2 - 1),
                    Math.floor(Math.random() * 3)
                );
        }
    },
    hardPhase: function (_l) {
        this.addEnemy(_l, 1, 3);
    },
    endPhase: function () {
        this.time2 = 0;
        this.cycle = Math.max(this.cycle - 120, 360);
        this.fallSpeed = Math.max(this.fallSpeed - 0.3, 2.0);
        this.fallCycle = Math.max(this.fallCycle - Math.random() * 30 + 5, 30);
        this.fallCycle = Math.floor(this.fallCycle);
        this.isHard = Math.random() < 0.5 ? true : false;

        for (var i = 0; i < 5; i++) {
            this.hardLineList[i] = Math.random() < 0.5 ? true : false;
        }
        this.hardLineList[Math.floor(Math.random() * 5)] = false;
        this.hardStartTime = Math.floor(Math.random() * (this.cycle - 60) + 60);
        this.hardStartTime = Math.max(this.hardStartTime, 0);
        this.hardEndTime = this.hardStartTime + Math.random() * 9 + 2;
        this.hardEndTime = Math.min(this.hardEndTime, this.cycle);
    },
    addHeart: function (_i, _t) {
        var heart = new Heart();
        heart.init(_i, _t);
        this.addChild(heart, 1);
        this.heartList.push(heart);
    },
    addEnemy: function (_i, _t, _type) {
        var enemy = new Enemy();
        enemy.init(_i, _t, _type);
        this.addChild(enemy, 1);
        this.enemyList.push(enemy);
    },
    addEffectCircle: function (_p) {
        var circle = new EffectCircle(_p.x, _p.y); //なんでcc.DrawNode()できないんじゃい
        this.addChild(circle, 2);
    },
    addEffectHeart: function (_point) {
        var eff = new EffectHeart(
            _point,
            this.player.getPosition().x,
            this.player.getPosition().y
        );
        this.addChild(eff, 1);
        this.effectHeartList.push(eff);
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
        this.heartList.splice(this.heartList.indexOf(_obj), 1);
        this.removeChild(_obj);
    },
    removeEnemy: function (_obj) {
        this.enemyList.splice(this.enemyList.indexOf(_obj), 1);
        this.removeChild(_obj);
    },
    removeObjOnly: function (_obj) {
        this.removeChild(_obj);
    }
});

var RetryBox = cc.Sprite.extend({
    ctor: function () {
        this._super();
        this.initWithFile(res.img_retry);
        this.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);

        var listener2 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var location = target.convertToNodeSpace(touch.getLocation());
                var targetSize = target.getContentSize();
                var targetRectangle = cc.rect(
                    0,
                    0,
                    targetSize.width,
                    targetSize.height
                );
                if (cc.rectContainsPoint(targetRectangle, location)) {
                    cc.audioEngine.stopMusic();
                    cc.director.runScene(new Title());
                }
                return true;
            }
        });
        cc.eventManager.addListener(listener2.clone(), this);
    }
});

var TweetBox = cc.Sprite.extend({
    ctor: function (_score) {
        this._super();
        this.initWithFile(res.img_tweet);
        this.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 3 + 50,
            scale: 0.3
        });
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var location = target.convertToNodeSpace(touch.getLocation());
                var targetSize = target.getContentSize();
                var targetRectangle = cc.rect(
                    0,
                    0,
                    targetSize.width,
                    targetSize.height
                );
                if (cc.rectContainsPoint(targetRectangle, location)) {
                    target.openTwitter(_score);
                }
                return true;
            }
        });
        cc.eventManager.addListener(listener.clone(), this);
    },
    openTwitter: function (score) {
        var text = "スコア:" + score + "%0A幸子カワイイよ！%0A";

        if (
            (navigator.userAgent.indexOf("iPhone") > 0 &&
                navigator.userAgent.indexOf("iPad") == -1) ||
            navigator.userAgent.indexOf("iPod") > 0
        ) {
            var url =
                "twitter://post?message=" +
                text +
                "%23KawaiiPanic" +
                "%0A" +
                "https://arcanite54.github.io/SachikoHeart/";

            location.href = url;
        } else if (navigator.userAgent.indexOf("Android") > 0) {
            var url =
                "intent://post?message=" +
                text +
                "%23KawaiiPanic" +
                "%0A" +
                "https://arcanite54.github.io/SachikoHeart/" +
                "%23Intent;scheme=twitter;package=com.twitter.android;end;";
            location.href = url;
        }
        else {
            var url =
                "http://twitter.com/intent/tweet?text=" +
                text +
                "&hashtags=KawaiiPanic" +
                "&url=https://arcanite54.github.io/SachikoHeart/";

            window.open(url, null, "width=480, height=320");
        }
    }
});
