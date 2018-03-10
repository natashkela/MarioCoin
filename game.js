// define variables
var game;
var mario;
var platforms;
var winningBadge;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false;
var currentPoints = 0;
var winningPoint = 80;

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  createItem(150, 650, 'coin');
  createItem(370,480,'poison');
  createItem(770, 100, 'coin');
  createItem(100, 250, 'coin');
  createItem(575, 150, 'coin');
  createItem(525, 300, 'coin');
  createItem(650, 250, 'coin');
  createItem(150, 40, 'coin');
  createItem(100, 420, 'poison');
  createItem(125, 50, 'star');
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(120, 670, 'platform2');
  platforms.create(320, 520, 'platform');
  platforms.create(550, 450, 'platform2');
  platforms.create(450, 150, 'platform');
  platforms.create(770, 150, 'platform2');
  platforms.create(750, 650, 'platform');
  platforms.create(120, 125, 'platform2');

  platforms.create(40, 350, 'platform');
  platforms.create(550, 350, 'platform');
  platforms.create(250, 150, 'platform');
  platforms.create(800, 370, 'platform');
  platforms.setAll('body.immovable', true);
}

// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// create the winning badge and add to screen
function createBadge() {
  winningBadge = game.add.physicsGroup();
  var badge = winningBadge.create(750, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen
function itemHandler(mario, item) {
  if(item.key==='coin'){
    currentPoints = currentPoints + 10;
  }
  else if(item.key==='poison'){
    currentPoints -= 10;
  }else if(item.key==='star'){
    currentPoints+=20;
  }
  item.kill();
  if (currentPoints === winningPoint) {
      createBadge();
  }
}

// when the player collects the badge at the end of the game
function badgeHandler(mario, badge) {
  badge.kill();
  won = true;
}

//Setup the game when the page is loading
window.onload = function () {
  //set the screen size to 1072, 800
  //run preload, create, update and render functions included
  game = new Phaser.Game(1072, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

  //preload the files before the game begins
  function preload() {
    //setting the background color to dark red
    game.stage.backgroundColor = '#7F220E';
    //loading the images of the platform
    game.load.image('platform', 'yellow_platform.png');
    game.load.image('platform2', 'poison_platform.png');
    //loading the spritesheets for mario -  the player
    //coins being collected
    //badge gotten at the end
    //poison to make the game a little bit difficult
    //start to get a boost score
    game.load.spritesheet('mario', 'mario.jpg', 60, 95);
    game.load.spritesheet('coin', 'coin.png', 36, 44);
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    game.load.spritesheet('poison', 'poison.png', 32, 32);
    game.load.spritesheet('star', 'star.png', 32, 32);
  }

  // initial game set up
  function create() {
    mario = game.add.sprite(50, 600, 'mario');
    mario.animations.add('running');
    mario.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(mario);
    mario.body.collideWorldBounds = true;
    mario.body.gravity.y = 400;
    addItems();
    addPlatforms();
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "POINTS: " + currentPoints, { font: "bold 24px Helvetica", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Helvetica", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
  }

  //when the game is going on...
  function update() {
    text.text = "POINTS: " + currentPoints; //update the current points
    game.physics.arcade.collide(mario, platforms); //check if we mario collided the platforms
    game.physics.arcade.overlap(mario, items, itemHandler); //check if mario should get any points off or added for items
    game.physics.arcade.overlap(mario, winningBadge, badgeHandler); //did he take the winning badge?
    mario.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      mario.animations.play('running', 15, true);
      mario.body.velocity.x = -200;
      mario.scale.x = - 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      mario.animations.play('running', 15, true);
      mario.body.velocity.x = 200;
      mario.scale.x = 1;
    }
    // mario isn't moving
    else {
      mario.animations.stop();
    }

    //make mario jump if the space bar is being pressed
    if (jumpButton.isDown && (mario.body.onFloor() || mario.body.touching.down)) {
      mario.body.velocity.y = -400;
    }
    //player won the game display the message
    if (won) {
      winningMessage.text = "Congratulations! You Won!";
    }
  }

  function render() {

  }

};
