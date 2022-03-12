const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

const LEVELS = [
  {
    level: 1,
    coords: generateLevel(1),
    color: "black",
    speed: 120,
  },
  {
    level: 1,
    coords: generateLevel(2),
    color: "black",
    speed: 120,
  },
  {
    level: 1,
    coords: generateLevel(3),
    color: "black",
    speed: 120,
  },
  {
    level: 1,
    coords: generateLevel(4),
    color: "black",
    speed: 120,
  },
  {
    level: 1,
    coords: generateLevel(5),
    color: "black",
    speed: 120,
  },
];

const MOVE_INTERVAL = 120;

let currentLevel = 0;

function generateLevel(level) {
  let coords = [];
  switch (level) {
    case 1:
      for (let i = 5; i < WIDTH - 5; i++) {
        coords.push({ x: i, y: 10 });
      }
      break;
    case 2:
      for (let i = 5; i < WIDTH - 5; i++) {
        coords.push({ x: i, y: 10 });
      }

      for (let i = 5; i < WIDTH - 5; i++) {
        coords.push({ x: i, y: 20 });
      }
      break;
    case 3:
      for (let i = 5; i < WIDTH - 5; i++) {
        coords.push({ x: i, y: 10 });
      }

      for (let i = 0; i < WIDTH; i++) {
        coords.push({ x: i, y: 0 });
        coords.push({ x: i, y: HEIGHT - 1 });
      }

      for (let i = 5; i < WIDTH - 5; i++) {
        coords.push({ x: i, y: 20 });
      }
      break;
    case 4:
      for (let i = 5; i < WIDTH - 5; i++) {
        coords.push({ x: i, y: 10 });
      }

      for (let i = 0; i < WIDTH; i++) {
        coords.push({ x: i, y: 0 });
        coords.push({ x: i, y: HEIGHT - 1 });
      }

      for (let i = 0; i < HEIGHT; i++) {
        coords.push({ x: 0, y: i });
        coords.push({ x: WIDTH - 1, y: i });
      }

      for (let i = 5; i < WIDTH - 5; i++) {
        coords.push({ x: i, y: 20 });
      }
      break;
    case 5:
      for (let i = 5; i < WIDTH - 5; i++) {
        coords.push({ x: i, y: 10 });
      }

      for (let i = 0; i < WIDTH; i++) {
        coords.push({ x: i, y: 0 });
        coords.push({ x: i, y: HEIGHT - 1 });
      }

      for (let i = 0; i < HEIGHT; i++) {
        coords.push({ x: 0, y: i });
        coords.push({ x: WIDTH - 1, y: i });
      }

      for (let i = 5; i < WIDTH - 5; i++) {
        coords.push({ x: i, y: 20 });
      }

      const adds = [
        { x: 3, y: 3 },
        { x: 4, y: 3 },
        { x: 3, y: 4 },
        { x: WIDTH - 4, y: 3 },
        { x: WIDTH - 5, y: 3 },
        { x: WIDTH - 4, y: 4 },
        { x: WIDTH - 4, y: HEIGHT - 4 },
        { x: WIDTH - 5, y: HEIGHT - 4 },
        { x: WIDTH - 4, y: HEIGHT - 5 },
        { x: 3, y: HEIGHT - 4 },
        { x: 4, y: HEIGHT - 4 },
        { x: 3, y: HEIGHT - 5 },
      ];
      coords.push(...adds);
      break;

    default:
      break;
  }

  return coords;
}

function initPosition() {
  let newPos = {
    x: random(1, WIDTH - 2),
    y: random(1, HEIGHT - 2),
  };

  while (!isSpaceFree(newPos)) {
    newPos = {
      x: random(1, WIDTH - 2),
      y: random(1, HEIGHT - 2),
    };
  }

  return newPos;
}

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake(color) {
  return {
    color: color,
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
  };
}

let snake1 = initSnake("purple");
let lives = 3;

let apples = [
  {
    color: "red",
    position: initPosition(),
  },
  {
    color: "blue",
    position: initPosition(),
  },
];

const scoreBoard = document.getElementById("score");
const levelBoard = document.getElementById("level");

function isSpaceFree(pos) {
  for (let coor of LEVELS[currentLevel].coords) {
    if (pos.x == coor.x && pos.y == coor.y) {
      return false;
    }
  }
  return true;
}

function drawLives() {
  const liveElement = document.getElementById("lives");
  liveElement.textContent = "";
  for (let i = 0; i < lives; i++) {
    var myImage = new Image(15, 15);
    myImage.src = "assets/hearth.png";
    liveElement.appendChild(myImage);
  }
}

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
  scoreBoard.textContent = snake.score;
}

function drawLevel(ctx, level) {
  for (coor of level.coords) {
    drawCell(ctx, coor.x, coor.y, level.color);
  }
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);


    var imghead = document.getElementById("head");
      ctx.drawImage(
        imghead,
        snake1.head.x * CELL_SIZE,
        snake1.head.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );

    for (let i = 1; i < snake1.body.length; i++) {
      drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
    }

    // Draw Level
    drawLevel(ctx, LEVELS[currentLevel]);

    // Draw apple
    for (let i = 0; i < apples.length; i++) {
      let apple = apples[i];

      var img = document.getElementById("apple");
      ctx.drawImage(
        img,
        apple.position.x * CELL_SIZE,
        apple.position.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }

   
    // Draw score
    drawScore(snake1);
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

function gameOver() {
  var audio = new Audio("assets/game-over.mp3");
  audio.play();
  alert("Game Over");
  window.location.reload();
}

function checkIsLevelUp() {
  if (snake1.score % 5 === 0 && currentLevel < 4) {
    currentLevel++;
    levelBoard.textContent = currentLevel + 1;
  }
}

function eat(snake, apples) {
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
      checkIsLevelUp();

      apple.position = initPosition();
      snake.score++;
      snake.body.push({ x: snake.head.x - 5, y: snake.head.y - 5 });
    }
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apples);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apples);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apples);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apples);
}

function checkCollision(snake) {
  let isCollide = false;

  // Check if snake head collide with body
  for (let k = 1; k < snake.body.length; k++) {
    if (snake.head.x == snake.body[k].x && snake.head.y == snake.body[k].y) {
      isCollide = true;
    }
  }

  // Check if snake head collide with level
  for (let coor of LEVELS[currentLevel].coords) {
    if (snake.head.x == coor.x && snake.head.y == coor.y) {
      isCollide = true;
    }
  }

  if (isCollide) {
    lives--;
    drawLives();

    if (lives <= 0) {
      gameOver();
    }
  }
  return isCollide;
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }

  checkCollision(snake1);

  setTimeout(function () {
    move(snake);
  }, MOVE_INTERVAL);

  moveBody(snake);
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === "ArrowRight") {
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === "ArrowUp") {
    turn(snake1, DIRECTION.UP);
  } else if (event.key === "ArrowDown") {
    turn(snake1, DIRECTION.DOWN);
  }
});

function initGame() {
  move(snake1);
  drawLives();
}

initGame();