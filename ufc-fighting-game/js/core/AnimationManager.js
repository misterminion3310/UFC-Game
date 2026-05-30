window.AnimationManager = function(owner){

    this.owner = owner;

    this.current = "idle";

    this.animations = {};

    this.frame = 0;
    this.elapsed = 0;
};

AnimationManager.prototype.add = function(name,data){

    this.animations[name]=data;
};

AnimationManager.prototype.play = function(name){

    if(this.current===name) return;

    this.current=name;
    this.frame=0;
    this.elapsed=0;
};

AnimationManager.prototype.update = function(dt){

    let anim=this.animations[this.current];

    if(!anim) return;

    this.elapsed += dt;

    if(this.elapsed>=anim.frameDuration){

        this.elapsed=0;

        this.frame++;

        if(this.frame>=anim.frames){

            if(anim.loop){

                this.frame=0;

            }else{

                this.frame=anim.frames-1;
            }
        }
    }
};

AnimationManager.prototype.draw=function(ctx){

    let anim=this.animations[this.current];

    if(!anim) return;

    if(anim.image){

        ctx.drawImage(
            anim.image,
            this.frame*anim.frameWidth,
            0,
            anim.frameWidth,
            anim.frameHeight,

            this.owner.x,
            this.owner.y,

            anim.frameWidth,
            anim.frameHeight
        );
    }
};