

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
        var moveAction = cc.MoveTo.create(this.t, new cc.Point(startX, -100));//ここどうしよう
        this.runAction(moveAction);
        this.scheduleUpdate();
    },
    _update: function (_player) {
        //if (cc.rectIntersectsRect(_player.getBoundingBox(), this.getBoundingBox())) {
        if (cc.rectIntersectsRect(cc.rect(_player.getPosition().x, _player.getPosition().y, 50, 50), this.getBoundingBox())) {
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
    },
    init: function (_x, _t, _type) {
        this.x = _x;
        this.t = _t;
        this.type = _type;
        switch (this.type) {
            case 0: this.initWithFile(res.img_enemy_mush); break;
            case 1: this.initWithFile(res.img_enemy_ball); break;
            case 2: this.initWithFile(res.img_enemy_ghost); break;
            case 3: this.initWithFile(res.img_enemy_flower); break;
        }
    },
    onEnter: function () {
        this._super();
        switch (this.type) {
            case 1:
                var moverr = cc.MoveBy.create(3 * this.t / 5 * Math.abs(cc.winSize.width - this.getPosition().x) / cc.winSize.width, cc.winSize.width - this.getPosition().x, 0);
                var movell = cc.MoveBy.create(3 * this.t / 5 * this.getPosition().x / cc.winSize.width, 0 - this.getPosition().x, 0);
                var moverl = cc.MoveBy.create(3 * this.t / 5 * Math.abs(cc.winSize.width - this.getPosition().x) / cc.winSize.width, -cc.winSize.width + this.getPosition().x, 0);
                var movelr = cc.MoveBy.create(3 * this.t / 5 * this.getPosition().x / cc.winSize.width, this.getPosition().x, 0);

                this.runAction(cc.repeatForever(cc.sequence(moverr, moverl, movell, movelr)));
                break;
            case 2:
                var move1 = cc.moveBy(2 * this.t / 5, 150, 0).easing(cc.easeSineInOut());
                var move2 = cc.moveBy(2 * this.t / 5, -150, 0).easing(cc.easeSineInOut());

                this.runAction(cc.repeatForever(cc.sequence(move1, move2)));
                break;
        }
    },
    hit: function (_player) {
        _player.damage();
    },
    removeObj: function () {
        gameLayer.removeEnemy(this);
    }
}
);

