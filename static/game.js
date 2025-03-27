let highestScore = 0;
let currentScore = 0;
let gridSize = 4;
let board = [];
let gameOver = false;

// Initialize UI
function createUI() {
  document.body.innerHTML = "";

  let title = document.createElement("h1");
  title.textContent = "2048 Game";
  document.body.appendChild(title);

  let scoreBoard = document.createElement("h2");
  scoreBoard.id = "score";
  scoreBoard.textContent = `Score: ${currentScore} | Highest: ${highestScore}`;
  document.body.appendChild(scoreBoard);

  let headingsize = document.createElement("h3");
  headingsize.textContent = "Adjust Grid";
  document.body.appendChild(headingsize);

  let sizeInput = document.createElement("input");
  sizeInput.type = "number";
  sizeInput.min = "2";
  sizeInput.max = "6";
  sizeInput.value = gridSize;
  sizeInput.addEventListener("change", (e) => {
    gridSize = parseInt(e.target.value);
    initBoard();
  });
  document.body.style.background = "linear-gradient(to left, #ff7e5f, #feb47b)";

  if (sizeInput) {
    sizeInput.style.padding = "8px";
    sizeInput.style.fontSize = "16px";
    sizeInput.style.margin = "10px";
    sizeInput.style.border = "2px solid #bbada0";
    sizeInput.style.borderRadius = "5px";
    sizeInput.style.textAlign = "center";
    sizeInput.style.outline = "none";
    sizeInput.style.width = "50px";
    sizeInput.style.transition = "0.3s";

    sizeInput.addEventListener("focus", () => {
      sizeInput.style.borderColor = "#ff7e5f";
      sizeInput.style.boxShadow = "0 0 8px rgba(255, 126, 95, 0.5)";
    });

    sizeInput.addEventListener("blur", () => {
      sizeInput.style.borderColor = "#bbada0";
      sizeInput.style.boxShadow = "none";
    });
  }

  document.body.appendChild(sizeInput);

  let gameBoard = document.createElement("div");
  gameBoard.id = "game-board";
  document.body.appendChild(gameBoard);
}

// Initialize board
function initBoard() {
  board = Array(gridSize)
    .fill()
    .map(() => Array(gridSize).fill(0));
  gameOver = false;
  currentScore = 0;
  spawnTile();
  spawnTile();
  updateBoard();
}

// Spawn a random tile (2 or 4)
function spawnTile() {
  let emptyTiles = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (board[r][c] === 0) emptyTiles.push({ r, c });
    }
  }
  if (emptyTiles.length > 0) {
    let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
}

// Move tiles in a direction
function move(direction) {
  if (gameOver) return;
  let boardCopy = JSON.stringify(board);

  for (let i = 0; i < gridSize; i++) {
    let rowOrCol = [];
    for (let j = 0; j < gridSize; j++) {
      let val =
        direction === "up" || direction === "down" ? board[j][i] : board[i][j];
      if (val !== 0) rowOrCol.push(val);
    }
    let merged = merge(rowOrCol);
    for (let j = 0; j < gridSize; j++) {
      let val = merged[j] || 0;
      if (direction === "up") board[j][i] = val;
      if (direction === "down") board[gridSize - 1 - j][i] = val;
      if (direction === "left") board[i][j] = val;
      if (direction === "right") board[i][gridSize - 1 - j] = val;
    }
  }

  if (JSON.stringify(board) !== boardCopy) {
    spawnTile();
    updateBoard();
    checkGameOver();
  }
}

// Merge tiles in a row/column
function merge(arr) {
  let newArr = arr.filter((val) => val !== 0);
  for (let i = 0; i < newArr.length - 1; i++) {
    if (newArr[i] === newArr[i + 1]) {
      newArr[i] *= 2;
      currentScore += newArr[i];
      newArr[i + 1] = 0;
    }
  }
  return newArr
    .filter((val) => val !== 0)
    .concat(Array(gridSize - newArr.length).fill(0));
}

// Update HTML grid
function updateBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  gameBoard.style.display = "grid";
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;
  gameBoard.style.gap = "10px";

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      let tile = document.createElement("div");
      tile.classList.add("tile");
      tile.textContent = board[r][c] === 0 ? "" : board[r][c];
      tile.style.width = "100px";
      tile.style.height = "100px";
      tile.style.background = board[r][c]
        ? `rgb(${200 - board[r][c] * 5}, 150, 100)`
        : "#ccc";
      gameBoard.appendChild(tile);
    }
  }
  document.getElementById(
    "score"
  ).textContent = `Score: ${currentScore} | Highest: ${(highestScore = Math.max(
    highestScore,
    currentScore
  ))}`;
}

// Check game over condition
function checkGameOver() {
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (board[r][c] === 0) return;
      if (c < gridSize - 1 && board[r][c] === board[r][c + 1]) return;
      if (r < gridSize - 1 && board[r][c] === board[r + 1][c]) return;
    }
  }
  gameOver = true;
  setTimeout(() => {
    alert("Game Over! Restarting...");
    initBoard();
  }, 100);
}

// Handle keypresses
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  e.preventDefault();
  switch (e.key) {
    case "ArrowUp":
      move("up");
      break;
    case "ArrowDown":
      move("down");
      break;
    case "ArrowLeft":
      move("left");
      break;
    case "ArrowRight":
      move("right");
      break;
  }
});

createUI();
initBoard();
