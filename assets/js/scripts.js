// Get the canvas and its context
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Define the paddle and ball properties
const paddleWidth = 10,
  paddleHeight = 100;
const ballSize = 10;
const initialBallSpeedX = 3.5;
const initialBallSpeedY = 3.5;

let playerY = canvas.height / 2 - paddleHeight / 2;
let computerY = canvas.height / 2 - paddleHeight / 2;
let playerSpeed = 0;
let computerSpeed = 3; // Start with a moderate speed for the AI
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = initialBallSpeedX;
let ballSpeedY = initialBallSpeedY;

// Initialize the scores
let playerScore = 0;
let computerScore = 0;

// Controls
const upKey = 38; // Arrow Up
const downKey = 40; // Arrow Down
const wKey = 87; // 'W' key
const sKey = 83; // 'S' key

// Event listener for keypresses to control the player paddle
document.addEventListener("keydown", (event) => {
  // Prevent the default behavior of arrow keys to avoid scrolling
  if (
    event.keyCode === upKey ||
    event.keyCode === downKey ||
    event.keyCode === wKey ||
    event.keyCode === sKey
  ) {
    event.preventDefault();
  }

  if (event.keyCode === upKey || event.keyCode === wKey) {
    playerSpeed = -4;
  } else if (event.keyCode === downKey || event.keyCode === sKey) {
    playerSpeed = 4;
  }
});

document.addEventListener("keyup", (event) => {
  if (
    event.keyCode === upKey ||
    event.keyCode === wKey ||
    event.keyCode === downKey ||
    event.keyCode === sKey
  ) {
    playerSpeed = 0;
  }
});

// Function to update the ball and paddles
function update() {
  // Update player paddle position
  playerY += playerSpeed;

  // Restrict player paddle within the canvas
  if (playerY < 0) {
    playerY = 0;
  } else if (playerY + paddleHeight > canvas.height) {
    playerY = canvas.height - paddleHeight;
  }

  // Update computer paddle position (AI with human-like randomness)
  let aiThreshold = 150; // The distance from the ball at which the AI will start moving
  let aiMove = 0;

  // AI moves only when the ball is close enough
  if (Math.abs(ballX - (canvas.width - paddleWidth)) < aiThreshold) {
    aiMove = ballY - (computerY + paddleHeight / 2);
    if (aiMove > 0) {
      computerY += computerSpeed; // Move down
    } else {
      computerY -= computerSpeed; // Move up
    }
  }

  // Restrict computer paddle within the canvas
  if (computerY < 0) {
    computerY = 0;
  } else if (computerY + paddleHeight > canvas.height) {
    computerY = canvas.height - paddleHeight;
  }

  // Update ball position
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Gradually increase the ball speed after each collision with top or bottom
  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY = -ballSpeedY;
    ballSpeedX *= 1.05; // Slight increase in horizontal speed
    ballSpeedY *= 1.05; // Slight increase in vertical speed
  }

  // Ball collision with left and right paddles
  if (
    ballX <= paddleWidth &&
    ballY >= playerY &&
    ballY <= playerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballSpeedX *= 1.05; // Increase speed after hitting player paddle
  }

  if (
    ballX + ballSize >= canvas.width - paddleWidth &&
    ballY >= computerY &&
    ballY <= computerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballSpeedX *= 1.05; // Increase speed after hitting computer paddle
  }

  // Scoring system
  if (ballX <= 0) {
    computerScore++;
    saveGameResult("Computer");
    resetBall();
  }

  if (ballX + ballSize >= canvas.width) {
    playerScore++;
    saveGameResult("Player");
    resetBall();
  }

  // Display the updated scores
  document.getElementById("playerScore").textContent = playerScore;
  document.getElementById("computerScore").textContent = computerScore;

  // If someone wins, reset the game
  if (playerScore === 5 || computerScore === 5) {
    setTimeout(() => {
      saveGameResult(playerScore === 5 ? "Player" : "Computer");
      playerScore = 0;
      computerScore = 0;
      resetBall();
    }, 100);
  }
}

// Function to save the game result to localStorage
function saveGameResult(winner) {
  const gameResult = {
    playerScore,
    computerScore,
    winner,
  };

  // Get stored game results from localStorage
  let gameResults = JSON.parse(localStorage.getItem("gameResults")) || [];

  // Add new game result to the array
  gameResults.unshift(gameResult);

  // Keep only the last 3 games
  if (gameResults.length > 3) {
    gameResults.pop();
  }

  // Save back to localStorage
  localStorage.setItem("gameResults", JSON.stringify(gameResults));

  // Update the scores display in the hamburger menu
  updateGameScores();
}

// Function to reset the ball to the center
function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  ballSpeedX = -initialBallSpeedX; // Reset to initial speed and change direction
  ballSpeedY = initialBallSpeedY; // Reset to initial speed
}

// Function to draw everything on the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw player paddle
  ctx.fillStyle = "#FFB6C1";
  ctx.fillRect(0, playerY, paddleWidth, paddleHeight);

  // Draw computer paddle
  ctx.fillStyle = "#FFB6C1";
  ctx.fillRect(
    canvas.width - paddleWidth,
    computerY,
    paddleWidth,
    paddleHeight
  );

  // Draw the ball
  ctx.fillStyle = "#FFB6C1";
  ctx.fillRect(ballX, ballY, ballSize, ballSize);
}

// Function to run the game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

// Add event listener for the Reset Game button
document
  .getElementById("resetGameButton")
  .addEventListener("click", function () {
    // Reset scores and ball
    playerScore = 0;
    computerScore = 0;
    resetBall();
  });

// Toggle sidebar visibility when the hamburger menu is clicked
document.getElementById("hamburger").addEventListener("click", function () {
  document.getElementById("sidebar").classList.toggle("active");
});

// Close the sidebar when the close button is clicked
document.getElementById("closeSidebar").addEventListener("click", function () {
  document.getElementById("sidebar").classList.remove("active");
});

// Function to update the game scores in the hamburger menu
function updateGameScores() {
  const gameScoresList = document.getElementById("gameScoresList");
  gameScoresList.innerHTML = "";

  // Get stored game results
  const gameResults = JSON.parse(localStorage.getItem("gameResults")) || [];

  // Display the last 3 game results
  gameResults.forEach((game, index) => {
    const li = document.createElement("li");
    li.textContent = `Game ${index + 1}: Player ${
      game.playerScore
    } - Computer ${game.computerScore} | Winner: ${game.winner}`;
    gameScoresList.appendChild(li);
  });
}

// Initialize the game scores list on page load
updateGameScores();
