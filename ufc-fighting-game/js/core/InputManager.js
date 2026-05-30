// Input Manager for handling keyboard input
var InputManager = (function() {
    var keys = {};
    var keyStates = {};
    var lastProcessedTime = {};
    
    function init() {
        window.addEventListener('keydown', function(e) {
            var code = e.code;
            if (!keys[code]) {
                keys[code] = true;
                keyStates[code] = 'pressed';
                lastProcessedTime[code] = performance.now();
            }
            
            // Prevent default for game keys
            var gameKeys = ['KeyA', 'KeyD', 'KeyJ', 'KeyK', 'KeyL', 'ArrowLeft', 'ArrowRight', 'Digit1', 'Digit2', 'Digit3'];
            if (gameKeys.indexOf(code) !== -1) {
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', function(e) {
            var code = e.code;
            keys[code] = false;
            keyStates[code] = 'released';
        });
        
        window.addEventListener('blur', function() {
            keys = {};
            keyStates = {};
        });
    }
    
    function isKeyDown(code) {
        return keys[code] === true;
    }
    
    function isKeyPressed(code) {
        var state = keyStates[code];
        if (state === 'pressed') {
            keyStates[code] = 'down';
            return true;
        }
        return false;
    }
    
    function isKeyReleased(code) {
        var state = keyStates[code];
        if (state === 'released') {
            keyStates[code] = 'up';
            return true;
        }
        return false;
    }
    
    function getInputState(playerControls) {
        var state = {
            moveLeft: false,
            moveRight: false,
            punch: false,
            kick: false,
            block: false
        };
        
        if (playerControls) {
            state.moveLeft = isKeyDown(playerControls.moveLeft);
            state.moveRight = isKeyDown(playerControls.moveRight);
            state.punch = isKeyPressed(playerControls.punch);
            state.kick = isKeyPressed(playerControls.kick);
            state.block = isKeyDown(playerControls.block);
        }
        
        return state;
    }
    
    function resetKeyState(code) {
        keyStates[code] = 'up';
    }
    
    init();
    
    return {
        isKeyDown: isKeyDown,
        isKeyPressed: isKeyPressed,
        isKeyReleased: isKeyReleased,
        getInputState: getInputState,
        resetKeyState: resetKeyState
    };
})();