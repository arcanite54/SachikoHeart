var Title = cc.Scene.extend({
    onEnter: function () {
        this._super();
        titleLayer = new TitleMainLayer();
        this.addChild(titleLayer);
    }
});

var TitleMainLayer = cc.Layer.extend({
    //sprite:null,
    //コンストラクタ
    ctor: function () {
        this._super();
        //var backgroundLayer = new cc.LayerColor(cc.color(255, 202, 222, 255));
        //this.addChild(backgroundLayer);
        var img = new cc.Sprite(res.img_title);
        img.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2
        });
        this.addChild(img, 0);

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                cc.director.runScene(new GameMainScene());
                return true;
            }
        });


        cc.eventManager.addListener(listener.clone(), this);

        //cc.audioEngine.playMusic(res.bgm_title, true);
        //auto playのエラー。とりあえずタイトルのBGMなしで

    }

});

