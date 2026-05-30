window.PlayerManager=function(){

    this.players=[];
};

PlayerManager.prototype.add=function(player){

    this.players.push(player);
};

PlayerManager.prototype.update=function(dt){

    this.players.forEach(p=>p.update(dt));
};

PlayerManager.prototype.draw=function(ctx){

    this.players.forEach(p=>p.draw(ctx));
};