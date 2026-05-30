window.AssetManager = {

    images:{},

    loadImage(key,path){

        return new Promise(resolve=>{

            const img=new Image();

            img.onload=()=>{

                this.images[key]=img;
                resolve();
            };

            img.src=path;
        });
    },

    getImage(key){
        return this.images[key];
    }
};