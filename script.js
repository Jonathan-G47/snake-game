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
   DIBUJAR CUADRADOS
   ============================================ */
const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type];

    const squareElement = document.getElementById(square);
    squareElement.className = `square ${type}`;

    if (type === 'emptySquare') {
        emptySquares.push(square);
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

    // Colisiones
    if (
        newSquare < 0 ||
        newSquare >= boardSize * boardSize ||
        (direction === 'ArrowRight' && column === '0') ||
        (direction === 'ArrowLeft' && column === '9') ||
        boardSquares[row][column] === squareTypes.snakeSquare
    ) {
        return gameOver();
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

    // Aumentar velocidad
    if (gameSpeed > 60) {
        gameSpeed -= 10;
        clearInterval(moveInterval);
        moveInterval = setInterval(moveSnake, gameSpeed);
    }

    // Animación de comer
    const head = document.getElementById(snake[snake.length - 1]);
    head.classList.add('eatAnimation');
    setTimeout(() => head.classList.remove('eatAnimation'), 300);

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
   DIRECCIÓN
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

/* ============================================
   COMIDA ALEATORIA
   ============================================ */
const createRandomFood = () => {
    const randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomSquare, 'foodSquare');
};

/* ============================================
   ACTUALIZAR SCORE
   ============================================ */
const updateScore = () => {
    scoreBoard.innerText = score;
};

/* ============================================
   CREAR TABLERO
   ============================================ */
const createBoard = () => {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const id = `${row}${col}`;
            const square = document.createElement('div');
            square.className = 'square emptySquare';
            square.id = id;
            board.appendChild(square);
            emptySquares.push(id);
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

    boardSquares = Array.from(Array(boardSize), () =>
        new Array(boardSize).fill(squareTypes.emptySquare)
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
   EVENTOS
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
