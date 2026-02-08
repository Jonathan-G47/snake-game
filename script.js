/* ============================================
   ELEMENTOS DEL DOM
   ============================================ */
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const scored = document.getElementById('score');
const startButton = document.getElementById('start');
const modal = document.getElementById('modal');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restart');
const goHomeButton = document.getElementById('goHome');
const mobileButtons = document.querySelectorAll('.ctrl');

/* ============================================
   CONFIGURACIÓN DEL JUEGO
   ============================================ */
const boardSize = 10;
let gameSpeed = 200;

const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};

const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
};

/* Variables del juego */
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

/* ============================================
   DIBUJAR CUADRADO
   square: "filaColumna" (ej: "03")
   type: emptySquare | snakeSquare | foodSquare | snakeHead
   ============================================ */
const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type] ?? boardSquares[row][column];

    const squareElement = document.getElementById(square);
    squareElement.className = `square ${type}`;

    if (type === 'emptySquare') {
        if (!emptySquares.includes(square)) emptySquares.push(square);
    } else {
        const index = emptySquares.indexOf(square);
        if (index !== -1) emptySquares.splice(index, 1);
    }
};

/* ============================================
   DIBUJAR SERPIENTE
   ============================================ */
const drawSnake = () => {
    snake.forEach((square, index) => {
        const type = index === snake.length - 1 ? 'snakeHead' : 'snakeSquare';
        drawSquare(square, type);
    });
};

/* ============================================
   MOVER SERPIENTE
   ============================================ */
const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction]
    ).padStart(2, '0');

    const [row, column] = newSquare.split('');

    // Colisiones con bordes o cuerpo
    if (
        newSquare < 0 ||
        newSquare >= boardSize * boardSize ||
        (direction === 'ArrowRight' && column === '0') ||
        (direction === 'ArrowLeft' && column === '9') ||
        boardSquares[row][column] === squareTypes.snakeSquare
    ) {
        gameOver();
        return;
    }

    snake.push(newSquare);

    if (boardSquares[row][column] === squareTypes.foodSquare) {
        addFood();
    } else {
        const emptySquare = snake.shift();
        drawSquare(emptySquare, 'emptySquare');
    }

    drawSnake();
};

/* ============================================
   AÑADIR COMIDA
   ============================================ */
const addFood = () => {
    score++;
    updateScore();

    // Aumentar velocidad con límite
    if (gameSpeed > 60) {
        gameSpeed -= 10;
        clearInterval(moveInterval);
        moveInterval = setInterval(moveSnake, gameSpeed);
    }

    // Animación de comer
    const headElement = document.getElementById(snake[snake.length - 1]);
    headElement.classList.add('eatAnimation');
    setTimeout(() => headElement.classList.remove('eatAnimation'), 300);

    createRandomFood();
};

/* ============================================
   GAME OVER
   ============================================ */
const gameOver = () => {
    clearInterval(moveInterval);
    finalScore.innerText = score;
    modal.style.display = 'flex';
};

/* ============================================
   DIRECCIÓN (TECLADO Y TÁCTIL)
   ============================================ */
const setDirection = newDirection => {
    direction = newDirection;
};

const directionEvent = event => {
    const key = event.key;

    if (key === 'ArrowUp' && direction !== 'ArrowDown') setDirection(key);
    if (key === 'ArrowDown' && direction !== 'ArrowUp') setDirection(key);
    if (key === 'ArrowLeft' && direction !== 'ArrowRight') setDirection(key);
    if (key === 'ArrowRight' && direction !== 'ArrowLeft') setDirection(key);
};

/* Controles táctiles (botones) */
mobileButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const dir = btn.dataset.dir;

        if (dir === 'ArrowUp' && direction !== 'ArrowDown') direction = 'ArrowUp';
        if (dir === 'ArrowDown' && direction !== 'ArrowUp') direction = 'ArrowDown';
        if (dir === 'ArrowLeft' && direction !== 'ArrowRight') direction = 'ArrowLeft';
        if (dir === 'ArrowRight' && direction !== 'ArrowLeft') direction = 'ArrowRight';
    });
});

/* ============================================
   CONTROL POR SWIPE (DESLIZAR EN PANTALLA)
   ============================================ */
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Movimiento horizontal
        if (dx > 0 && direction !== 'ArrowLeft') direction = 'ArrowRight';
        else if (dx < 0 && direction !== 'ArrowRight') direction = 'ArrowLeft';
    } else {
        // Movimiento vertical
        if (dy > 0 && direction !== 'ArrowUp') direction = 'ArrowDown';
        else if (dy < 0 && direction !== 'ArrowDown') direction = 'ArrowUp';
    }
});

/* ============================================
   COMIDA ALEATORIA
   ============================================ */
const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
};

/* ============================================
   SCORE
   ============================================ */
const updateScore = () => {
    scoreBoard.innerText = score;
};

/* ============================================
   CREAR TABLERO
   ============================================ */
const createBoard = () => {
    for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
        for (let columnIndex = 0; columnIndex < boardSize; columnIndex++) {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        }
    }
};

/* ============================================
   CONFIGURAR JUEGO
   ============================================ */
const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = 0;
    gameSpeed = 200;
    direction = 'ArrowRight';

    boardSquares = Array.from(
        Array(boardSize),
        () => new Array(boardSize).fill(squareTypes.emptySquare)
    );

    board.innerHTML = '';
    emptySquares = [];

    createBoard();
};

/* ============================================
   INICIAR JUEGO
   ============================================ */
const startGame = () => {
    setGame();
    scored.style.display = 'flex';
    board.style.display = 'grid';
    startButton.style.display = 'none';
    startButton.disabled = true;

    drawSnake();
    updateScore();
    createRandomFood();

    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval(moveSnake, gameSpeed);
};

/* ============================================
   EVENTOS PRINCIPALES
   ============================================ */
startButton.addEventListener('click', startGame);

restartButton.addEventListener('click', () => {
    modal.style.display = 'none';
    startGame();
});

goHomeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    board.style.display = 'none';
    scored.style.display = 'none';
    startButton.style.display = 'inline-block';
    startButton.disabled = false;
});
