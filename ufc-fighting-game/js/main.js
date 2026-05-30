// Main game entry point
var GameInstance = null;
var fighter1Image = null;
var fighter2Image = null;

window.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');
    
    // Setup file uploads
    var p1Upload = document.getElementById('p1-upload');
    var p2Upload = document.getElementById('p2-upload');
    
    if (p1Upload) {
        p1Upload.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(ev) {
                    fighter1Image = ev.target.result;
                    var img = document.getElementById('p1-image');
                    if (img) img.src = fighter1Image;
                    var nameElem = document.getElementById('p1-name');
                    if (nameElem) nameElem.textContent = file.name.split('.')[0];
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (p2Upload) {
        p2Upload.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(ev) {
                    fighter2Image = ev.target.result;
                    var img = document.getElementById('p2-image');
                    if (img) img.src = fighter2Image;
                    var nameElem = document.getElementById('p2-name');
                    if (nameElem) nameElem.textContent = file.name.split('.')[0];
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Start button
    var startBtn = document.getElementById('start-fight-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            startGame();
        });
    }
    
    // Reset button
    var resetBtn = document.getElementById('reset-fighters-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            fighter1Image = null;
            fighter2Image = null;
            var p1Img = document.getElementById('p1-image');
            var p2Img = document.getElementById('p2-image');
            var p1Name = document.getElementById('p1-name');
            var p2Name = document.getElementById('p2-name');
            if (p1Img) p1Img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23e74c3c'/%3E%3Ccircle cx='100' cy='90' r='40' fill='%23f39c12'/%3E%3Ctext x='100' y='185' text-anchor='middle' fill='white' font-size='16'%3ESELECT%3C/text%3E%3C/svg%3E";
            if (p2Img) p2Img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%233498db'/%3E%3Ccircle cx='100' cy='90' r='40' fill='%23f1c40f'/%3E%3Ctext x='100' y='185' text-anchor='middle' fill='white' font-size='16'%3ESELECT%3C/text%3E%3C/svg%3E";
            if (p1Name) p1Name.textContent = 'SELECT FIGHTER';
            if (p2Name) p2Name.textContent = 'SELECT FIGHTER';
            if (p1Upload) p1Upload.value = '';
            if (p2Upload) p2Upload.value = '';
        });
    }
});

function startGame() {
    console.log('Starting game...');
    
    // Hide selection screen
    var selectionScreen = document.getElementById('selection-screen');
    var uiOverlay = document.getElementById('ui-overlay');
    
    if (selectionScreen) selectionScreen.style.display = 'none';
    if (uiOverlay) uiOverlay.style.display = 'block';
    
    // Get fighter names
    var p1NameElem = document.getElementById('p1-name');
    var p2NameElem = document.getElementById('p2-name');
    var p1Name = p1NameElem ? p1NameElem.textContent : 'DRAGON';
    var p2Name = p2NameElem ? p2NameElem.textContent : 'TIGER';
    
    // Fighter configs
    var fighter1Config = {
        name: p1Name,
        maxHealth: 100,
        speed: 5
    };
    
    var fighter2Config = {
        name: p2Name,
        maxHealth: 100,
        speed: 5
    };
    
    // Create and start game
    GameInstance = new Game(fighter1Config, fighter2Config, fighter1Image, fighter2Image);
    GameInstance.start();
}