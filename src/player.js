import { Missile } from './missile.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.speed = 5;
    this.health = 100;
    this.sprite = new Image();
    this.sprite.src = 'assets/f15.png';
    this.movement = { left: false, right: false, up: false, down: false };
  }

  update() {
    if (this.movement.left) this.x -= this.speed;
    if (this.movement.right) this.x += this.speed;
    if (this.movement.up) this.y -= this.speed;
    if (this.movement.down) this.y += this.speed;

    this.x = Math.max(0, Math.min(this.x, 800 - this.width));
    this.y = Math.max(0, Math.min(this.y, 600 - this.height));
  }

  render(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }

  handleInput(key, isKeyDown) {
    switch (key) {
      case 'ArrowLeft':
        this.movement.left = isKeyDown;
        break;
      case 'ArrowRight':
        this.movement.right = isKeyDown;
        break;
      case 'ArrowUp':
        this.movement.up = isKeyDown;
        break;
      case 'ArrowDown':
        this.movement.down = isKeyDown;
        break;
    }
  }

  shoot() {
    return new Missile(this.x + this.width / 2, this.y);
  }

  collidesWith(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  damage() {
    this.health -= 10;
  }
}
