window.FightScene=function(){

    this.playerManager=new PlayerManager();

    this.combatManager=new CombatManager();

    this.uiManager=new UIManager();

    this.player1=new Fighter({

        x:200,
        y:330,

        color:"blue",

        controls:ControlsConfig.player1,

        ...FighterConfig.default
    });

    this.player2=new Fighter({

        x:900,
        y:330,

        color:"red",

        controls:ControlsConfig.player2,

        ...FighterConfig.default
    });

    this.playerManager.add(this.player1);
    this.playerManager.add(this.player2);

    window.addEventListener("keydown",(e)=>{

        if(e.code===ControlsConfig.player1.punch){

            this.player1.attack("punch");
        }

        if(e.code===ControlsConfig.player1.kick){

            this.player1.attack("kick");
        }

        if(e.code===ControlsConfig.player2.punch){

            this.player2.attack("punch");
        }

        if(e.code===ControlsConfig.player2.kick){

            this.player2.attack("kick");
        }
    });
};

FightScene.prototype.update=function(dt){

    this.playerManager.update(dt);

    this.combatManager.update(
        this.player1,
        this.player2
    );
};

FightScene.prototype.draw=function(ctx){

    ctx.clearRect(
        0,
        0,
        GameConfig.width,
        GameConfig.height
    );

    this.playerManager.draw(ctx);

    this.uiManager.draw(
        ctx,
        this.player1,
        this.player2
    );
};