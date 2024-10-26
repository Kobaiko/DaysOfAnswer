import { Howl, Howler } from 'howler';
import { Game } from './game.js';
import { HomeScreen } from './homeScreen.js';
import { MissionBriefing } from './missionBriefing.js';
import { GameOver } from './gameOver.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = new Game(canvas, ctx);
const homeScreen = new HomeScreen(ctx);
const missionBriefing = new MissionBriefing(ctx);
const gameOver = new GameOver(ctx);

let gameState = 'home';

const sounds = {
  bgm: new Howl({ src: ['assets/bgm.mp3'], loop: true }),
  explosion: new Howl({ src: ['assets/explosion.mp3'] }),
  shoot: new Howl({ src: ['assets/shoot.mp3'] }),
};

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  switch (gameState) {
    case 'home':
      homeScreen.render();
      break;
    case 'briefing':
      missionBriefing.render();
      break;
    case 'playing':
      game.update();
      game.render();
      if (game.isGameOver()) {
        gameState = 'gameOver';
        sounds.bgm.stop();
      }
      break;
    case 'gameOver':
      gameOver.render(game.score, game.gameOverReason);
      break;
  }

  requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (gameState === 'home') {
    if (homeScreen.isStartButtonClicked(x, y)) {
      gameState = 'briefing';
    }
  } else if (gameState === 'briefing') {
    gameState = 'playing';
    sounds.bgm.play();
  } else if (gameState === 'gameOver') {
    game.reset();
    gameState = 'home';
  }
});

document.addEventListener('keydown', (e) => {
  if (gameState === 'playing') {
    game.handleInput(e.key, true);
    if (e.key === ' ') {
      sounds.shoot.play();
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (gameState === 'playing') {
    game.handleInput(e.key, false);
  }
});

gameLoop();
