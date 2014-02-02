(function (root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});



  var Tile = Minesweeper.Tile = function (options) {
    this.isMine = false;
    this.isFlagged = false;
    this.isRevealed = false;
    this.board = options.board;
    this.pos = options.pos;
    this.adjacentMines = 0;
  };

  Tile.prototype.toggleFlag = function () {
    this.isFlagged = !this.isFlagged;
  }

  Tile.prototype.reveal = function () {
    var that = this;

    if (this.isRevealed) {
      return;
    } else {
      this.isRevealed = true;
    } 

    if (this.isMine) {
      return;
    } 

    this.countAdjacentMines();
    if (this.adjacentMines > 0) {
      return;
    }

    this.getNeighbors().forEach(function (tile) {
      tile.reveal();
    })

  };

  Tile.prototype.setMine = function () {
    this.isMine = true;
  };

  Tile.prototype.getNeighbors = function () {
    var that = this;
    var deltas = [[-1, -1], 
                  [-1, 0], 
                  [-1, 1], 
                  [0, -1], 
                  [0, 0], 
                  [0, 1], 
                  [1, -1], 
                  [1, 0], 
                  [1, 1]];
    var neighbors = [];

    deltas.forEach(function (delta) {
      var newRow = that.pos[0] + delta[0];
      var newCol = that.pos[1] + delta[1];

      if (that.board.inBounds(newRow, newCol)) {
        neighbors.push(that.board.getPos(newRow, newCol));
      }
    });

    return neighbors;
  };

  Tile.prototype.countAdjacentMines = function () {
    var that = this;
    var neighborMines = 0;

    this.getNeighbors().forEach(function (neighbor) {
      if (neighbor.isMine) {
        neighborMines++;
      }
    });

    this.adjacentMines = neighborMines;
  };

  Tile.prototype.render = function () {
    if (this.isMine) {
      return "M";
    } else if (this.adjacentMines > 0) {
      return this.adjacentMines;
    }
  };




  var Board = Minesweeper.Board = function (options) {
    this.boardSize = options.boardSize;
    this.grid = this.makeGrid(options.boardSize);
    this.numMines = options.mines;
    this.seedMines();
  };

  Board.prototype.makeGrid = function (boardSize) {
    var grid = [];
    var counter = 0;

    for (var i = 0; i < boardSize; i++) {
      var row = [];
      for (var j = 0; j < boardSize; j++) {
        row.push(new Tile({
          board: this, 
          pos: [i, j],
          tileId: counter
        }));
        counter++;
      }
      grid.push(row);
    }

    return grid;
  };

  Board.prototype.getPos = function (row, col) {
    return this.grid[row][col];
  };

  Board.prototype.inBounds = function (row, col) {
    return (row >= 0 && row < this.boardSize) && (col >= 0 && col < this.boardSize);
  }

  Board.prototype.getRandCoords = function () {
    var row = Math.floor(this.grid.length * Math.random(this.grid.length));
    var col = Math.floor(this.grid.length * Math.random(this.grid.length));

    return [row, col];
  };

  Board.prototype.seedMines = function () {

    var minesSet = 0;

    while (minesSet < this.numMines) {
      var randCoords = this.getRandCoords();
      var tile = this.grid[randCoords[0]][randCoords[1]];

      if (!tile.isMine) {
        tile.setMine();
        minesSet++;
      }
    }

  };

  Board.prototype.getMines = function () {
    allTheMines = [];

    this.grid.forEach(function (row) {
      row.forEach(function (tile) {
        if (tile.isMine) {
          allTheMines.push(tile);
        }
      });
    });

    return allTheMines;
  };

  Board.prototype.hasMineExploded = function () {
    var hasExploded = false;

    this.getMines().forEach(function (mineTile) {
      if (mineTile.isRevealed) {
        hasExploded = true;
      }
    });

    return hasExploded;
  };

  Board.prototype.allMinesFlagged = function () {
    var allFlagged = true;

    this.getMines().forEach(function (mineTile) {
      if (!mineTile.isFlagged) {
        allFlagged = false;
      }
    })

    return allFlagged;
  };

  Board.prototype.isOver = function () {
    if (this.hasMineExploded()) {
      return "lost";
    } else if (this.allMinesFlagged()) {
      return "won";
    } 
  };

  Board.prototype.revealAllTiles = function () {
    this.grid.forEach(function (row) {
      row.forEach(function (tile) {
        (!tile.isRevealed) && (tile.isRevealed = true);
      });
    });
  }


})(this);
