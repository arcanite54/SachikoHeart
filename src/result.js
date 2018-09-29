var Result = cc.Scene.extend({
    onEnter: function () {
        this._super();
        ResultLayer = new ResultMainLayer();
        this.addChild(ResultLayer);
    }
});

var ResultMainLayer = cc.Layer.extend({
    //sprite:null,
    //コンストラクタ
    ctor: function () {
        this._super();
        var backgroundLayer = new cc.LayerColor(cc.color(0, 202, 222, 255));
        this.addChild(backgroundLayer);

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                cc.director.runScene(new Title());
                return true;
            }
        });

        cc.eventManager.addListener(listener, this);



    }

});