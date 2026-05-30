window.UIManager=function(){};

UIManager.prototype.draw=function(ctx,p1,p2){

    ctx.fillStyle="black";

    ctx.fillRect(40,40,400,30);
    ctx.fillRect(840,40,400,30);

    ctx.fillStyle="green";

    ctx.fillRect(
        40,
        40,
        400*(p1.health/p1.maxHealth),
        30
    );

    ctx.fillRect(
        840,
        40,
        400*(p2.health/p2.maxHealth),
        30
    );
};