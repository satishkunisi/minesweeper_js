(function (root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});

  var BOARDSIZE = Minesweeper.BOARDSIZE = 20;
  var MINES = Minesweeper.MINES = 50;

  var GameUI = Minesweeper.GameUI = function (rootEl) {
    this.board = new Minesweeper.Board({
      boardSize: BOARDSIZE,
      mines: MINES
    });
    
    this.rootEl = rootEl;
  };

  GameUI.prototype.countAsWord = function (num) {
    var value;

    switch (num) {
      case 1:
        value = "one";
        break;
      case 2:
        value = "two";
        break;
      case 3:
        value = "three";
        break;
      case 4:
        value = "four";
        break;
      case 5:
        value = "five";
        break;
      case 6:
        value = "six";
        break;
      case 7:
        value = "seven";
        break;
      case 8:
        value = "eight";
        break;
    }

    return value;
  };

  GameUI.prototype.flagTile = function (tile) {
    tile.toggleFlag();

    var row = tile.pos[0];
    var col = tile.pos[1];

    var tileDiv = $('div[data-row="' + row + '"][data-col="' + col + '"]');

    if (tile.isFlagged) {
      tileDiv.removeClass('unrevealed').addClass('flagged').html("⚑");
    } else {
      tileDiv.removeClass('flagged').addClass('unrevealed').html('');
    }
  };

  GameUI.prototype.reveal = function (tile) {
    var that = this;

    var row = tile.pos[0];
    var col = tile.pos[1];

    var tileDiv = $('div[data-row="' + row + '"][data-col="' + col + '"]');

    if (tile.isMine || (!tileDiv.hasClass('unrevealed')) || tile.isFlagged) {
      return;
    } else if (tile.adjacentMines > 0) {
      var countAsWord = this.countAsWord(tile.adjacentMines);
      tileDiv.removeClass('unrevealed').addClass(countAsWord).html(tile.render()) ;

      return;
    } else {
      tileDiv.removeClass('unrevealed').addClass('revealed');
      
      setTimeout(function () {
        tile.getNeighbors().forEach(function (neighbor) {
          that.reveal(neighbor);
        });
      }, 100);
     
    }
  };

  GameUI.prototype.buildGrid = function () {
    var that = this;

    this.rootEl.html('');

    this.board.grid.forEach(function (row) {
      row.forEach(function (tile) {
        var currentTile = $('<div>').addClass('unrevealed');
        currentTile.attr('data-row', tile.pos[0]).attr('data-col', tile.pos[1]);
        that.rootEl.append(currentTile);
      });
    });
  };

  GameUI.prototype.revealBoard = function () {
    var that = this;

    this.rootEl.html('');

    this.board.grid.forEach(function (row) {
      row.forEach(function (tile) {
        var currentTile = $('<div>').removeClass('unrevealed');
        if (tile.isMine) {
          currentTile.addClass('mine').html(tile.render());
        } else if (tile.adjacentMines > 0) {
          currentTile.addClass(that.countAsWord(tile.adjacentMines));
          currentTile.html(tile.render());
        } else {
          currentTile.addClass('revealed');
        }
        that.rootEl.append(currentTile);
      });
    });
  };

  GameUI.prototype.handleAction = function (tile) {
    var action = $('#flag').is(':checked') ? "flag" : "reveal";

    if (action == "reveal" && !tile.isFlagged && !tile.isRevealed) {
      this.handleReveal(tile);
    } else if (action == "flag" && !tile.isRevealed) {
      this.flagTile(tile);
    }

    this.checkGameStatus();
  };

  GameUI.prototype.handleReveal = function (tile) {
    tile.reveal();

    if (tile.isMine) {
      this.revealBoard();
    } else {
      this.reveal(tile);
    }
  };

  GameUI.prototype.checkGameStatus = function () {
    var gameOverMsg = this.board.isOver();
    if (gameOverMsg) {
      $(this.rootEl).off();

      this.board.revealAllTiles();

      alert('Game over. You ' + gameOverMsg + '!');
    }
  }

  GameUI.prototype.setBoardListener = function () {
    var that = this;

    $(this.rootEl).on("mousedown", function (event) {
      event.preventDefault();

      var row = $(event.target).data('row');
      var col = $(event.target).data('col');
      var tile = that.board.getPos(row, col);
      
      that.handleAction(tile);
    })
  };

  GameUI.prototype.setButtonListener = function () {
    var that = this;

    $('button').on("click", function (event) {
      event.preventDefault();

      that.board = new Minesweeper.Board({
        boardSize: BOARDSIZE,
        mines: MINES
      });

      $(that.rootEl).off();
      that.buildGrid();
      that.setBoardListener(); 
    });
  };

  GameUI.prototype.start = function () {
    var that = this;
    
    this.buildGrid();
    this.setBoardListener();
    this.setButtonListener();
  };

})(this);

$(function () {
  var gameUI = new Minesweeper.GameUI($('#game-board'));
  gameUI.start();
});
