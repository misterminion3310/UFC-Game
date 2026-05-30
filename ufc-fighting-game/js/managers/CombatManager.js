// Combat Manager for handling attacks and hits
var CombatManager = (function() {
    var activeAttacks = [];
    var hitCooldown = {};
    
    function registerAttack(attack) {
        if (!attack || !attack.attacker) return;
        
        activeAttacks.push({
            x: attack.x,
            y: attack.y,
            w: attack.w,
            h: attack.h,
            damage: attack.damage,
            attacker: attack.attacker,
            active: true,
            lifetime: 0.2 // 200ms lifetime
        });
        
        console.log('Attack registered:', attack.attacker.side, 'damage:', attack.damage);
    }
    
    function update(deltaTime, fighter1, fighter2) {
        // Update active attacks
        for (var i = activeAttacks.length - 1; i >= 0; i--) {
            var attack = activeAttacks[i];
            attack.lifetime -= deltaTime;
            
            if (attack.lifetime <= 0) {
                activeAttacks.splice(i, 1);
                continue;
            }
            
            // Check hit against both fighters (but not the attacker)
            if (attack.attacker !== fighter1) {
                checkHit(attack, fighter1);
            }
            if (attack.attacker !== fighter2) {
                checkHit(attack, fighter2);
            }
        }
    }
    
    function checkHit(attack, target) {
        // Get target hitbox
        var targetHitbox = target.getHitbox();
        
        // Check collision
        var isHit = attack.x < targetHitbox.x + targetHitbox.w &&
                   attack.x + attack.w > targetHitbox.x &&
                   attack.y < targetHitbox.y + targetHitbox.h &&
                   attack.y + attack.h > targetHitbox.y;
        
        if (isHit && attack.active) {
            // Check cooldown to prevent multiple hits from same attack
            var hitKey = attack.attacker.side + '_' + target.side;
            if (hitCooldown[hitKey] && hitCooldown[hitKey] > 0) {
                return;
            }
            
            // Apply damage
            var damageDealt = target.takeDamage(attack.damage, attack.attacker);
            
            if (damageDealt) {
                console.log('HIT!', attack.attacker.side, 'hit', target.side, 'for', attack.damage, 'damage');
                
                // Deactivate attack after hit
                attack.active = false;
                hitCooldown[hitKey] = 0.3; // 300ms cooldown
                
                // Remove attack from list
                var index = activeAttacks.indexOf(attack);
                if (index > -1) {
                    activeAttacks.splice(index, 1);
                }
            }
        }
    }
    
    function clearAttacks() {
        activeAttacks = [];
    }
    
    function getActiveAttacks() {
        return activeAttacks;
    }
    
    // Update hit cooldowns
    setInterval(function() {
        for (var key in hitCooldown) {
            if (hitCooldown[key] > 0) {
                hitCooldown[key] -= 0.05;
            }
        }
    }, 50);
    
    return {
        registerAttack: registerAttack,
        update: update,
        clearAttacks: clearAttacks,
        getActiveAttacks: getActiveAttacks,
        debug: false
    };
})();