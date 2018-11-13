
var EffectCircle = cc.Sprite.extend({
    ctor: function (_x, _y) {
        this._super();
        this.initWithFile(res.img_effectCircle);
        this.count = 0;
        this.setPosition(_x, _y);
    },
    onEnter: function () {
        this._super();
        this.runAction(new cc.scaleTo(0.5, 2));
        this.runAction(new cc.fadeOut(0.5));
        this.scheduleUpdate();
    },
    update: function () {
        this._super();
        this.count++;
        if (this.count > this.t) gameLayer.removeObjOnly(this);
    }
});



var EffectHeart = cc.Sprite.extend({
    ctor: function (_point, _x, _y) {
        this._super();
        if (_point == 3) this.initWithFile(res.img_heart3);
        else this.initWithFile(res.img_heart1);
        this.setScale(1.5);
        this.count = 0;
        this.x = _x;
        this.y = _y;
    },
    onEnter: function () {
        this._super();
        this.runAction(new cc.fadeOut(1));
        this.scheduleUpdate();
    },
    update: function () {
        this._super();
        this.setPosition(this.x, this.y);
        this.count++;
        if (this.count > 60) gameLayer.removeObjOnly(this);
    },
    changePosition(_x, _y) {
        this.x = _x;
        this.y = _y;
    }
});
