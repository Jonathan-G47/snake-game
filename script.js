// HTML Elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const scored = document.getElementById('score');
const startButton = document.getElementById('start');
const modal = document.getElementById('modal');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restart');
const goHomeButton = document.getElementById('goHome');



// Game settings
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

// Game variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

// Rellena cada cuadrado del tablero
// @params
// square: posición del cuadrado,
// type: tipo de cuadrado {emptySquare, snakeSquare, foodSquare}
const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);   
    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        const index = emptySquares.indexOf(square);
        if (index !== -1) {
            emptySquares.splice(index, 1);
        }
    }
};



const drawSnake = () => {
    snake.forEach((square, index) => {
        const type = index === snake.length - 1 ? 'snakeHead' : 'snakeSquare';
        drawSquare(square, type);
    });
};

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction]
    ).padStart(2, '0');
    const [row, column] = newSquare.split('');

    if (
        newSquare < 0 ||
        newSquare >= boardSize * boardSize ||
        (direction === 'ArrowRight' && column === '0') ||
        (direction === 'ArrowLeft' && column === '9') ||
        boardSquares[row][column] === squareTypes.snakeSquare
    ) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
};

const addFood = () => {
    score++;
    updateScore();
    
    // Aumentar velocidad con límite
    if (gameSpeed > 60) {
        gameSpeed -= 10;
        clearInterval(moveInterval);
        moveInterval = setInterval(() => moveSnake(), gameSpeed);
    }

    // Animación de "comer"
    const headElement = document.getElementById(snake[snake.length - 1]);
    headElement.classList.add('eatAnimation');
    setTimeout(() => {
        headElement.classList.remove('eatAnimation');
    }, 300); // duración de la animación

    createRandomFood();
};


const gameOver = () => {
    clearInterval(moveInterval);
    finalScore.innerText = score;
    modal.style.display = 'flex';
};

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


const setDirection = newDirection => {
    direction = newDirection;
};

const directionEvent = event => {
    const key = event.key;
    switch (key) {
        case 'ArrowUp':
            if (direction !== 'ArrowDown') setDirection(key);
            break;
        case 'ArrowDown':
            if (direction !== 'ArrowUp') setDirection(key);
            break;
        case 'ArrowLeft':
            if (direction !== 'ArrowRight') setDirection(key);
            break;
        case 'ArrowRight':
            if (direction !== 'ArrowLeft') setDirection(key);
            break;
    }
};

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
};

const updateScore = () => {
    scoreBoard.innerText = score;
};

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

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = 0;
    gameSpeed = 200; //Reiniciar la velocidad al volver a empezar
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
};

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
    moveInterval = setInterval(() => moveSnake(), gameSpeed);
};

startButton.addEventListener('click', startGame);
