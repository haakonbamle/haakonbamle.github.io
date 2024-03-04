function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}


const c = document.getElementById("game");
const ctx = c.getContext("2d");

const restartButton = document.getElementById("restart");

document.addEventListener("click", restart);
function restart() {
    gameOver = false;
    scoreCounter = 0;
    snakeBody = [];
    snake.positionX = Math.floor(Math.random() * (boardSize / snake.size)) * snake.size;
    snake.positionY = Math.floor(Math.random() * (boardSize / snake.size)) * snake.size;
    snakeBody[0] = [snake.positionX, snake.positionY];
    snake.directionX = 0;
    snake.directionY = 0;
    spawnFood();
    ctx.fillStyle = "lime";
    ctx.fillRect(snake.positionX, snake.positionY, snake.size, snake.size);

    Math.floor(Math.random() * (boardSize / snake.size)) * snake.size;
}

const highScoreHeader = document.getElementById("highScore");
const boardSize = 400;

let scoreCounter = 0;
const highScore = getCookie('highScore');

if (typeof highScore === 'undefined') setCookie('highScore', 0, 180);

highScoreHeader.innerHTML = `Highscore: ${highScore}`;
const score = document.getElementById("score");
score.innerHTML = "Score: 0"
let queue;


let snakeBody = [];
let gameOver = false;

let snake = {
    size: 25,

    positionX: 0,
    positionY: 0,

    directionX: 0,
    directionY: 0

    
};

let food = {
    size: 25,

    positionX: 0,
    positionY: 0

};

const rows = boardSize / snake.size;
const cols = boardSize / snake.size;

function keyDown(e) {
    if (e.key === "ArrowUp" && snake.directionY === 1 || e.key === "ArrowUp" && queue == "down") {
        return;
    } else if (e.key === "ArrowDown" && snake.directionY === -1 || e.key === "ArrowDown" && queue == "up") {
        return;
    } else if (e.key === "ArrowRight" && snake.directionX === -1 || e.key === "ArrowRight" && queue == "left") {
        return;
    } else if (e.key === "ArrowLeft" && snake.directionX === 1 || e.key === "ArrowLeft" && queue == "right") {
        return;
    } else if (e.key === "ArrowUp") {
        snake.directionX = 0;
        snake.directionY = -1;
    } else if (e.key === "ArrowDown") {
        snake.directionX = 0;
        snake.directionY = 1;
    } else if (e.key === "ArrowRight") {
        snake.directionX = 1;
        snake.directionY = 0;
    } else if (e.key === "ArrowLeft") {
        snake.directionX = -1;
        snake.directionY = 0;
    }
}

function spawnFood() {
    food.positionX = Math.floor(Math.random() * (boardSize / snake.size)) * snake.size;
    food.positionY = Math.floor(Math.random() * (boardSize / snake.size)) * snake.size;
}

function drawGrid() {
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            ctx.fillStyle = "green";
            ctx.fillRect(j * snake.size, i * snake.size, snake.size, snake.size);
        }
    }
}


function setGameOver() {
    gameOver = true;
    alert("Game Over");
    if (scoreCounter > highScore) {
        
        alert(`You got a new high score! ${scoreCounter}`);
        setCookie('highScore', scoreCounter, 180);
        highScoreHeader.innerHTML = `Highscore: ${highScore}`;
    }
    scoreCounter = 0;
}

function update() {
    if (gameOver) {
        return;
    }


    if (snake.directionX == 0 && snake.directionY == 1) {
        queue = "down";
    } else if (snake.directionX == 0 && snake.directionY == -1) {
        queue = "up";
    } else if (snake.directionX == 1 && snake.directionY == 0) {
        queue = "right";
    } else if (snake.directionX == -1 && snake.directionY == 0) {
        queue = "left";
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, boardSize, boardSize);

    ctx.fillStyle = "red";
    ctx.fillRect(food.positionX, food.positionY, food.size, food.size);
    

    if (snake.positionX == food.positionX && snake.positionY == food.positionY) {
        snakeBody.push([food.positionX, food.positionY]);
        scoreCounter += 1;
        spawnFood();
        score.innerHTML = `Score: ${scoreCounter}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snake.positionX, snake.positionY];
    }

    ctx.fillStyle = "lime";
    snake.positionX += snake.directionX * snake.size;
    snake.positionY += snake.directionY * snake.size;
    ctx.fillRect(snake.positionX, snake.positionY, snake.size, snake.size);
    for (let i = 0; i < snakeBody.length; i++) {
        ctx.fillRect(snakeBody[i][0], snakeBody[i][1], snake.size, snake.size);

    }

    if (snake.positionX < 0 || snake.positionX >= boardSize || snake.positionY< 0 || snake.positionY >= boardSize ) setGameOver();

    for (i = 0; i < snakeBody.length; i++) {
        if (snake.positionX == snakeBody[i][0] && snake.positionY == snakeBody[i][1]) setGameOver();
    }

   
}



window.onload = function() {

    spawnFood();
    ctx.fillStyle = "lime";
    ctx.fillRect(snake.positionX, snake.positionY, snake.size, snake.size)
    document.addEventListener("keydown", keyDown);
    setInterval(update, 100);
};
