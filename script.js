const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const winnerModal = document.getElementById('winnerModal');
const winnerText = document.getElementById('winnerText');
const modalRestartBtn = document.getElementById('modalRestartBtn');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellClick = (e) => {
    const clickedCell = e.target;
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
            break;
        }
    }

    if (roundWon) {
        announceWinner(currentPlayer);
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

const announceWinner = (player) => {
    winnerText.textContent = `Player ${player} Wins!`;
    winnerText.style.color = player === 'X' ? 'var(--accent-x)' : 'var(--accent-o)';
    winnerModal.classList.add('show');
    // Add confetti or celebration sound here if desired
};

const announceDraw = () => {
    winnerText.textContent = "Draw!";
    winnerText.style.color = 'var(--text-primary)';
    winnerModal.classList.add('show');
};

const resetGame = () => {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    statusText.textContent = `Player X's Turn`;
    statusText.style.color = 'var(--text-primary)'; // Reset to default or keep X/O color?
    // Actually, let's set it to X's color
    statusText.style.color = 'var(--accent-x)';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });

    winnerModal.classList.remove('show');
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', resetGame);
modalRestartBtn.addEventListener('click', resetGame);

// Initialize Status Color
statusText.style.color = 'var(--accent-x)';
