// Basic Tetris implementation
// https://en.wikipedia.org/wiki/Tetris

// emun function: https://github.com/RougeWare/Micro-JS-Enum
Enum=function(){v=arguments;s={all:[],keys:v};for(i=v.length;i--;)s[v[i]]=s.all[i]=i;return s}

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
  
  drawBoardOff(element);

  // game loop
  var intervalHandler = setInterval(
    function () {
    if (tetris.loop()) {
      redrawBoard(tetris.getState(), tetris.getBoard(), element);
    }
  }, 
   TICKS_MS);
  
  // key handler
  element.addEventListener('keydown', 
    function(e) {
      if(KEY_LEFT == e.keyCode) {
        tetris.moveTetromino(tetris.moveEnum.Left);
      } else if(KEY_RIGHT == e.keyCode) {
        tetris.moveTetromino(tetris.moveEnum.Right);
      } else if(KEY_ENTER == e.keyCode) {
        if(STATE_ON == tetris.getState() || STATE_PAUSE == tetris.getState()) {
          tetris.togglePauseGame();        
        } else {
          tetris.newGame();
        }
      }
    }
  );
}

/* BOARD LOGIC ****************************************************************/

/**
 * redrawBoard()
 */
function redrawBoard(tetrisState, tetrisBoard, element) {
  element.innerHTML = "";
  drawBoard(tetrisState, tetrisBoard, element);
}

/**
 * drawBoard()
 */
function drawBoard(tetrisState, tetrisBoard, element) {
  var boardDiv = document.createElement('div');
  boardDiv.id = 'board';
  element.appendChild(boardDiv);

  switch (tetrisState) {
    case STATE_OFF:
      //drawBoardOff(tetris, element, boardDiv, tetrisBoard);
      break;
    case STATE_ON:
    case STATE_OVER:
      drawBoardOn(tetrisState, element, boardDiv, tetrisBoard);
      break;
    case STATE_PAUSE:
      drawBoardPaused(tetrisState, element, boardDiv, tetrisBoard);
      break;
  }

}

function drawBoardOff(element) {
  var boardDiv = document.createElement('div');
  boardDiv.id = 'board';
  element.appendChild(boardDiv);

  for(i=0; i<NUM_ROWS; i++) {
    var rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    var rowString = (i<10) ? ("0"+i) : i;
    var headerSpan = document.createElement('span');
    headerSpan.classList.add('headerFooter');
    headerSpan.innerHTML = "r" + rowString + " "; 
    rowDiv.appendChild(headerSpan);

    for(j=0; j<NUM_COLUMNS; j++){
      var blockSpan = document.createElement('span');
      blockSpan.classList.add('empty');
      blockSpan.innerHTML = '0';
      rowDiv.appendChild(blockSpan);
    }

    boardDiv.appendChild(rowDiv);
  }
}

function drawBoardPaused(element, boardDiv) {
  var boardDiv = document.createElement('div');
  boardDiv.id = 'board';
  element.appendChild(boardDiv);

  for(r=0; r<NUM_ROWS; r++) {
    var rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    var rowString = (r<10) ? ("0"+r) : r;
    var headerSpan = document.createElement('span');
    headerSpan.classList.add('headerFooter');
    headerSpan.innerHTML = "r" + rowString + " "; 
    rowDiv.appendChild(headerSpan);

    for(c=0; c<NUM_COLUMNS; c++){
      if (r == (NUM_ROWS/2)) {
        var blockSpan = document.createElement('span');
        blockSpan.classList.add('empty');
        blockSpan.innerHTML = 'P';
        rowDiv.appendChild(blockSpan);
      } else {
        var blockSpan = document.createElement('span');
        blockSpan.classList.add('empty');
        blockSpan.innerHTML = '0';
        rowDiv.appendChild(blockSpan);
      }
    }

    boardDiv.appendChild(rowDiv);
  }
}

function drawBoardOn(tetrisState, element, boardDiv, tetrisBoard) {
  for(i=0; i<NUM_ROWS; i++) {
    var rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    var rowString = (i<10) ? ("0"+i) : i;
    var headerSpan = document.createElement('span');
    headerSpan.classList.add('headerFooter');
    headerSpan.innerHTML = "r" + rowString + " "; 
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

    boardDiv.appendChild(rowDiv);
  }
}

/* GAME LOGIC *****************************************************************/

/**
 * Tetris()
 */
function Tetris() {
  // TODO - make row and column arguments to the Tetris object
  // TODO - move the tetromino shape definitions in here
  // TODO - expose the TICKS_MS as a method from Tetris that changes with level

  // represents the different ways the player can move the tetromino
  this.moveEnum = Enum(
    "RotateClockwise", 
    "RotateCounterClockwise",
    "Right",
    "Left",
    "Drop");

  // represents the different states the game can be in
  this.stateEnum = Enum(
    "Off",
    "On",
    "Paused",
    "Over"
  )

  // current state of the game (of type this.stateEnum)
  var state = STATE_OFF;

  // the current falling tetromino
  var currentTetromino = null;

  // the row of the current falling tetromino (top left corner)
  var currentTetrominoRow = null;

  // the column of the current falling tetromino (top left corner)
  var currentTetrominoCol = null;

  // the wall contains all the fallen tetrominos.
  var wall = [];

  // board holds the combination of the wall and the current tetromio
  var board = [];

  // initialize the wall and the board 2D arrays
  for(r=0; r<NUM_ROWS; r++) {
    wall[r] = [];
    board[r] = [];
    for(c=0; c<NUM_COLUMNS; c++) {
      wall[r][c] = 0;
      board[r][c] = 0;
    }
  }

  /**
   * getBoard() returns the gameboard showing the current tetromino and the wall
   */
  this.getBoard = function() {
    // draw the active tetromino on the board if the game is on or over
    if (STATE_ON == state || STATE_OVER == state) {
      // copy the wall to the board
      for(r=0; r<NUM_ROWS; r++) {
        for(c=0; c<NUM_COLUMNS; c++) {
          board[r][c] = wall[r][c];
        }
      }
      // draw the current tetromino on the board
      for(r=0; r<4; r++) {
        for(c=0; c<4; c++) {
          if (currentTetromino[r][c] == 1) {
            board[currentTetrominoRow+r][currentTetrominoCol+c] = 1;
          }
        }
      }
    } 
    // show an empty board if the game is paused (no cheating!)
    else if (STATE_PAUSE == state) {
      for(r=0; r<NUM_ROWS; r++)
        for(c=0; c<NUM_COLUMNS; c++)
          board[r][c] = 0;
    }

    return board;
  }

  // PUBLIC METHODS (PRIVLIDGED)

  /**
   * getState() returns a Tetris.stateEnum to represent the state of the game
   */
  this.getState = function() {
    return state;
  }

  /**
   * newGame()
   */
  this.newGame = function() {
    if (STATE_OFF != state) {
      console.log('ERROR: Game already in progress.');
      return;
    }

    console.log('Starting new game.');
    state = STATE_ON;
    spawnNewTetromino();
  }

  /**
   * togglePauseGame()
   */
  this.togglePauseGame = function () {
    if (STATE_ON == state) {
      state = STATE_PAUSE;
      console.log('Game paused.');
    } else if(STATE_PAUSE == state) {
      state = STATE_ON;
      console.log('Game resumed.');
    }
  }

  /**
   * moveTetromino() returns true if the tetromino was moved, or false if the
   * requested move was invalid. 
   * 
   * @@direction - Tetris.moveEnum for list of moves the player can make
   */
  this.moveTetromino = function(direction) {
    var newRow = currentTetrominoRow;
    var newCol = currentTetrominoCol;
    var newTetromino = currentTetromino;

    switch (direction) {
      case this.moveEnum.RotateClockwise:
        break;
      case this.moveEnum.RotateCounterClockwise:
        break;
      case this.moveEnum.Left:
        newCol--;
        break;
      case this.moveEnum.Right:
        newCol++;
        break;
      case this.moveEnum.Drop:
        break;
    }

    var didTetrominoMove = isMovePossible(newTetromino, newRow, newCol);
    if (didTetrominoMove) {
      currentTetrominoRow = newRow;
      currentTetrominoCol = newCol;
      currentTetromino = newTetromino;
    }

    return didTetrominoMove;
  }

  /**
   * gameLooop() returns true if the game status has changed, false if it 
   *  hasn't.
   */
  this.loop = function() {
    if (STATE_ON != state) {
      return false;
    }

    console.log('Game loop running.');

    var canMoveDown = isMovePossible(currentTetromino, currentTetrominoRow+1, 
      currentTetrominoCol);
    
    if (canMoveDown) {
      currentTetrominoRow++;
    } else {
      addTetrominoToWall();
    }

    return true;
  }

  // PRIVATE METHODS

  /**
   * addTetrominoToWall() adds the current tetromino to the wall and spawns a 
   *  new tetromino.
   */
  function addTetrominoToWall() {
    // Add tetromino to wall
    for (r=0; r<4; r++) {
      for (c=0; c<4; c++) {
        if (currentTetromino[r][c] == 1) {
          wall[currentTetrominoRow+r][currentTetrominoCol+c] = 1;
        }
      }
    }
  
    spawnNewTetromino();
  }

  /**
   * spawnNewTetromino() 
   */
  function spawnNewTetromino() {
    console.log('Creating a new tetromino.');
    var initialRow = 0;
    var initialColumn = (NUM_COLUMNS/2)-2;

    if (isMovePossible(tetrominoO, initialRow, initialColumn)) {
      currentTetromino = tetrominoO;
      currentTetrominoRow = 0;
      currentTetrominoCol = initialColumn;
    } else {
      state = STATE_OFF;
    }
  }

  /**
   * isMovePossible() returns true if the new move is possible.
   * 
   * @@tetromino - a 2d array representing the tetromino
   * @@moveRow - the row where the tetromino is to be placed
   * @@moveColumn - the column where the tetromino is to be placed
   */
  function isMovePossible(tetromino, moveRow, moveColumn) {
    for (r=0; r<4; r++) {
      for (c=0; c<4; c++) {
        if (tetromino[r][c] == 1) {
          var boardRow = moveRow + r;
          var boardCol = moveColumn + c;

          // is the tetromino exceeding the bottom of the board?
          if (boardRow > (NUM_ROWS-1))
            return false;

          // is the tetromino exceeding the left or right boundaries?
          if (boardCol < 0 || boardCol > (NUM_COLUMNS-1))
            return false;

          // is the tetromino exceeding part of the wall?
          if (wall[boardRow][boardCol] == 1)
            return false;
        }
      }
    }

    return true;
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
}