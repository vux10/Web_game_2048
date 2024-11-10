const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Kích thước canvas mới
const WIDTH = 600; 
const HEIGHT = 700; 

const colors = {
    0: '#cdc1b4',
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
    'light text': '#f9f6f2',
    'dark text': '#776e65',
    'bg': '#bbada0'
};

let board = Array.from({ length: 6 }, () => Array(6).fill(0));  // Thay đổi kích thước bảng thành 6x6
let score = 0;
let highScore = 0;
let history = [];  // Mảng lưu trữ lịch sử các trạng thái trước đó

function drawBoard() {
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT - 100);  // Khu vực bảng 6x6

    // Vẽ điểm số
    document.getElementById('score').innerText = `Điểm: ${score}`;
    document.getElementById('high-score').innerText = `Điểm cao: ${highScore}`;

    // Vẽ các ô
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            const value = board[i][j];
            drawTile(i, j, value);
        }
    }
}

function drawTile(row, col, value) {
    ctx.fillStyle = colors[value] || colors['other'];
    const x = col * 90 + 20;  // Điều chỉnh kích thước và khoảng cách của ô
    const y = row * 90 + 20;
    ctx.fillRect(x, y, 75, 75);

    if (value !== 0) {
        ctx.fillStyle = value > 8 ? colors['light text'] : colors['dark text'];
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value, x + 37.5, y + 37.5);
    }
}

document.addEventListener('keydown', (event) => { 
    if (event.key === 'ArrowUp') {
        takeTurn('UP');
    } else if (event.key === 'ArrowDown') {
        takeTurn('DOWN');
    } else if (event.key === 'ArrowLeft') {
        takeTurn('LEFT');
    } else if (event.key === 'ArrowRight') {
        takeTurn('RIGHT');
    }
});

function move(direction) {
    let moved = false;
    if (direction === 'UP') {
        for (let col = 0; col < 6; col++) {
            let temp = [];
            // Lấy các ô không phải 0 trong cột
            for (let row = 0; row < 6; row++) {
                if (board[row][col] !== 0) temp.push(board[row][col]);
            }
            temp = mergeTiles(temp);

            // Cập nhật lại bảng sau khi di chuyển
            for (let row = 0; row < 6; row++) {
                if (board[row][col] !== temp[row]) {
                    moved = true;
                }
                board[row][col] = temp[row] || 0;
            }
        }
    } else if (direction === 'DOWN') {
        for (let col = 0; col < 6; col++) {
            let temp = [];
            // Lấy các ô không phải 0 trong cột
            for (let row = 5; row >= 0; row--) {
                if (board[row][col] !== 0) temp.push(board[row][col]);
            }

            temp = mergeTiles(temp);

            // Cập nhật lại bảng sau khi di chuyển
            for (let row = 5; row >= 0; row--) {
                if (board[row][col] !== temp[5 - row]) {
                    moved = true;
                }
                board[row][col] = temp[5 - row] || 0;
            }
        }
    } else if (direction === 'LEFT') {
        for (let row = 0; row < 6; row++) {
            let temp = [];
            // Lấy các ô không phải 0 trong hàng
            for (let col = 0; col < 6; col++) {
                if (board[row][col] !== 0) temp.push(board[row][col]);
            }

            temp = mergeTiles(temp);

            // Cập nhật lại bảng sau khi di chuyển
            for (let col = 0; col < 6; col++) {
                if (board[row][col] !== temp[col]) {
                    moved = true;
                }
                board[row][col] = temp[col] || 0;
            }
        }
    } else if (direction === 'RIGHT') {
        for (let row = 0; row < 6; row++) {
            let temp = [];
            // Lấy các ô không phải 0 trong hàng
            for (let col = 5; col >= 0; col--) {
                if (board[row][col] !== 0) temp.push(board[row][col]);
            }
            temp = mergeTiles(temp);

            // Cập nhật lại bảng sau khi di chuyển
            for (let col = 5; col >= 0; col--) {
                if (board[row][col] !== temp[5 - col]) {
                    moved = true;
                }
                board[row][col] = temp[5 - col] || 0;
            }
        }
    }
    return moved;
}

const mergeSound = new Audio('merge_sound.wav');  // Tạo đối tượng âm thanh
function mergeTiles(arr) {
    let merged = [];
    let skip = false;
    for (let i = 0; i < arr.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }

        if (i + 1 < arr.length && arr[i] === arr[i + 1] && arr[i] !== 0) {
            arr[i] *= 2;
            score += arr[i];
            arr[i + 1] = 0;
            skip = true;
            mergeSound.play();  // Phát âm thanh khi hợp ô
        }
        merged.push(arr[i]);
    }
    updateHighScore();
    return merged.concat(Array(arr.length - merged.length).fill(0));  // Thêm các ô trống vào mảng
}

let previousState = null;  // Biến lưu trạng thái trước đó

// Lưu trạng thái của game trước khi di chuyển
function saveState() {
    // Lưu trạng thái hiện tại vào lịch sử
    history.push({
        board: board.map(row => row.slice()),  // Sao chép bảng
        score: score
    });

    // Giới hạn số lượng trạng thái trong lịch sử (ví dụ: lưu tối đa 20 trạng thái)
    if (history.length > 20) {
        history.shift();  // Loại bỏ trạng thái cũ nhất nếu vượt quá giới hạn
    }
}


document.getElementById('reset-button').addEventListener('click', () => {
    history = [];  // Xóa lịch sử Undo
    initGame();  // Khởi tạo lại trò chơi
});

document.getElementById('undo-button').addEventListener('click', () => {
    if (history.length > 0) {
        // Lấy trạng thái cuối cùng trong lịch sử
        const lastState = history.pop();

        // Khôi phục bảng và điểm số
        board = lastState.board.map(row => row.slice());  // Khôi phục bảng
        score = lastState.score;  // Khôi phục điểm số

        drawBoard();  // Vẽ lại bảng
    }
});


function takeTurn(direction) {
    saveState();
    let moved = move(direction);
    if (moved) {
        spawnNewTile();
        drawBoard();
    }
}

function canMove() {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            if (board[row][col] === 0) return true;
            if (row < 5 && board[row][col] === board[row + 1][col]) return true;
            if (col < 5 && board[row][col] === board[row][col + 1]) return true;
        }
    }
    return false;
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        document.getElementById('high-score').innerText = `Điểm cao: ${highScore}`;  // Cập nhật điểm cao lên giao diện
    }
}

function spawnNewTile() {
    let emptyTiles = [];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if (board[i][j] === 0) emptyTiles.push({ row: i, col: j });
        }
    }

    if (emptyTiles.length > 0) {
        const newTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[newTile.row][newTile.col] = Math.random() > 0.9 ? 4 : 2;
    }
}

function initGame() {
    board = Array.from({ length: 6 }, () => Array(6).fill(0));  // Bảng 6x6
    score = 0;
    let highScore = 0;
    previousState = null;
    const Sound = new Audio('background_music.mp3');  // Tạo đối tượng âm thanh
    Sound.play();
    spawnNewTile();
    spawnNewTile();
    drawBoard();
}

initGame();
