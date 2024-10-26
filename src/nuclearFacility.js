export class NuclearFacility {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 128;
    this.height = 128;
    this.destroyed = false;
    this.sprite = new Image();
    this.sprite.src = 'assets/nuclear_facility.png';
    this.destroyedSprite = new Image();
    this.destroyedSprite.src = 'assets/nuclear_facility_destroyed.png';
  }

  render(ctx) {
    if (this.destroyed) {
      ctx.drawImage(this.destroyedSprite, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    } else {
      ctx.drawImage(this.sprite, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
  }

  destroy() {
    this.destroyed = true;
  }

  isDestroyed() {
    return this.destroyed;
  }
}
