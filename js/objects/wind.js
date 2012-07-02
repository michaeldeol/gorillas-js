define(

  // Dependencies ex: ['foo/bar', 'foobar'],

  // Module + passing of dependencies (if any)
  function () {

    // TODO: I believe the wind is going "backwards"
    // meaning, its faster to throw it againts the arrow direction
    // this needs to be looked into and fixed

    // Constructor
    function Wind ( context ) {
      this.context = context;
      this.windSpeed = Math.floor( Math.random() * 10 - 5 );
      if ( Math.floor( Math.random() * 3 ) === 1 ) {
        if ( this.windSpeed > 0 ) {
          this.windSpeed += Math.floor( Math.random() * 10 );
        } else {
          this.windSpeed -= Math.floor( Math.random() * 10 );
        }
      }
    }

    Wind.prototype.create = function () {
      if ( this.windSpeed !== 0 ) {
        this.windLine = this.windSpeed * 3 * ( APP_WIDTH / 320 );
        this.context.strokeStyle = 'rgb( 245, 11, 11 )';
        this.context.beginPath();
        this.context.moveTo( APP_WIDTH / 2, APP_HEIGHT - 5 );
        this.context.lineTo( APP_WIDTH / 2 + this.windLine, APP_HEIGHT - 5 );
        if ( this.windSpeed > 0 ) {
          this.arrowDir = -2;
        } else {
          this.arrowDir = 2;
        }
        this.context.moveTo( APP_WIDTH / 2 + this.windLine, APP_HEIGHT - 5 );
        this.context.lineTo( APP_WIDTH / 2 + this.windLine + this.arrowDir, APP_HEIGHT - 5 - 2 );
        this.context.moveTo( APP_WIDTH / 2 + this.windLine, APP_HEIGHT - 5 );
        this.context.lineTo( APP_WIDTH / 2 + this.windLine + this.arrowDir, APP_HEIGHT - 5 + 2 );
        this.context.stroke();
      }
    };

    // Return our Wind Object
    return Wind;

});