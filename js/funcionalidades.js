// =========================================
// CONFIGURACIÓN GENERAL Y MANEJO DE JUEGOS |
// =========================================

function openGame(game) {
  // Cerrar todos los juegos antes de abrir uno nuevo
  closeGame();

  // Mostrar el contenedor del juego seleccionado
  const gameContainer = document.getElementById(game + '-container');
  if (gameContainer) {
    gameContainer.style.display = 'block';
  }

  // Inicializar el juego correspondiente
  switch (game) {
    case 'snake':
      initSnake();
      break;
    case 'tictactoe':
      initTicTacToe();
      break;
    case 'tetris':
      initTetris();
      break;
    case 'breakout':
      initBreakout();
      break;
    case 'hangman':
      initHangman();
      break;
    case 'memory':
      initMemory();
      break;
    case 'minesweeper':
      initMinesweeper();
      break;
    case 'sudoku':
      initSudoku();
      break;
    case 'pacman':
      initPacMan();
      break;
  }
}

function closeGame() {
  const containers = document.getElementsByClassName('game-container');
  for (let container of containers) {
    container.style.display = 'none';
  }
}


// ===============================
// JUEGO 1: Juego de Snake |
// ===============================
let snakeGame;
function initSnake() {
  const canvas = document.getElementById('snake-game-canvas');
  const ctx = canvas.getContext('2d');

  // Variables del juego
  let snake = [{ x: 10, y: 10 }];
  let food = { x: 15, y: 15 };
  let direction = 'right';
  let nextDirection = 'right';
  let score = 0;
  let speed = 130;
  let gameOver = false;
  const gridSize = 20;
  const gridWidth = canvas.width / gridSize;
  const gridHeight = canvas.height / gridSize;

  // Control de teclado
  document.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'down') nextDirection = 'up';
        break;
      case 'ArrowDown':
        if (direction !== 'up') nextDirection = 'down';
        break;
      case 'ArrowLeft':
        if (direction !== 'right') nextDirection = 'left';
        break;
      case 'ArrowRight':
        if (direction !== 'left') nextDirection = 'right';
        break;
    }
  });

  // Controles táctiles para móviles
  let touchStartX = 0;
  let touchStartY = 0;

  canvas.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
  }, false);

  canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
  }, false);

  canvas.addEventListener('touchend', function (e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Movimiento horizontal
      if (dx > 0 && direction !== 'left') {
        nextDirection = 'right';
      } else if (dx < 0 && direction !== 'right') {
        nextDirection = 'left';
      }
    } else {
      // Movimiento vertical
      if (dy > 0 && direction !== 'up') {
        nextDirection = 'down';
      } else if (dy < 0 && direction !== 'down') {
        nextDirection = 'up';
      }
    }

    e.preventDefault();
  }, false);

  // Función para generar comida aleatoria
  function generateFood() {
    food = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight)
    };

    // Evitar que la comida aparezca en la serpiente
    for (let segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        return generateFood();
      }
    }
  }

  // Función de actualización del juego
  function update() {
    if (gameOver) return;

    // Actualizar dirección
    direction = nextDirection;

    // Mover serpiente
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
      case 'up':
        head.y--;
        break;
      case 'down':
        head.y++;
        break;
      case 'left':
        head.x--;
        break;
      case 'right':
        head.x++;
        break;
    }

    // Verificar colisión con paredes
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
      gameOver = true;
      return;
    }

    // Verificar colisión con la propia serpiente
    for (let i = 0; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver = true;
        return;
      }
    }

    // Añadir nueva cabeza
    snake.unshift(head);

    // Verificar si come la comida
    if (head.x === food.x && head.y === food.y) {
      score++;
      // Aumentar velocidad cada 5 puntos
      if (score % 5 === 0) {
        speed = Math.max(50, speed - 10);
      }
      generateFood();
    } else {
      // Eliminar la cola si no come
      snake.pop();
    }
  }

  // Función de renderizado
  function render() {
    // Limpiar canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar serpiente
    ctx.fillStyle = '#03dac6';
    for (let segment of snake) {
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    }

    // Dibujar cabeza con un color diferente
    ctx.fillStyle = '#6200ee';
    ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 1, gridSize - 1);

    // Dibujar comida
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);

    // Mostrar puntuación
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Puntuación: ${score}`, 10, 30);

    // Mostrar Game Over
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('¡JUEGO TERMINADO!', canvas.width / 2, canvas.height / 2 - 30);
      ctx.font = '20px Arial';
      ctx.fillText(`Puntuación final: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
      ctx.fillText('Toca para reiniciar', canvas.width / 2, canvas.height / 2 + 50);

      canvas.addEventListener('click', function restartHandler() {
        canvas.removeEventListener('click', restartHandler);
        initSnake();
      });

      canvas.addEventListener('touchend', function restartTouchHandler() {
        canvas.removeEventListener('touchend', restartTouchHandler);
        initSnake();
      });
    }
  }

  // Función principal del juego
  function gameLoop() {
    update();
    render();

    if (!gameOver) {
      clearTimeout(snakeGame);
      snakeGame = setTimeout(gameLoop, speed);
    }
  }

  // Iniciar juego
  snake = [{ x: 10, y: 10 }];
  direction = 'right';
  nextDirection = 'right';
  score = 0;
  gameOver = false;
  speed = 130;
  generateFood();
  if (snakeGame) clearTimeout(snakeGame);
  snakeGame = setTimeout(gameLoop, speed);
}


// =================================
// JUEGO 2: TIC-TAC-TOE (3 EN RAYA) |
// =================================
function initTicTacToe() {
  const board = document.getElementById('tictactoe-board');
  const status = document.getElementById('tictactoe-status');
  const modeButton = document.getElementById('tictactoe-mode'); // Botón para cambiar modo

  let currentPlayer = 'X'; // Jugador humano siempre es 'X'
  let gameState = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;
  let vsAI = false; // Modo IA desactivado por defecto

  // Cambiar modo de juego (Humano vs Humano o Humano vs IA)
  modeButton.addEventListener('click', () => {
    vsAI = !vsAI; // Alternar entre modos
    modeButton.textContent = vsAI ? 'Modo: Humano vs IA' : 'Modo: Humano vs Humano';
    resetGame();
  });

  // Reiniciar el juego
  function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    status.textContent = `Turno de: ${currentPlayer}`;
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('tictactoe-cell');
      cell.setAttribute('data-index', i);
      cell.addEventListener('click', handleCellClick);
      board.appendChild(cell);
    }
  }

  // Manejar clic en una celda
  function handleCellClick(e) {
    const index = parseInt(e.target.getAttribute('data-index'));
    if (gameState[index] !== '' || !gameActive) return;

    // Hacer el movimiento del jugador actual
    makeMove(index, currentPlayer);

    // Verificar si el jugador actual ha ganado
    if (checkWin(gameState, currentPlayer)) {
      status.textContent = `¡Jugador ${currentPlayer} gana!`;
      gameActive = false;
      return;
    }

    // Verificar empate
    if (!gameState.includes('')) {
      status.textContent = '¡Empate!';
      gameActive = false;
      return;
    }

    // Cambiar al siguiente jugador
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    // Si está en modo IA y es el turno de la IA, hacer su movimiento
    if (vsAI && currentPlayer === 'O' && gameActive) {
      status.textContent = 'Turno de: IA';
      setTimeout(() => {
        const bestMove = findBestMove(gameState);
        makeMove(bestMove, 'O');

        // Verificar si la IA ha ganado
        if (checkWin(gameState, 'O')) {
          status.textContent = '¡IA gana!';
          gameActive = false;
          return;
        }

        // Verificar empate
        if (!gameState.includes('')) {
          status.textContent = '¡Empate!';
          gameActive = false;
          return;
        }

        // Cambiar de nuevo al jugador humano
        currentPlayer = 'X';
        status.textContent = `Turno de: ${currentPlayer}`;
      }, 500); // Retraso para simular "pensamiento" de la IA
    } else {
      // Si no es modo IA, simplemente cambiar el turno
      status.textContent = `Turno de: ${currentPlayer}`;
    }
  }

  // Hacer un movimiento en el tablero
  function makeMove(index, player) {
    gameState[index] = player;
    const cell = board.children[index];
    cell.textContent = player;
    cell.classList.add(player === 'X' ? 'x' : 'o');
  }

  // Verificar si hay un ganador
  function checkWin(board, player) {
    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
      [0, 4, 8], [2, 4, 6] // Diagonales
    ];
    return winConditions.some(condition =>
      condition.every(index => board[index] === player)
    );
  }

  // Encontrar el mejor movimiento para la IA usando Minimax
  function findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O'; // La IA es 'O'
        const score = minimax(board, 0, false);
        board[i] = ''; // Deshacer el movimiento
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }

  // Algoritmo Minimax
  function minimax(board, depth, isMaximizing) {
    if (checkWin(board, 'O')) return 10 - depth; // IA gana
    if (checkWin(board, 'X')) return depth - 10; // Jugador gana
    if (!board.includes('')) return 0; // Empate

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          const score = minimax(board, depth + 1, false);
          board[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          const score = minimax(board, depth + 1, true);
          board[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  // Iniciar el juego
  resetGame();
}


// ===============================
// JUEGO 3: Juego de Tetris |
// ===============================
function initTetris() {
  const canvas = document.getElementById('tetris-canvas');
  const ctx = canvas.getContext('2d');

  // Configuración
  const blockSize = 30;
  const boardWidth = 10;
  const boardHeight = 20;
  canvas.width = blockSize * boardWidth;
  canvas.height = blockSize * boardHeight;

  // Colores para las piezas
  const colors = [
    '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D', '#FFE138', '#3877FF'
  ];

  // Definición de las piezas (tetrominos)
  const pieces = [
    [
      [1, 1, 1, 1]    // I
    ],
    [
      [1, 1, 1],      // T
      [0, 1, 0]
    ],
    [
      [1, 1, 1],      // L
      [1, 0, 0]
    ],
    [
      [1, 1, 1],      // J
      [0, 0, 1]
    ],
    [
      [1, 1],         // O
      [1, 1]
    ],
    [
      [0, 1, 1],      // S
      [1, 1, 0]
    ],
    [
      [1, 1, 0],      // Z
      [0, 1, 1]
    ]
  ];

  // Variables del juego
  let board = Array(boardHeight).fill().map(() => Array(boardWidth).fill(0));
  let piece;
  let piecePosition = { x: 0, y: 0 };
  let pieceIndex;
  let score = 0;
  let gameOver = false;
  let requestId;
  let dropCounter = 0;
  let dropInterval = 1000; // 1 segundo
  let lastTime = 0;

  // Crear nueva pieza
  function createPiece() {
    pieceIndex = Math.floor(Math.random() * pieces.length);
    piece = pieces[pieceIndex];
    piecePosition = {
      x: Math.floor(boardWidth / 2) - Math.floor(piece[0].length / 2),
      y: 0
    };

    // Verificar game over
    if (!isValidMove(piecePosition.x, piecePosition.y, piece)) {
      gameOver = true;
    }
  }

  // Función para verificar si un movimiento es válido
  function isValidMove(x, y, piece) {
    for (let row = 0; row < piece.length; row++) {
      for (let col = 0; col < piece[row].length; col++) {
        if (piece[row][col]) {
          const boardX = x + col;
          const boardY = y + row;

          // Verificar límites
          if (boardX < 0 || boardX >= boardWidth || boardY >= boardHeight) {
            return false;
          }

          // Verificar colisión con piezas en el tablero
          if (boardY >= 0 && board[boardY][boardX]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  // Mover pieza
  function movePiece(dx, dy) {
    const newX = piecePosition.x + dx;
    const newY = piecePosition.y + dy;

    if (isValidMove(newX, newY, piece)) {
      piecePosition.x = newX;
      piecePosition.y = newY;
      return true;
    }
    return false;
  }

  // Rotar pieza
  function rotatePiece() {
    const rotated = [];
    for (let col = 0; col < piece[0].length; col++) {
      rotated.push([]);
      for (let row = piece.length - 1; row >= 0; row--) {
        rotated[col].push(piece[row][col]);
      }
    }

    if (isValidMove(piecePosition.x, piecePosition.y, rotated)) {
      piece = rotated;
    }
  }

  // Fijar pieza en el tablero
  function placePiece() {
    for (let row = 0; row < piece.length; row++) {
      for (let col = 0; col < piece[row].length; col++) {
        if (piece[row][col]) {
          const boardY = piecePosition.y + row;
          const boardX = piecePosition.x + col;

          if (boardY >= 0) {
            board[boardY][boardX] = pieceIndex + 1; // +1 para evitar el valor 0
          }
        }
      }
    }

    // Verificar y limpiar filas completas
    clearRows();

    // Crear nueva pieza
    createPiece();
  }

  // Limpiar filas completas
  function clearRows() {
    let rowsCleared = 0;

    for (let row = boardHeight - 1; row >= 0; row--) {
      if (board[row].every(cell => cell > 0)) {
        // Eliminar fila completa
        board.splice(row, 1);
        // Añadir nueva fila vacía arriba
        board.unshift(Array(boardWidth).fill(0));
        // Incrementar contador de filas
        rowsCleared++;
        // Ajustar índice para verificar la misma posición
        row++;
      }
    }

    // Actualizar puntuación
    if (rowsCleared > 0) {
      // Puntuación exponencial según número de filas
      score += [0, 100, 300, 500, 800][rowsCleared];
      // Aumentar velocidad cada 1000 puntos
      dropInterval = Math.max(100, 1000 - Math.floor(score / 1000) * 100);
    }
  }

  // Dibujar tablero
  function drawBoard() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar piezas colocadas
    for (let row = 0; row < boardHeight; row++) {
      for (let col = 0; col < boardWidth; col++) {
        if (board[row][col]) {
          const colorIndex = board[row][col] - 1;
          ctx.fillStyle = colors[colorIndex];
          drawBlock(col, row);
        }
      }
    }

    // Dibujar pieza actual
    if (piece) {
      ctx.fillStyle = colors[pieceIndex];
      for (let row = 0; row < piece.length; row++) {
        for (let col = 0; col < piece[row].length; col++) {
          if (piece[row][col]) {
            drawBlock(piecePosition.x + col, piecePosition.y + row);
          }
        }
      }
    }

    // Dibujar cuadrícula
    ctx.strokeStyle = '#333';
    for (let row = 0; row < boardHeight; row++) {
      for (let col = 0; col < boardWidth; col++) {
        ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
      }
    }

    // Mostrar puntuación
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Puntuación: ${score}`, 10, 30);

    // Mostrar Game Over
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('¡JUEGO TERMINADO!', canvas.width / 2, canvas.height / 2 - 30);
      ctx.font = '20px Arial';
      ctx.fillText(`Puntuación final: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
      ctx.fillText('Toca para reiniciar', canvas.width / 2, canvas.height / 2 + 50);
    }
  }

  // Dibujar un bloque
  function drawBlock(x, y) {
    if (y < 0) return; // No dibujar bloques fuera del canvas
    ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
  }

  // Actualizar juego
  function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    if (!gameOver) {
      dropCounter += deltaTime;
      if (dropCounter > dropInterval) {
        dropCounter = 0;
        if (!movePiece(0, 1)) {
          placePiece();
        }
      }

      drawBoard();
      requestId = requestAnimationFrame(update);
    } else {
      drawBoard();
      canvas.addEventListener('click', function restartHandler() {
        canvas.removeEventListener('click', restartHandler);
        initTetris();
      });

      canvas.addEventListener('touchend', function restartTouchHandler() {
        canvas.removeEventListener('touchend', restartTouchHandler);
        initTetris();
      });
    }
  }

  // Control de teclado
  document.addEventListener('keydown', function (e) {
    if (gameOver) return;

    switch (e.key) {
      case 'ArrowLeft':
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        movePiece(0, 1);
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
    }
  });

  // Controles táctiles para móviles
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  canvas.addEventListener('touchstart', function (e) {
    if (gameOver) return;

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    e.preventDefault();
  }, false);

  canvas.addEventListener('touchend', function (e) {
    if (gameOver) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchTime = Date.now() - touchStartTime;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // Tap rápido para rotar
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20 && touchTime < 200) {
      rotatePiece();
    } else if (Math.abs(dx) > Math.abs(dy)) {
      // Deslizamiento horizontal
      if (dx > 50) {
        movePiece(1, 0);
      } else if (dx < -50) {
        movePiece(-1, 0);
      }
    } else if (dy > 50) {
      // Deslizamiento hacia abajo
      movePiece(0, 1);
    }

    e.preventDefault();
  }, false);

  // Iniciar juego
  board = Array(boardHeight).fill().map(() => Array(boardWidth).fill(0));
  score = 0;
  gameOver = false;
  dropInterval = 1000;
  createPiece();

  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  requestId = requestAnimationFrame(update);
}


// ============================
// JUEGO 4: Juego de Breakout |
// ============================
function initBreakout() {
  const canvas = document.getElementById('breakout-canvas');
  const ctx = canvas.getContext('2d');

  // Configuración
  const ballRadius = 10;
  const paddleHeight = 10;
  const paddleWidth = 75;
  const brickRowCount = 5;
  const brickColumnCount = 8;
  const brickWidth = 45;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 50;
  const brickOffsetLeft = 30;

  // Variables del juego
  let x = canvas.width / 2;
  let y = canvas.height - 30;
  let dx = 4;
  let dy = -4;
  let paddleX = (canvas.width - paddleWidth) / 2;
  let rightPressed = false;
  let leftPressed = false;
  let score = 0;
  let lives = 3;
  let gameOver = false;
  let gameWon = false;
  let requestId;

  // Inicializar ladrillos
  let bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  // Eventos de teclado
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      leftPressed = true;
    }
  });

  document.addEventListener('keyup', function (e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      leftPressed = false;
    }
  });

  // Eventos táctiles para móviles
  let touchStartX = 0;

  canvas.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    const rect = canvas.getBoundingClientRect();
    paddleX = touch.clientX - rect.left - paddleWidth / 2;
    e.preventDefault();
  }, false);

  canvas.addEventListener('touchmove', function (e) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    paddleX = touch.clientX - rect.left - paddleWidth / 2;
    e.preventDefault();
  }, false);

  // Control de ratón
  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    paddleX = e.clientX - rect.left - paddleWidth / 2;
  });

  // Función para detectar colisiones con ladrillos
  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brick = bricks[c][r];
        if (brick.status === 1) {
          if (x > brick.x && x < brick.x + brickWidth && y > brick.y && y < brick.y + brickHeight) {
            dy = -dy;
            brick.status = 0;
            score++;

            // Victoria si todos los ladrillos están rotos
            if (score === brickRowCount * brickColumnCount) {
              gameWon = true;
            }

            // Aumentar velocidad cada 10 puntos
            if (score % 10 === 0) {
              dx *= 1.1;
              dy *= 1.1;
            }
          }
        }
      }
    }
  }

  // Dibujar pelota
  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#03dac6';
    ctx.fill();
    ctx.closePath();
  }

  // Dibujar paleta
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#6200ee';
    ctx.fill();
    ctx.closePath();
  }

  // Dibujar ladrillos
  function drawBricks() {
    const colors = ['#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', '#FF8E0D'];
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
          const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = colors[r % colors.length];
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  // Dibujar puntuación
  function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Puntuación: ${score}`, 8, 20);
  }

  // Dibujar vidas
  function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Vidas: ${lives}`, canvas.width - 80, 20);
  }

  // Función principal de dibujo
  function draw() {
    // Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar elementos
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();

    // Comprobar colisiones
    collisionDetection();

    // Rebote en paredes laterales
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }

    // Rebote en pared superior
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      // Comprobar si golpea la paleta
      if (x > paddleX && x < paddleX + paddleWidth) {
        // Ajustar ángulo según donde golpee en la paleta
        const hitPosition = (x - paddleX) / paddleWidth;
        dx = 8 * (hitPosition - 0.5); // -4 a 4 según posición
        dy = -Math.abs(dy); // Siempre hacia arriba
      } else {
        // Pierde una vida
        lives--;
        if (lives === 0) {
          gameOver = true;
        } else {
          // Reiniciar posición
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 4;
          dy = -4;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }

    // Mover paleta
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    // Limitar la paleta dentro del canvas
    paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, paddleX));

    // Mover la pelota
    x += dx;
    y += dy;

    // Verificar fin del juego
    if (gameOver || gameWon) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'white';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';

      if (gameWon) {
        ctx.fillText('¡VICTORIA!', canvas.width / 2, canvas.height / 2 - 30);
      } else {
        ctx.fillText('¡JUEGO TERMINADO!', canvas.width / 2, canvas.height / 2 - 30);
      }

      ctx.font = '20px Arial';
      ctx.fillText(`Puntuación final: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
      ctx.fillText('Toca para reiniciar', canvas.width / 2, canvas.height / 2 + 50);

      cancelAnimationFrame(requestId);

      canvas.addEventListener('click', function restartHandler() {
        canvas.removeEventListener('click', restartHandler);
        initBreakout();
      });

      canvas.addEventListener('touchend', function restartTouchHandler() {
        canvas.removeEventListener('touchend', restartTouchHandler);
        initBreakout();
      });

      return;
    }

    requestId = requestAnimationFrame(draw);
  }

  // Inicializar juego
  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  // Resetear variables
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 4;
  dy = -4;
  paddleX = (canvas.width - paddleWidth) / 2;
  rightPressed = false;
  leftPressed = false;
  score = 0;
  lives = 3;
  gameOver = false;
  gameWon = false;

  // Resetear ladrillos
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  // Iniciar bucle de juego
  requestId = requestAnimationFrame(draw);
}


// =============================
// JUEGO 5: Juego del Ahorcado |
// =============================
function initHangman() {
  const wordContainer = document.getElementById('hangman-word');
  const letterButtons = document.getElementById('hangman-letters');
  const hangmanDrawing = document.getElementById('hangman-drawing');
  const messageContainer = document.getElementById('hangman-message');
  const resetButton = document.getElementById('hangman-reset');

  // Lista de palabras
  const words = [
    'JAVASCRIPT', 'PROGRAMACION', 'DESARROLLO', 'APLICACION', 'ALGORITMO',
    'FRONTEND', 'BACKEND', 'FULLSTACK', 'FRAMEWORK', 'BIBLIOTECA',
    'VARIABLE', 'FUNCION', 'OBJETO', 'ARREGLO', 'CLASE',
    'METODO', 'EVENTO', 'PROMESA', 'ASINCRONO', 'DOM'
  ];

  // Representaciones ASCII del ahorcado para cada estado
  const hangmanStates = [
    // Estado 0: Inicial (solo la horca)
    "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
    // Estado 1: Cabeza
    "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========",
    // Estado 2: Tronco
    "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========",
    // Estado 3: Brazo izquierdo
    "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========",
    // Estado 4: Brazo derecho
    "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========",
    // Estado 5: Pierna izquierda
    "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========",
    // Estado 6: Pierna derecha (ahorcado completo)
    "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========="
  ];

  let selectedWord = '';
  let guessedLetters = [];
  let wrongGuesses = 0;
  let maxWrongGuesses = 6;
  let gameStatus = 'playing'; // 'playing', 'won', 'lost'

  // Inicializar juego
  function init() {
    // Seleccionar palabra aleatoria
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongGuesses = 0;
    gameStatus = 'playing';

    // Actualizar UI
    updateWordDisplay();
    createLetterButtons();
    updateHangmanDrawing();
    messageContainer.textContent = 'Adivina la palabra:';
    resetButton.style.display = 'none';
  }

  // Actualizar la visualización de la palabra
  function updateWordDisplay() {
    wordContainer.innerHTML = '';

    for (const letter of selectedWord) {
      const span = document.createElement('span');
      span.classList.add('hangman-letter');
      span.style.margin = '0 2px';

      if (guessedLetters.includes(letter)) {
        span.textContent = letter;
      } else {
        span.textContent = '_';
      }

      wordContainer.appendChild(span);
    }
  }

  // Crear botones para cada letra
  function createLetterButtons() {
    letterButtons.innerHTML = '';

    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const button = document.createElement('button');
      button.textContent = letter;
      button.classList.add('hangman-letter-button');
      button.style.margin = '5px';
      button.style.width = '35px';
      button.style.height = '35px';
      button.style.fontSize = '16px';
      button.style.cursor = 'pointer';

      // Deshabilitar si ya ha sido adivinada
      if (guessedLetters.includes(letter)) {
        button.disabled = true;
        button.style.opacity = '0.5';
      }

      // Añadir evento al botón
      button.addEventListener('click', () => handleLetterGuess(letter));

      letterButtons.appendChild(button);
    }
  }

  // Manejar una letra adivinada
  function handleLetterGuess(letter) {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) {
      return;
    }

    guessedLetters.push(letter);

    // Verificar si la letra está en la palabra
    if (selectedWord.includes(letter)) {
      // Comprobar victoria
      const allLettersGuessed = [...selectedWord].every(l => guessedLetters.includes(l));

      if (allLettersGuessed) {
        gameStatus = 'won';
        messageContainer.textContent = '¡Has ganado! ¡Palabra completa!';
        resetButton.style.display = 'block';
      }
    } else {
      // Letra incorrecta
      wrongGuesses++;

      // Comprobar derrota
      if (wrongGuesses >= maxWrongGuesses) {
        gameStatus = 'lost';
        messageContainer.textContent = `¡Has perdido! La palabra era: ${selectedWord}`;
        resetButton.style.display = 'block';
      }
    }

    // Actualizar UI
    updateWordDisplay();
    createLetterButtons();
    updateHangmanDrawing();
  }

  // Actualizar dibujo del ahorcado con ASCII art
  function updateHangmanDrawing() {
    hangmanDrawing.textContent = hangmanStates[wrongGuesses];
  }

  // Evento para el botón de reinicio
  resetButton.addEventListener('click', init);

  // Iniciar juego
  init();
}



// ==================
// JUEGO 6: MEMORIA |
// ==================
function initMemory() {
  const board = document.getElementById('memory-board');
  const stats = document.getElementById('memory-stats');

  const symbols = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
  let cards = [...symbols, ...symbols];
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;

  // Barajar cartas
  cards.sort(() => Math.random() - 0.5);

  // Limpiar tablero
  board.innerHTML = '';
  stats.textContent = 'Movimientos: 0 | Parejas: 0/8';

  cards.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.symbol = symbol;

    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });

  function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
      card.textContent = card.dataset.symbol;
      card.classList.add('flipped');
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
      }
    }
  }

  function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedPairs++;
    } else {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.textContent = '';
      card2.textContent = '';
    }

    moves++;
    stats.textContent = `Movimientos: ${moves} | Parejas: ${matchedPairs}/8`;
    flippedCards = [];

    if (matchedPairs === 8) {
      setTimeout(() => alert('¡Felicidades! Has completado el juego.'), 300);
    }
  }
}


// ================================
// JUEGO 8: Buscaminas |
// ================================
function initMinesweeper() {
  const grid = document.getElementById('minesweeper-grid');
  const minesCountElement = document.getElementById('mines-count');
  const gridSize = 8; // Tablero de 8x8
  const mineCount = 10; // Número de minas
  let mines = [];
  let revealedCells = 0;
  let gameOver = false;

  // Crear el tablero
  function createBoard() {
    grid.innerHTML = '';
    mines = Array(gridSize * gridSize).fill(false);
    revealedCells = 0;
    gameOver = false;

    // Colocar minas aleatorias
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const randomIndex = Math.floor(Math.random() * gridSize * gridSize);
      if (!mines[randomIndex]) {
        mines[randomIndex] = true;
        minesPlaced++;
      }
    }

    // Crear celdas
    for (let i = 0; i < gridSize * gridSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('minesweeper-cell');
      cell.dataset.index = i;
      cell.addEventListener('click', () => revealCell(i));
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(i);
      });
      grid.appendChild(cell);
    }

    // Actualizar contador de minas
    minesCountElement.textContent = mineCount;
  }

  // Revelar una celda
  function revealCell(index) {
    if (gameOver) return;

    const cell = grid.children[index];
    if (cell.classList.contains('revealed') || cell.classList.contains('flag')) return;

    if (mines[index]) {
      // Si es una mina, fin del juego
      cell.classList.add('mine');
      gameOver = true;
      alert('¡Has perdido! Haz clic en Reiniciar Juego para intentarlo de nuevo.');
      revealAllMines();
    } else {
      // Si no es una mina, revelar la celda
      const mineCount = countAdjacentMines(index);
      cell.classList.add('revealed');
      cell.textContent = mineCount > 0 ? mineCount : '';
      revealedCells++;

      // Si no hay minas adyacentes, revelar celdas vecinas
      if (mineCount === 0) {
        revealAdjacentCells(index);
      }

      // Verificar si el jugador ha ganado
      if (revealedCells === gridSize * gridSize - mineCount) {
        gameOver = true;
        alert('¡Felicidades! Has ganado.');
      }
    }
  }

  // Revelar todas las minas (cuando el jugador pierde)
  function revealAllMines() {
    for (let i = 0; i < gridSize * gridSize; i++) {
      if (mines[i]) {
        const cell = grid.children[i];
        cell.classList.add('mine');
      }
    }
  }

  // Contar minas adyacentes
  function countAdjacentMines(index) {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    let count = 0;

    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
          const neighborIndex = i * gridSize + j;
          if (mines[neighborIndex]) {
            count++;
          }
        }
      }
    }

    return count;
  }

  // Revelar celdas adyacentes (si no tienen minas)
  function revealAdjacentCells(index) {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
          const neighborIndex = i * gridSize + j;
          revealCell(neighborIndex);
        }
      }
    }
  }

  // Alternar bandera en una celda
  function toggleFlag(index) {
    if (gameOver) return;

    const cell = grid.children[index];
    if (cell.classList.contains('revealed')) return;

    if (cell.classList.contains('flag')) {
      cell.classList.remove('flag');
      minesCountElement.textContent = parseInt(minesCountElement.textContent) + 1;
    } else {
      cell.classList.add('flag');
      minesCountElement.textContent = parseInt(minesCountElement.textContent) - 1;
    }
  }

  // Iniciar el juego
  createBoard();
}


// ================================
// JUEGO 9: Sudoku |
// ================================
function initSudoku() {
  const grid = document.getElementById('sudoku-grid');
  const status = document.getElementById('sudoku-status');
  let board = [];
  let solution = [];
  let difficulty = 'easy';

  // Generar un tablero de Sudoku
  function generateSudoku(level = 'easy') {
    difficulty = level;
    board = generateBoard();
    solution = solveSudoku([...board.map(row => [...row])]); // Guardar la solución
    removeNumbers(board, difficulty); // Eliminar números según la dificultad
    renderBoard(board);
    status.textContent = '';
  }

  // Generar un tablero completo válido
  function generateBoard() {
    const board = Array(9).fill().map(() => Array(9).fill(0));
    solveSudoku(board);
    return board;
  }

  // Resolver el Sudoku (algoritmo de backtracking)
  function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) return board;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return board;
  }

  // Verificar si un número es válido en una celda
  function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  // Eliminar números según la dificultad
  function removeNumbers(board, difficulty) {
    let cellsToRemove;
    switch (difficulty) {
      case 'easy':
        cellsToRemove = 40;
        break;
      case 'medium':
        cellsToRemove = 50;
        break;
      case 'hard':
        cellsToRemove = 60;
        break;
      default:
        cellsToRemove = 40;
    }
    while (cellsToRemove > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (board[row][col] !== 0) {
        board[row][col] = 0;
        cellsToRemove--;
      }
    }
  }

  // Renderizar el tablero en el HTML
  function renderBoard(board) {
    grid.innerHTML = '';
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = document.createElement('div');
        cell.classList.add('sudoku-cell');
        if (board[row][col] !== 0) {
          cell.textContent = board[row][col];
          cell.classList.add('fixed');
        } else {
          const input = document.createElement('input');
          input.type = 'text';
          input.maxLength = 1;
          input.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value >= 1 && value <= 9) {
              board[row][col] = value;
            } else {
              e.target.value = '';
              board[row][col] = 0;
            }
          });
          cell.appendChild(input);
        }
        grid.appendChild(cell);
      }
    }
  }

  // Verificar la solución del jugador
  function checkSolution() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== solution[row][col]) {
          status.textContent = '¡Solución incorrecta!';
          return;
        }
      }
    }
    status.textContent = '¡Felicidades! Has resuelto el Sudoku.';
  }

  // Obtener una pista
  function getHint() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          board[row][col] = solution[row][col];
          renderBoard(board);
          status.textContent = 'Pista aplicada.';
          return;
        }
      }
    }
    status.textContent = 'No hay celdas vacías para pistas.';
  }

  // Iniciar el juego
  generateSudoku('easy');
}


// ================================
// JUEGO 10: Pac-Man |
// ================================
function initPacMan() {
  const canvas = document.getElementById('pacman-canvas');
  const ctx = canvas.getContext('2d');
  const scoreElement = document.getElementById('pacman-score');
  const livesElement = document.getElementById('pacman-lives');
  const levelElement = document.getElementById('pacman-level');

  // Configuración del juego
  const tileSize = 20;
  const rows = 20;
  const cols = 20;
  let pacman = { x: 1, y: 1, dir: 'right' };
  let ghosts = [
    { x: 9, y: 9, dir: 'left', color: 'red' },
    { x: 8, y: 9, dir: 'up', color: 'pink' },
    { x: 9, y: 8, dir: 'down', color: 'cyan' },
    { x: 10, y: 9, dir: 'right', color: 'orange' },
  ];
  let dots = [];
  let score = 0;
  let lives = 3;
  let level = 1;
  let gameOver = false;

  // Velocidad de movimiento (en milisegundos)
  const pacmanSpeed = 200; // Pac-Man se mueve cada 200 ms
  const ghostSpeed = 300; // Fantasmas se mueven cada 300 ms

  // Laberinto (0: pared, 1: camino, 2: punto)
  const maze = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  // Inicializar puntos
  function createDots() {
    dots = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (maze[row][col] === 1) {
          dots.push({ x: col, y: row });
        }
      }
    }
  }

  // Reiniciar el juego
  function resetGame() {
    pacman = { x: 1, y: 1, dir: 'right' };
    ghosts = [
      { x: 9, y: 9, dir: 'left', color: 'red' },
      { x: 8, y: 9, dir: 'up', color: 'pink' },
      { x: 9, y: 8, dir: 'down', color: 'cyan' },
      { x: 10, y: 9, dir: 'right', color: 'orange' },
    ];
    score = 0;
    lives = 3;
    level = 1;
    gameOver = false;
    createDots();
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    levelElement.textContent = level;
  }

  // Dibujar el laberinto
  function drawMaze() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (maze[row][col] === 0) {
          ctx.fillStyle = '#0000ff';
          ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
      }
    }
  }

  // Dibujar puntos
  function drawDots() {
    ctx.fillStyle = '#fff';
    dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(
        dot.x * tileSize + tileSize / 2,
        dot.y * tileSize + tileSize / 2,
        3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  }

  // Dibujar Pac-Man
  function drawPacMan() {
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(
      pacman.x * tileSize + tileSize / 2,
      pacman.y * tileSize + tileSize / 2,
      tileSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Dibujar fantasmas
  function drawGhosts() {
    ghosts.forEach(ghost => {
      ctx.fillStyle = ghost.color;
      ctx.beginPath();
      ctx.arc(
        ghost.x * tileSize + tileSize / 2,
        ghost.y * tileSize + tileSize / 2,
        tileSize / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  }

  // Mover Pac-Man
  function movePacMan() {
    let newX = pacman.x;
    let newY = pacman.y;

    if (pacman.dir === 'left') newX--;
    if (pacman.dir === 'right') newX++;
    if (pacman.dir === 'up') newY--;
    if (pacman.dir === 'down') newY++;

    if (maze[newY][newX] !== 0) {
      pacman.x = newX;
      pacman.y = newY;

      // Recolectar puntos
      const dotIndex = dots.findIndex(dot => dot.x === pacman.x && dot.y === pacman.y);
      if (dotIndex !== -1) {
        dots.splice(dotIndex, 1);
        score += 10;
        scoreElement.textContent = score;
      }
    }
  }

  // IA de los fantasmas: Seguir a Pac-Man si está cerca
  function moveGhosts() {
    ghosts.forEach(ghost => {
      const directions = ['left', 'right', 'up', 'down'];
      let bestDir = ghost.dir;
      let minDistance = Infinity;

      // Calcular la distancia a Pac-Man
      const distanceToPacMan = Math.sqrt(
        Math.pow(ghost.x - pacman.x, 2) + Math.pow(ghost.y - pacman.y, 2)
      );

      // Si está cerca, seguir a Pac-Man
      if (distanceToPacMan < 5) {
        directions.forEach(dir => {
          let newX = ghost.x;
          let newY = ghost.y;

          if (dir === 'left') newX--;
          if (dir === 'right') newX++;
          if (dir === 'up') newY--;
          if (dir === 'down') newY++;

          if (maze[newY][newX] !== 0) {
            const distance = Math.sqrt(
              Math.pow(newX - pacman.x, 2) + Math.pow(newY - pacman.y, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              bestDir = dir;
            }
          }
        });
      } else {
        // Moverse aleatoriamente
        bestDir = directions[Math.floor(Math.random() * directions.length)];
      }

      // Mover el fantasma
      let newX = ghost.x;
      let newY = ghost.y;

      if (bestDir === 'left') newX--;
      if (bestDir === 'right') newX++;
      if (bestDir === 'up') newY--;
      if (bestDir === 'down') newY++;

      if (maze[newY][newX] !== 0) {
        ghost.x = newX;
        ghost.y = newY;
        ghost.dir = bestDir;
      }
    });
  }

  // Verificar colisiones con fantasmas
  function checkCollisions() {
    ghosts.forEach(ghost => {
      if (ghost.x === pacman.x && ghost.y === pacman.y) {
        lives--;
        livesElement.textContent = lives;
        if (lives === 0) {
          gameOver = true;
        } else {
          // Reiniciar posición de Pac-Man y fantasmas
          pacman = { x: 1, y: 1, dir: 'right' };
          ghosts = [
            { x: 9, y: 9, dir: 'left', color: 'red' },
            { x: 8, y: 9, dir: 'up', color: 'pink' },
            { x: 9, y: 8, dir: 'down', color: 'cyan' },
            { x: 10, y: 9, dir: 'right', color: 'orange' },
          ];
        }
      }
    });
  }

  // Dibujar el juego
  function draw() {
    drawMaze();
    drawDots();
    drawPacMan();
    drawGhosts();
  }

  // Actualizar el juego
  function update() {
    if (gameOver) {
      alert(`¡Juego terminado! Puntuación final: ${score}`);
      resetGame(); // Reiniciar el juego después de la alerta
      return;
    }

    checkCollisions();
    draw();

    if (dots.length === 0) {
      level++;
      levelElement.textContent = level;
      createDots();
    }
  }

  // Control de teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') pacman.dir = 'left';
    if (e.key === 'ArrowRight') pacman.dir = 'right';
    if (e.key === 'ArrowUp') pacman.dir = 'up';
    if (e.key === 'ArrowDown') pacman.dir = 'down';
  });

  // Iniciar el juego
  resetGame(); // Iniciar el juego por primera vez

  // Control de velocidad
  setInterval(movePacMan, pacmanSpeed); // Mover Pac-Man cada 200 ms
  setInterval(moveGhosts, ghostSpeed); // Mover fantasmas cada 300 ms
  setInterval(update, 100); // Actualizar el juego cada 100 ms
}