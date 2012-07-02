define(

  // Dependencies ex: ['foo/bar', 'foobar'],
  ['helpers/shape'],

  // Module + passing of dependencies (if any)
  function ( Shape ) {

    // Constants
    var SUN_BODY_COLOR = "rgb( 255, 255, 0 )",
        SUN_EYES_COLOR = "rgb( 0, 0, 160 )";

    // Constructor
    function Sun ( context ) {
      this.context = context;
      this.canvas = document.getElementById('canvas');
      this.mouth = false;
      this.width = 10;
      this.height = 27;
      this.position = ( this.canvas.width / 2 );
    }

    /**
     * create: Begin sun build-out
     * params {Boolean} hit
     */
    Sun.prototype.create = function ( hit ) {
      if ( hit ) this.mouth = true;
      this.createRays();
      this.createBody();
      this.createEyes();
      this.createMouth();
    };

    /**
     * createBody: Build the sun's body
     */
    Sun.prototype.createBody = function () {
      var shape = new Shape( this.context );
      this.context.fillStyle = SUN_BODY_COLOR;
      shape.circle( this.position, this.height, this.width );
    };

    /**
     * createEyes: Build left/right eye(s)
     */
    Sun.prototype.createEyes = function () {
      var shape = new Shape( this.context );
      this.context.fillStyle = SUN_EYES_COLOR;
      // create left eye
      shape.circle( this.position - 2.5, this.height - 2.5, 1 );
      // create right eye
      shape.circle( this.position + 2.5, this.height - 2.5, 1 );
    };

    /**
     * createRays: Build sun rays
     */
    Sun.prototype.createRays = function () {
      // Helper Method
      // TODO: may extract this
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

    /**
     * createMouth: Build out the mouth in the smile or shocked state
     */
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

    // Return our Sun Object
    return Sun;

});