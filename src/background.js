export class Background {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.y = 0;
    this.speed = 1;
    this.image = new Image();
    this.image.src = 'assets/background.png';
  }

  update() {
    this.y += this.speed;
    if (this.y >= this.height) {
      this.y = 0;
    }
  }

  render(ctx) {
    ctx.drawImage(this.image, 0, this.y, this.width, this.height);
    ctx.drawImage(this.image, 0, this.y - this.height, this.width, this.height);
  }
}
