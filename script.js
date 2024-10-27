let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let gameMode = 'friend';
let gameDifficulty = 'medium'; // Default difficulty
let scores = { X: 0, O: 0 };
let playerNames = { X: 'Player X', O: 'Player O' };

// Nome da IA
const aiName = 'AI Bot';

function setGameMode(mode) {
    gameMode = mode;
    document.getElementById('playerNames').style.display = mode === 'friend' ? 'block' : 'none';
    document.getElementById('difficultySelect').style.display = mode === 'ai' ? 'block' : 'none';

    // Atualiza os nomes dos jogadores
    if (mode === 'ai') {
        playerNames.O = aiName; // Define o nome da IA
    } else {
        playerNames.O = 'Player O'; // Nome padrão para jogador
    }

    resetBoard(); // Reset board for the new mode
}

function setPlayerNames() {
    playerNames.X = document.getElementById('player1').value || 'Player X';
    playerNames.O = document.getElementById('player2').value || 'Player O';
    resetBoard(); // Reseta o tabuleiro ao definir os nomes
}

function setDifficulty(difficulty) {
    gameDifficulty = difficulty;
    resetBoard();
    document.getElementById('board').style.display = 'grid'; // Exibe o tabuleiro
    document.getElementById('resetButton').style.display = 'block'; // Exibe botão de reset
    gameActive = true;
    currentPlayer = 'X'; // Reinicia o jogador
}

function updateCell(index, player) {
    const cell = document.getElementsByClassName('cell')[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    gameBoard[index] = player;
}

function makeMove(index) {
    if (gameBoard[index] === '' && gameActive) {
        updateCell(index, currentPlayer);

        if (checkWin(currentPlayer)) {
            scores[currentPlayer]++;
            updateScores();
            gameActive = false;
            showVictoryScreen(currentPlayer);
            return;
        }

        if (checkDraw()) {
            gameActive = false;
            setTimeout(() => {
                showVictoryScreen(null, true); // Pass true para draw
            }, 100);
            return;
        }

        // Alterna o jogador
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; 

        // Se for o modo AI e for a vez da IA
        if (gameMode === 'ai' && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500); // Chama a IA após um pequeno atraso
        }
    }
}

function resetBoard() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true; // Habilita o jogo

    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });

    document.getElementById('board').style.display = 'grid'; // Exibe o tabuleiro
    document.getElementById('resetButton').style.display = 'block'; // Exibe botão de reset
}

function updateScores() {
    document.getElementById('scoreX').textContent = scores.X;
    document.getElementById('scoreO').textContent = scores.O;
}

function updatePlayerNames() {
    document.getElementById('player1Name').textContent = playerNames.X;
    document.getElementById('player2Name').textContent = playerNames.O;
}

function checkWin(player) {
    return checkWinningCondition(player);
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function checkWinningCondition(player) {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winCombos.some(combo => {
        return combo.every(index => gameBoard[index] === player);
    });
}

function showVictoryScreen(winner, isDraw = false) {
    const victoryScreen = document.getElementById('victoryScreen');
    const victoryText = document.getElementById('victoryText');
    const drawText = document.getElementById('drawText');

    if (isDraw) {
        victoryText.style.display = 'none';
        drawText.style.display = 'block';
    } else {
        victoryText.textContent = `${playerNames[winner]} WINS!`;
        victoryText.style.display = 'block';
        drawText.style.display = 'none';
    }

    victoryScreen.style.display = 'flex';
}

function hideVictoryScreen() {
    document.getElementById('victoryScreen').style.display = 'none';
    resetBoard();
}

function findWinningMove(player) {
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = player;
            if (checkWinningCondition(player)) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }
    return -1;
}

function findRandomMove() {
    const available = gameBoard.reduce((acc, cell, i) => {
        if (cell === '') acc.push(i);
        return acc;
    }, []);
    return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : -1;
}

function findStrategicMove() {
    const strategicMoves = [
        4, // Centro
        0, 2, 6, 8 // Cantos
    ];

    for (let move of strategicMoves) {
        if (gameBoard[move] === '') {
            return move;
        }
    }

    return -1; // Se não houver movimentos estratégicos
}

// Lógica da IA
function makeAIMove() {
    if (!gameActive) return;

    let move = -1;

    // Lógica de dificuldade para a IA
    if (gameDifficulty === 'easy') {
        move = findRandomMove();
    } else if (gameDifficulty === 'medium') {
        move = findWinningMove('O'); // Tentar vencer
        if (move === -1) {
            move = findWinningMove('X'); // Bloquear o jogador
        }
        if (move === -1) {
            move = findRandomMove(); // Selecionar aleatoriamente
        }
    } else if (gameDifficulty === 'hard') {
        move = findWinningMove('O'); // Tentar vencer
        if (move === -1) {
            move = findWinningMove('X'); // Bloquear o jogador
        }
        if (move === -1) {
            move = findStrategicMove(); // Estratégia avançada
        }
        if (move === -1) {
            move = findRandomMove(); // Selecionar aleatoriamente
        }
    }

    if (move !== -1) {
        updateCell(move, 'O'); // IA faz a jogada

        if (checkWin('O')) {
            scores['O']++;
            updateScores();
            gameActive = false;
            showVictoryScreen('O');
            return;
        }

        if (checkDraw()) {
            gameActive = false;
            setTimeout(() => {
                showVictoryScreen(null, true);
            }, 100);
        }

        currentPlayer = 'X'; // Retorna ao jogador humano
    }
}
