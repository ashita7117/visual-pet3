var dog, dogi ;
var happyDog, happyDogi;
var database;
var foodS;
var foodStock;
var feedPet;
var addFood;
var fedTime;
var lastFed;
var foodObj;
var garden, washroom, bedroom;
var gameState;
var readState

function preload()
{
  dogi = loadImage("images/Dog.png");
  happyDogi = loadImage("images/happydog.png")
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png")
  bedroom = loadImage("images/Bed Room.png");
  

}

function setup() {
	createCanvas(500, 500);
  database = firebase.database();

  foodObj = new Food()

  dog = createSprite(250,400);
  dog.addImage(dogi);
  dog.scale = 0.15;

  // happyDog = createSprite()
  // happyDog = addImage(happyDogi);
  // happyDogi.scale = 1

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val()
  })

  feedPet = createButton("Feed The Dog")
  feedPet.position(500,50);
  feedPet.mousePressed(feedDog);

  addFood = createButton("Add Food")
  addFood.position(600,50);
  addFood.mousePressed(AddFood);

  foodObj.updateFoodStock(foodS)

}


function draw() {  

  //foodStock = database.ref('Food');
  //foodStock.on("value",readStock);

  // fill("white");
   //ext("Press UP Arrow To Feed The Dog", 170,350);

  fedTime = database.ref("feedTime");
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val()
  })

  var currentTime = hour()
  console.log(currentTime)
  console.log(lastFed)
  if(currentTime === (lastFed + 1)){
    foodObj.garden();
    update("playing")
  }
  else  if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    foodObj.washroom();
    update("bathroom")
  }
  else{
    foodObj.display();
    update("hungry")
  }

  // foodObj.display();

  // fill("white");
  // text("FOOD REMAINING: " + foodS, 170,290);

  

  // foodObj.updateFoodStock(foodS)

  if(gameState !== "hungry"){
feedPet.hide()
addFood.hide()
dog.remove();
  }
  else{
    feedPet.show()
    addFood.show()
    dog.addImage(dogi)
  }
  drawSprites();

}

function writeStock(x){
  if(x <= 0){
    x = 0;
  }
  else{
    x = x-1
  }
   database.ref('/').update({
     Food: x
   })
}

function readStock (data){
  foodS = data.val();
  //foodObj.updatefoodStock(foodS)
  // dog.x = dogPosition.x
}

function AddFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(happyDogi);
  if(foodS >= 1){
    foodS = foodS - 1
  }

  //foodObj.updateFoodStock(foodObj.getFoodStock()- 1);
  database.ref('/').update({
    Food : foodS,
    feedTime:hour(),
    gameState : "hungry"
  })
}

function update(state){
  database.ref('/').update({
    gameState : state
  })

}

