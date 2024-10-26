export class GameOver {
  constructor(ctx) {
    this.ctx = ctx;
  }

  render(score, reason) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, 800, 600);

    this.ctx.fillStyle = 'white';
    this.ctx.font = '32px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over', 400, 200);

    this.ctx.font = '24px "Press Start 2P"';
    this.ctx.fillText(reason, 400, 250);
    this.ctx.fillText(`Final Score: ${score}`, 400, 300);

    this.ctx.font = '20px "Press Start 2P"';
    this.ctx.fillText('Click to restart', 400, 400);
  }
}
