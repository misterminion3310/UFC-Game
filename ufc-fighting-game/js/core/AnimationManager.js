// Animation Manager for handling sprite animations
var AnimationManager = (function() {
    var animations = {};
    var currentAnimations = {};
    
    function createAnimation(config) {
        var key = config.key;
        animations[key] = {
            frames: config.frames,
            frameTime: config.frameTime,
            loop: config.loop || false,
            frameWidth: config.frameWidth,
            frameHeight: config.frameHeight,
            spriteSheet: config.spriteSheet
        };
    }
    
    function playAnimation(entityKey, animName, callback) {
        var anim = animations[animName];
        if (!anim) {
            console.warn('Animation not found:', animName);
            return false;
        }
        
        currentAnimations[entityKey] = {
            name: animName,
            animation: anim,
            currentFrame: 0,
            frameTimer: 0,
            callback: callback,
            playing: true
        };
        
        return true;
    }
    
    function update(deltaTime) {
        for (var key in currentAnimations) {
            var animState = currentAnimations[key];
            if (!animState.playing) continue;
            
            animState.frameTimer += deltaTime;
            
            if (animState.frameTimer >= animState.animation.frameTime) {
                animState.frameTimer = 0;
                animState.currentFrame++;
                
                if (animState.currentFrame >= animState.animation.frames) {
                    if (animState.animation.loop) {
                        animState.currentFrame = 0;
                    } else {
                        animState.playing = false;
                        if (animState.callback) {
                            animState.callback();
                        }
                    }
                }
            }
        }
    }
    
    function getCurrentFrame(entityKey) {
        var animState = currentAnimations[entityKey];
        if (!animState || !animState.playing) {
            return 0;
        }
        return animState.currentFrame;
    }
    
    function getAnimation(entityKey) {
        var animState = currentAnimations[entityKey];
        return animState ? animState.animation : null;
    }
    
    function isPlaying(entityKey) {
        var animState = currentAnimations[entityKey];
        return animState ? animState.playing : false;
    }
    
    function stopAnimation(entityKey) {
        if (currentAnimations[entityKey]) {
            currentAnimations[entityKey].playing = false;
        }
    }
    
    function createPlaceholderAnimations() {
        // Create placeholder animations for fighters
        var fighter1Idle = {
            key: 'fighter1_idle',
            frames: 1,
            frameTime: 100,
            loop: true,
            frameWidth: 80,
            frameHeight: 100
        };
        
        var fighter2Idle = {
            key: 'fighter2_idle',
            frames: 1,
            frameTime: 100,
            loop: true,
            frameWidth: 80,
            frameHeight: 100
        };
        
        createAnimation(fighter1Idle);
        createAnimation(fighter2Idle);
    }
    
    createPlaceholderAnimations();
    
    return {
        createAnimation: createAnimation,
        playAnimation: playAnimation,
        update: update,
        getCurrentFrame: getCurrentFrame,
        getAnimation: getAnimation,
        isPlaying: isPlaying,
        stopAnimation: stopAnimation
    };
})();