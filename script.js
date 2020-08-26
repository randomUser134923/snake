

const board_border = 'black'
const board_backgrond = 'white';
const snake_col = 'lightblue';
const snake_border = 'darkblue';

const snakeboard = document.getElementById("gameCanvas");
const snakeboard_ctx = gameCanvas.getContext("2d");


/* initialize */

let snake = [
  {x:200, y:200}, 
  {x:190, y:200}, 
  {x:180, y:200},
  {x:170, y:200}, 
  {x:160, y:200},
]

let changing_direction = false;
let dx= 10;
let dy= 0;
let food_x , food_y = 0;
let score = 0;

/* run part */
gen_Food();
draw_Food();
main();
document.addEventListener("keydown",change_direction);

function drawSnakePart(snakePart) {
  snakeboard_ctx.fillStyle = 'lightblue';
  snakeboard_ctx.strokestyle = 'darkblue';
  snakeboard_ctx.fillRect( snakePart.x , snakePart.y , 10,10);
  snakeboard_ctx.strokeRect( snakePart.x, snakePart.y, 10,10);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function clearCanvas() {
  snakeboard_ctx.fillStyle = board_backgrond;
  snakeboard_ctx.strokestyle = board_border;
  snakeboard_ctx.fillRect( 0,0, snakeboard.width , snakeboard.height );
  snakeboard_ctx.strokeRect( 0,0, snakeboard.width, snakeboard.height );
}

function move_snake()
{
  const head = {x:snake[0].x + dx, y:snake[0].y + dy};
  snake.unshift(head);

  const has_eaten = (snake[0].x === food_x && snake[0].y === food_y);
  if(has_eaten) {
    gen_Food();
    add_Score();
  }
  else {
    snake.pop();
  }
}

function change_direction(event)
{
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  if (changing_direction) return;
  changing_direction = true;

  const keyPressed = event.keyCode;
  const goingUp = (dy === -10);
  const goingDown = (dy === 10);
  const goingRight = (dx === 10);
  const goingLeft = (dx === -10);

  if(keyPressed === LEFT_KEY && !goingRight ) {
    dx = -10;
    dy = 0;
  }

  if(keyPressed === UP_KEY && !goingDown ) {
    dx = 0;
    dy = -10;
  }

  if(keyPressed === RIGHT_KEY && !goingLeft ) {
    dx = 10;
    dy = 0;
  }

  if(keyPressed === DOWN_KEY && !goingUp ) {
    dx = 0;
    dy = 10;
  }
}

function has_game_ended() {
  for( let i=4; i< snake.length; i++ ) {
    if(snake[i].x === snake[0].x && snake[i].y === snake[0].y)
      return true
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - 10;

  return (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall )

}

function random_food(min,max) {
  return Math.round( (min + Math.random() *(max-min) )/10 ) * 10;
}

function gen_Food() {
  food_x = random_food(0, snakeboard.width - 10);
  food_y = random_food(0, snakeboard.height - 10);
  snake.forEach( function has_snake_eaten_food(part) {
    const has_eaten = (part.x === food_x && part.y === food_y);
    if(has_eaten) {
      gen_Food();
    }
  });
}

function draw_Food(){
  snakeboard_ctx.fillStyle = 'lightgreen';
  snakeboard_ctx.strokestyle = 'darkgreen';
  snakeboard_ctx.fillRect(food_x,food_y,10,10);
  snakeboard_ctx.strokeRect(food_x,food_y,10,10);
}

function update_detail() {
  document.getElementById('details').innerHTML = ""+snake[0].x+" , "+snake[0].y;
  document.getElementById('food').innerHTML = "NEXT FOOD: "+food_x+" , "+food_y;
  document.getElementById('score').innerHTML = "SCORE: "+ score;
}

function add_Score() {
  score = score+ (50 + snake.length*10);
}



function main() {

  if (has_game_ended()) {
    document.getElementById('details').innerHTML = "GAME OVER [" +score+"]";
    document.getElementById("details").style.color= "red";
    return;
  }
  changing_direction = false;

  setTimeout( function onTick()
  {
    clearCanvas();
    move_snake();
    drawSnake();
    update_detail();
    draw_Food();
    main();
  } , 100)

}