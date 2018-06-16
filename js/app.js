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
    const tickSpan = dt * this.moveSpanX;
    // If x larger than the canvas' width, set x to 0.
    (this.x + tickSpan) > 505
    ? this.x = 0
    : this.x += tickSpan;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // Check collision
    checkCollision(this);
};

// Gem class
class Gem extends Enemy {
    constructor(x, y, moveSpanX, gemlink='images/Star.png'){
        super(x, y, moveSpanX);
        this.sprite = gemlink;
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
        direction === 'left' && (this.x - this.moveSpanX) >= 0
        ? this.x -= this.moveSpanX
        : direction === 'right' && (this.x + this.moveSpanX) <= 101*4
            ? this.x += this.moveSpanX
            : direction === 'up' && (this.y - this.moveSpanY) >= -20
                ? this.y -= this.moveSpanY
                : direction === 'down' && (this.y + this.moveSpanY) <= 390
                    ? this.y += this.moveSpanY
                    : console.log('unkown direction or boundary limit');
    
    // console.log(`Player, x:${player.x}, y${player.y}`);
    // console.log(`Enemy, x:${allEnemies[1].x}, y:${allEnemies[1].y}`);
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(0, 62, 50), new Enemy(50, 145, 100), new Enemy(500, 230, 70), new Gem(0, 62, 30), new Gem(50, 145, 10), new Gem(500, 230, 20)];
var gems = [];
var player = new Player(101*2, 390);
var score = 0;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function checkCollision(enemy){
    const diffX = Math.abs(enemy.x - player.x);
    const diffY = Math.abs(enemy.y - player.y);
    if(diffX <= 50 && diffY <= 10){
        enemy.sprite.indexOf('bug') === -1
        ? (score += 10, this.x = -9999999)
        : gameEnd = true;
    }
}

var resetObjects = function(){
    allEnemies = [new Enemy(0, 62, 50), new Enemy(50, 145, 100), new Enemy(500, 230, 70)];
    player = new Player(101*2, 390);
}