// Asset Manager for loading and managing game assets
var AssetManager = (function() {
    var assets = {};
    var loadedCount = 0;
    var totalAssets = 0;
    
    function loadImage(key, src) {
        return new Promise(function(resolve, reject) {
            var img = new Image();
            img.onload = function() {
                assets[key] = img;
                loadedCount++;
                resolve(img);
            };
            img.onerror = function() {
                reject(new Error('Failed to load image: ' + src));
            };
            img.src = src;
        });
    }
    
    function loadImages(images) {
        totalAssets = Object.keys(images).length;
        var promises = [];
        
        for (var key in images) {
            promises.push(loadImage(key, images[key]));
        }
        
        return Promise.all(promises);
    }
    
    function getAsset(key) {
        return assets[key];
    }
    
    function getProgress() {
        return totalAssets === 0 ? 1 : loadedCount / totalAssets;
    }
    
    function createPlaceholderFighter(color, width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        
        // Draw placeholder fighter
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        
        // Draw head
        ctx.fillStyle = '#ffcc99';
        ctx.fillRect(width/4, height/4, width/2, height/3);
        
        // Draw body
        ctx.fillStyle = color;
        ctx.fillRect(width/3, height/2, width/3, height/3);
        
        var img = new Image();
        img.src = canvas.toDataURL();
        assets['fighter_' + color] = img;
        
        return img;
    }
    
    return {
        loadImage: loadImage,
        loadImages: loadImages,
        getAsset: getAsset,
        getProgress: getProgress,
        createPlaceholderFighter: createPlaceholderFighter
    };
})();