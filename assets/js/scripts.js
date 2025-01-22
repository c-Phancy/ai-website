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

let gameEnded = false; // Flag to check if the game has ended

// Function to update the ball and paddles
function update() {
  if (gameEnded) return; // Skip further logic if the game has ended

  // Update player paddle position
  playerY += playerSpeed;

  // Restrict player paddle within the canvas
  if (playerY < 0) {
    playerY = 0;
  } else if (playerY + paddleHeight > canvas.height) {
    playerY = canvas.height - paddleHeight;
  }

  // Update computer paddle position (AI)
  let aiThreshold = 150; // The distance from the ball at which the AI will start moving
  let aiMove = 0;

  if (Math.abs(ballX - (canvas.width - paddleWidth)) < aiThreshold) {
    aiMove = ballY - (computerY + paddleHeight / 2);
    if (aiMove > 0) {
      computerY += computerSpeed;
    } else {
      computerY -= computerSpeed;
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
    ballSpeedX *= 1.02; // Slight increase in horizontal speed
    ballSpeedY *= 1.02; // Slight increase in vertical speed
  }

  // Ball collision with left and right paddles
  if (
    ballX <= paddleWidth &&
    ballY >= playerY &&
    ballY <= playerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballSpeedX *= 1.02; // Increase speed after hitting player paddle
  }

  if (
    ballX + ballSize >= canvas.width - paddleWidth &&
    ballY >= computerY &&
    ballY <= computerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballSpeedX *= 1.02; // Increase speed after hitting computer paddle
  }

  // Scoring system
  if (ballX <= 0) {
    computerScore++;
    resetBall(); // Reset the ball speed and position after every score
  }

  if (ballX + ballSize >= canvas.width) {
    playerScore++;
    resetBall(); // Reset the ball speed and position after every score
  }

  // Display the updated scores
  document.getElementById("playerScore").textContent = playerScore;
  document.getElementById("computerScore").textContent = computerScore;

  // If someone wins (score 5), save the result and reset the game
  if (playerScore === 5 || computerScore === 5) {
    if (!gameEnded) {
      // Only run this block once if the game hasn't ended yet
      gameEnded = true; // Set the flag to true, indicating the game has ended

      setTimeout(() => {
        // Save game result only once at the end of a round
        saveGameResult(playerScore === 5 ? "Player" : "Computer");
        playerScore = 0; // Reset the score after the round ends
        computerScore = 0;
        resetBall(); // Reset the ball speed and position when the game resets

        // Reset the gameEnded flag so the game can start a new round
        gameEnded = false;
      }, 100); // Delay to ensure proper timing and avoid multiple updates
    }
  }
}

// Function to save the game result (rounds)
function saveGameResult(winner) {
  const roundResult = {
    roundNumber: getRoundNumber(),
    playerScore,
    computerScore,
    winner,
  };

  // Get stored game results (rounds) from localStorage
  let gameResults = JSON.parse(localStorage.getItem("gameResults")) || [];

  // Add new round result to the array
  gameResults.unshift(roundResult);

  // Keep only the last 3 rounds
  if (gameResults.length > 3) {
    gameResults.pop();
  }

  console.log(gameResults);

  // Save the round results back to localStorage
  localStorage.setItem("gameResults", JSON.stringify(gameResults));

  // Update the scores display in the hamburger menu
  updateGameScores();
}

// Helper function to get the next round number
function getRoundNumber() {
  let gameResults = JSON.parse(localStorage.getItem("gameResults")) || [];
  return gameResults.length + 1; // Next round number based on current stored rounds
}

// Function to reset the ball to the center
function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  ballSpeedX = Math.random() > 0.5 ? 3 : -3; // Randomize direction after reset
  ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 3; // Random vertical speed after reset
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

  // Get stored game results (rounds) from localStorage
  const gameResults = JSON.parse(localStorage.getItem("gameResults")) || [];

  // Display the last 3 round results
  gameResults.forEach((game, _) => {
    const li = document.createElement("li");
    li.textContent = `Round ${game.roundNumber}: Player ${game.playerScore} - Computer ${game.computerScore} | Winner: ${game.winner}`;
    gameScoresList.appendChild(li);
  });
}

// Initialize the game scores list on page load
updateGameScores();
