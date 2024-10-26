export class MissionBriefing {
  constructor(ctx) {
    this.ctx = ctx;
    this.mapImage = new Image();
    this.mapImage.src = 'assets/briefing_map.png';
  }

  render() {
    this.ctx.fillStyle = '#000033';  // Dark blue background
    this.ctx.fillRect(0, 0, 800, 600);

    this.ctx.fillStyle = 'white';
    this.ctx.font = '32px "Press Start 2P"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Mission Briefing', 400, 80);

    this.ctx.font = '16px "Press Start 2P"';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Objective:', 50, 150);
    this.ctx.fillText('Destroy enemy nuclear facility', 50, 180);

    this.ctx.fillText('Intel:', 50, 240);
    this.ctx.fillText('- Heavy air defenses expected', 50, 270);
    this.ctx.fillText('- Watch for enemy fighters', 50, 300);

    this.ctx.fillText('Controls:', 50, 360);
    this.ctx.fillText('- Arrow keys: Move', 50, 390);
    this.ctx.fillText('- Space: Fire', 50, 420);

    this.ctx.textAlign = 'center';
    this.ctx.fillText('Click to start the mission', 400, 550);

    // Draw the mission map
    this.ctx.drawImage(this.mapImage, 550, 150, 200, 300);
  }
}
