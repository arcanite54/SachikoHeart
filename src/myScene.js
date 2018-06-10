//このへんグローバルにしていいのか？
var player;
var gameLayer;
var scoreLabel;

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        gameLayer = new GameMainLayer();
        this.addChild(gameLayer);
    }
});



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
        this.score=0;
        scoreLabel=cc.LabelTTF.create("score:"+this.score,"Arial",40);
        scoreLabel.setPosition(cc.winSize.width-120,cc.winSize.height-50);
        scoreLabel.setColor(cc.color(255,255,255));
        this.addChild(scoreLabel,1);
        this.scheduleUpdate();


        this.schedule(this.addHeart,3);
    },
    update:function(dt)
    {
        player.update();
        this.score=player.getScore();
        scoreLabel.setString("score:"+this.score);
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
        this.score=0;
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
        console.log(this.score);
    },
    changeTargetX:function(_x)
    {
        this.targetX=_x;
    },
    hoge:function()
    {
        console.log("hoge");
    },
    scorePlus:function(_x)
    {
        this.score+=_x;
    },
    getScore:function()
    {
        return this.score;
    }



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
        var startX=Math.random()*cc.winSize.width;
        this.setPosition(startX,cc.winSize.height+100);
        //console.log(startX);
        var moveAction = cc.MoveTo.create(5,new cc.Point(startX,-100));
        this.runAction(moveAction);
        this.scheduleUpdate();
        this.point=1;//あとで3ポイントもつける
    },
    update:function(dt)
    {
        if(cc.rectIntersectsRect(player.getBoundingBox(),this.getBoundingBox()))
        {
            gameLayer.removeHeart(this);
            player.scorePlus(this.point);
        }
        if(this.getPosition().y< -100)
        {
            gameLayer.removeHeart(this);
        }
    }

});
