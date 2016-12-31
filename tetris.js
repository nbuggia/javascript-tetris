// Basic Tetris implementation
// https://en.wikipedia.org/wiki/Tetris

/**
 * TODO - I need to add a method to Tetris to add a tetromino to the board, and also remove
 * that tetromino so I can add it again in its new location. I also need to figure out where
 * to insert the isMovePossible() function to gate the game from getting into a broken state.
 */

// Standard board size for a tetris game
const NUM_COLUMNS = 10;
const NUM_ROWS = 16;

// The height and width of a block (they are all squares)
const BLOCK_SIZE = 30;

const TICKS_MS = 400;

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_SPACEBAR = 32;
const KEY_ENTER = 13;

// The game can only be in one of these states at a time.
const STATE_OFF = 0;
const STATE_ON = 1;
const STATE_OVER = 2;
const STATE_PAUSE = 3;

const tetrominoO = [
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0],
];

const tetrominoI = [
  [0, 0, 1, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 0],
];

const tetrominoT = [
  [0, 0, 0, 0],
  [0, 1, 1, 1],
  [0, 0, 1, 0],
  [0, 0, 0, 0],
];

const tetrominoJ = [
  [0, 0, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 0],
  [0, 1, 1, 0],
];

const tetrominoS = [
  [0, 0, 0, 0],
  [0, 0, 1, 1],
  [0, 1, 1, 0],
  [0, 0, 0, 0],
];

const tetrominoZ = [
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 0, 1, 1],
  [0, 0, 0, 0],
];

/**
 * tetrisRun()
 */
function tetrisRun(element) {
  var tetris = new Tetris();
  
  // game loop
  var intervalHandler = setInterval(
    function () {
    if (tetris.loop()) {
      redrawBoard(tetris, element);
    }
  }, 
   TICKS_MS);
  
  // key handler
  element.addEventListener('keydown', 
    function(e) {
      if(KEY_LEFT == e.keyCode) {
        alert('left');
      } else if(KEY_RIGHT == e.keyCode) {
        alert('right');
      } else if(KEY_ENTER == e.keyCode) {
        tetris.newGame();
      } else {
        ;
      }
    }
  );
}

/* BOARD LOGIC ***********************************************************************************************/

/**
 * redrawBoard()
 */
function redrawBoard(tetris, element) {
  element.innerHTML("");

  drawBoard(tetris, element);
}

/**
 * drawBoard()
 */
function drawBoard(tetris, element) {
  var boardDiv = document.createElement('div');
  
  boardDiv.id = 'board';
  element.appendChild(boardDiv);

  for(i=0; i<10; i++) {
    for(j=0; j<10; j++){
      var blockDiv = document.createElement('div');
      blockDiv.style.top = (i*BLOCK_SIZE) + 'px';
      blockDiv.style.left = (j*BLOCK_SIZE) + 'px';
      blockDiv.style.height = BLOCK_SIZE;
      blockDiv.style.width = BLOCK_SIZE;

      if(tetris.board[i][j] == 1) {
        blockDiv.classList.add('block');
      } else {
        blockDiv.classList.add('empty');
      }

      boardDiv.appendChild(blockDiv);
    }
  }
}

/* GAME LOGIC ***********************************************************************************************/

/**
 * Tetris()
 */
function Tetris() {
  this.state = STATE_OFF;
  this.currentTetromino = null;
  this.currentTetrominoRow = null;
  this.currentTetrominoCol = null;

  // initialize the board
  this.board = [];
  for(i=0; i<NUM_ROWS; i++) {
    this.board[i] = [];
    for(j=0; j<NUM_COLUMNS; j++) {
      this.board[i][j] = 0;
    }
  }
}

/**
 * rotate() rotates the tetromino 90 degrees counter-clockwise
 */
function rotate(t) {
    return [
    [t[0][3], t[1][3], t[2][3], t[3][3]],
    [t[0][2], t[1][2], t[2][2], t[3][2]],
    [t[0][1], t[1][1], t[2][1], t[3][1]],
    [t[0][0], t[1][0], t[2][0], t[3][0]],
    ];
}

/**
 * spawnNewTetromino()
 */
Tetris.prototype.spawnNewTetromino = function() {
  console.log('Creating a new tetromino.');
  this.currentTetromino = tetrominoO;
  this.currentTetrominoRow = 0;
  this.currentTetrominoCol = (NUM_COLUMNS/2)-2;

  // Check if this new piece is legal. If not, change the state of the game.
}

/**
 * newGame()
 */
Tetris.prototype.newGame = function() {
  if (STATE_OFF != this.state) {
    console.log('ERROR: Game already in progress.');
    return;
  }

  console.log('Starting new game.');
  this.state = STATE_ON;
  this.spawnNewTetromino();
}

/**
 * isMovePossible()
 */
Tetris.prototype.isMovePossible = function() {
  return true;
}

/**
 * gameLooop()
 */
Tetris.prototype.loop = function() {
  if (STATE_ON != this.state) {
    return false;
  }

  console.log('Game loop running.');
  this.currentTetrominoRow++;
}