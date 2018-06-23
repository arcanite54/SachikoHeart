//このへんグローバルにしていいのか？
var player;
var gameLayer;


var MyScene = cc.Scene.extend({
    onEnter:function () 
    {
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
        this.scoreLabel=cc.LabelTTF.create("score:"+this.score,"Arial",40);
        this.scoreLabel.setPosition(cc.winSize.width-120,cc.winSize.height-90);
        this.scoreLabel.setColor(cc.color(255,255,255));

        this.HPLabel=cc.LabelTTF.create("life:"+this.playerHP,"Arial",40);
        this.HPLabel.setPosition(cc.winSize.width-120,cc.winSize.height-50);
        this.HPLabel.setColor(cc.color(255,255,255));

        this.addChild(this.scoreLabel,1);
        this.addChild(this.HPLabel,1);

        this.scheduleUpdate();


        this.schedule(this.addHeart,3);
        this.schedule(this.addEnemy,7);
    },
    update:function(dt)
    {
        player.update();
        this.scoreLabel.setString("score:"+player.getScore());
        this.HPLabel.setString("life:"+player.getHP());

        //this.this.player.hoge();
    },
    addHeart:function(event)
    {
        var heart=new Heart();
        this.addChild(heart,1);
    },
    addEnemy:function(event)
    {
        var enemy=new Enemy();
        this.addChild(enemy,1);
    },
    removeObj:function(_obj)
    {
        this.removeChild(_obj);
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
        this.HP=3;
    },
    update:function(dt)
    {
        var moveX = this.getPosition().x-this.targetX > 0 ? -this.speed : this.speed;
        if(Math.abs(this.getPosition().x-this.targetX)<this.speed)moveX=0;
        this.setPosition(this.getPosition().x+moveX,this.getPosition().y);
        //console.log(this.score);
    },
    changeTargetX:function(_x)
    {
        this.targetX=_x;
    },
    scorePlus:function(_x)
    {
        this.score+=_x;
    },
    getScore:function()
    {
        return this.score;
    },
    damage:function()
    {
        this.HP-=1;
    },
    getHP:function()
    {
        return this.HP;
    }
});

var FallObj = cc.Sprite.extend({
    ctor:function()
    {
        this._super();
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
    },
    update:function(dt)
    {
        if(cc.rectIntersectsRect(player.getBoundingBox(),this.getBoundingBox()))
        {
            this.hit();
            gameLayer.removeObj(this);
        }
        if(this.getPosition().y< -100)
        {
            gameLayer.removeObj(this);
        }
    },
    hit:function()
    {
        //継承先で実装
    }

});

var Heart =FallObj.extend({
        ctor:function()
        {
            this._super();
            if(Math.floor(Math.random()*5)==0)
            {
                this.initWithFile(res.img_heart3);
                this.point=3;
            }
            else
            {
                this.initWithFile(res.img_heart1);
                this.point=1;
            }
        },
        onEnter:function()
        {
            this._super();
        },
        hit:function()
        {
            //this._super();
            player.scorePlus(this.point);
        }
    }
);

var Enemy =FallObj.extend({
        ctor:function()
        {
            this._super();
            this.initWithFile(res.img_enemy);
        },
        onEnter:function()
        {
            this._super();
        },
        hit:function()
        {
            player.damage();
        }
    }
);
