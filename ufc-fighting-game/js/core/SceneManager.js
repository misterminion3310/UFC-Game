window.SceneManager={

    current:null,

    change(scene){

        this.current=scene;
    },

    update(dt){

        if(this.current){

            this.current.update(dt);
        }
    },

    draw(ctx){

        if(this.current){

            this.current.draw(ctx);
        }
    }
};