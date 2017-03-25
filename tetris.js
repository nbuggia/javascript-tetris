// https://scotch.io/bar-talk/4-javascript-design-patterns-you-should-know

// Basic Tetris implementation

function tetrisRun(element) {
  let tetrisGame = new TetrisGame(element);
  tetrisGame.drawGame();
  
  // game loop
  let intervalHandler = setInterval(
    function () {
      if (tetrisGame.loop()) {
        tetrisGame.redrawGame();
      }
    }, 
    tetrisGame.getTicks()
  );
  
  // key handler
  document.body.addEventListener('keydown', 
    function(e) {
      tetrisGame.keyHandler(e);
    }
  ); 
}

/* BOARD LOGIC ****************************************************************/

/**
 * TetrisGame() - implements a user interface to play Tetris
 * 
 * @@ document - reference to the HTML document
 * @@ elementId - the id for the div inside which the Tetris game will be 
 *  rendered. If the div doesn't exist, we'll create it.
 */
function TetrisGame(elementId) {
  // Class for the Tetris game logic
  let tetris = new Tetris();

  // hard coded keys
  const keyLeft = 37;
  const keyRight = 39;
  const keyUp = 38;
  const keyDown = 40;
  const keySpacebar = 32;
  const keyEnter = 13;  

  // ID's for the various HTML divs we create and use
  const gameElementId = elementId;
  const boardElementId = 'board';

  // The HTML div where we will render the game
  let gameElement = document.getElementById(gameElementId);
  if (gameElement === null) {
    gameElement = document.createElement('div');
    gameElement.id = gameElementId;
    document.body.appendChild(gameElement);
  }

  // the HTML div where we will render various features of the game
  let boardElement = null;
  let scoreElement = null;
  let stateElement = null;
  let nextTetrominoElement = null;

  // PUBLIC METHODS (PRIVLIDGED)

  /**
   * drawGame()
   */
  this.drawGame = function() {
    boardElement = document.createElement('div');
    boardElement.id = boardElementId;
    drawBoard(boardElement);
    gameElement.appendChild(boardElement);

    console.log(boardElement);
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
    return tetris.loop();
  }

  /**
   * getTicks()
   */
  this.getTicks = function() {
    return tetris.getTicks();
  }

  /**
   * getGameElement()
   */
  this.getGameElement = function() {
    return this.gameElement;
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

  // PROTECTED METHODS

  /**
   * drawBoard()
   */
  function drawBoard(boardElement) {
    let board = tetris.getBoard();

    for (r=0; r<tetris.getNumRows(); r++) {
      // create a row and a label for the row "r01 "
      let rowDiv = document.createElement('div');
      rowDiv.classList.add('row');
      let rowLabelSpan = document.createElement('span');
      rowLabelSpan.classList.add('headerFooter');
      rowLabelSpan.innerHTML = `r${(r<10) ? ('0'+r) : r} `; 
      rowDiv.appendChild(rowLabelSpan);

      // fill in the board grid with the right shape and color
      for (c=0; c<tetris.getNumCols(); c++){
        let blockSpan = document.createElement('span');
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

      boardElement.appendChild(rowDiv);
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

function Tetris(rows, columns) {
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
  this.stateEnum = Enum("Off", "On", "Paused", "Over");

  // used to index each of the tetrominos
  this.tetrominoEnum = Enum("O", "I", "T", "J", "L", "S", "Z");

  // color for the index for each of the tetrominos
  // https://en.wikipedia.org/wiki/Tetris#Colors_of_Tetriminos
  this.tetrominoColorEnum = Enum(
    "Yellow", "Cyan", "Purple",  "Blue", "Orange", "Lime", "Red"
  );

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
  this.numRows = rows || 16;
  this.numCols = columns || 10;

  // the time interval before a block will fall to the next row down (gravity)
  this.ticksMs = 400;

  // current state of the game (of type this.stateEnum)
  this.state = this.stateEnum.Off;

  // the current falling tetromino
  this.currentTetromino = null;

  // the row of the current falling tetromino (top left corner)
  this.currentTetrominoRow = null;

  // the column of the current falling tetromino (top left corner)
  this.currentTetrominoCol = null;

  // used to hold Tk upcoming tetromino pieces
  this.tetrominoBag = [];

  // the wall contains all the fallen tetrominos. Board holds the combination of 
  //  the wall and the current tetromio
  this.wall = [];
  this.board = [];

  for (r=0; r<this.numRows; r++) {
    this.wall[r] = [];
    this.board[r] = [];
    for (c=0; c<this.numCols; c++) {
      this.wall[r][c] = this.blank;
      this.board[r][c] = this.blank;
    }
  }

  // METHODS

  this.getState = function() {return this.state;}
  this.getNumRows = function() {return this.numRows;}
  this.getNumCols = function() {return this.numCols;}
  this.getTicks = function() {return this.ticksMs;}

  /**
   * getBoard() returns the gameboard showing the current tetromino and the wall
   */
  this.getBoard = function() {
    // draw the active tetromino on the board if the game is on or over
    if (this.state == this.stateEnum.On || this.state == this.stateEnum.Over) {
      // copy the wall to the board
      for (r=0; r<this.numRows; r++) {
        for (c=0; c<this.numCols; c++) {
          this.board[r][c] = this.wall[r][c];
        }
      }
      // draw the current tetromino on the board
      for (r=0; r<4; r++) {
        for (c=0; c<4; c++) {
          if (this.blank != this.currentTetromino[r][c]) {
            this.board[this.currentTetrominoRow+r][this.currentTetrominoCol+c] = 1;
          }
        }
      }
    } 

    // show an empty board if the game is paused (no cheating!) or off
    else if (this.state == this.stateEnum.Pause || this.state == this.stateEnum.Off) {
      for (r=0; r<this.numRows; r++) {
        for (c=0; c<this.numCols; c++) {
          this.board[r][c] = this.blank;
        }
      }
    }

    return this.board;
  }

  /**
   * newGame()
   */
  this.newGame = function() {
    if (this.state != this.stateEnum.Off && this.state != this.stateEnum.Over) {
      console.log('ERROR: Game already in progress.');
      return;
    }

    console.log('Starting new game.');
    this.resetGame();
    this.state = this.stateEnum.On;
    this.spawnNewTetromino();
  }

  /**
   * togglePauseGame() toggles the game state between paused and unpaused
   */
  this.togglePauseGame = function () {
    if (this.state == this.stateEnum.On) {
      this.state = this.stateEnum.Pause;
      console.log('Game paused.');
    } else if (this.state == this.stateEnum.Pause) {
      this.state = this.stateEnum.On;
      console.log('Game resumed.');
    }
  }

  /**
   * gameLooop() updates the state of the game based on one turn passing. 
   *  Returns true if the game state has changed, false if it hasn't.
   */
  this.loop = function() {
    if (this.state != this.stateEnum.On) return false;

    console.log('Game loop running.');

    var canMoveDown = this.isMovePossible(
      this.currentTetromino, 
      this.currentTetrominoRow+1, 
      this.currentTetrominoCol
    );
    
    if (canMoveDown) {
      this.currentTetrominoRow++;
    } else {
      this.addTetrominoToWall();
    }

    return true;
  }

  /**
   * resetGame() - sets all the variables to play the game from the beginning.
   */
  this.resetGame = function() {
    this.state = this.stateEnum.Off;
    this.currentTetromino = null;
    this.currentTetrominoRow = null;
    this.currentTetrominoCol = null;
    this.wall = [];
    this.board = [];

    this.resetWallAndBoard();
  }

  /**
   * getNextTetromino() - 
   */
  this.getNextTetromino = function() {
    if (this.tetrominoBag.length == 0) {
      // refill the bag with two sets of every tetromino piece
      this.tetrominoBag.push( 
        tetrominos[this.tetrominoEnum.O], 
        tetrominos[this.tetrominoEnum.O],
        tetrominos[this.tetrominoEnum.I],
        tetrominos[this.tetrominoEnum.I],
        tetrominos[this.tetrominoEnum.J],
        tetrominos[this.tetrominoEnum.J],
        tetrominos[this.tetrominoEnum.L],
        tetrominos[this.tetrominoEnum.L],
        tetrominos[this.tetrominoEnum.T],
        tetrominos[this.tetrominoEnum.T],
        tetrominos[this.tetrominoEnum.S],
        tetrominos[this.tetrominoEnum.S],
        tetrominos[this.tetrominoEnum.Z],
        tetrominos[this.tetrominoEnum.Z]
      );        
      
      // shuffle the pieces in a statistically reasonable way
      // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
      var swapIndex, temp;
      for (i=this.tetrominoBag.length-1; i>0; i--) {
        swapIndex = Math.floor(Math.random() * i);
        temp = this.tetrominoBag[swapIndex];
        this.tetrominoBag[i] = this.tetrominoBag[swapIndex];
        this.tetrominoBag[swapIndex] = temp;
      }
    }

    // return the top entry and remove it from the bag
    return this.tetrominoBag.splice(0, 1)[0];
  }

  /**
   * addTetrominoToWall() adds the current tetromino to the wall and spawns a 
   *  new tetromino.
   */
  this.addTetrominoToWall = function() {
    // Add tetromino to wall
    for (r=0; r<4; r++) {
      for (c=0; c<4; c++) {
        if (this.currentTetromino[r][c] != this.blank) {
          this.wall[this.currentTetrominoRow+r][this.currentTetrominoCol+c] = 1;
          // TODO preserve the color of the tetromino
        }
      }
    }
  
    this.spawnNewTetromino();
  }

  /**
   * spawnNewTetromino() 
   */
  this.spawnNewTetromino = function() {
    console.log('Creating a new tetromino.');
    var initialRow = 0;
    var initialColumn = (this.numCols/2)-2;
    var newTetromino = this.getNextTetromino();

    if (this.isMovePossible(newTetromino, initialRow, initialColumn)) {
      this.currentTetromino = newTetromino;
      this.currentTetrominoRow = 0;
      this.currentTetrominoCol = initialColumn;
    } else {
      this.state = this.stateEnum.Over;
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
  this.isMovePossible = function(tetromino, moveRow, moveColumn) {
    for (r=0; r<4; r++) {
      for (c=0; c<4; c++) {
        if (tetromino[r][c] != this.blank) {
          var boardRow = moveRow + r;
          var boardCol = moveColumn + c;

          // is the tetromino exceeding the bottom of the board?
          if (boardRow > (this.numRows-1))
            return false;

          // is the tetromino exceeding the left or right boundaries?
          if (boardCol < 0 || boardCol > (this.numCols-1))
            return false;

          // is the tetromino overlapping any part of the wall?
          if (this.wall[boardRow][boardCol] != this.blank)
            return false;
        }
      }
    }

    return true;
  }

  /**
   * rotate() rotates the tetromino 90 degrees counter-clockwise
  */
  this.rotate = function(t) {
      return [
      [t[0][3], t[1][3], t[2][3], t[3][3]],
      [t[0][2], t[1][2], t[2][2], t[3][2]],
      [t[0][1], t[1][1], t[2][1], t[3][1]],
      [t[0][0], t[1][0], t[2][0], t[3][0]],
      ];
  }
}

/**
 * resetWallAndBoard() - sets all the variables to play the game from the beginning.
 */
Tetris.prototype.resetWallAndBoard = function() {
  // TODO - do I need to explicity check if they don't equal null, then free
  //  memory and try again
  for (r=0; r<this.numRows; r++) {
    this.wall[r] = [];
    this.board[r] = [];
    for (c=0; c<this.numCols; c++) {
      this.wall[r][c] = this.blank;
      this.board[r][c] = this.blank;
    }
  }
}

/**
 * moveTetromino() returns true if the tetromino was moved, or false if the
 * requested move was invalid. 
 * 
 * @@direction - Tetris.moveEnum for list of moves the player can make
 */
Tetris.prototype.moveTetromino = function(direction) {
  var newRow = currentTetrominoRow;
  var newCol = currentTetrominoCol;
  var newTetromino = currentTetromino;

  if (state != this.stateEnum.On) return false;

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

  var didTetrominoMove = this.isMovePossible(newTetromino, newRow, newCol);
  if (didTetrominoMove) {
    this.currentTetrominoRow = newRow;
    this.currentTetrominoCol = newCol;
    this.currentTetromino = newTetromino;
  }

  return didTetrominoMove;
}

