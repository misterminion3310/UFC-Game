window.Game=function(){

    this.canvas=
        document.getElementById("gameCanvas");

    this.ctx=
        this.canvas.getContext("2d");

    this.canvas.width=
        GameConfig.width;

    this.canvas.height=
        GameConfig.height;

    InputManager.init();

    this.last=0;
};

Game.prototype.start=function(){

    SceneManager.change(
        new FightScene()
    );

    requestAnimationFrame(
        this.loop.bind(this)
    );
};

Game.prototype.loop=function(time){

    let dt=time-this.last;

    this.last=time;

    SceneManager.update(dt);

    SceneManager.draw(this.ctx);

    requestAnimationFrame(
        this.loop.bind(this)
    );
};