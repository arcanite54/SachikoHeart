
var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameMainLayer();
        this.addChild(layer);
    }
});

var player;

var GameMainLayer = cc.Layer.extend({
    //sprite:null,
    //コンストラクタ
    ctor:function() 
    {
        this._super();
        var backgroundLayer = new cc.LayerColor(cc.color(170,202,222,255));
        this.addChild(backgroundLayer);

/*    
        cc.eventManager.addListener({
            event:cc.EventListener.MOUSE,
            onMouseDown:function(event)
            {
                player.changeTargetX(event.getLocationX());
                //this.player.targetX=event.getLocationX();
            }
        },this);
        */
        cc.eventManager.addListener(listener,this);
        player = new Player();
        this.addChild(player, 0);
        this.scheduleUpdate();

        this.schedule(this.addHeart,1);
    },
    update:function(dt)
    {
        player.update();
        //this.player.hoge();
    },
    addHeart:function(event)
    {
        var heart=new Heart();
        this.addChild(heart,1);
    },
    removeHeart:function(_heart)
    {
        this.removeChild(_heart);
    }
});

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

var Player = cc.Sprite.extend({
    ctor:function()
    {
        this._super();
        var size = cc.winSize;
        this.initWithFile(res.img_sachiko);
        this.setPosition(size.width/2,size.height/4);
        this.targetX=this.getPosition().x;
        this.speed=5;
        /*
        this.attr({
            x: size.width/2,
            y: size.height/4
        });
        */
        //cc.eventManager.addListener(listener.clone(),this);

    },
    update:function()
    {
        var moveX = this.getPosition().x-this.targetX > 0 ? -this.speed : this.speed;
        if(Math.abs(this.getPosition().x-this.targetX)<this.speed)moveX=0;
        this.setPosition(this.getPosition().x+moveX,this.getPosition().y);
    },
    changeTargetX:function(_x)
    {
        this.targetX=_x;
    },
    hoge:function()
    {
        console.log("hoge");
    },



});


var Heart = cc.Sprite.extend({
    ctor:function()
    {
        this._super();
        this.initWithFile(res.img_heart1);
    },
    onEnter:function()
    {
        this._super();
        var startX=Math.random()*300;
        this.setPosition(startX,1000);
        console.log(startX);
        var moveAction = cc.MoveTo.create(2.5,new cc.Point(startX,-100));
        this.runAction(moveAction);
        this.scheduleUpdate();
    },
    update:function(dt)
    {
        if(this.getPosition().x< -100)
        {

        }
    }

});
