var gameState="play"
var trex ,trex_running;
var score=0
function preload(){
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png")
  ground_image=loadImage("ground2.png")
  cloudImage=loadImage("cloud.png")
  cactus1=loadImage("obstacle1.png")
  cactus2=loadImage("obstacle2.png")
  cactus3=loadImage("obstacle3.png")
  cactus4=loadImage("obstacle4.png")
  cactus5=loadImage("obstacle5.png")
  cactus6=loadImage("obstacle6.png")
  trexCollided=loadAnimation("trex_collided.png")
  gameOverimg=loadImage("gameOver.png")
  restartimg=loadImage("restart.png")
  checkpoint=loadSound("checkpoint.mp3")
  die=loadSound("die.mp3")
  jump=loadSound("jump.mp3")
} 

function setup(){
  createCanvas(windowWidth-20,windowHeight-20)

  
  randomNumber=Math.round(random(1,10))
  console.log(randomNumber)
  trex=createSprite(50,height-150,20,50)
  trex.addAnimation("run",trex_running)
  trex.addAnimation("collide",trexCollided)
  trex.debug=false
  trex.setCollider("circle",0,0,35)
  trex.scale=0.5

  ground=createSprite(width/2,height-100,600,20)
  ground.addImage(ground_image)
  ground.velocityX=-4
  ground.scale=1.3

  ground2=createSprite(width/2,height-90,width,20)
  ground2.visible=false

  gameOver=createSprite(width/2,height/2)
  gameOver.addImage(gameOverimg)

  restart=createSprite(width/2,height/2+30)
  restart.addImage(restartimg)
  restart.scale=0.5
  cGroup=createGroup()
  cactGroup=createGroup()
  
  
}


function draw(){
 
  background("skyblue")

  text("Score:"+score,width-100,20)

  trex.collide(ground2)
 
  if(gameState=="play"){
    gameOver.visible=false
    restart.visible=false
    
    score=score+Math.round(getFrameRate()/60)
    if(score%100==0&&score>0){
      checkpoint.play()
    }

    if(touches.length>0||keyDown("space")&&trex.y>height-200){
      trex.velocityY=-15
      jump.play()
      touches=[]
    }
    trex.velocityY+=0.8
    ground.velocityX=-(4+score/60)

    if(ground.x<100){
      ground.x=ground.width/2
    }
    createClouds()
    createCactus()
  
    if(cactGroup.isTouching(trex)){
      die.play()
      gameState="end"
    }

  }

  else if(gameState=="end"){
    background("skyblue")
    ground.velocityX=0
    cGroup.setVelocityXEach(0)
    cactGroup.setVelocityXEach(0)
    cGroup.setLifetimeEach(-10)
    cactGroup.setLifetimeEach(-10)
    trex.changeAnimation("collide")
    trex.velocityY=0
    gameOver.visible=true
    restart.visible=true
    if(mousePressedOver(restart)||touches.length>0){
      reset()
      touches=[]
    }
  }
  drawSprites()
}
function reset(){
  gameState="play"
  cactGroup.destroyEach()
  cGroup.destroyEach()
  trex.changeAnimation("run")
  score=0
}
function createClouds(){
  if(frameCount%70==0){
    cloud=createSprite(width,100,40,20)
    cloud.velocityX=-3
    console.log(frameCount)
    cloud.y=Math.round(random(30,height/2))
    cloud.addImage(cloudImage)
    cloud.scale=0.7
    cloud.depth=trex.depth
    cloud.lifetime=1000
    trex.depth+=1
    cGroup.add(cloud)
  }
  
}

function createCactus(){
  if(frameCount%90==0){
    cactus=createSprite(width,height-120,20,50)
    cactus.velocityX=-(4+score/100)

    cactusNumber=Math.round(random(1,6))
    switch(cactusNumber){
      case 1:cactus.addImage(cactus1)
      break 
      case 2:cactus.addImage(cactus2)
      break 
      case 3:cactus.addImage(cactus3)
      break 
      case 4:cactus.addImage(cactus4)
      break 
      case 5:cactus.addImage(cactus5)
      break 
      case 6:cactus.addImage(cactus6)
      break 

    } 
    cactus.scale=0.6
    cactus.lifetime=1000 
    cactGroup.add(cactus)
  }
}