// Basic Tetris implementation

/**
 * tetrisRun()
 */
function tetrisRun(element) {
  var tetrisBoard = new TetrisBoard(element);
  tetrisBoard.drawBoard();
  
  // game loop
  var intervalHandler = setInterval(
    function () {
      if (tetrisBoard.loop()) {
        tetrisBoard.redrawBoard();
      }
    }, 
    tetrisBoard.getTicks()
  );
  
  // key handler
  element.addEventListener('keydown', tetrisBoard.keyHandler()); 
}

/* BOARD LOGIC ****************************************************************/

/**
 * TetrisBoard() - implements a user interface to play Tetris
 */
function TetrisBoard(element) {
  // Class for the Tetris game logic
  var tetris = new Tetris();

  // The HTML div where we will render the game
  var gameElement = element;

  // the HTML div where we will render the tetris board
  var boardElement = null;

  // ID's for the various HTML divs we create and use
  const gameElementId = "tetrisGame";
  const boardElementId = "board";

  // hard coded keys
  const keyLeft = 37;
  const keyRight = 39;
  const keyUp = 38;
  const keyDown = 40;
  const keySpacebar = 32;
  const keyEnter = 13;

  // PUBLIC METHODS (PRIVLIDGED)

  /**
   * drawGame()
   */
  this.drawGame = function() {
    boardElement = document.createElement('div');
    boardElement.id = boardElementId;
    drawBoard();
    
    gameElement.appendChild(boardElement);
  }

  /**
   * redrawGame()
   */
  this.redrawGame = function() {
    gameElement.innerHTML = "";
    this.drawGame();
  }

  /**
   * loop()
   */
  this.loop = function() {
    tetris.loop();
  }

  /**
   * getTicks()
   */
  this.getTicks = function() {
    tetris.getTicks();
  }

  /**
   * keyHandler()
   */
  this.keyHandler = function(keyEvent) {
    switch (keyEvent.keyCode) {
      case keyLeft:
        tetris.moveTetromino(tetris.moveEnum.Left);
        break;
      case keyRight:
        tetris.moveTetromino(tetris.moveEnum.Right);
        break;
      case keyDown:
        tetris.moveTetromino(tetris.moveEnum.Down);
        break;
      case keyEnter:
      case keySpacebar:
        if (tetris.stateEnum.On == tetris.getState() 
            || tetris.stateEnum.Pause == tetris.getState()) {
          tetris.togglePauseGame();        
        } else {
          tetris.newGame();
        }
        break;
    }
  }

  // PRIVATE METHODS

  /**
   * drawBoard()
   */
  function drawBoard() {
    var board = tetris.getBoard();

    for(r=0; r<tetris.getNumRows(); r++) {
      // create a row and a label for the row "r01 "
      var rowDiv = document.createElement('div');
      rowDiv.classList.add('row');
      var rowString = (r<10) ? ("0"+r) : r;
      var headerSpan = document.createElement('span');
      headerSpan.classList.add('headerFooter');
      headerSpan.innerHTML = "r" + rowString + " "; 
      rowDiv.appendChild(headerSpan);

      // if game is paused or off, then fill the board with tetris.blank
      // TODO

      // fill in the board grid with the right shape and color
      for(c=0; c<tetris.getNumCols(); c++){
        var blockSpan = document.createElement('span');
        switch (board[r][c]) {
          case tetris.tetrominoEnum.O:
            blockSpan.classList.add(
              tetris.tetrominoColorEnum.keys[tetrominoColorEnum.Yellow]
            );
            blockSpan.innerHTML = '0';
            break;
          case tetris.tetrominoEnum.I:
            blockSpan.classList.add('Cyan');
            blockSpan.innerHTML = '1';
            break;
          case tetris.tetrominoEnum.T:
            blockSpan.classList.add('Purple');
            blockSpan.innerHTML = '2';
            break;
          case tetris.tetrominoEnum.J:
            blockSpan.classList.add('Blue');
            blockSpan.innerHTML = '3';
            break;
          case tetris.tetrominoEnum.L:
            blockSpan.classList.add('Orange');
            blockSpan.innerHTML = '4';
            break;
          case tetris.tetrominoEnum.S:
            blockSpan.classList.add('Lime');
            blockSpan.innerHTML = '5';
            break;
          case tetris.tetrominoEnum.Z:
            blockSpan.classList.add('Red');
            blockSpan.innerHTML = '6';
            break;
          case tetris.blank:
            blockSpan.classList.add('empty');
            blockSpan.innerHTML = '9';
            break;
        }

        rowDiv.appendChild(blockSpan);
      }

      boardDiv.appendChild(rowDiv);
    }
  }

  /**
   * drawScore()
   */
  function drawScore() { }

  /**
   * drawState()
   */
  function drawState() { }

  /**
   * drawStats()
   */
  function drawStats() { }

  /**
   * drawNextTetromino()
   */
  function drawNextTetromino() { }
}


/* GAME LOGIC *****************************************************************/

/**
 * Tetris() - implements all the game logic and state management
 *            https://en.wikipedia.org/wiki/Tetris
 */
function Tetris(numRows, numCols) {
  // emun function: https://github.com/RougeWare/Micro-JS-Enum
  Enum=function(){v=arguments;s={all:[],keys:v};for(i=v.length;i--;)s[v[i]]=s.all[i]=i;return s}
  
  // represents the different ways the player can move the tetromino
  this.moveEnum = Enum(
    "RotateClockwise", 
    "RotateCounterClockwise",
    "Right",
    "Left",
    "Down");

  // represents the different states the game can be in
  this.stateEnum = Enum(
    "Off",
    "On",
    "Paused",
    "Over"
  )

  // used to index each of the tetrominos
  this.tetrominoEnum = Enum(
    "O", "I", "T", "J", "L", "S", "Z"
  )

  // color for the index for each of the tetrominos
  // https://en.wikipedia.org/wiki/Tetris#Colors_of_Tetriminos
  this.tetrominoColorEnum = Enum(
    "Yellow", "Cyan", "Purple",  "Blue", "Orange", "Lime", "Red"
  )

  // grids to represent each tetromino shape. Number is the index in 
  // tetrominoEnum, and cross references with tetrominoColorEnum
  const tetrominos =
    [[[9, 0, 0, 9],
      [9, 0, 0, 9],
      [9, 9, 9, 9],
      [9, 9, 9, 9]],
     [[9, 9, 1, 9],
      [9, 9, 1, 9],
      [9, 9, 1, 9],
      [9, 9, 1, 9]],
     [[9, 2, 2, 2],
      [9, 9, 2, 9],
      [9, 9, 9, 9],
      [9, 9, 9, 9]],
     [[9, 9, 3, 3],
      [9, 3, 3, 9],
      [9, 9, 9, 9],
      [9, 9, 9, 9]],
     [[9, 4, 4, 9],
      [9, 9, 4, 4],
      [9, 9, 9, 9],
      [9, 9, 9, 9]],
     [[9, 9, 5, 9],
      [9, 9, 5, 9],
      [9, 5, 5, 9],
      [9, 9, 9, 9]],
     [[9, 6, 9, 9],
      [9, 6, 9, 9],
      [9, 6, 6, 9],
      [9, 9, 9, 9]]];

  // used to represent blank spaces in the board and tetromino grids
  this.blank = 9;

  // Standard board size for a tetris game
  var numRows = numRows || 16;
  var numCols = numCols || 10;

  // the time interval before a block will fall to the next row down (gravity)
  var ticksMs = 400;

  // current state of the game (of type this.stateEnum)
  var state = this.stateEnum.Off;

  // the current falling tetromino
  var currentTetromino = null;

  // the row of the current falling tetromino (top left corner)
  var currentTetrominoRow = null;

  // the column of the current falling tetromino (top left corner)
  var currentTetrominoCol = null;

  // used to hold Tk upcoming tetromino pieces
  var tetrominoBag = [];

  // the wall contains all the fallen tetrominos.
  var wall = [];

  // board holds the combination of the wall and the current tetromio
  var board = [];

  resetGame();
  
  // PUBLIC METHODS (PRIVLIDGED)

  /**
   * getBoard() returns the gameboard showing the current tetromino and the wall
   */
  this.getBoard = function() {
    // draw the active tetromino on the board if the game is on or over
    if (this.stateEnum.On == state || this.stateEnum.Over == state) {
      // copy the wall to the board
      for (r=0; r<numRows; r++) {
        for (c=0; c<numCols; c++) {
          board[r][c] = wall[r][c];
        }
      }
      // draw the current tetromino on the board
      for (r=0; r<4; r++) {
        for (c=0; c<4; c++) {
          if (this.blank != currentTetromino[r][c]) {
            board[currentTetrominoRow+r][currentTetrominoCol+c] = 1;
          }
        }
      }
    } 
    // show an empty board if the game is paused (no cheating!)
    else if (this.stateEnum.Pause == state) {
      for(r=0; r<numRows; r++)
        for(c=0; c<numCols; c++)
          board[r][c] = this.blank;
    }

    return board;
  }

  this.getState = function() {return state;}
  this.getNumRows = function() {return numRows;}
  this.getNumCols = function() { return numCols;}
  this.getTicks = function() {return ticksMs;}

  /**
   * newGame()
   */
  this.newGame = function() {
    if (this.stateEnum.Off != state && this.stateEnum.Over != state) {
      console.log('ERROR: Game already in progress.');
      return;
    }

    console.log('Starting new game.');
    resetGame();
    state = this.stateEnum.On;
    spawnNewTetromino();
  }

  /**
   * togglePauseGame()
   */
  this.togglePauseGame = function () {
    if (this.stateEnum.On == state) {
      state = this.stateEnum.Pause;
      console.log('Game paused.');
    } else if(this.stateEnum.Pause == state) {
      state = this.stateEnum.On;
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

    if (this.stateEnum.On != state) {
      return false;
    }

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
      case this.moveEnum.Down:
        newRow++;
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
    if (this.stateEnum.On != state) {
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
   * resetGame() - sets all the variables to play the game from the beginning.
   */
  function resetGame() {
    state = this.stateEnum.Off;
    currentTetromino = null;
    currentTetrominoRow = null;
    currentTetrominoCol = null;
    wall = [];
    board = [];

    // initialize the wall and the board 2D arrays
    for(r=0; r<numRows; r++) {
      wall[r] = [];
      board[r] = [];
      for(c=0; c<numCols; c++) {
        wall[r][c] = this.blank;
        board[r][c] = this.blank;
      }
    }
  }

  /**
   * getNextTetromino() - 
   */
  function getNextTetromino() {
    if (0 == tetrominoBag.length) {
      // refill the bag with two sets of every tetromino piece
      tetrominoBag.push( 
        tetrominos[tetrominoEnum.O], 
        tetrominos[tetrominoEnum.O],
        tetrominos[tetrominoEnum.I],
        tetrominos[tetrominoEnum.I],
        tetrominos[tetrominoEnum.J],
        tetrominos[tetrominoEnum.J],
        tetrominos[tetrominoEnum.L],
        tetrominos[tetrominoEnum.L],
        tetrominos[tetrominoEnum.T],
        tetrominos[tetrominoEnum.T],
        tetrominos[tetrominoEnum.S],
        tetrominos[tetrominoEnum.S],
        tetrominos[tetrominoEnum.Z],
        tetrominos[tetrominoEnum.Z]
      );        
      
      // shuffle the pieces in a statistically reasonable way
      // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
      var j, temp;
      for (i=tetrominoBag.length-1; i>0; i--) {
        j = Math.floor(Math.random() * i);
        temp = tetrominoBag[j];
        tetrominoBag[i] = tetrominoBag[j];
        tetrominoBag[j] = temp;
      }
    }

    // return the top entry and remove it from the bag
    return tetrominoBag.splice(0, 1)[0];
  }


  /**
   * addTetrominoToWall() adds the current tetromino to the wall and spawns a 
   *  new tetromino.
   */
  function addTetrominoToWall() {
    // Add tetromino to wall
    for (r=0; r<4; r++) {
      for (c=0; c<4; c++) {
        if (this.blank != currentTetromino[r][c]) {
          wall[currentTetrominoRow+r][currentTetrominoCol+c] = 1;
          // TODO preserve the color of the tetromino
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
    var initialColumn = (numCols/2)-2;
    var newTetromino = getNextTetromino();

    if (isMovePossible(newTetromino, initialRow, initialColumn)) {
      currentTetromino = newTetromino;
      currentTetrominoRow = 0;
      currentTetrominoCol = initialColumn;
    } else {
      state = this.stateEnum.Over;
      console.log('Game over, you lose :(');
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
        if (this.blank != tetromino[r][c]) {
          var boardRow = moveRow + r;
          var boardCol = moveColumn + c;

          // is the tetromino exceeding the bottom of the board?
          if (boardRow > (numRows-1))
            return false;

          // is the tetromino exceeding the left or right boundaries?
          if (boardCol < 0 || boardCol > (numCols-1))
            return false;

          // is the tetromino overlapping any part of the wall?
          if (this.blank != wall[boardRow][boardCol])
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
