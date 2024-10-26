export class Missile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 8;
    this.height = 16;
    this.speed = 10;
    this.active = true;
    this.sprite = new Image();
    this.sprite.src = 'assets/missile.png';
  }

  update() {
    this.y -= this.speed;
    if (this.y < 0) {
      this.active = false;
    }
  }

  render(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }

  collidesWith(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  isActive() {
    return this.active;
  }

  deactivate() {
    this.active = false;
  }
}
