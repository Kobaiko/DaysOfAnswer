export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.reset();
  }

  reset() {
    this.score = 0;
    this.player = {
      x: 400,
      y: 550,
      width: 60,
      height: 60,
      speed: 5,
      sprite: new Image()
    };
    this.player.sprite.src = 'assets/f15_sprite.png';
    this.background = new Image();
    this.background.src = 'assets/background.png';
    this.backgroundY = 0;
    this.backgroundSpeed = 1;
    this.enemySprite = new Image();
    this.enemySprite.src = 'assets/enemy_fighter.png';
    this.playerMissileSprite = new Image();
    this.playerMissileSprite.src = 'assets/player_missile.png';
    this.enemyMissileSprite = new Image();
    this.enemyMissileSprite.src = 'assets/enemy_missile.png';
    this.explosionSprite = new Image();
    this.explosionSprite.src = 'assets/explosion.png';
    this.nuclearFacilitySprite = new Image();
    this.nuclearFacilitySprite.src = 'assets/nuclear_facility.png';
    this.keys = {};
    this.enemies = [];
    this.playerMissiles = [];
    this.enemyMissiles = [];
    this.explosions = [];
    this.spawnTimer = 0;
    this.gameTime = 0;
    this.gameOverReason = '';
    this.missionTime = 5 * 60 * 60; // 5 minutes in frames (60 fps)
    this.nuclearFacility = {
      x: 400,
      y: -200,
      width: 128,
      height: 128,
      health: 100
    };
  }

  update() {
    this.gameTime++;

    // Update background
    this.backgroundY = (this.backgroundY + this.backgroundSpeed) % this.canvas.height;

    // Update player
    if (this.keys.ArrowLeft) this.player.x -= this.player.speed;
    if (this.keys.ArrowRight) this.player.x += this.player.speed;
    if (this.keys.ArrowUp) this.player.y -= this.player.speed;
    if (this.keys.ArrowDown) this.player.y += this.player.speed;

    // Keep player within canvas bounds
    this.player.x = Math.max(0, Math.min(this.player.x, this.canvas.width - this.player.width));
    this.player.y = Math.max(0, Math.min(this.player.y, this.canvas.height - this.player.height));

    // Update enemies
    this.updateEnemies();

    // Update missiles
    this.updateMissiles();

    // Update explosions
    this.updateExplosions();

    // Spawn new enemies
    this.spawnTimer++;
    const spawnInterval = Math.max(30, 180 - Math.floor(this.gameTime / 3600) * 30); // Decrease spawn interval every minute, minimum 0.5 seconds
    if (this.spawnTimer >= spawnInterval) {
      this.spawnTimer = 0;
      if (Math.random() < 0.5) {
        this.spawnEnemy();
      }
    }

    // Check collisions
    this.checkCollisions();

    // Check if mission time is over
    if (this.gameTime >= this.missionTime) {
      this.nuclearFacility.y += 1; // Move nuclear facility into view
    }

    // Check if nuclear facility is destroyed
    if (this.nuclearFacility.health <= 0) {
      this.gameOverReason = 'Mission Accomplished!';
    }
  }

  render() {
    // Draw scrolling background
    this.ctx.drawImage(this.background, 0, this.backgroundY);
    this.ctx.drawImage(this.background, 0, this.backgroundY - this.canvas.height);

    // Draw nuclear facility if in view
    if (this.nuclearFacility.y + this.nuclearFacility.height > 0) {
      this.ctx.drawImage(this.nuclearFacilitySprite, this.nuclearFacility.x, this.nuclearFacility.y, this.nuclearFacility.width, this.nuclearFacility.height);
    }

    // Draw enemies
    this.enemies.forEach(enemy => {
      this.ctx.drawImage(this.enemySprite, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Draw player (F-15)
    this.ctx.drawImage(this.player.sprite, this.player.x, this.player.y, this.player.width, this.player.height);

    // Draw player missiles
    this.playerMissiles.forEach(missile => {
      this.ctx.drawImage(this.playerMissileSprite, missile.x, missile.y, missile.width, missile.height);
    });

    // Draw enemy missiles
    this.enemyMissiles.forEach(missile => {
      this.ctx.drawImage(this.enemyMissileSprite, missile.x, missile.y, missile.width, missile.height);
    });

    // Draw explosions
    this.explosions.forEach(explosion => {
      this.ctx.drawImage(this.explosionSprite, explosion.x, explosion.y, explosion.width, explosion.height);
    });

    // Draw HUD
    this.renderHUD();
  }

  renderHUD() {
    // Create a semi-transparent black background for the HUD
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, 40);

    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px "Press Start 2P"';
    
    // Score in top right
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Score: ${this.score}`, this.canvas.width - 20, 28);

    // ETA to target
    const remainingTime = Math.max(0, Math.ceil((this.missionTime - this.gameTime) / 60));
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`ETA: ${minutes}:${seconds.toString().padStart(2, '0')}`, this.canvas.width / 2, 28);
  }

  handleInput(key, isKeyDown) {
    this.keys[key] = isKeyDown;
    if (key === ' ' && isKeyDown) {
      this.playerShoot();
    }
  }

  isGameOver() {
    return this.gameOverReason !== '';
  }

  updateEnemies() {
    this.enemies = this.enemies.filter(enemy => {
      enemy.y += enemy.speed;
      
      // Enemy shooting
      if (!enemy.hasFired && Math.random() < 0.01) { // 1% chance to shoot each frame if hasn't fired yet
        this.enemyShoot(enemy);
        enemy.hasFired = true;
      }

      return enemy.y < this.canvas.height;
    });
  }

  updateMissiles() {
    this.playerMissiles = this.playerMissiles.filter(missile => {
      missile.y -= missile.speed;
      return missile.y > 0;
    });

    this.enemyMissiles = this.enemyMissiles.filter(missile => {
      missile.y += missile.speed;
      return missile.y < this.canvas.height;
    });
  }

  updateExplosions() {
    this.explosions = this.explosions.filter(explosion => {
      explosion.timer--;
      return explosion.timer > 0;
    });
  }

  spawnEnemy() {
    const enemy = {
      x: Math.random() * (this.canvas.width - 48),
      y: -48,
      width: 48,
      height: 48,
      speed: 1 + Math.random() + (this.gameTime / 3600) * 0.5, // Increase speed over time
      hasFired: false // New property to track if the enemy has fired
    };
    this.enemies.push(enemy);
  }

  playerShoot() {
    if (this.playerMissiles.length < 5) { // Limit the number of missiles on screen
      const missile = {
        x: this.player.x + this.player.width / 2 - 4,
        y: this.player.y,
        width: 8,
        height: 16,
        speed: 10
      };
      this.playerMissiles.push(missile);
    }
  }

  enemyShoot(enemy) {
    const missile = {
      x: enemy.x + enemy.width / 2 - 4,
      y: enemy.y + enemy.height,
      width: 8,
      height: 16,
      speed: 5
    };
    this.enemyMissiles.push(missile);
  }

  checkCollisions() {
    // Player missiles hitting enemies
    this.playerMissiles.forEach(missile => {
      this.enemies.forEach(enemy => {
        if (this.checkCollision(missile, enemy)) {
          this.score++;
          this.explosions.push({x: enemy.x, y: enemy.y, width: 64, height: 64, timer: 30});
          enemy.destroyed = true;
          missile.destroyed = true;
        }
      });
    });

    // Enemy missiles hitting player
    this.enemyMissiles.forEach(missile => {
      if (this.checkCollision(missile, this.player)) {
        this.gameOverReason = 'You were shot down!';
      }
    });

    // Player missiles hitting nuclear facility
    if (this.score >= 100 && this.nuclearFacility.y + this.nuclearFacility.height > 0) {
      this.playerMissiles.forEach(missile => {
        if (this.checkCollision(missile, this.nuclearFacility)) {
          this.nuclearFacility.health -= 10;
          for (let i = 0; i < 5; i++) {
            this.explosions.push({
              x: this.nuclearFacility.x + Math.random() * this.nuclearFacility.width,
              y: this.nuclearFacility.y + Math.random() * this.nuclearFacility.height,
              width: 64,
              height: 64,
              timer: 30
            });
          }
          missile.destroyed = true;
        }
      });
    }

    // Remove destroyed objects
    this.playerMissiles = this.playerMissiles.filter(missile => !missile.destroyed);
    this.enemies = this.enemies.filter(enemy => !enemy.destroyed);
  }

  checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }
}
