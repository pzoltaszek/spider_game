let BOUNDARY = null;
let PLAY_AREA = null;
const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
let SPEED = 3;
let LIVES = 3;
let ENTERED = false;

function start() {
    document.addEventListener('keydown', checkKeys);
    createGameBoard();
    createPlayArea();
    createSpider();
    updateInfo();
    BOUNDARY = document.querySelector('.gameboard').getBoundingClientRect();
    PLAY_AREA = document.querySelector('.playArea').getBoundingClientRect();

};

function createGameBoard() {
    let board = document.createElement('div');
    board.className = 'gameboard';
    board.style.left = '20px';
    board.style.top = '100px';
    document.body.appendChild(board);
};

function createPlayArea() {
    let playArea = document.createElement('div');
    playArea.className = 'playArea';
    document.querySelector('.gameboard').appendChild(playArea);
}

function createSpider(x, y) {
    let newSpider = document.createElement('div');
    newSpider.className = 'spider';
    if (!x && !y) {
        newSpider.style.left = '20px';
        newSpider.style.top = '100px'
    } else {
        newSpider.style.left = `${x}px`;
        newSpider.style.top = `${y}px`;
    }
    document.body.appendChild(newSpider);
};

function removeSpider() {
    let spiderToremove = document.querySelector('.spider').remove();
};

function updateInfo() {
    let info = document.querySelector('.info');
    info.innerHTML = `LIVES: ${LIVES} ||  SCORE: ${666}`;
}

function checkKeys(e) {
    if (!KEYS.includes(e.code)) {
        return;
    } else {
        checkMove(e.code);
    }
};

function checkMove(code) {
    const spiderCoord = document.querySelector('.spider').getBoundingClientRect();
    switch (code) {
        case 'ArrowUp':
            checkMoveUp(spiderCoord);
            break;
        case 'ArrowDown':
            checkMoveDown(spiderCoord);
            break;
        case 'ArrowLeft':
            checkMoveLeft(spiderCoord);
            break;
        case 'ArrowRight':
            checkMoveRight(spiderCoord);
            break;
    }
};

function checkMoveUp(spiderCoord) {
    if (spiderCoord.top <= BOUNDARY.top) {
        return;
    }
    removeSpider();
    createSpider(spiderCoord.left, spiderCoord.top - 1 * SPEED);
};

function checkMoveDown(spiderCoord) {
    if (spiderCoord.bottom >= BOUNDARY.bottom) {
        return;
    }
    removeSpider();
    createSpider(spiderCoord.left, spiderCoord.top + 1 * SPEED);
};


function checkMoveLeft(spiderCoord) {
    if (spiderCoord.left <= BOUNDARY.left) {
        return;
    }
    if (spiderCoord.left + spiderCoord.width / 2 >= PLAY_AREA.left && spiderCoord.right - spiderCoord.width / 2 <= PLAY_AREA.right) {
        ENTERED = true;
    } else {
        ENTERED = false
    }
    console.log(ENTERED);
    removeSpider();
    createSpider(spiderCoord.left - 1 * SPEED, spiderCoord.top);
};

function checkMoveRight(spiderCoord) {
    if (spiderCoord.right >= BOUNDARY.right) {
        return;
    }
    if (spiderCoord.left + spiderCoord.width / 2 >= PLAY_AREA.left && spiderCoord.right - spiderCoord.width / 2 <= PLAY_AREA.right) {
        ENTERED = true;
    } else {
        ENTERED = false
    }
    console.log(ENTERED);
    removeSpider();
    createSpider(spiderCoord.left + 1 * SPEED, spiderCoord.top);
};

function enterPlayArea() {

};