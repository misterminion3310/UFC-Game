// Scene Manager for handling game scenes
var SceneManager = (function() {
    var scenes = {};
    var currentScene = null;
    var nextScene = null;
    
    function registerScene(name, scene) {
        scenes[name] = scene;
    }
    
    function switchToScene(name, params) {
        if (scenes[name]) {
            nextScene = {
                name: name,
                scene: scenes[name],
                params: params
            };
        } else {
            console.error('Scene not found:', name);
        }
    }
    
    function update(deltaTime) {
        if (nextScene) {
            if (currentScene && currentScene.onExit) {
                currentScene.onExit();
            }
            
            currentScene = nextScene.scene;
            if (currentScene && currentScene.onEnter) {
                currentScene.onEnter(nextScene.params);
            }
            nextScene = null;
        }
        
        if (currentScene && currentScene.update) {
            currentScene.update(deltaTime);
        }
    }
    
    function render(ctx) {
        if (currentScene && currentScene.render) {
            currentScene.render(ctx);
        }
    }
    
    function getCurrentScene() {
        return currentScene;
    }
    
    return {
        registerScene: registerScene,
        switchToScene: switchToScene,
        update: update,
        render: render,
        getCurrentScene: getCurrentScene
    };
})();