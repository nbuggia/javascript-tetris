// Basic Tetris implementation
// https://en.wikipedia.org/wiki/Tetris

// Standard board size for a tetris game
const NUM_COLUMNS = 10;
const NUM_ROWS = 16;

// The height and width of a block (they are all squares)
const BLOCK_SIZE = 30;

const TICKS_MS = 1000; //400

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
        if(STATE_ON == tetris.state) {
          tetris.pauseGame();        
        } else if (STATE_PAUSE == tetris.state) {
          tetris.unPauseGame();
        } else {
          tetris.newGame();
        }
      }
    }
  );
}

/* BOARD LOGIC ***********************************************************************************************/

/**
 * redrawBoard()
 */
function redrawBoard(tetris, element) {
  element.innerHTML = "";
  drawBoard(tetris, element);
}

/**
 * drawBoard()
 */
function drawBoard(tetris, element) {
  var boardDiv = document.createElement('div');
  var tetrisBoard = tetris.getBoard();
  boardDiv.id = 'board';
  element.appendChild(boardDiv);

  for(i=0; i<NUM_ROWS; i++) {
    var rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    var rowString = (i<10) ? ("0"+i) : i;
    var headerSpan = document.createElement('span');
    headerSpan.classList.add('headerFooter');
    headerSpan.innerHTML = "r:" + rowString + "|"; 
    rowDiv.appendChild(headerSpan);

    for(j=0; j<NUM_COLUMNS; j++){
      var blockSpan = document.createElement('span');

      if(tetrisBoard[i][j] == 1) {
        blockSpan.classList.add('occupied');
        blockSpan.innerHTML = '1';
      } else {
        blockSpan.classList.add('empty');
        blockSpan.innerHTML = '0';
      }

      rowDiv.appendChild(blockSpan);
    }

    var footerSpan = document.createElement('span');
    footerSpan.classList.add('headerFooter');
    footerSpan.innerHTML = "|  "; 
    rowDiv.appendChild(footerSpan);

    boardDiv.appendChild(rowDiv);
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

  // initialize the wall. The wall contains all the fallen tetrominos.
  this.wall = [];
  this.board = [];
  for(r=0; r<NUM_ROWS; r++) {
    this.wall[r] = [];
    this.board[r] = [];
    for(c=0; c<NUM_COLUMNS; c++) {
      this.wall[r][c] = 0;
      this.board[r][c] = 0;
    }
  }
}

/**
 * getBoard()
 */
Tetris.prototype.getBoard = function() {
  // draw the active tetromino on the board if the game is on or over
  if (STATE_ON == this.state || STATE_OVER == this.state) {
    // copy the wall to the board
    for(r=0; r<NUM_ROWS; r++) {
      for(c=0; c<NUM_COLUMNS; c++) {
        this.board[r][c] = this.wall[r][c];
      }
    }
    // draw the current tetromino on the board
    for(r=0; r<4; r++) {
      for(c=0; c<4; c++) {
        if (this.currentTetromino[r][c] == 1) {
          this.board[this.currentTetrominoRow+r][this.currentTetrominoCol+c] = 1;
        }
      }
    }
  } 
  
  // show an empty board if the game is paused (no cheating!)
  else if (STATE_PAUSE == this.state) {
    for(i=0; i<NUM_ROWS; i++) {
      for(j=0; j<NUM_COLUMNS; j++) {
        this.board[i][j] = 0;
        // TODO - if we are in the middle row, write the word 'PAUSED'
        //  hit 'enter' to resume game.
      }
    }
  }

  return this.board;
}

/**
 * spawnNewTetromino()
 */
Tetris.prototype.spawnNewTetromino = function() {
  console.log('Creating a new tetromino.');
  this.currentTetromino = tetrominoO;
  this.currentTetrominoRow = 0;
  this.currentTetrominoCol = (NUM_COLUMNS/2)-2;

  // Check if placing this new piece is legal. If not, change the state of the game.
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
 * pauseGame()
 */
Tetris.prototype.pauseGame = function () {
  this.state = STATE_PAUSE;
}

/**
 * unPauseGame()
 */
Tetris.prototype.unPauseGame = function () {
  this.state = STATE_ON;
}

/**
 * isMovePossible() returns true if the new move is possible
 */
Tetris.prototype.isMovePossible = function() {
  return true;
}

/**
 * gameLooop() returns true if the game status has changed, false if it hasn't.
 */
Tetris.prototype.loop = function() {
  if (STATE_ON != this.state) {
    return false;
  }

  console.log('Game loop running.');
//  this.currentTetrominoRow++;
  return true;
}

/**
 * rotate() rotates the tetromino 90 degrees counter-clockwise
function rotate(t) {
    return [
    [t[0][3], t[1][3], t[2][3], t[3][3]],
    [t[0][2], t[1][2], t[2][2], t[3][2]],
    [t[0][1], t[1][1], t[2][1], t[3][1]],
    [t[0][0], t[1][0], t[2][0], t[3][0]],
    ];
}
 */
