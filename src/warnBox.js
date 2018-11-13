
var WarnBox = cc.Sprite.extend({
    ctor: function () {
        this._super();
    },
    init: function (_l, _t, _j) {
        //initいらない説
        this.l = _l;
        this.t = _t;
        this.isSE = _j == 0 ? true : false;//音の重ね掛け回避
    },
    onEnter: function () {
        this._super();
        this.setPosition(this.l * cc.winSize.width / 5 + cc.winSize.width / 10, cc.winSize.height - 200);
        this.runAction(new cc.blink(this.t / 60, 6));
        this.scheduleUpdate();
    },
    update: function () {
        this._super();
        if (this.count % Math.floor(this.t / 6) == 0 && this.isSE) cc.audioEngine.playEffect(res.se_warn);
        this.count++;
        if (this.count > this.t) gameLayer.removeObjOnly(this);
    }
});

var WarnBox1 = WarnBox.extend({
    ctor: function () {
        this._super();
        this.initWithFile(res.img_warn1);
        this.count = 0;
    }
});

var WarnBox2 = WarnBox.extend({
    ctor: function () {
        this._super();
        this.initWithFile(res.img_warn2);
        this.count = 0;
    }
});