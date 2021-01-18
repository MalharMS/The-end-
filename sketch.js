localStorage["High.score"] = 0

//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver,restart,gameOverimage,restartimage;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverimage = loadImage("gameOver.png")
  restartimage = loadImage("restart.png")

  bg = loadImage("T-rexGame.png")
}

function setup() {
  createCanvas(displayWidth , displayHeight - 100);
  
  
  
  trex = createSprite(50,displayHeight-170,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(displayWidth/2,displayHeight-100,displayWidth,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(displayWidth/2,displayHeight-110,displayWidth,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  //place gameOver and restart icon on the screen
    gameOver = createSprite(300,displayHeight-230);
    restart = createSprite(300,displayHeight-200);
    gameOver.addImage(gameOverimage)
    gameOver.scale = 0.5;
    restart.addImage(restartimage)
    restart.scale = 0.5;

    gameOver.visible = false;
    restart.visible = false;
}

function draw() {

  camera.x = trex.x;
  camera.y = trex.y;

  gameOver.position.x = restart.position.x = camera.x

  background(bg);
  text("Score: "+ score, 500,50);
  text("highscore: "+ localStorage["High.score"],400,50 )
  if (gameState===PLAY){
    
  score = score + Math.round(getFrameRate()/60);
  
  if(keyDown("space")&& trex.y>=displayHeight-150) {
    trex.velocityY = -15;
  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/4;
  }
  
  ground.velocityX = -4;
    
  spawnClouds();
  spawnObstacles();
  End();
    
    if(obstaclesGroup.isTouching(trex)){
    gameState=END
    }
  } else if(gameState===END){
      gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided)
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  
      if(mousePressedOver(restart)) {
    reset();
  }
  
  }
  trex.collide(invisibleGround);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth+20,displayHeight-300,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(displayWidth,displayHeight-120,10,40);
    obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 400;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  trex.position.x = 10 
  
  if(localStorage["High.score"] < score){
  localStorage["High.score"] = score
  }
  
  score = 0;
  
  
}


function End() {
  if (score === 1000) {
    gameState = END
  }
}