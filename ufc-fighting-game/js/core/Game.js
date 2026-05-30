// Main Game class
var Game = (function() {
    function Game(fighter1Config, fighter2Config, fighter1Image, fighter2Image) {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.lastTimestamp = 0;
        this.isRunning = false;
        
        // Set canvas size
        this.canvas.width = 1200;
        this.canvas.height = 600;
        
        console.log('Game created, canvas size:', this.canvas.width, this.canvas.height);
        
        // Create fighters
        this.fighter1 = new Fighter(fighter1Config, 'left', ControlsConfig.player1, fighter1Image);
        this.fighter2 = new Fighter(fighter2Config, 'right', ControlsConfig.player2, fighter2Image);
        
        // Create UI manager
        this.uiManager = new UIManager();
        
        // Set fighter names in UI
        var p1NameElem = document.getElementById('player1-name-display');
        var p2NameElem = document.getElementById('player2-name-display');
        if (p1NameElem) p1NameElem.textContent = fighter1Config.name.toUpperCase();
        if (p2NameElem) p2NameElem.textContent = fighter2Config.name.toUpperCase();
        
        this.timeLeft = 99;
        this.round = 1;
        this.gameOver = false;
        
        // Update UI
        this.uiManager.updateHealthBars(100, 100, 100, 100);
        this.uiManager.updateTimer(99);
        this.uiManager.updateRound(1);
        
        // Bind hit event
        this.onHit = this.onHit.bind(this);
        if (typeof EventBus !== 'undefined') {
            EventBus.subscribe('fighter:hit', this.onHit);
        }
    }
    
    Game.prototype.onHit = function(data) {
        this.uiManager.showDamage(data.damage, data.fighter);
        this.uiManager.updateHealthBars(
            this.fighter1.health, this.fighter1.maxHealth,
            this.fighter2.health, this.fighter2.maxHealth
        );
        
        if (data.attacker.comboCounter > 1) {
            this.uiManager.showCombo(data.attacker.comboCounter + ' HIT COMBO!');
        }
        
        // Check for KO
        if (this.fighter1.health <= 0) {
            this.endGame(this.fighter2);
        } else if (this.fighter2.health <= 0) {
            this.endGame(this.fighter1);
        }
    };
    
    Game.prototype.endGame = function(winner) {
        if (this.gameOver) return;
        this.gameOver = true;
        this.uiManager.showMessage(winner.config.name + ' WINS BY KNOCKOUT!');
        setTimeout(function() {
            location.reload();
        }, 3000);
    };
    
    Game.prototype.start = function() {
        console.log('Game starting...');
        this.isRunning = true;
        this.lastTimestamp = performance.now();
        this.gameLoop();
    };
    
    Game.prototype.gameLoop = function() {
        if (!this.isRunning) return;
        
        var now = performance.now();
        var deltaTime = Math.min(0.033, (now - this.lastTimestamp) / 1000);
        this.lastTimestamp = now;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame(this.gameLoop.bind(this));
    };
    
    Game.prototype.update = function(deltaTime) {
        if (this.gameOver) return;
        
        // Update timer
        this.timeLeft -= deltaTime;
        if (this.timeLeft <= 0) {
            this.timeLeft = 0;
            this.uiManager.updateTimer(0);
            this.endGame(this.fighter1.health > this.fighter2.health ? this.fighter1 : this.fighter2);
            return;
        }
        this.uiManager.updateTimer(Math.ceil(this.timeLeft));
        
        // Get input
        var input1 = InputManager.getInputState(ControlsConfig.player1);
        var input2 = InputManager.getInputState(ControlsConfig.player2);
        
        // Update fighters
        this.fighter1.update(deltaTime, input1, this.fighter2);
        this.fighter2.update(deltaTime, input2, this.fighter1);
        
        // Update combat
        if (typeof CombatManager !== 'undefined') {
            CombatManager.update(deltaTime, this.fighter1, this.fighter2);
        }
        
        // Update UI health
        this.uiManager.updateHealthBars(
            this.fighter1.health, this.fighter1.maxHealth,
            this.fighter2.health, this.fighter2.maxHealth
        );
    };
    
    Game.prototype.render = function() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.renderBackground();
        
        // Draw fighters
        this.fighter1.render(this.ctx);
        this.fighter2.render(this.ctx);
    };
    
    Game.prototype.renderBackground = function() {
        // Gradient background
        var gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Octagon cage
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 4;
        
        var padding = 40;
        var w = this.canvas.width - padding * 2;
        var h = this.canvas.height - padding * 2;
        
        // Octagon points
        var points = [
            {x: padding + w/4, y: padding},
            {x: padding + 3*w/4, y: padding},
            {x: padding + w, y: padding + h/4},
            {x: padding + w, y: padding + 3*h/4},
            {x: padding + 3*w/4, y: padding + h},
            {x: padding + w/4, y: padding + h},
            {x: padding, y: padding + 3*h/4},
            {x: padding, y: padding + h/4}
        ];
        
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        
        // Center line
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, padding);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height - padding);
        this.ctx.stroke();
        
        // Center circle
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 80, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Title
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = 'bold 28px Impact';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('UFC FIGHT NIGHT', this.canvas.width / 2, 50);
    };
    
    return Game;
})();