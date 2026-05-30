// Hitbox class for collision detection
var Hitbox = (function() {
    function Hitbox(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type || 'hit'; // hit, hurt, block
        this.active = true;
        this.damage = 0;
        this.stun = 0;
    }
    
    Hitbox.prototype.update = function(x, y) {
        this.x = x;
        this.y = y;
    };
    
    Hitbox.prototype.getRect = function() {
        return {
            x: this.x,
            y: this.y,
            w: this.width,
            h: this.height
        };
    };
    
    Hitbox.prototype.checkCollision = function(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    };
    
    Hitbox.prototype.deactivate = function() {
        this.active = false;
    };
    
    Hitbox.prototype.activate = function() {
        this.active = true;
    };
    
    return Hitbox;
})();