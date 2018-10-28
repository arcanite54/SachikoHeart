
var Player = cc.Sprite.extend({
    ctor: function () {
        this._super();
        var size = cc.winSize;
        //this.initWithFile(res.img_sachiko);

        this.setPosition(size.width / 2, size.height / 8);
        this.targetX = this.getPosition().x;
        this.speed = 15;
        //this.score = 0;
        this.HP = 60;
        this.actionList = [];
        this.preMoveX = 0;
        this.isMove = false;

    },
    update: function (dt) {
        this._super();
        var moveX = this.getPosition().x - this.targetX > 0 ? -this.speed : this.speed;
        var nextX = this.getPosition().x + moveX;
        if (Math.abs(this.getPosition().x - this.targetX) < this.speed) {
            //moveX = 0;
            //if (Math.abs(this.getPosition().x - this.targetX) < cc.winSize.width / 7) {
            moveX = 0;
            nextX = Math.floor(this.targetX / cc.winSize.width * 5) * cc.winSize.width / 5 + cc.winSize.width / 10;
            this.targetX = nextX;
        }
        //console.log(moveX);
        //console.log(Math.floor(this.targetX / cc.winSize.width * 7));

        //nextX = Math.round(this.targetX / cc.winSize.width) * 7 + 50;


        //var a = Math.floor(this.targetX / cc.winSize.width * 7) * 107;
        //if (moveX == 0 && a <= this.getPosition().x && this.getPosition().x < a + 107) nextX = a + 53;


        //console.log(nextX);
        this.setPosition(nextX, this.getPosition().y);
        //console.log(this.score);
        if (this.preMoveX != moveX) this.animation(moveX);
        this.preMoveX = moveX;
    },
    onEnter: function () {
        this._super();
        for (var j = 0; j < 3; j++) {
            var sprites = [];
            for (var i = 0; i < 2; i++) {
                sprites.push(new cc.SpriteFrame(res.img_sachiko, cc.rect(90 * i, 180 * j, 90, 180)));
            }
            this.actionList.push(new cc.RepeatForever(new cc.Animate(new cc.Animation(sprites, 0.2))));
        }
        this.runAction(this.actionList[0]);
        this.scheduleUpdate();
    },
    changeTargetX: function (_x) {
        this.targetX = _x;
    },
    scorePlus: function (_x) {
        //        this.score += _x;
        this.HP += _x;
    },
    damage: function () {
        this.HP -= 20;
    },
    getHP: function () {
        return Math.max(this.HP, 0);
    },
    animation: function (dx) {
        var act = dx > 0 ? 2 : 1;//ここもっとうまいこと書けそう感
        if (dx == 0) act = 0;
        //console.log("animation"+act);
        this.stopAllActions();
        this.runAction(this.actionList[act]);
    },
    changeIsMove: function () {
        this.isMove = true;
    }
});