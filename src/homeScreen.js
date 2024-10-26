export class HomeScreen {
  constructor(ctx) {
    this.ctx = ctx;
    this.background = new Image();
    this.background.src = 'assets/home_background.png';
    this.logo = new Image();
    this.logo.src = 'assets/game_logo.png';
    this.startButton = new Image();
    this.startButton.src = 'assets/start_button.png';
    this.startButtonPos = {
      x: 300,
      y: 450,
      width: 200,
      height: 60
    };
  }

  render() {
    this.ctx.drawImage(this.background, 0, 0, 800, 600);
    this.ctx.drawImage(this.logo, 200, 50, 400, 200);
    this.ctx.drawImage(this.startButton, this.startButtonPos.x, this.startButtonPos.y, this.startButtonPos.width, this.startButtonPos.height);
  }

  isStartButtonClicked(x, y) {
    return (
      x >= this.startButtonPos.x &&
      x <= this.startButtonPos.x + this.startButtonPos.width &&
      y >= this.startButtonPos.y &&
      y <= this.startButtonPos.y + this.startButtonPos.height
    );
  }
}
