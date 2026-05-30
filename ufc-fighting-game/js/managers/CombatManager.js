window.CombatManager = function(){};

CombatManager.prototype.update=function(p1,p2){

    let box1=p1.getAttackBox();

    if(box1){

        if(CollisionManager.rects(
            box1,
            p2.getHitbox()
        )){
            p2.takeDamage(
                p1.attacks[p1.attackType].damage
            );

            p1.attacking=false;
        }
    }

    let box2=p2.getAttackBox();

    if(box2){

        if(CollisionManager.rects(
            box2,
            p1.getHitbox()
        )){
            p1.takeDamage(
                p2.attacks[p2.attackType].damage
            );

            p2.attacking=false;
        }
    }
};