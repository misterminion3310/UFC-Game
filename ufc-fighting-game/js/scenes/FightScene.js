// Fight Scene - main gameplay scene
var FightScene = (function() {
    function FightScene(ctx, fighter1, fighter2, uiManager) {
        this.ctx = ctx;
        this.fighter1 = fighter1;
        this.fighter2 = fighter2;
        this.uiManager = uiManager;
        
        this.round = 1;
        this.timeLeft = GameConfig.game.roundTime;
        this.isRoundActive = true;
        this.gameOver = false;
        
        // Bind event handlers
        this.onHit = this.onHit.bind(this);
        
        // Subscribe to events
        if (typeof EventBus !== 'undefined') {
            EventBus.subscribe('fighter:hit', this.onHit);
        }
    }
    
    FightScene.prototype.onEnter = function(params) {
        console.log('FightScene entered');
        this.resetRound();
        this.uiManager.updateHealthBars(this.fighter1.health, this.fighter1.maxHealth, this.fighter2.health, this.fighter2.maxHealth);
        this.uiManager.updateTimer(this.timeLeft);
        this.uiManager.updateRound(this.round);
    };
    
    FightScene.prototype.onExit = function() {
        if (typeof EventBus !== 'undefined') {
            EventBus.unsubscribe('fighter:hit', this.onHit);
        }
    };
    
    FightScene.prototype.resetRound = function() {
        this.fighter1.health = this.fighter1.maxHealth;
        this.fighter2.health = this.fighter2.maxHealth;
        this.fighter1.x = 250;
        this.fighter2.x = GameConfig.canvas.width - 250;
        this.fighter1.state = 'idle';
        this.fighter2.state = 'idle';
        this.fighter1.isInvincible = false;
        this.fighter2.isInvincible = false;
        this.timeLeft = GameConfig.game.roundTime;
        this.isRoundActive = true;
        
        if (typeof CombatManager !== 'undefined') {
            CombatManager.clearAttacks();
        }
    };
    
    FightScene.prototype.update = function(deltaTime) {
        if (this.gameOver) return;
        
        // Update timer
        this.timeLeft -= deltaTime;
        if (this.timeLeft <= 0) {
            this.timeLeft = 0;
            this.endRound('time');
        }
        
        // Get input states
        var input1 = InputManager.getInputState(ControlsConfig.player1);
        var input2 = InputManager.getInputState(ControlsConfig.player2);
        
        // Update fighters
        this.fighter1.update(deltaTime, input1, this.fighter2);
        this.fighter2.update(deltaTime, input2, this.fighter1);
        
        // Update combat
        if (typeof CombatManager !== 'undefined') {
            CombatManager.update(deltaTime, this.fighter1, this.fighter2);
        }
        
        // Update UI
        this.uiManager.updateHealthBars(this.fighter1.health, this.fighter1.maxHealth, this.fighter2.health, this.fighter2.maxHealth);
        this.uiManager.updateTimer(Math.ceil(this.timeLeft));
        
        // Check for round end
        if (this.fighter1.health <= 0) {
            this.endRound('fighter2');
        } else if (this.fighter2.health <= 0) {
            this.endRound('fighter1');
        }
    };
    
    FightScene.prototype.endRound = function(winner) {
        if (!this.isRoundActive) return;
        
        this.isRoundActive = false;
        
        if (winner === 'fighter1') {
            this.uiManager.showMessage(this.fighter1.config.name + ' WINS!');
        } else if (winner === 'fighter2') {
            this.uiManager.showMessage(this.fighter2.config.name + ' WINS!');
        } else if (winner === 'time') {
            if (this.fighter1.health > this.fighter2.health) {
                this.uiManager.showMessage(this.fighter1.config.name + ' WINS BY DECISION!');
            } else if (this.fighter2.health > this.fighter1.health) {
                this.uiManager.showMessage(this.fighter2.config.name + ' WINS BY DECISION!');
            } else {
                this.uiManager.showMessage('DRAW!');
            }
        }
        
        var self = this;
        setTimeout(function() {
            if (self.round < GameConfig.game.rounds) {
                self.round++;
                self.resetRound();
                self.uiManager.updateRound(self.round);
                self.uiManager.showMessage('ROUND ' + self.round);
            } else {
                self.gameOver = true;
                setTimeout(function() {
                    location.reload();
                }, 3000);
            }
        }, 2000);
    };
    
    FightScene.prototype.onHit = function(data) {
        this.uiManager.showDamage(data.damage, data.target);
        this.uiManager.updateHealthBars(this.fighter1.health, this.fighter1.maxHealth, this.fighter2.health, this.fighter2.maxHealth);
        
        if (data.attacker.comboCounter > 1) {
            this.uiManager.showCombo(data.attacker.comboCounter + ' HIT COMBO!');
        }
    };
    
    FightScene.prototype.render = function(ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, GameConfig.canvas.width, GameConfig.canvas.height);
        
        // Draw background (Octagon)
        this.renderBackground(ctx);
        
        // Draw fighters
        this.fighter1.render(ctx);
        this.fighter2.render(ctx);
    };
    
    FightScene.prototype.renderBackground = function(ctx) {
        // Gradient background
        var gradient = ctx.createLinearGradient(0, 0, 0, GameConfig.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, GameConfig.canvas.width, GameConfig.canvas.height);
        
        // Draw octagon cage
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 5;
        
        // Outer octagon
        var padding = 40;
        var w = GameConfig.canvas.width - padding * 2;
        var h = GameConfig.canvas.height - padding * 2;
        var x = padding;
        var y = padding;
        
        ctx.beginPath();
        ctx.moveTo(x + w/4, y);
        ctx.lineTo(x + 3*w/4, y);
        ctx.lineTo(x + w, y + h/4);
        ctx.lineTo(x + w, y + 3*h/4);
        ctx.lineTo(x + 3*w/4, y + h);
        ctx.lineTo(x + w/4, y + h);
        ctx.lineTo(x, y + 3*h/4);
        ctx.lineTo(x, y + h/4);
        ctx.closePath();
        ctx.stroke();
        
        // Inner octagon
        var innerPadding = 20;
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + w/4 + innerPadding, y + innerPadding);
        ctx.lineTo(x + 3*w/4 - innerPadding, y + innerPadding);
        ctx.lineTo(x + w - innerPadding, y + h/4 + innerPadding);
        ctx.lineTo(x + w - innerPadding, y + 3*h/4 - innerPadding);
        ctx.lineTo(x + 3*w/4 - innerPadding, y + h - innerPadding);
        ctx.lineTo(x + w/4 + innerPadding, y + h - innerPadding);
        ctx.lineTo(x + innerPadding, y + 3*h/4 - innerPadding);
        ctx.lineTo(x + innerPadding, y + h/4 + innerPadding);
        ctx.closePath();
        ctx.stroke();
        
        // Center line
        ctx.beginPath();
        ctx.moveTo(GameConfig.canvas.width / 2, padding);
        ctx.lineTo(GameConfig.canvas.width / 2, GameConfig.canvas.height - padding);
        ctx.stroke();
        
        // Center circle
        ctx.beginPath();
        ctx.arc(GameConfig.canvas.width / 2, GameConfig.canvas.height / 2, 80, 0, Math.PI * 2);
        ctx.stroke();
        
        // UFC logo text
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 30px Impact';
        ctx.shadowBlur = 0;
        ctx.textAlign = 'center';
        ctx.fillText('UFC', GameConfig.canvas.width / 2, 60);
    };
    
    return FightScene;
})();