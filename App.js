// Khởi tạo Canvas và cài đặt thông số cơ bản
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = 400;
const HEIGHT = 500;

let sizeOptions = [4, 5, 6];
let currentSizeIndex = 0;
let gameStarted = false;
let showSizeOptions = false;

function drawButton(text, x, y, width, height, hover = false) {
  ctx.fillStyle = hover ? '#6495ED' : '#4682B4';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, x + width / 2, y + height / 2 + 8);
}

function drawStartScreen() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  
  drawButton('Play', 130, 170, 140, 70);
  drawButton('Quit', 165, 420, 70, 40);

  const gridSizeText = `${sizeOptions[currentSizeIndex]}x${sizeOptions[currentSizeIndex]}`;
  drawButton(gridSizeText, 150, 250, 100, 30, showSizeOptions);

  if (showSizeOptions) {
    sizeOptions.forEach((size, index) => {
      drawButton(`${size}x${size}`, 150, 290 + index * 40, 100, 30);
    });
  }
}

function handleClick(x, y) {
  if (x >= 130 && x <= 270 && y >= 170 && y <= 240) {
    gameStarted = true;
    startGame(sizeOptions[currentSizeIndex]);
  } else if (x >= 165 && x <= 235 && y >= 420 && y <= 460) {
    // Thoát game
    window.close();
  } else if (x >= 150 && x <= 250 && y >= 250 && y <= 280) {
    showSizeOptions = !showSizeOptions;
  } else if (showSizeOptions) {
    sizeOptions.forEach((size, index) => {
      if (x >= 150 && x <= 250 && y >= 290 + index * 40 && y <= 320 + index * 40) {
        currentSizeIndex = index;
        showSizeOptions = false;
      }
    });
  }
}

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  handleClick(x, y);
});

function startGame(gridSize) {
  console.log(`Starting game with grid size: ${gridSize}x${gridSize}`);
  // Tại đây bạn sẽ chuyển sang giao diện game chính và khởi tạo lưới cho 2048
}

function gameLoop() {
  if (!gameStarted) {
    drawStartScreen();
  } else {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#C8C8C8';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    // Vẽ nội dung trò chơi chính
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
