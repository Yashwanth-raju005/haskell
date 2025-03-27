const gridSize = 4;
let board = [];

// Initialize board
function initBoard() {
    board = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
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
    let moved = false;
    let boardCopy = JSON.stringify(board); // Copy for comparison

    for (let i = 0; i < gridSize; i++) {
        let rowOrCol = [];

        for (let j = 0; j < gridSize; j++) {
            let val = direction === "up" || direction === "down" ? board[j][i] : board[i][j];
            if (val !== 0) rowOrCol.push(val);
        }

        let merged = merge(rowOrCol);

        // Place merged row/column back into board
        for (let j = 0; j < gridSize; j++) {
            let val = merged[j] || 0;
            if (direction === "up") board[j][i] = val;
            if (direction === "down") board[gridSize - 1 - j][i] = val;
            if (direction === "left") board[i][j] = val;
            if (direction === "right") board[i][gridSize - 1 - j] = val;
        }
    }

    if (JSON.stringify(board) !== boardCopy) { // Check if board changed
        spawnTile();
        updateBoard();
        checkGameOver();
    }
}

// Merge tiles in a row/column
function merge(arr) {
    let newArr = arr.filter(val => val !== 0); // Remove zeroes
    for (let i = 0; i < newArr.length - 1; i++) {
        if (newArr[i] === newArr[i + 1]) {
            newArr[i] *= 2;
            newArr[i + 1] = 0;
        }
    }
    return newArr.filter(val => val !== 0).concat(Array(gridSize - newArr.length).fill(0));
}

// Update HTML grid
function updateBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 100px)`;

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            let tile = document.createElement("div");
            tile.classList.add("tile");
            tile.textContent = board[r][c] === 0 ? "" : board[r][c];
            tile.style.background = board[r][c] ? `rgb(${200 - board[r][c] * 5}, 150, 100)` : "#ccc";
            gameBoard.appendChild(tile);
            if (board[r][c] === 2048) {
                setTimeout(() => alert("🎉 You Win! Refresh to play again!"), 100);
                return;
            }
        }
    }
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
    setTimeout(() => alert("Game Over! Refresh to restart."), 100);
}

// Handle keypresses
document.addEventListener("keydown", (e) => {
    e.preventDefault(); // Prevent arrow key scrolling
    switch (e.key) {
        case "ArrowUp": move("up"); break;
        case "ArrowDown": move("down"); break;
        case "ArrowLeft": move("left"); break;
        case "ArrowRight": move("right"); break;
    }
});

// Start the game
initBoard();
