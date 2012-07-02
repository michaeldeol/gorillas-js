define(

  // Dependencies ex: ['foo/bar', 'foobar'],

  // Module + passing of dependencies (if any)
  function () {

    // Constructor
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

    // Return our Shape Object
    return Shape;

});