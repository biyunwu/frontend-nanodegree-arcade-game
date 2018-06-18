// Enemies our player must avoid
var Enemy = function(x, y, moveSpanX) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.moveSpanX = moveSpanX;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (!gameStatus.gamePaused) {
        const tickSpan = dt * this.moveSpanX;
        // If x larger than the canvas' width, set x to 0.
        (this.x + tickSpan) > 505
        ? this.x = 0
        : this.x += tickSpan;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // Check collision
    checkCollision(this);
};

// Gem class: set a random sprite link when a Gem obj is created.
class Gem extends Enemy {
    constructor(x, y, moveSpanX, gemLink='images/Star.png'){
        super(x, y, moveSpanX);
        this.sprite = gemLink;
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(x, y, moveSpanX=101, moveSpanY=82, sprite='images/char-princess-girl.png'){
        this.x = x;
        this.y = y;
        // The unit of horizontal movement.
        this.moveSpanX = moveSpanX;
        // The unit of vertical movement.
        this.moveSpanY = moveSpanY;
        // Default player
        this.sprite = sprite;
    }

    update(){
        // To be finished if necessary
    }

    render(){
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(direction){
        if(direction === 'space'){
            handleSpaceKey();
        } else if (!gameStatus.gamePaused){
            direction === 'left' && (this.x - this.moveSpanX) >= 0
            ? this.x -= this.moveSpanX
            : direction === 'right' && (this.x + this.moveSpanX) <= 101*4
                ? this.x += this.moveSpanX
                : direction === 'up' && (this.y - this.moveSpanY) >= -20
                    ? this.y -= this.moveSpanY
                    : direction === 'down' && (this.y + this.moveSpanY) <= 390
                        ? this.y += this.moveSpanY
                        : console.log('unkown direction or boundary limit');

            if(this.y < 0){gameSuccess()}
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const gemLinks = [
    'images/Gem Blue.png',
    'images/Gem Green.png',
    'images/Gem Orange.png',
    'images/Heart.png',
    'images/Key.png',
    'images/Star.png'
];

// Create obj lists.
var allEnemies = getEnemyList();
var allGems = getGemList();
var player = new Player(101*2, 390);
// Get DOM elements for update game statistics.
const minutesLabel = document.getElementById('minutes');
const secondsLabel = document.getElementById('seconds');
const scoreLable = document.getElementById('score');
// Obj which stores the game status.
var gameStatus = {
    seconds: 0,
    score: 0,
    gameEnd: false,
    gamePaused: true,
    increaseScore: function(){this.score += 10, scoreLable.innerHTML = this.score},
    checkStatus: function(){return !this.gameEnd && !this.gamePaused}
};

//Timer
setInterval(setTime, 1000);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Prevent defalut scolling action in browsers when space bar is clicked.
window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    } else if (e.keyCode == 13){
        window.location.reload();
    }
});

function getEnemyList(){
    return [
        new Enemy(randomX(), 62, randomSpeed()),
        new Enemy(randomX(), 145, randomSpeed()),
        new Enemy(randomX(), 230, randomSpeed())
    ];
}

function getGemList(){
    return [
        new Gem(randomX(), 62, randomSpeed(), randomGemLink()),
        new Gem(randomX(), 145, randomSpeed(), randomGemLink()),
        new Gem(randomX(), 230, randomSpeed(), randomGemLink())
    ];
}

function checkCollision(obj){
    const diffX = Math.abs(obj.x - player.x);
    const diffY = Math.abs(obj.y - player.y);
    if(diffX <= 50 && diffY <= 10){
        obj.sprite.indexOf('bug') === -1 ? collectGem(obj) : gameFail();
    }
}

function collectGem(gem){
    gameStatus.increaseScore();
    // Remove the gem from the allEnemies list.
    allGems.splice(allGems.indexOf(gem), 1);
    // Add a new gem.
    allGems.push(new Gem(randomX(), gem.y, randomSpeed(), randomGemLink()));
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function randomX(min=0, max=500){
    return getRandomInt(min, max);
}

function randomSpeed(min=20, max=200){
    return getRandomInt(min, max);
}

function randomGemLink(){
    return gemLinks[getRandomInt(0, gemLinks.length-1)]
}

function handleSpaceKey(){
    gameStatus.gamePaused === false
    ? gameStatus.gamePaused = true
    : gameStatus.gamePaused = false;
}

// Timer function modified based on https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
function setTime() {
    if(gameStatus.checkStatus()){
        ++gameStatus.seconds;
        secondsLabel.innerHTML = pad(gameStatus.seconds % 60);
        minutesLabel.innerHTML = pad(parseInt(gameStatus.seconds / 60));
    }
}

// Helper method for setTime()
function pad(val) {
    const valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function gameFail(){
    gameStatus.gameEnd = true;
    setTimeout(function(){ctx.drawImage(Resources.get('images/game-over.gif'), 0, 150)}, 300);
}

function gameSuccess(){
    gameStatus.gameEnd = true;
    setTimeout(function(){ctx.drawImage(Resources.get('images/you-won.png'), 65, 120)}, 300);
}