// Game Configuration
var GameConfig = {
    canvas: {
        width: 1200,
        height: 600
    },
    
    game: {
        rounds: 3,
        roundTime: 99,
        postRoundDelay: 3000,
        gameOverDelay: 2000
    },
    
    physics: {
        gravity: 0,
        friction: 0.92,
        maxSpeed: 8,
        pushForce: 15
    },
    
    combat: {
        hitStunDuration: 12,
        blockStunDuration: 8,
        invincibilityFrames: 20,
        comboWindow: 45,
        superMeterGain: 10
    },
    
    ui: {
        healthBarWidth: 500,
        messageDuration: 2000
    }
};