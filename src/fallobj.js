

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
