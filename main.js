document.addEventListener('DOMContentLoaded', () => {
    const paddle = document.getElementById('paddle');
    const ball = document.getElementById('ball');
    const bricksContainer = document.getElementById('bricks-container');
    const scoreDisplay = document.getElementById('score');
    const instructions = document.getElementById('instructions');
    const startButton = document.getElementById('start-button');

    let game_width = 400
    let game_heigth = 480;
    let PADDLE_HEIGHT = 15;
    let PADDLE_WIDTH = 90;
    let BALL_RADIUS = 15 / 2;
    let gameLoopIntervalId;
    let paddleX;
    let ballX, ballY;
    let ballDX, ballDY;
    let score;
    let bricks = [];
    let mySoundGameOver;
    let mySoundPaddleCol;
    let gamePaused = false;

    const pressedKeys = {};
    window.onkeyup = function(e) { pressedKeys[e.key] = false; }
    window.onkeydown = function(e) { pressedKeys[e.key] = true; } // Element keyup event, paddle movement
    
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            gamePaused = !gamePaused; 
        }
    });

    function resetGame() {
        clearInterval(gameLoopIntervalId);
    }

    function initializeGame() {
        mySoundGameOver = new sound("game-over-arcade-6435.mp3");
        paddleX = (400 - 80) / 2;
        paddle.style.left = `${paddleX}px`;

        ballX = 200;
        ballY = 200;
        ballDX = 5;
        ballDY = -5;
        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;

        generateBricks();
        instructions.style.display = 'none';
        startButton.style.display = 'none';

        startGameLoop();
    }

    function generateBricks () {
        const brickCount = 7 * 4;

        bricksContainer.innerHTML = '';

        for(let i = 0; i < brickCount; i++) {
            const brick = document.createElement('div');
            brick.className = 'brick';
            bricksContainer.appendChild(brick);
            bricks.push(brick);
        }
    }

    function generateBricksSQN() {
        const brickRowCount = 4;
        const brickColumnCount = 6;
        const brickWidth = 50;
        const brickHeight = 20;
        const brickMargin = 10;

        bricksContainer.innerHTML = '';

        for (let row = 0; row < brickRowCount; row++) {
            for (let col = 0; col < brickColumnCount; col++) {
                const brick = document.createElement('div');
                brick.style.top = `${row * (brickHeight + brickMargin)}px`;
                brick.style.left = `${col * (brickWidth + brickMargin)}px`;
                brick.className = 'brick';
                bricksContainer.appendChild(brick);
                bricks.push(brick);
            }
        }
    }

    function gameLoop() {
        if (gamePaused) return;

        moveBall();
        movePaddle();
        checkCollisions();
        if (isGameOver()) {
            endGame();
        }
    }

    function startGameLoop() {
        gameLoopIntervalId = setInterval(gameLoop, 1000 / 60); // 60 frames
    }

    function movePaddle() {
        const deltaX = game_width / 50;

        if (pressedKeys['ArrowLeft'] && paddleX > 0) {
            paddleX -= deltaX;
        } else if (pressedKeys['ArrowRight'] && paddleX < 320) {
            paddleX += deltaX;
        }

        paddle.style.left = `${paddleX}px`;
    }

    function moveBall() {
        ballX += ballDX;
        ballY += ballDY;

        if (ballX < 0 || ballX > 390) {
            ballDX = -ballDX;
        }
        if (ballY < 0) {
            ballDY = -ballDY;
        }

        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;
    }

    function checkCollisions() {

        // Check ball collision with paddle
        mySoundPaddleCol = new sound("90s-game-ui-3-185096.mp3")
        if (ballY + BALL_RADIUS * 2 >= game_heigth - PADDLE_HEIGHT &&
            ballX + BALL_RADIUS >= paddleX &&
            ballX <= paddleX + PADDLE_WIDTH) {
            ballDY = -ballDY;
            ballY = ballY - 5
            mySoundPaddleCol.play();
        }
    
        // Check ball collision with bricks
        const ballRect = ball.getBoundingClientRect();

        bricks
            .filter(b => b.style.visibility !== 'hidden')
            .forEach((brick) => {
                const rect = brick.getBoundingClientRect();

                if (ballRect.left + BALL_RADIUS >= rect.left &&
                    ballRect.left + BALL_RADIUS <= rect.right &&
                    ballRect.top + BALL_RADIUS >= rect.top &&
                    ballRect.top + BALL_RADIUS <= rect.bottom)
                {
                    // Ball has collided with the brick
                    brick.style.visibility = 'hidden'; // Hide the brick
                    ballDY *= -1; // Reverse ball's vertical direction
                    score += 10; // Increase score
                    scoreDisplay.textContent = `Score: ${score}`; // Update score display
                }
        });
    
        // Check ball collision with walls
        
        if (ballX <= 0 || ballX + BALL_RADIUS * 2 >= game_width || ballY <= 0) {
            ballDX = -ballDX; // Reverse ball's horizontal direction
        }

        if (ballY + BALL_RADIUS >= game_heigth) {
            endGame();
        }
    }
    
    
    function isGameOver() {
        return bricks.every(brick => brick.style.visibility === 'hidden');
    }

    function endGame() {
        mySoundGameOver.play();
        alert(`Game Over! Your Score: ${score}`);
        resetGame();
        initializeGame();
        
    }

    startButton.addEventListener('click', () => {
        initializeGame();
    });
});


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }

