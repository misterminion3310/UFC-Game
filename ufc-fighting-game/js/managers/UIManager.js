// UI Manager for handling user interface
var UIManager = (function() {
    function UIManager() {
        this.healthBar1 = document.getElementById('player1-health');
        this.healthBar2 = document.getElementById('player2-health');
        this.timerElement = document.getElementById('timer');
        this.roundElement = document.getElementById('round-display');
        this.messageElement = document.getElementById('game-message');
        this.comboElement = document.getElementById('combo-display');
        
        this.messageTimeout = null;
        this.comboTimeout = null;
    }
    
    UIManager.prototype.updateHealthBars = function(health1, maxHealth1, health2, maxHealth2) {
        if (this.healthBar1) {
            var percent1 = (health1 / maxHealth1) * 100;
            this.healthBar1.style.width = percent1 + '%';
        }
        
        if (this.healthBar2) {
            var percent2 = (health2 / maxHealth2) * 100;
            this.healthBar2.style.width = percent2 + '%';
        }
    };
    
    UIManager.prototype.updateTimer = function(seconds) {
        if (this.timerElement) {
            this.timerElement.textContent = Math.floor(seconds);
        }
    };
    
    UIManager.prototype.updateRound = function(round) {
        if (this.roundElement) {
            this.roundElement.textContent = 'ROUND ' + round;
        }
    };
    
    UIManager.prototype.showMessage = function(message) {
        if (this.messageElement) {
            this.messageElement.textContent = message;
            this.messageElement.style.display = 'block';
            
            if (this.messageTimeout) {
                clearTimeout(this.messageTimeout);
            }
            
            this.messageTimeout = setTimeout(function() {
                if (this.messageElement) {
                    this.messageElement.style.display = 'none';
                }
            }.bind(this), GameConfig.ui.messageDuration);
        }
    };
    
    UIManager.prototype.showDamage = function(damage, fighter) {
        // Create floating damage number
        var damageDiv = document.createElement('div');
        damageDiv.className = 'damage-number';
        damageDiv.textContent = Math.floor(damage);
        damageDiv.style.position = 'absolute';
        damageDiv.style.left = fighter.x + 'px';
        damageDiv.style.top = fighter.y - 100 + 'px';
        damageDiv.style.color = '#ff4444';
        damageDiv.style.fontSize = '24px';
        damageDiv.style.fontWeight = 'bold';
        damageDiv.style.fontFamily = 'Impact';
        damageDiv.style.textShadow = '2px 2px 0 black';
        damageDiv.style.pointerEvents = 'none';
        damageDiv.style.zIndex = '100';
        damageDiv.style.animation = 'floatUp 0.5s ease-out forwards';
        
        document.body.appendChild(damageDiv);
        
        setTimeout(function() {
            if (damageDiv && damageDiv.parentNode) {
                damageDiv.parentNode.removeChild(damageDiv);
            }
        }, 500);
    };
    
    UIManager.prototype.showCombo = function(comboText) {
        if (this.comboElement) {
            this.comboElement.textContent = comboText;
            this.comboElement.style.display = 'block';
            this.comboElement.style.animation = 'none';
            this.comboElement.offsetHeight; // Trigger reflow
            this.comboElement.style.animation = 'comboPop 0.3s ease-out';
            
            if (this.comboTimeout) {
                clearTimeout(this.comboTimeout);
            }
            
            this.comboTimeout = setTimeout(function() {
                if (this.comboElement) {
                    this.comboElement.style.display = 'none';
                }
            }.bind(this), 1000);
        }
    };
    
    UIManager.prototype.hideCombo = function() {
        if (this.comboElement) {
            this.comboElement.style.display = 'none';
        }
    };
    
    return UIManager;
})();

// Add CSS animations
var style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px);
        }
    }
    
    @keyframes comboPop {
        0% {
            transform: scale(0.5);
            opacity: 0;
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .damage-number {
        position: absolute;
        pointer-events: none;
        z-index: 1000;
    }
`;
document.head.appendChild(style);