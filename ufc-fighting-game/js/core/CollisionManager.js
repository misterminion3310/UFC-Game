// Collision Manager for handling collisions between entities
var CollisionManager = (function() {
    function checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.w &&
               rect1.x + rect1.w > rect2.x &&
               rect1.y < rect2.y + rect2.h &&
               rect1.y + rect1.h > rect2.y;
    }
    
    function checkHitboxCollision(hitbox1, hitbox2) {
        return checkCollision(hitbox1, hitbox2);
    }
    
    function getDistance(entity1, entity2) {
        var dx = entity1.x - entity2.x;
        var dy = entity1.y - entity2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    function isInRange(attacker, target, range) {
        var dx = Math.abs(attacker.x - target.x);
        var facingOffset = attacker.facing === 'right' ? 1 : -1;
        var attackX = attacker.x + (attacker.facing === 'right' ? 40 : -40);
        var targetX = target.x;
        
        return Math.abs(attackX - targetX) <= range;
    }
    
    function checkAttackHit(attacker, move, target) {
        var hitbox = {
            x: attacker.x + (attacker.facing === 'right' ? move.hitbox.offsetX : -move.hitbox.offsetX - move.hitbox.width),
            y: attacker.y + move.hitbox.offsetY,
            w: move.hitbox.width,
            h: move.hitbox.height
        };
        
        var targetHitbox = {
            x: target.x - 30,
            y: target.y - 60,
            w: 60,
            h: 100
        };
        
        return checkCollision(hitbox, targetHitbox);
    }
    
    function resolveCollision(entity1, entity2) {
        var overlap = (entity1.x + 40) - (entity2.x - 40);
        
        if (overlap > 0) {
            var pushX = overlap / 2;
            entity1.x -= pushX;
            entity2.x += pushX;
            
            // Clamp positions
            entity1.x = Math.max(50, Math.min(1150, entity1.x));
            entity2.x = Math.max(50, Math.min(1150, entity2.x));
        }
    }
    
    return {
        checkCollision: checkCollision,
        checkHitboxCollision: checkHitboxCollision,
        getDistance: getDistance,
        isInRange: isInRange,
        checkAttackHit: checkAttackHit,
        resolveCollision: resolveCollision
    };
})();