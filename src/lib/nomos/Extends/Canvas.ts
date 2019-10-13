CanvasRenderingContext2D.prototype.roundRect = function (x: number, y: number, width: number, height: number, borderRadius: number) {
  if (width < 2 * borderRadius) borderRadius = width / 2;
  if (height < 2 * borderRadius) borderRadius = height / 2;
  this.beginPath();
  this.moveTo(x+borderRadius, y);
  this.arcTo(x+width, y,   x+width, y+height, borderRadius);
  this.arcTo(x+width, y+height, x,   y+height, borderRadius);
  this.arcTo(x,   y+height, x,   y,   borderRadius);
  this.arcTo(x,   y,   x+width, y,   borderRadius);
  this.closePath();
  return this;
}

export const canvasExtensions = {};