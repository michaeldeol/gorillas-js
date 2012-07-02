define(

  // Dependencies ex: ['foo/bar', 'foobar'],
  ['helpers/shape'],

  // Module + passing of dependencies (if any)
  function ( Shape ) {

    var SUN_BODY_COLOR, SUN_EYES_COLOR,
        SUN_BODY_COLOR = "rgb( 255, 255, 0 )",
        SUN_EYES_COLOR = "rgb( 0, 0, 160 )";

    // Constructor
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

    // Return our Sun Object
    return Sun;

});