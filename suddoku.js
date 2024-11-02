let puzzle;
let originalPuzzle;

function generatePuzzle(difficulty = 30) {
    const board = Array(9).fill(null).map(() => Array(9).fill(0));
    fillRandomCells(board, difficulty);
    return board;
}

function fillRandomCells(board, filledCells) {
    let count = 0;
    while (count < filledCells) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (board[row][col] === 0) {
            const num = Math.floor(Math.random() * 9) + 1;
            if (isSafeToPlace(board, row, col, num)) {
                board[row][col] = num;
                count++;
            }
        }
    }
}

function isSafeToPlace(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
    }
    const startRow = row - (row % 3), startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
        }
    }
    return true;
}

function renderGrid(puzzle) {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    puzzle.forEach((row, rowIndex) => {
        row.forEach((cellValue, colIndex) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.value = cellValue ? cellValue : '';
            input.disabled = cellValue !== 0;
            input.dataset.row = rowIndex;
            input.dataset.col = colIndex;

            input.addEventListener('input', (e) => {
                validateInput(e.target);
            });

            cell.appendChild(input);
            grid.appendChild(cell);
        });
    });
}

function validateInput(input) {
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    const value = parseInt(input.value);

    if (!value || value < 1 || value > 9) {
        input.value = '';
        input.style.color = '';
        return;
    }

    input.style.color = isValidMove(row, col, value) ? 'yellow' : 'red';
}

function isValidMove(row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (i !== col && puzzle[row][i] === num) return false;
        if (i !== row && puzzle[i][col] === num) return false;
    }
    const startRow = row - (row % 3), startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if ((i + startRow !== row || j + startCol !== col) && puzzle[i + startRow][j + startCol] === num) return false;
        }
    }
    return true;
}

function newGame() {
    puzzle = generatePuzzle(30);
    originalPuzzle = JSON.parse(JSON.stringify(puzzle));
    renderGrid(puzzle);
}

function restartGame() {
    renderGrid(originalPuzzle);
}

document.getElementById('new-game-btn').addEventListener('click', newGame);
document.getElementById('restart-btn').addEventListener('click', restartGame);

newGame();
