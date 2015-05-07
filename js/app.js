const COLLIDES = -1,
      HITS_TARGET = 1,
      HITS_TOP = 2,
      NO_HIT = 0;
var gameData = document.getElementById("gameData"),
    about = document.getElementById("about"),

    // Initialise the collision sound
    collision = document.getElementById("collide"),
    siren = document.getElementById("siren"),
    crash = document.getElementById("crash");


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
  this.score,
  this.level,
  this.life,
  this.hit,
  this.hits,
  this.startLifeTimer = true,
  this.start = false,
  this.gameOver = false,
  this.sprite = 'images/char-boy.png';
}

Player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function(){
  if(!this.start) return;
  if (this.hit > NO_HIT){
    this.hits += 1;
  }else if (this.hit == COLLIDES){
    if(crash) {
        crash.currentTime = 0;
        crash.play();
    }
    this.life += -1;
    if(this.life == 0){
      this.gameOver = true;
      this.start = false;
      return;
    }
    
  }

  if(this.hit == HITS_TARGET){
    if(collision) {
        collision.currentTime = 0;
        collision.play();
    }
  }

  if(this.hit != HITS_TOP) 
    this.score += this.hit * this.level;
  if(this.score < 0)
    this.score = 0;
  if(this.hits % 5 == 0 && this.hit > NO_HIT){
    this.level += 1;
    allEnemies.forEach(function(enemy) {
      enemy.speed += 30;
    });    
  }
  if(this.hit != NO_HIT){
    this.hit = NO_HIT;
    this.y = 400;
  }
  if(life.show){
    if(this.x == life.x && this.y - life.y == 15){
      this.life += 1;
      life.show = false;
      if(siren) {
        siren.pause();
      }
    }
  }
}

Player.prototype.restart = function(){
  this.life = 3;
  this.score = 0;
  this.level = 1;
  this.hits = 0;
  this.hit = NO_HIT;
  this.startLifeTimer = true;
  this.start = true;
  this.gameOver = false;
  gameData.style.display = "block";
  about.style.display = "none";
  this.y = 400;
  this.x = 202;
}

Player.prototype.handleInput = function(key){

  if(!this.start){
    if(key == 'up'){
      this.restart();     
    }
    return;
  }


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
      if(this.y != 68){
        this.y -= 83;
      }else{
        if(this.hit != COLLIDES){          
          if(this.x == target.x){
            this.hit = HITS_TARGET;
            target.update();
          }else{
            this.hit = HITS_TOP;
          }
          
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

function Life(){
  this.x,
  this.y,
  this.show,
  this.sprite = 'images/gem-blue.png';  
}

Life.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Life.prototype.update = function(){
  this.x = (Math.floor(Math.random() * 5) * 101);
  this.y = ((1 + Math.floor(Math.random() * 4)) * 83) - 30;
}

// Start Button object
var startBtn = {
  w: 300,
  h: 80,
  x: 102.5,
  y: 263,
  msg: "",

  draw: function() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = "2";
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    ctx.font = "18px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStlye = "white";
    ctx.fillText(this.msg, 252.5, 303);
  }
};

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

var life = new Life();
   
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