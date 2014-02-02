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
  }

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

  GameUI.prototype.render = function () {
    var that = this;

    this.rootEl.html('');

    this.board.grid.forEach(function (row) {
      row.forEach(function (tile) {
        var currentTile = $('<div>');

        if (tile.isRevealed) {
          currentTile.removeClass('unrevealed');
          currentTile.html(tile.render());

          
          if (tile.isMine) {
            currentTile.addClass('mine');
          } else if (tile.adjacentMines > 0) {
            var adjClass = that.countAsWord(tile.adjacentMines);
            currentTile.addClass(adjClass).addClass('revealed');
          } else {
            currentTile.addClass('revealed')
          }

        } else {
          currentTile.addClass('unrevealed')
        }

        currentTile.data('row', tile.pos[0]).data('col', tile.pos[1]);
        that.rootEl.append(currentTile);
      });
    })
  };

  GameUI.prototype.setBoardListener = function () {
    var that = this;

    $('button').attr('disabled', true);

    $(this.rootEl).on("click", function (event) {
      event.preventDefault();

      var row = $(event.target).data('row');
      var col = $(event.target).data('col');
      var tile = that.board.getPos(row, col);

      tile.reveal();

      setTimeout(function () {
        that.render();
        if (that.board.isOver()) {
          $(that.rootEl).off();
          alert('Game over.');
          $('button').removeAttr('disabled');
        }
      }, 50)
    })
  },

  GameUI.prototype.setButtonListener = function () {
    var that = this;

    $('button').on("click", function (event) {
      event.preventDefault();

      that.board = new Minesweeper.Board({
        boardSize: BOARDSIZE,
        mines: MINES
      });

      that.render();
      that.setBoardListener(); 
    });
  },

  GameUI.prototype.start = function () {
    var that = this;
    
    this.render();
    this.setBoardListener();
    this.setButtonListener();

  };

})(this);

$(function () {
  var gameUI = new Minesweeper.GameUI($('#game-board'));
  gameUI.start();
});
