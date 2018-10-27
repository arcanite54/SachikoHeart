
var WarnBox = cc.Sprite.extend({
    ctor: function () {
        this._super();
        //var size = cc.winSize;
        //this.initWithFile(res.img_sachiko);
        //this.initWithFile(res.img_warn);
        //this.runAction(new cc.fadeOut(0));
        //this.count = 0;
    },
    init: function (_l, _t) {
        this.l = _l;
        this.t = _t;
    },
    onEnter: function () {
        this._super();
        //this.runAction(new cc.fadeIn(0));
        this.setPosition(this.l * cc.winSize.width / 5 + cc.winSize.width / 10, cc.winSize.height - 100);
        this.runAction(new cc.blink(this.t / 60, 6));


        this.scheduleUpdate();
    },
    update: function () {
        this._super();
        this.count++;
        if (this.count > this.t) gameLayer.removeObjOnly(this);
    }
});

var WarnBox1 = WarnBox.extend({
    ctor: function () {
        this._super();
        //var size = cc.winSize;
        //this.initWithFile(res.img_sachiko);
        this.initWithFile(res.img_warn1);
        //this.runAction(new cc.fadeOut(0));
        this.count = 0;
    }
});

var WarnBox2 = WarnBox.extend({
    ctor: function () {
        this._super();
        //var size = cc.winSize;
        //this.initWithFile(res.img_sachiko);
        this.initWithFile(res.img_warn2);
        //this.runAction(new cc.fadeOut(0));
        this.count = 0;
    }
});