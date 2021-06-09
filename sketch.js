//Create variables here
var dog,dogImg1,dogImg2;
var happyDog;
var foodS;
var foodStock;
var database;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var changeState;
var readState;
var bedroom,garden,washroom;
var ct;

function preload()
{
	//load images here
  dogImg1=loadImage("dogImg.png");
  dogImg2=loadImage("dogImg1.png");
  bedroom=loadImage("Bed Room.png");
  garden=loadImage("Garden.png");
  washroom=loadImage("Wash Room.png");
}

function setup() {

  database=firebase.database();

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

	createCanvas(500, 500);

  dog=createSprite(250,310,20,20);
  dog.addImage(dogImg1);
  dog.scale=0.25;

  foodObj=new Food();

  feed=createButton("Feed the dog");
  feed.position(600,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);

  
}


function draw() { 
  background(46,139,87);
  drawSprites();
  
  
  
  
  

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });


  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed :"+ lastFed%12 + "PM",200,30);
  }else if(lastFed==0){
    text("Last Feed :12 AM",200,30);
  }else{
    text("Last Feed :"+ lastFed + "AM",200,30);
  }

  ct=hour();
  if(ct==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(ct==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(ct>(lastFed+2) && ct<(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg1);
  }

  
  //add styles here
  

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);

}

function feedDog(){
  dog.addImage(dogImg2);

  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })

}


function addFoods(){
  dog.addImage(dogImg1);
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){

  database.ref('/').update({
    gameState:state
  })

}
