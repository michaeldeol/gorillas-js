
  // CONSTANSTS
  var APP_WIDTH   = 640,
      APP_HEIGHT  = 350;


  var Gorilla, Banana, Building, Sun, App, Shape;

  Shape = (function () {

    function Shape ( context ) {
      this.context = context;
    }

    Shape.prototype.circle = function ( x, y, width ) {
      this.context.beginPath();
      this.context.arc( x, y, width, 0, Math.PI * 2, true );
      this.context.closePath();
      return this.context.fill();
    };

    Shape.prototype.rectangle = function ( x, y, w, h ) {
      this.context.fillRect( x, y, w, h );
    };

    Shape.prototype.ellipse = function ( x, y, w, h ) {
      var kappa, ox, oy, xe, ye, xm, ym;
      kappa = 0.5522848;
      ox = (w / 2) * kappa;
      oy = (h / 2) * kappa;
      xe = x + w;
      ye = y + h;
      xm = x + w / 2;
      ym = y + h / 2;

      this.context.beginPath();
      this.context.moveTo( x, ym );
      this.context.bezierCurveTo( x, ym - oy, xm - ox, y, xm, y );
      this.context.bezierCurveTo( xm + ox, y, xe, ym - oy, xe, ym );
      this.context.bezierCurveTo( xe, ym + oy, xm + ox, ye, xm, ye );
      this.context.bezierCurveTo( xm - ox, ye, x, ym + oy, x, ym );
      this.context.closePath();
      this.context.fill();
    };

    return Shape;

  }());

  Sun = (function () {

    var SUN_BODY_COLOR, SUN_EYES_COLOR;
    SUN_BODY_COLOR = "rgb( 255, 255, 0 )";
    SUN_EYES_COLOR = "rgb( 0, 0, 160 )";

    function Sun ( context ) {
      this.context = context;
      this.mouth = false;
      this.width = 10;
      this.height = 27;
      this.position = ( APP_WIDTH / 2 );
    }

    Sun.prototype.create = function ( hit ) {
      if ( hit ) this.mouth = true;
      this.createRays();
      this.createBody();
      this.createEyes();
      this.createMouth();
    };

    Sun.prototype.createBody = function () {

      // create shape for use with body
      var shape = new Shape( this.context );

      // TODO: See if we should extract this or leave it here
      this.context.fillStyle = SUN_BODY_COLOR;

      // create body shape
      shape.circle( this.position, this.height, this.width );

    };

    Sun.prototype.createEyes = function () {

      // create shape for use with eyes
      var shape = new Shape( this.context );

      // TODO: See if we should extract this or leave it here
      this.context.fillStyle = SUN_EYES_COLOR;

      // create left eye
      shape.circle( this.position - 2.5, this.height - 2.5, 1 );

      // create right eye
      shape.circle( this.position + 2.5, this.height - 2.5, 1 );

    };

    Sun.prototype.createRays = function () {
      function createRay ( a ) {
        this.context.moveTo( this.position, this.height );
        return this.context.lineTo( this.position + 20 * Math.cos(a), this.height + 20 * Math.sin(a) );
      }
      this.context.strokeStyle = SUN_BODY_COLOR;
      this.context.beginPath();
      this.context.lineWidth = 1;
      for (var i = 0; i < 16; i++) {
        createRay.call( this, 360 * i / 4.5 );
      }
      this.context.stroke();
    };

    Sun.prototype.createMouth = function () {
      this.context.fillStyle = SUN_BODY_COLOR;
      this.context.strokeStyle = SUN_EYES_COLOR;
      if ( this.mouth ) {
        this.context.fillStyle = SUN_EYES_COLOR;
        var shape = new Shape( this.context );
        shape.circle( this.position, this.height + 5, this.width / 4 );
      } else {
        this.context.beginPath();
        this.context.arc( this.position, this.height + 1, this.width / 2, 0.25, 2.9, false );
        this.context.stroke();
      }
    };

    return Sun;

  }());

  Building = (function () {

    function Building ( context, canvasHeight ) {
      this.context = context;
      this.canvasHeight = canvasHeight;
      this.width = 37 + Math.floor( Math.random() * 70 );
      this.baseHeight = 80;
      this.baseLine = 335;
      this.spacing = 1;
      this.windowHeight = 7;
      this.windowWidth = 4;
      this.buildingColors = ['rgb( 173, 170, 173 )', 'rgb( 0, 170, 173 )', 'rgb( 173, 0, 0 )'];
      this.buildingColor = null;
      this.windows = [];
      this.colissions = [];
    }

    Building.prototype.positionAtX = function () {
      return this.x;
    };

    Building.prototype.positionAtY = function () {
      return this.canvasHeight - this.height;
    };

    Building.prototype.endPosition = function () {
      return this.positionAtX() + this.width + this.spacing;
    };

    Building.prototype.middlePosition = function () {
      return this.positionAtX() + ( this.endPosition() - this.positionAtX() ) / 2;
    };

    Building.prototype.create = function ( x, y ) {
      this.x = x;
      this.y = y;
      this.buildingColor = this.buildingColor || this.buildingColors[ Math.floor(Math.random() * (3 - 0) + 0) ];
      this.context.fillStyle = this.buildingColor;
      this.height = this.baseHeight + y;
      this.context.fillRect( this.positionAtX(), this.baseLine - this.height, this.width, this.height );
      this.createWindows( this.positionAtX(), this.positionAtY() );
    };

    Building.prototype.reCreate = function () {
      this.create( this.x, this.y );
    };

    Building.prototype.createWindows = function ( x, y ) {
      var rows, windowsPerFloor, currentDistance, totalHeight, results, w, winLength, winRef, i;
      if ( this.windows.length > 0 ) {
        winRef = this.windows;
        for ( i = 0, winLength = winRef.length; i < winLength; i++ ) {
          w = winRef[i];
          this.createWindow( w[0], w[1], w[2] );
        }
        return;
      }
      rows = Math.round( this.width + this.windowWidth );
      windowsPerFloor = Math.floor( this.width / this.windowWidth + this.windowHeight );
      for ( var row = 3; row < Math.floor( this.width - 11 + this.windowWidth ); row += 11 ) {
        for ( var column = 3; column < Math.floor( this.height - 15 ); column += 15 ) {
          this.color = ( Math.floor(Math.random() * 5) > 0 ) ? 'rgb( 255, 255, 82 )' : 'rgb( 82, 85, 82 )';
          this.createWindow( x + 1 + row, Math.floor( (this.baseLine - this.height) + 1 + column ), this.color );
          this.windows.push( [x + 1 + row, Math.floor( (this.baseLine - this.height) + 1 + column ), this.color] );
        }
      }
    };

    Building.prototype.createWindow = function ( x, y, color ) {
      this.context.fillStyle = color;
      this.context.fillRect( x, y, this.windowWidth, this.windowHeight );
    };

    Building.prototype.checkColission = function ( x, y ) {
      if ( this.positionAtY() - 25 <= y && ( x > this.x && x < this.x + this.width + 10 ) ) {
        this.colissions.push( [x - 20, y] );
        this.createColission( x - 20, y );
        return true;
      }
      return false;
    };

    Building.prototype.createColission = function ( x, y ) {
      var width, height, shape;
      width = 25;
      height = 15;
      this.context.fillStyle = 'rgb( 0, 0, 160 )';
      shape = new Shape( this.context );
      shape.ellipse( x, y, width, height );
    };

    Building.prototype.reCreateColissions = function () {
      if ( this.colissions.length > 0 ) {
        for ( var i = 0; i < this.colissions.length; i++ ) {
          var colission = this.colissions[i];
          this.createColission( colission[0], colission[1] );
        }
      }
    };

    return Building;

  }());

  Gorilla = (function () {

    // STATIC PRIVATES
    var BODY_COLOR = 'rgb( 255, 170, 82 )',
        BODY_LINE  = 'rgb( 0, 0, 160 )';

    function Gorilla ( context, playerNumber ) {
      this.context = context;
      this.playerNumber = playerNumber;
      this.width = 40;
      this.height = 40;
      this.wins = 0;
      this.dead = false;
      this.animate = false;
      this.directionRight = 'down';
      this.directionLeft = 'up';
      this.animations = 0;
      this.explosionWidth = this.width;
      this.explosionHeight = this.height;
      this.oldY = false;
      this.timer = 0;
      this.justThrown = false;
    }

    Gorilla.prototype.create = function ( x, y ) {

      if ( this.dead ) {
        this.renderDead();
        return;
      }

      this.x = x;

      // We need to keep the Gorillas in the same spot when re-rendering
      if ( !this.oldY ) {
        this.oldY = true;
        this.y = y - 47; // Move the Gorilla up out of the building
      } else {
        this.y = y;
      }

      // Draw the Head
      this.context.fillStyle = BODY_COLOR;
      this.context.fillRect( this.x - 4, this.y,  7, 7 );
      this.context.fillRect( this.x - 5, this.y + 2, 9, 3 );

      // Draw the eyes/brow
      this.context.fillStyle = BODY_LINE;
      this.context.fillRect( this.x - 3, this.y + 2, 5, 1 );
      this.context.fillRect( this.x - 3, this.y + 4, 2, 1 );
      this.context.fillRect( this.x, this.y + 4, 2, 1 );

      // Draw the Neck
      this.context.fillStyle = BODY_COLOR;
      this.context.fillRect( this.x - 3, this.y + 7, 5, 1 );

      // Draw the Body
      this.context.fillRect( this.x - 9, this.y + 8, 17, 7 );
      this.context.fillRect( this.x - 7, this.y + 15, 13, 6 );

      // Draw the Legs
      for ( var i = 0; i < 4; i++ ) {
        this.context.strokeStyle = BODY_COLOR;
        this.context.beginPath();
        // Left Leg
        this.context.arc( this.x + 2 + i, this.y + 25, 10, 3 * Math.PI / 4, 9 * Math.PI / 8, false );
        this.context.stroke();
        this.context.beginPath();
        // Right Leg
        this.context.arc( this.x - 3 - i, this.y + 25, 10, 15 * Math.PI / 8, Math.PI / 4, false );
        this.context.stroke();
      }

      // Draw the Chest
      this.context.strokeStyle = BODY_LINE;
      this.context.beginPath();
      this.context.arc( this.x - 5, this.y + 10, 4.9, 0, 3 * Math.PI / 5, false );
      this.context.stroke();
      this.context.beginPath();
      this.context.arc( this.x + 4, this.y + 10, 4.9, 3 * Math.PI / 7, 4 * Math.PI / 4, false );
      this.context.stroke();

      if ( this.animate ) {
        // DANCE GORILLA DANCE!!!
        if ( this.directionLeft === 'up' ) {
            this.animateArms( 'leftArm', [15, 3 * Math.PI / 4, 5 * Math.PI / 4, false], ( this.directionLeft === 'down' ) ? 'up' : 'down' );
        } else {
            this.animateArms( 'leftArm', [5, 3 * Math.PI / 4, 5 * Math.PI / 4, false], ( this.directionLeft === 'up' ) ? 'down' : 'up' );
        }

        if ( this.directionRight === 'up' ) {
            this.animateArms( 'rightArm', [15, 7 * Math.PI / 4, Math.PI / 4, false], ( this.directionRight === 'down' ) ? 'up' : 'down' );
        } else {
            this.animateArms( 'rightArm', [5, 7 * Math.PI / 4, Math.PI / 4, false], ( this.directionRight === 'up' ) ? 'down' : 'up' );
        }
      } else {
        // Draw the Arms
        // default for now... both arms down
        for ( var i = -5; i < -1; i++ ) {
          this.context.strokeStyle = BODY_COLOR;
          this.context.beginPath();
          // Left Arm
          this.context.arc( this.x + 1 + i , this.y + 15, 9, 3 * Math.PI / 4, 5 * Math.PI / 4, false );
          this.context.stroke();
          this.context.beginPath();
          // Right Arm
          this.context.arc( this.x - 2 - i , this.y + 15, 9, 7 * Math.PI / 4, Math.PI / 4, false );
          this.context.stroke();
        }
      }
    };

    Gorilla.prototype.animateArms = function ( arm, arc, direction ) {
      this.context.strokeStyle = BODY_COLOR;
      for ( var i = -5; i < -1; i++ ) {
        if ( arm === 'leftArm' ) {
          this.context.beginPath();
          this.context.arc( this.x + 1 + i , this.y + arc[0], 9, arc[1], arc[2], arc[3] );
          this.context.stroke();
        }
        if ( arm === 'rightArm' ) {
          this.context.beginPath();
          this.context.arc( this.x - 2 - i , this.y + arc[0], 9, arc[1], arc[2], arc[3] );
          this.context.stroke();
        }
      }
      if ( arm === 'leftArm' ) this.directionLeft = direction;
      if ( arm === 'rightArm' ) this.directionRight = direction;
    };

    Gorilla.prototype.reCreate = function () {
      this.create( this.x, this.y );
    };

    Gorilla.prototype.getBanana = function ( force, angle ) {
      this.banana = new Banana( this.context, this.x, this.y - 17, force, angle );
    };

    Gorilla.prototype.renderDead = function () {
      this.context.fillStyle = 'rgb( 0, 0, 160 )';
      var shape = new Shape( this.context );
      shape.ellipse( this.x - this.width * 2, this.y, 2.5 * this.explosionWidth, this.explosionHeight );
    };

    Gorilla.prototype.animateColission = function () {
      this.context.fillStyle = 'rgb( 245, 11, 11 )';
      this.explosionWidth += 20;
      this.explosionHeight += 20;
      var width = this.explosionWidth;
      var height = this.explosionHeight;
      var shape = new Shape( this.context );
      shape.ellipse( this.x - this.width * 2, this.y, 2.5 * width, height );
    };

    Gorilla.prototype.throwBanana = function ( time, justThrown ) {

      // TODO: This needs to be fixed... At the moment, the down position does not clear out
      if ( !this.justThrown ) {
        if ( this.playerNumber === 2 && justThrown === true ) {
          // Animate RIGHT Hand
          if ( this.directionRight === 'up' ) {
              this.animateArms( 'rightArm', [15, 7 * Math.PI / 4, Math.PI / 4, false], ( this.directionRight === 'down' ) ? 'up' : 'down' );
          } else {
              this.animateArms( 'rightArm', [5, 7 * Math.PI / 4, Math.PI / 4, false], ( this.directionRight === 'up' ) ? 'down' : 'up' );
          }
          // console.log( 'RIGHT Hand:', time, justThrown );
        } else if ( justThrown === true ) {
          // Animate LEFT Hand
          if ( this.directionLeft === 'up' ) {
              this.animateArms( 'leftArm', [15, 3 * Math.PI / 4, 5 * Math.PI / 4, false], ( this.directionLeft === 'down' ) ? 'up' : 'down' );
          } else {
              this.animateArms( 'leftArm', [5, 3 * Math.PI / 4, 5 * Math.PI / 4, false], ( this.directionLeft === 'up' ) ? 'down' : 'up' );
          }
          // console.log( 'LEFT Hand:', time, justThrown );
        }
      }
      // this.justThrown = ( justThrown ) ? true : false;
      this.banana.createFrame( time, this.playerNumber );
    };

    Gorilla.prototype.checkColission = function ( x, y ) {
      if ( this.y <= y && x > this.x - this.width / 2 && x < this.x + this.width / 2 ) {
        this.dead = true;
        return true;
      }
      return false;
    };

    Gorilla.prototype.animateWin = function () {
      // TODO: make sure gorilla does his dance
      this.animations++;
    };

    return Gorilla;

  }());

  Banana = (function () {

    // Constructor
    function Banana ( context, initx, inity, force, angle ) {
      this.context = context;
      this.initx = initx;
      this.inity = inity;
      this.force = force;
      this.angle = angle;
      this.projectionX = 0;
      this.projectionY = 0;
      this.scale = 0.09;
      this.gravity = 9.8; // TODO: Make this something the user can change
      this.calcInitialPosition();
      this.startTime = 0;
      this.wind = 15; // TODO: Make this dynamic
      this.direction = 'up';
      this.timer = 0;
    }

    Banana.prototype.x = function () {
      return this.initx + this.projectionX;
    };

    Banana.prototype.y = function () {
      return this.inity - this.projectionY;
    };

    Banana.prototype.create = function ( player ) {
      this.context.fillStyle = 'rgb( 255, 255, 0 )';
      this.context.strokeStyle = 'rgb( 255, 255, 0 )';
      var direction = this.direction;
      switch ( direction ) {
        case 'up':
          this.rotateBanana( [1.6 * Math.PI, 0.4 * Math.PI, false], ( player === 2 ) ? 'right' : 'left' );
          break;
        case 'right':
          this.rotateBanana( [1.1 * Math.PI, 1.9 * Math.PI, false], ( player === 2 ) ? 'down' : 'up' );
          break;
        case 'down':
          this.rotateBanana( [0.6 * Math.PI, 1.4 * Math.PI, false], ( player === 2 ) ? 'left' : 'right' );
          break;
        case 'left':
          this.rotateBanana( [0.1 * Math.PI, 0.9 * Math.PI, false], ( player === 2 ) ? 'up' : 'down' );
          break;
      }
    };

    Banana.prototype.rotateBanana = function ( arc, direction ) {
      for ( var i = -5; i < -1; i++ ) {
        this.context.beginPath();
        this.context.arc( this.x() + 1 + i , this.y() + 15, 3, arc[0], arc[1], arc[2] );
        this.context.stroke();
      }
      if ( !(this.timer < 5) ) {
        this.direction = direction;
        this.timer = 0;
      } else {
        this.timer++;
      }
    };

    Banana.prototype.createFrame = function ( time, player ) {
      this.startTime = time;
      this.create( player );
      this.calcProjection();
    };

    Banana.prototype.calcInitialPosition = function () {
      var radian = this.angle * Math.PI / 180;
      this.dx = this.force * Math.cos( radian );
      this.dy = this.force * Math.sin( radian ) - this.gravity * this.startTime;
    };

    Banana.prototype.calcProjection = function () {
      this.calcInitialPosition();
      this.projectionX += this.dx * this.scale;
      this.projectionY += this.dy * this.scale;
    };

    return Banana;

  }());

  App = (function () {

    function App () {
      this.empty = true;
      this.canvas = document.getElementById('canvas');
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.context = this.canvas.getContext('2d');
      this.sunShock = false;
      this.winner = [];
      this.scores = {
        player_1: 0,
        player_2: 0
      };
      this.buildings = [];
      this.frameRate = 15; // Note, this may change
    }

    App.prototype.createScene = function () {
      this.clear();
      this.createSun();
      if ( this.empty ) {
        this.empty = false;
        this.createBuildings();
        this.createGorillas();
      } else {
        this.reCreateBuildings();
        this.reCreateColissions();
        this.reCreateGorillas();
      }
      this.updateScore();
    };

    App.prototype.createBuildings = function () {
      var position = 0;
      while ( position < this.width ) {
        var building = this.createBuilding( position );
        position = building.endPosition();
      }
    };

    App.prototype.createBuilding = function ( x ) {
      var building = new Building( this.context, this.height );
      var y = Math.floor( Math.random() * 150 );
      building.create( x, y );
      this.buildings.push( building );
      return building;
    };

    App.prototype.reCreateBuildings = function () {
      for ( var i = 0; i < this.buildings.length; i++ ) {
        this.buildings[i].reCreate();
      }
    };

    App.prototype.reCreateColissions = function () {
      for ( var i = 0; i < this.buildings.length; i++ ) {
        this.buildings[i].reCreateColissions();
      }
    };

    App.prototype.createSun = function () {
      var sun = new Sun( this.context );
      if ( this.sunShock ) {
        sun.create( true );
      } else {
        sun.create();
      }
    };

    App.prototype.clear = function () {
      return this.canvas.width = this.canvas.width;
    };

    App.prototype.clearTimeouts = function () {
      clearTimeout( this.timeout );
    };

    App.prototype.createGorillas = function () {
      var buildingOnePosition, buildingTwoPosition, building;

      buildingOnePosition = Math.floor( Math.random() * this.buildings.length / 2 );
      building = this.buildings[ buildingOnePosition ];
      this.player_1 = new Gorilla( this.context, 1 );
      this.player_1.create( building.middlePosition(), building.positionAtY() );

      buildingTwoPosition = Math.floor( Math.random() * (this.buildings.length - 2 - buildingOnePosition) ) + buildingOnePosition + 1;
      building = this.buildings[ buildingTwoPosition ];
      this.player_2 = new Gorilla( this.context, 2 );
      this.player_2.create( building.middlePosition(), building.positionAtY() );
    };

    App.prototype.reCreateGorillas = function () {
      this.player_1.reCreate();
      this.player_2.reCreate();
    };

    App.prototype.throwBanana = function ( force, angle, player ) {
      var that = this;
      if ( player === 2 ) {
        angle = -angle;
        force = -force;
      }
      player = this['player_' + player];
      player.getBanana( force, angle );
      this.timeout = setTimeout( function () {
        that.startTime = new Date();
        that.animateBanana( player, that.startTime );
      }, this.frameRate );
    };

    App.prototype.updateScore = function () {
      // TODO: update score board
      this.context.fillStyle = 'rgb( 0, 0, 160 )';
      this.context.font = 'bold 14px courier';
      this.context.fillRect( this.width / 2 - 45, this.height - 40, 90, 13 );
      this.context.fillStyle = 'rgb( 255, 255, 255 )';
      this.context.fillText(this.scores.player_1 + '>Score<' + this.scores.player_2, this.width / 2 - 37, this.height - 30 );
    };

    App.prototype.animateBanana = function ( player ) {
      var that = this;
      this.timeout = setTimeout( function () {
        that.createScene();
        if ( that.bananaHitSun( player ) ) that.sunShock = true;
        if ( that.bananaHitGorilla( player ) ) return;
        if ( that.bananaHasHit( player ) ) {
          that.nextPlayerTurn( player );
          return;
        }
        if ( that.withinBoundries( player.banana.x(), player.banana.y() ) === false ) {
          that.nextPlayerTurn( player );
          return;
        }
        var now = new Date();
        var time = now - that.startTime;

        player.throwBanana( time / 1000, time ); // previously was time
        that.animateBanana( player );
      }, this.frameRate );
    };

    App.prototype.bananaHitSun = function ( player ) {
      var x = player.banana.x();
      var y = player.banana.y();
      if ( x <= (this.width / 2) + 10 && x >= (this.width / 2) - 10 && y <= 27 && y >= 17 ) {
        return true;
      }
      return false;
    };

    App.prototype.bananaHasHit = function ( player ) {
      var x = player.banana.x();
      var y = player.banana.y();
      for ( var i = 0; i < this.buildings.length; i ++ ) {
        if ( this.buildings[i].checkColission( x, y ) ) return true;
      }
      return false;
    };

    App.prototype.bananaHitGorilla = function ( player ) {
      var that = this;
      var x = player.banana.x();
      var y = player.banana.y();
      if ( this.player_2.checkColission( x, y ) || this.player_1.checkColission( x, y ) ) {
        var deadPlayer = ( this.player_2.dead === true ) ? this.player_2 : this.player_1;
        var winner = ( this.player_2.dead === false ) ? this.player_2 : this.player_1;
        this.winner.push( winner.playerNumber );
        this.timeout = setTimeout( function () {
          that.animateColission( deadPlayer );
        }, 5 );
        this.scores['player_' + winner.playerNumber]++;
        this.updateScore();
        this.timeout = setTimeout( function () {
          that.startTime = new Date();
          winner.animate = true;
          that.createScene();
          player.animateWin();
          that.animateWin( winner, that.startTime );
        }, this.frameRate );
        return true;
      }
    };

    App.prototype.animateColission = function ( player ) {
      var that = this;
      this.timeout = setTimeout( function () {
        that.startTime = new Date();
        player.animateColission();
        if ( !(player.explosionWidth > player.width) ) that.animateColission( player );
      }, 0 );
    };

    App.prototype.animateWin = function ( player, startTime ) {
      var that = this;
      this.startTime = startTime;
      this.timeout = setTimeout( function () {
        while ( !(player.animate === true && player.animations < 12) ) {
          that.empty = true;
          that.buildings = [];
          that.createScene();
          that.nextPlayerTurn( player );
          return;
        }
        var now = new Date();
        var time = now - that.startTime;
        that.createScene();
        player.animateWin();
        that.animateWin( player, that.startTime );
      }, 800 );
    };

    App.prototype.nextPlayerTurn = function ( player ) {
      this.sunShock = false;
      var nextPlayer = ( player.playerNumber === 2 ) ? 1 : 2;
      window.showPlayerField( 'player_' + nextPlayer, 'angle' );
    };

    App.prototype.withinBoundries = function ( x, y ) {
      return ( x < 0 || x > this.width || y > this.height ) ? false : true;
    };

    return App;

  }());

window.hidePlayerField = function ( player, field ) {
  var el = document.getElementById( player + '_' + field );
  el.style.display = "none";
  el.previousElementSibling.style.display = "none";
}

window.showPlayerField = function ( player, field ) {
  var el = document.getElementById( player + '_' + field );
  el.style.display = "block";
  el.previousElementSibling.style.display = "block";
  el.focus();
}

window.readAngleAndVelocity = function ( player ) {
  return {
    angle: document.getElementById( player + '_angle' ).value,
    velocity: document.getElementById( player + '_velocity' ).value
  };
}

window.clearFields = function ( player ) {
  document.getElementById( player + '_angle' ).value = '';
  document.getElementById( player + '_velocity' ).value = '';
}


function draw() {

  var app = new App();
  app.createScene();

  var p1angle = document.getElementById( 'player_1_angle' );
  var p1velocity = document.getElementById( 'player_1_velocity' );

  var p2angle = document.getElementById( 'player_2_angle' );
  var p2velocity = document.getElementById( 'player_2_velocity' );

  p1angle.addEventListener( "keydown", function ( event ) {
    if ( event.keyCode === 13 ) {
      app.clearTimeouts();
      window.showPlayerField( 'player_1', 'velocity' );
    }
  });

  p1velocity.addEventListener( "keydown", function ( event ) {
    if ( event.keyCode === 13 ) {
      window.hidePlayerField( 'player_1', 'angle' );
      window.hidePlayerField( 'player_1', 'velocity' );
      var parameters = window.readAngleAndVelocity( 'player_1' );
      window.clearFields( 'player_1' );
      app.throwBanana( parseInt(parameters.velocity), parseInt(parameters.angle), 1 );
    }
  });

  p2angle.addEventListener( "keydown", function ( event ) {
    if ( event.keyCode === 13 ) {
      app.clearTimeouts();
      window.showPlayerField( 'player_2', 'velocity' );
    }
  });

  p2velocity.addEventListener( "keydown", function ( event ) {
    if ( event.keyCode === 13 ) {
      window.hidePlayerField( 'player_2', 'angle' );
      window.hidePlayerField( 'player_2', 'velocity' );

      var parameters = window.readAngleAndVelocity( 'player_2' );
      window.clearFields( 'player_2' );
      app.throwBanana( parseInt(parameters.velocity), parseInt(parameters.angle), 2 );
    }
  });

  p1angle.style.display = 'block';
  p1angle.previousElementSibling.style.display = 'block';
  p1angle.focus();

  p2angle.style.display = 'none';
  p2angle.previousElementSibling.style.display = 'none';
  p2velocity.style.display = 'none';
  p2velocity.previousElementSibling.style.display = 'none';

}