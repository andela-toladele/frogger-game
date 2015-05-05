// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  this.x ,
  this.y,
  this.pos,
  this.speed = 100,

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

  if(this.x > 505)
    this.generate();
    
  this.x += this.speed * dt;

}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Generate enemy object coordinate
Enemy.prototype.generate = function() {
  
  this.x = -400 + ((Math.floor(Math.random() * 4) * 100));
  if(this.pos > 2){
    this.y = ((1 + Math.floor(Math.random() * 4)) * 83) - 15;        
  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player(){

  this.x = 202,
  this.y = 400,
  collides = false,
  this.sprite = 'images/char-boy.png';
  
}

Player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function(){

}

Player.prototype.handleInput = function(key){

  switch(key){

    case 'left':
      if(this.x != 0)
        this.x -= 101;
      break;
    case 'right':
      if(this.x != 404)
         this.x += 101;
      break;
    case 'up':
      if(this.y != 68)
         this.y -= 83;
      else{
        this.y = 400;
        if(!this.collides){

          this.update();
          target.update();

        }                    
      }
      break;
    case 'down':
      if(this.y != 400)
         this.y += 83;            
      break;
  }

}

function Target(){

  this.x = 0,
  this.y = -15,
  this.sprite = 'images/Rock.png';
  
}

Target.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Target.prototype.update = function(){
  this.x = (Math.floor(Math.random() * 5) * 101);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i<5; i++){
  var enemy = new Enemy();
  enemy.pos = i;
  enemy.y = ((i + 1) * 83) - 15;
  enemy.generate();
  allEnemies.push(enemy);
}

var player = new Player();

var target = new Target();
   
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
