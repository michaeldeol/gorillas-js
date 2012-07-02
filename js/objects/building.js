define(

  // Dependencies ex: ['foo/bar', 'foobar'],
  ['helpers/shape'],

  // Module + passing of dependencies (if any)
  function ( Shape ) {

    // Constructor
    function Building ( context, canvasHeight ) {
      this.context = context;
      this.canvas = document.getElementById('canvas');
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

    /**
     * positionAtX: Where are we at x
     * returns {Integer}
     */
    Building.prototype.positionAtX = function () {
      return this.x;
    };

    /**
     * positionAtY: Where are we at y
     * returns {Integer}
     */
    Building.prototype.positionAtY = function () {
      return this.canvas.height - this.height;
    };

    /**
     * endPosition: Where does this building end
     * returns {Integer}
     */
    Building.prototype.endPosition = function () {
      return this.positionAtX() + this.width + this.spacing;
    };

    /**
     * middlePosition: Locate the middle of the building
     * returns {Integer}
     */
    Building.prototype.middlePosition = function () {
      return this.positionAtX() + ( this.endPosition() - this.positionAtX() ) / 2;
    };

    /**
     * create: Build out the building
     * params {Integer} x
     * params {Integer} y
     */
    Building.prototype.create = function ( x, y ) {
      this.x = x;
      this.y = y;
      this.buildingColor = this.buildingColor || this.buildingColors[ Math.floor(Math.random() * (3 - 0) + 0) ];
      this.context.fillStyle = this.buildingColor;
      this.height = this.baseHeight + y;
      this.context.fillRect( this.positionAtX(), this.baseLine - this.height, this.width, this.height );
      this.createWindows( this.positionAtX(), this.positionAtY() );
    };

    /**
     * reCreate: Re-Build the buildings
     */
    Building.prototype.reCreate = function () {
      this.create( this.x, this.y );
    };

    /**
     * createWindows: Create as many windows as the building can hold based on it's size.
     * If there is windows already for the recreate, lets use those instead.
     * params {Integer} x
     * params {Integer} y
     */
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

    /**
     * createWindow: Build the window
     * params {Integer} x
     * params {Integer} y
     * params {String} color
     */
    Building.prototype.createWindow = function ( x, y, color ) {
      this.context.fillStyle = color;
      this.context.fillRect( x, y, this.windowWidth, this.windowHeight );
    };

    /**
     * checkColission: Has the building been hit?
     * params {Integer} x
     * params {Integer} y
     * returns {Boolean}
     */
    Building.prototype.checkColission = function ( x, y ) {
      if ( this.positionAtY() - 25 <= y && ( x > this.x && x < this.x + this.width + 10 ) ) {
        this.colissions.push( [x - 20, y] );
        this.createColission( x - 20, y );
        return true;
      }
      return false;
    };

    /**
     * createColission: Draw colission if we hit the building
     * params {Integer} x
     * params {Integer} y
     */
    Building.prototype.createColission = function ( x, y ) {
      var width, height, shape;
      width = 25;
      height = 15;
      this.context.fillStyle = 'rgb( 0, 0, 160 )';
      shape = new Shape( this.context );
      shape.ellipse( x, y, width, height );
    };

    /**
     * reCreateColissions: On building reCreate, lets draw the colissions again
     */
    Building.prototype.reCreateColissions = function () {
      if ( this.colissions.length > 0 ) {
        for ( var i = 0; i < this.colissions.length; i++ ) {
          var colission = this.colissions[i];
          this.createColission( colission[0], colission[1] );
        }
      }
    };

    // Return our Building Object
    return Building;

});