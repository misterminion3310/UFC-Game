// Fighter class
var Fighter = (function() {
    function Fighter(config, side, controls, customImage) {
        this.config = config;
        this.side = side;
        this.controls = controls;
        
        // Position
        this.x = side === 'left' ? 250 : 950;
        this.y = 420;
        this.facing = side === 'left' ? 'right' : 'left';
        
        // Stats
        this.health = 100;
        this.maxHealth = 100;
        
        // State
        this.state = 'idle';
        this.isBlocking = false;
        this.isInvincible = false;
        this.invincibilityTimer = 0;
        this.hitStunTimer = 0;
        
        // Combat
        this.comboCounter = 0;
        this.comboTimer = 0;
        this.moveCooldowns = { punch: 0, kick: 0 };
        
        // Movement
        this.vx = 0;
        
        // Attack hitbox
        this.currentHitbox = null;
        this.attackTimer = 0;
        
        // Custom image
        this.image = null;
        if (customImage) {
            this.image = new Image();
            this.image.src = customImage;
        }
    }
    
    Fighter.prototype.update = function(deltaTime, input, opponent) {
        // Update invincibility
        if (this.isInvincible) {
            this.invincibilityTimer -= deltaTime;
            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
            }
        }
        
        // Update hit stun
        if (this.hitStunTimer > 0) {
            this.hitStunTimer -= deltaTime;
            if (this.hitStunTimer <= 0 && this.state === 'hit') {
                this.state = 'idle';
            }
        }
        
        // Update cooldowns
        if (this.moveCooldowns.punch > 0) this.moveCooldowns.punch -= deltaTime;
        if (this.moveCooldowns.kick > 0) this.moveCooldowns.kick -= deltaTime;
        if (this.comboTimer > 0) this.comboTimer -= deltaTime;
        else if (this.comboCounter > 0) this.comboCounter = 0;
        
        // Update attack timer
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
            if (this.attackTimer <= 0) {
                this.currentHitbox = null;
                if (this.state === 'punch' || this.state === 'kick') {
                    this.state = 'idle';
                }
            }
        }
        
        // Process input (only if not in hit stun)
        if (this.hitStunTimer <= 0 && this.state !== 'hit') {
            this.processInput(input);
        }
        
        // Update position
        this.x += this.vx;
        
        // Update facing based on opponent
        if (opponent && this.hitStunTimer <= 0) {
            this.facing = opponent.x > this.x ? 'right' : 'left';
        }
        
        // Clamp position
        this.x = Math.max(100, Math.min(1100, this.x));
    };
    
    Fighter.prototype.processInput = function(input) {
        // Movement
        if (this.state === 'idle' || this.state === 'walking') {
            if (input.moveLeft) {
                this.vx = -5;
                this.state = 'walking';
            } else if (input.moveRight) {
                this.vx = 5;
                this.state = 'walking';
            } else {
                this.vx *= 0.9;
                if (Math.abs(this.vx) < 0.5) {
                    this.vx = 0;
                    if (this.state === 'walking') this.state = 'idle';
                }
            }
        }
        
        // Block
        if (input.block && !this.isBlocking) {
            this.isBlocking = true;
            this.state = 'blocking';
        } else if (!input.block && this.isBlocking) {
            this.isBlocking = false;
            if (this.state === 'blocking') this.state = 'idle';
        }
        
        // Attacks (only if not blocking)
        if (!this.isBlocking && this.state !== 'blocking') {
            // Punch attack
            if (input.punch && this.moveCooldowns.punch <= 0 && this.attackTimer <= 0) {
                this.performPunch();
            }
            
            // Kick attack
            if (input.kick && this.moveCooldowns.kick <= 0 && this.attackTimer <= 0) {
                this.performKick();
            }
        }
    };
    
    Fighter.prototype.performPunch = function() {
        this.state = 'punch';
        this.moveCooldowns.punch = 0.5;
        this.comboCounter++;
        this.comboTimer = 1.0;
        this.attackTimer = 0.2;
        
        // Create punch hitbox
        var punchX = this.x + (this.facing === 'right' ? 50 : -50);
        this.currentHitbox = {
            x: punchX,
            y: this.y - 60,
            w: 40,
            h: 40,
            damage: 10,
            attacker: this,
            active: true
        };
        
        // Register with combat manager
        if (typeof CombatManager !== 'undefined') {
            CombatManager.registerAttack(this.currentHitbox);
        }
        
        // Auto-reset after animation
        var self = this;
        setTimeout(function() {
            if (self.state === 'punch' && self.attackTimer <= 0) {
                self.state = 'idle';
            }
        }, 200);
    };
    
    Fighter.prototype.performKick = function() {
        this.state = 'kick';
        this.moveCooldowns.kick = 0.6;
        this.comboCounter++;
        this.comboTimer = 1.0;
        this.attackTimer = 0.25;
        
        // Create kick hitbox
        var kickX = this.x + (this.facing === 'right' ? 70 : -70);
        this.currentHitbox = {
            x: kickX,
            y: this.y - 40,
            w: 50,
            h: 60,
            damage: 15,
            attacker: this,
            active: true
        };
        
        // Register with combat manager
        if (typeof CombatManager !== 'undefined') {
            CombatManager.registerAttack(this.currentHitbox);
        }
        
        // Auto-reset after animation
        var self = this;
        setTimeout(function() {
            if (self.state === 'kick' && self.attackTimer <= 0) {
                self.state = 'idle';
            }
        }, 250);
    };
    
    Fighter.prototype.takeDamage = function(amount, attacker) {
        if (this.isInvincible) return false;
        
        // Apply block reduction
        if (this.isBlocking) {
            amount = Math.floor(amount * 0.5);
            // Play block effect
            if (typeof EventBus !== 'undefined') {
                EventBus.publish('fighter:block', { fighter: this, damage: amount });
            }
        }
        
        this.health = Math.max(0, this.health - amount);
        this.hitStunTimer = 0.3;
        this.state = 'hit';
        this.isInvincible = true;
        this.invincibilityTimer = 0.4;
        
        // Knockback
        var direction = this.x > attacker.x ? 1 : -1;
        this.vx = direction * 6;
        
        // Reset combo on hit
        this.comboCounter = 0;
        
        // Stop blocking when hit
        this.isBlocking = false;
        
        // Publish hit event
        if (typeof EventBus !== 'undefined') {
            EventBus.publish('fighter:hit', {
                fighter: this,
                damage: amount,
                attacker: attacker,
                wasBlocking: this.isBlocking
            });
        }
        
        // Auto-reset hit state
        var self = this;
        setTimeout(function() {
            if (self.state === 'hit') {
                self.state = 'idle';
            }
        }, 300);
        
        return true;
    };
    
    Fighter.prototype.getHitbox = function() {
        return {
            x: this.x - 30,
            y: this.y - 90,
            w: 60,
            h: 110,
            type: 'hurtbox'
        };
    };
    
    Fighter.prototype.render = function(ctx) {
        ctx.save();
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 15, 45, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw fighter
        if (this.image && this.image.complete && this.image.naturalWidth > 0) {
            // Draw custom image
            ctx.save();
            if (this.facing === 'left') {
                ctx.translate(this.x, this.y - 70);
                ctx.scale(-1, 1);
                ctx.drawImage(this.image, -55, -60, 110, 110);
            } else {
                ctx.drawImage(this.image, this.x - 55, this.y - 130, 110, 110);
            }
            ctx.restore();
        } else {
            // Draw default fighter based on side
            var mainColor = this.side === 'left' ? '#e74c3c' : '#3498db';
            var darkColor = this.side === 'left' ? '#c0392b' : '#2980b9';
            
            // Draw body
            ctx.fillStyle = mainColor;
            ctx.fillRect(this.x - 32, this.y - 85, 64, 85);
            
            // Draw head
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.ellipse(this.x, this.y - 105, 28, 30, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw eyes
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x - 13, this.y - 113, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + 13, this.y - 113, 7, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#2c3e50';
            ctx.beginPath();
            ctx.arc(this.x - 13, this.y - 112, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x + 13, this.y - 112, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Angry eyebrows
            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(this.x - 24, this.y - 125, 18, 5);
            ctx.fillRect(this.x + 6, this.y - 125, 18, 5);
            
            // Mouth based on state
            ctx.fillStyle = '#8b0000';
            if (this.state === 'punch') {
                ctx.fillRect(this.x - 15, this.y - 92, 30, 6);
            } else if (this.state === 'kick') {
                ctx.fillRect(this.x - 18, this.y - 92, 36, 6);
            } else if (this.state === 'hit') {
                ctx.fillRect(this.x - 10, this.y - 94, 20, 8);
            } else {
                ctx.fillRect(this.x - 12, this.y - 95, 24, 4);
            }
            
            // Draw arms based on action
            ctx.fillStyle = darkColor;
            if (this.state === 'punch') {
                // Punching arm extended
                if (this.facing === 'right') {
                    ctx.fillRect(this.x + 25, this.y - 75, 55, 22);
                    ctx.fillRect(this.x - 52, this.y - 75, 28, 22);
                } else {
                    ctx.fillRect(this.x - 80, this.y - 75, 55, 22);
                    ctx.fillRect(this.x + 24, this.y - 75, 28, 22);
                }
            } else if (this.state === 'kick') {
                // Kicking leg
                if (this.facing === 'right') {
                    ctx.fillRect(this.x + 20, this.y - 35, 60, 22);
                } else {
                    ctx.fillRect(this.x - 80, this.y - 35, 60, 22);
                }
                ctx.fillRect(this.x - 28, this.y - 35, 22, 22);
                // Normal arms
                ctx.fillRect(this.x - 52, this.y - 75, 28, 22);
                ctx.fillRect(this.x + 24, this.y - 75, 28, 22);
            } else if (this.state === 'blocking') {
                // Blocking arms up
                ctx.fillRect(this.x - 45, this.y - 85, 35, 25);
                ctx.fillRect(this.x + 10, this.y - 85, 35, 25);
            } else {
                // Normal arms
                ctx.fillRect(this.x - 52, this.y - 75, 28, 22);
                ctx.fillRect(this.x + 24, this.y - 75, 28, 22);
            }
            
            // Draw legs
            ctx.fillRect(this.x - 28, this.y - 25, 22, 45);
            ctx.fillRect(this.x + 6, this.y - 25, 22, 45);
            
            // Draw gloves
            ctx.fillStyle = '#8b0000';
            if (this.state === 'punch' && this.facing === 'right') {
                ctx.fillRect(this.x + 72, this.y - 78, 18, 18);
            } else if (this.state === 'punch' && this.facing === 'left') {
                ctx.fillRect(this.x - 90, this.y - 78, 18, 18);
            } else {
                ctx.fillRect(this.x - 58, this.y - 78, 18, 18);
                ctx.fillRect(this.x + 40, this.y - 78, 18, 18);
            }
        }
        
        // Draw health bar above fighter
        var healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(this.x - 60, this.y - 145, 120, 14);
        ctx.fillStyle = this.side === 'left' ? '#e74c3c' : '#2ecc71';
        ctx.fillRect(this.x - 60, this.y - 145, 120 * healthPercent, 14);
        
        // Draw name
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 16px Impact';
        ctx.shadowBlur = 0;
        ctx.textAlign = 'center';
        ctx.fillText(this.config.name, this.x, this.y - 158);
        
        // Draw block effect
        if (this.isBlocking) {
            ctx.strokeStyle = '#f1c40f';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(this.x, this.y - 75, 55, 0, Math.PI * 2);
            ctx.stroke();
            // Block文字
            ctx.fillStyle = '#f1c40f';
            ctx.font = 'bold 14px Impact';
            ctx.fillText('BLOCK', this.x, this.y - 120);
        }
        
        // Draw combo counter
        if (this.comboCounter > 1 && this.comboTimer > 0) {
            ctx.fillStyle = '#e67e22';
            ctx.font = 'bold 22px Impact';
            ctx.fillText(this.comboCounter + ' HIT!', this.x, this.y - 175);
        }
        
        // Draw hit effect
        if (this.state === 'hit') {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y - 75, 50, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw attack hitbox for debugging (optional)
        if (this.currentHitbox && this.currentHitbox.active && typeof CombatManager !== 'undefined' && CombatManager.debug) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.currentHitbox.x, this.currentHitbox.y, this.currentHitbox.w, this.currentHitbox.h);
        }
        
        ctx.restore();
    };
    
    return Fighter;
})();