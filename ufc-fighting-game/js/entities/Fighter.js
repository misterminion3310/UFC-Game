window.Fighter = function(data){

    Object.assign(this,data);

    this.health = this.maxHealth;

    this.attacking=false;
    this.attackType=null;

    this.animation = new AnimationManager(this);
};

Fighter.prototype.update=function(dt){

    if(this.health<=0) return;

    if(InputManager.isPressed(this.controls.left)){

        this.x-=this.moveSpeed;
    }

    if(InputManager.isPressed(this.controls.right)){

        this.x+=this.moveSpeed;
    }

    this.animation.update(dt);
};

Fighter.prototype.attack=function(type){

    if(this.attacking) return;

    this.attacking=true;
    this.attackType=type;

    setTimeout(()=>{

        this.attacking=false;
        this.attackType=null;

    }, this.attacks[type].duration);
};

Fighter.prototype.takeDamage=function(value){

    this.health-=value;

    if(this.health<0){

        this.health=0;
    }
};

Fighter.prototype.getHitbox=function(){

    return {

        x:this.x,
        y:this.y,

        width:this.width,
        height:this.height
    };
};

Fighter.prototype.getAttackBox=function(){

    if(!this.attacking) return null;

    let attack=this.attacks[this.attackType];

    return {

        x:this.x+this.width,

        y:this.y+50,

        width:attack.range,

        height:80
    };
};

Fighter.prototype.draw=function(ctx){

    ctx.fillStyle=this.color;

    ctx.fillRect(
        this.x,
        this.y,
        this.width,
        this.height
    );

    let attackBox=this.getAttackBox();

    if(attackBox){

        ctx.fillStyle="rgba(255,0,0,.4)";

        ctx.fillRect(
            attackBox.x,
            attackBox.y,
            attackBox.width,
            attackBox.height
        );
    }
};