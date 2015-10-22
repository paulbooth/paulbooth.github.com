
var tableWidth = 50, tableHeight = 10;
var intervalTime = 50;

function Letter(letter, destX, destY, href) {
  this.letter = letter;
  this.destX = destX;
  this.destY = destY;
  this.x = Math.floor(Math.random() * tableWidth);
  this.y = Math.floor(Math.random() * tableHeight);
  this.iter = 0;
  this.href = href;

  this.step = function(oldMap, newMap) {
    var newX = x = this.x, newY = y = this.y, destY = this.destY, destX = this.destX;

    function moveX() {
      if (newX == x) {
        if (y < destY) {
          newY = y + 1;
        } else if (y > destY) {
          newY = y - 1;
        }
        if (oldMap[newX][newY]) {
          newY = y;
        }
      }
    }

    function moveY() {
      if (newY == y) {
        if (x < destX) {
          newX = x + 1;
        } else if (x > destX) {
          newX = x - 1;
        }
        if (oldMap[newX][newY]) {
          newX = x;
        }
      }
    }

    if (Math.random() < .5) {
      moveX();
      moveY();
    } else {
      moveY();
      moveX();
    }
    
    if (newY == this.y && newX == this.x && (this.x != this.destX || this.y != this.destY)) {
      if (Math.random() < .5) {
        newX = this.x + (Math.random() < .5 ? 1 : -1);
      } else {
        newY = this.y + (Math.random() < .5 ? 1 : -1);
      }
    }

    if (oldMap[newX][newY]) {
      newY = this.y;
      newX = this.x;
    }
    if (newX != this.destX || newY != this.destY) {
      this.iter += 1;
      if (this.iter > 90 + Math.random() * 20) {
        do {
          newX = Math.floor(Math.random() * tableWidth);
          newY = Math.floor(Math.random() * tableHeight);
        } while (oldMap[newX][newY]);
        this.iter = 0;
        console.log("LOL, looks like " + this.letter + " needs some help...");
      }
    }
    this.x = newX;
    this.y = newY;
    newMap[this.x][this.y] = this;
    return this.x == this.destX && this.y == this.destY;
  }
}

function SimulationRunner() {

  this.getLetters = function(word, startX, startY, href) {
    return $.map(word.split(''), function(letter, i) {
      return new Letter(letter, startX + i, startY, href);
    })
  }

  this.drawTable = function() {
    var $businessCard = $("#business_card");
    $businessCard.empty();
    for (var y = 0; y < tableHeight; y++) {
      var $tr = $('<tr></tr>');
      for (var x = 0; x < tableWidth; x++) {
        var $td;
        if (this.map[x][y]) {
          $td = $('<a href="' + this.map[x][y].href + '">' + this.map[x][y].letter + '</a>');
        } else {
          $td = $('<td></td>');
        }
        $tr.append($td);
      }
      $businessCard.append($tr);
    }
  }

  this.getNewMap = function() {
    var map = new Array(tableWidth);
    for (var i = 0; i < tableWidth; i++) {
      map[i] = new Array(tableHeight);
    }
    return map;
  }

  this.iterate = function() {
    var newMap = this.getNewMap();
    var map = this.map;
    var done = true;
    $.each(this.letters, function(i, l) {
      var stepDone = l.step(map, newMap);
      done = done && stepDone;
    });
    this.map = newMap;
    this.drawTable();
    return done;
  }

  this.map = this.getNewMap();
  this.letters = this.getLetters("Paul Booth", 4, 3, "http://t.co/thepaulbooth")
      .concat(this.getLetters("GitHub", 4, 5, "https://github.com/paulbooth"))
      .concat(this.getLetters("thepaulbooth@gmail.com", 4, 7, "mailto:thepaulbooth@gmail.com"))
      .concat(this.getLetters("LinkedIn", 18, 5, "https://www.linkedin.com/in/thepaulbooth"))
      .concat(this.getLetters("R\u00E9sum\u00E9", 20, 3, "./static/Paul_Booth_Resume.pdf"))
}

$(window).ready(function() {
  simulationRunner = new SimulationRunner();
  var interval = setInterval(function() {
    var done = simulationRunner.iterate();
    if (done) {
      console.log("aahhhh... the card is complete!");
      clearInterval(interval);
    }
  }, intervalTime);
});