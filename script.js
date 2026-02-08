const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const winnerMessage = document.getElementById('winnerMessage');
const winningLineToDraw = document.getElementById('winningLine');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winConditions = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Col 1
    [1, 4, 7], // Col 2
    [2, 5, 8], // Col 3
    [0, 4, 8], // Diag 1
    [2, 4, 6]  // Diag 2
];

const handleCellClick = (e) => {
    const clickedCell = e.target;
    // Ensure we are clicking a cell and not the line container or something else
    if (!clickedCell.classList.contains('cell')) return;

    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();
};

const updateCell = (cell, index) => {
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
};

const switchPlayer = () => {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
    statusText.style.color = currentPlayer === 'X' ? 'var(--accent-x)' : 'var(--accent-o)';
};

const checkResult = () => {
    let roundWon = false;
    let winningCombo = [];

    for (let i = 0; i < winConditions.length; i++) {
        const winCondition = winConditions[i];
        let a = gameBoard[winCondition[0]];
        let b = gameBoard[winCondition[1]];
        let c = gameBoard[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            winningCombo = winCondition;
            break;
        }
    }

    if (roundWon) {
        announceWinner(currentPlayer, winningCombo);
        gameActive = false;
        return;
    }

    if (!gameBoard.includes('')) {
        announceDraw();
        gameActive = false;
        return;
    }

    switchPlayer();
};

const announceWinner = (player, winningCombo) => {
    statusText.textContent = `Winner!`;
    winnerMessage.textContent = `Player ${player} has won the game!`;
    winnerMessage.style.color = player === 'X' ? 'var(--accent-x)' : 'var(--accent-o)';

    drawWinningLine(winningCombo);
};

const announceDraw = () => {
    statusText.textContent = "Draw!";
    statusText.style.color = 'var(--text-primary)';
    winnerMessage.textContent = "It's a tie game.";
    winnerMessage.style.color = 'var(--text-primary)';
};

const drawWinningLine = (winningCombo) => {
    // winningCombo contains the indices [0, 1, 2], etc.
    // We need to find the center coordinates of the start and end cells

    // Grid Logic:
    // 0 1 2
    // 3 4 5
    // 6 7 8

    // Each cell is approx 100x100 + 10px gap. 
    // SVG viewBox is 300x300 (mapped to the board size via CSS).
    // Let's assume standard grid coords for simpler math:
    // Col 0 center: 50, Col 1 center: 160, Col 2 center: 270 (approx with gaps)
    // Actually, let's use exact offsets.
    // Gap is 10px. Cell is 1fr.
    // If we treat space as 0-320 (100*3 + 10*2).
    // Center of col 0: 50.
    // Center of col 1: 100 + 10 + 50 = 160.
    // Center of col 2: 100 + 10 + 100 + 10 + 50 = 270.

    const getCellCenter = (index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;

        // x = col * 110 + 50
        // y = row * 110 + 50
        return {
            x: col * 110 + 50,
            y: row * 110 + 50
        };
    };

    const start = getCellCenter(winningCombo[0]);
    const end = getCellCenter(winningCombo[2]);

    // Create the line element
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', start.x);
    line.setAttribute('y1', start.y);
    line.setAttribute('x2', end.x);
    line.setAttribute('y2', end.y);

    // Set stroke color based on winner
    const strokeColor = currentPlayer === 'X' ? '#38bdf8' : '#f472b6';
    line.setAttribute('stroke', strokeColor);

    winningLineToDraw.appendChild(line);
};

const resetGame = () => {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    statusText.textContent = `Player X's Turn`;
    statusText.style.color = 'var(--accent-x)';
    winnerMessage.textContent = '';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });

    // Clear the SVG line
    while (winningLineToDraw.firstChild) {
        winningLineToDraw.removeChild(winningLineToDraw.firstChild);
    }
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', resetGame);

// Initialize Status Color
statusText.style.color = 'var(--accent-x)';
