// Fighter Configuration
var FighterConfig = {
    fighter1: {
        name: "Dragon",
        maxHealth: 100,
        speed: 5,
        moves: {
            punch: { damage: 8, range: 40, speed: 8, cooldown: 20, hitbox: { width: 30, height: 20, offsetX: 40, offsetY: -20 } },
            kick: { damage: 12, range: 60, speed: 12, cooldown: 30, hitbox: { width: 40, height: 30, offsetX: 50, offsetY: -10 } },
            block: { reduction: 0.7, duration: 25, cooldown: 10 }
        },
        animations: {
            idle: { frames: 1, frameTime: 100, loop: true },
            walk: { frames: 4, frameTime: 100, loop: true },
            punch: { frames: 3, frameTime: 50, loop: false },
            kick: { frames: 4, frameTime: 50, loop: false },
            hit: { frames: 2, frameTime: 80, loop: false },
            block: { frames: 2, frameTime: 100, loop: true },
            knockdown: { frames: 3, frameTime: 100, loop: false }
        },
        scale: 1.5,
        offsetY: 0
    },
    
    fighter2: {
        name: "Tiger",
        maxHealth: 100,
        speed: 5,
        moves: {
            punch: { damage: 8, range: 40, speed: 8, cooldown: 20, hitbox: { width: 30, height: 20, offsetX: 40, offsetY: -20 } },
            kick: { damage: 12, range: 60, speed: 12, cooldown: 30, hitbox: { width: 40, height: 30, offsetX: 50, offsetY: -10 } },
            block: { reduction: 0.7, duration: 25, cooldown: 10 }
        },
        animations: {
            idle: { frames: 1, frameTime: 100, loop: true },
            walk: { frames: 4, frameTime: 100, loop: true },
            punch: { frames: 3, frameTime: 50, loop: false },
            kick: { frames: 4, frameTime: 50, loop: false },
            hit: { frames: 2, frameTime: 80, loop: false },
            block: { frames: 2, frameTime: 100, loop: true },
            knockdown: { frames: 3, frameTime: 100, loop: false }
        },
        scale: 1.5,
        offsetY: 0
    }
};