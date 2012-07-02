define(

  // Dependencies ex: ['foo/bar', 'foobar'],

  // Module + passing of dependencies (if any)
  function () {

    // Constructor
    function Banana ( context, initx, inity, force, angle, wind ) {
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
      this.wind = wind;
      this.direction = 'up';
      this.timer = 0;
    }

    /**
     * x: Where are we at x
     * returns {Integer}
     */
    Banana.prototype.x = function () {
      return this.initx + this.projectionX;
    };

    /**
     * y: Where are we at y
     * returns {Integer}
     */
    Banana.prototype.y = function () {
      return this.inity - this.projectionY;
    };

    /**
     * create: Build the banana and rotate it based on previous position.
     * params {Integer} player Which player this banana is associated with
     */
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

    /**
     * rotateBanana: Draw the banana based on it's direction
     * params {Array} arc Arc directions
     * params {String} direction
     */
    Banana.prototype.rotateBanana = function ( arc, direction ) {
      for ( var i = -5; i < -1; i++ ) {
        this.context.beginPath();
        this.context.arc( this.x() + 1 + i , this.y(), 3, arc[0], arc[1], arc[2] );
        this.context.stroke();
      }
      if ( !(this.timer < 5) ) {
        this.direction = direction;
        this.timer = 0;
      } else {
        this.timer++;
      }
    };

    /**
     * createFrame: create the starting position for launch
     * params {Integer} time
     * params {Integer} player
     */
    Banana.prototype.createFrame = function ( time, player ) {
      this.startTime = time;
      this.create( player );
      this.calcProjection();
    };

    /**
     * calcInitialPosition: Setup the initial position and where the banana will go based on wind && gravity
     */
    Banana.prototype.calcInitialPosition = function () {
      var radian = this.angle * Math.PI / 180;
      this.dx = this.force * Math.cos( radian ) + this.wind;
      this.dy = this.force * Math.sin( radian ) - this.gravity * this.startTime;
    };

    /**
     * calcProjection: calculate where the next frame should render this banana
     */
    Banana.prototype.calcProjection = function () {
      this.calcInitialPosition();
      this.projectionX += this.dx * this.scale;
      this.projectionY += this.dy * this.scale;
    };

    // Return our Banana Object
    return Banana;

});