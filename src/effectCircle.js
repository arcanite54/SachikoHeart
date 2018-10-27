
var EffectCircle = cc.Sprite.extend({
    ctor: function () {
        this._super();
        this.initWithFile(res.img_effectCircle);
        //this.runAction(new cc.fadeOut(0));
        this.count = 0;
    },
    init: function (_x, _y) {
        this.setPosition(_x, _y);
    },
    onEnter: function () {
        this._super();
        //this.runAction(new cc.fadeIn(0));
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
