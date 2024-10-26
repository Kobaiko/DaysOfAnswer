export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.speed = 2;
    this.active = true;
    this.sprite = new Image();
    this.sprite.src = 'assets/enemy.png';
  }

  update() {
    this.y += this.speed;
    if (this.y > 600) {
      this.active = false;
    }
  }

  render(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }

  isActive() {
    return this.active;
  }

  deactivate() {
    this.active = false;
  }
}
