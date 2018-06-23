/*
var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var gameLayer = GameMainLayer();
        this.addChild(gameLayer);
    }
});*/

window.onload = function(){
              cc.game.onStart = function(){
                  //load resources
                  cc.LoaderScene.preload(g_resources, function () {
                      //var MyScene = MainScene();
                      cc.director.runScene(new MyScene());
                  }, this);
              };
              cc.game.run("gameCanvas");
          };