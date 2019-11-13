let BOUNDARY = null;
let PLAY_AREA = [];
const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
let SPEED = 3;
let LIVES = 3;
let ENTERED = false;
let LINE_POINTS = [];
let LAST_DIRECTION = null;
let NUM = 0;

function start() {
    createGameBoard();
    createSpider();
    updateInfo();
    setInitialPlayAreaBorders();
    BOUNDARY = document.querySelector('.gameboard').getBoundingClientRect();
    document.addEventListener('keydown', checkKeys);
};

function Vector(x, y) {
    this.x = x;
    this.y = y;
};

function createGameBoard() {
    let gameboard = document.createElement('div');
    gameboard.className = 'gameboard';
    let playArea = document.createElement('div');
    playArea.className = 'playArea';
    gameboard.appendChild(playArea);
    document.body.appendChild(gameboard);
};

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
};

function setInitialPlayAreaBorders() {
    let playArea = document.querySelector('.playArea').getBoundingClientRect(),
        minX = Math.floor(playArea.left),
        maxX = Math.ceil(playArea.right),
        minY = Math.floor(playArea.top),
        maxY = Math.ceil(playArea.bottom);
    PLAY_AREA.push(new Vector(minX, minY));
    PLAY_AREA.push(new Vector(minX, maxY));
    PLAY_AREA.push(new Vector(maxX, minY));
    PLAY_AREA.push(new Vector(maxX, maxY));
};

function checkKeys(e) {
    if (!KEYS.includes(e.code)) {
        return;
    } else {
        checkMove(e.code);
    }
};

function checkMove(code) {
    const spiderCoord = document.querySelector('.spider').getBoundingClientRect();
    enterPlayArea(spiderCoord);
    setPoints(spiderCoord, code);
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
    removeSpider();
    createSpider(spiderCoord.left - 1 * SPEED, spiderCoord.top);
};

function checkMoveRight(spiderCoord) {
    if (spiderCoord.right >= BOUNDARY.right) {
        return;
    }
    removeSpider();
    createSpider(spiderCoord.left + 1 * SPEED, spiderCoord.top);
};

function enterPlayArea(spiderCoord) {
    let borders = getAreaBorders();
    let horizontalCheck = spiderCoord.left + spiderCoord.width / 2 >= borders.minX &&
        spiderCoord.right - spiderCoord.width / 2 <= borders.maxX;
    let verticalCheck = spiderCoord.bottom - spiderCoord.height / 2 >= borders.minY &&
        spiderCoord.bottom - spiderCoord.height / 2 <= borders.maxY;
    if (verticalCheck && horizontalCheck) {
        ENTERED = true;
    } else {
        ENTERED = false
        if (LINE_POINTS.length !== 0) {
            LINE_POINTS.push(new Vector(spiderCoord.left + spiderCoord.width / 2, spiderCoord.top + spiderCoord.height / 2));
        }
    }
    console.log(ENTERED);
};

function setPoints(spiderCoord, code) {
    if (code === LAST_DIRECTION && ENTERED) {
        removeline();
        drawLine(spiderCoord);
        return
    } else if (ENTERED) {
        LINE_POINTS.push(new Vector(spiderCoord.left + spiderCoord.width / 2, spiderCoord.top + spiderCoord.height / 2));
        NUM++;
        LAST_DIRECTION = code;
        removeline();
        drawLine(spiderCoord);
        console.log(LINE_POINTS);
    } else if (!ENTERED && LINE_POINTS.length !== 0) {
        buildOwnedArea();
        LINE_POINTS = [];
        NUM = 0;
    }
};

function buildOwnedArea() {
    console.log('budowaniediva');
};

function removeline() {
    let spiderToremove = document.querySelector(`.c${NUM}`);
    if (spiderToremove) {
        document.querySelector(`.c${NUM}`).remove();
    }
};

function drawLine(spiderCoord) {
    let element = document.createElement('div');
    element.id = 'line';
    element.className = `c${NUM}`
    element.style.left = `${LINE_POINTS[LINE_POINTS.length - 1].x}px`;
    element.style.top = `${LINE_POINTS[LINE_POINTS.length - 1].y}px`;
    switch (LAST_DIRECTION) {
        case 'ArrowUp':
            element.style.left = `${spiderCoord.left + spiderCoord.width / 2}px`;
            element.style.top = `${spiderCoord.top + spiderCoord.height / 2}px`;
            element.style.height = `${(LINE_POINTS[LINE_POINTS.length - 1].y) - (spiderCoord.top + spiderCoord.height / 2)}px`;
            element.style.width = '1px';
            break;
        case 'ArrowDown':
            element.style.left = `${LINE_POINTS[LINE_POINTS.length - 1].x}px`;
            element.style.top = `${LINE_POINTS[LINE_POINTS.length - 1].y}px`;
            element.style.height = `${(spiderCoord.top + spiderCoord.height / 2) - (LINE_POINTS[LINE_POINTS.length - 1].y)}px`;
            element.style.width = '1px';
            break;
        case 'ArrowLeft':
            element.style.left = `${spiderCoord.left + spiderCoord.width / 2}px`;
            element.style.top = `${spiderCoord.top + spiderCoord.height / 2}px`;
            element.style.width = `${LINE_POINTS[LINE_POINTS.length - 1].x - (spiderCoord.left + spiderCoord.width / 2)}px`;
            element.style.height = '1px';
            break;
        case 'ArrowRight':
            element.style.left = `${LINE_POINTS[LINE_POINTS.length - 1].x}px`;
            element.style.top = `${LINE_POINTS[LINE_POINTS.length - 1].y}px`;
            element.style.width = `${(spiderCoord.left + spiderCoord.width / 2) - (LINE_POINTS[LINE_POINTS.length - 1].x)}px`;
            element.style.height = '1px';
            break;
    }
    console.log('width: ' + element.style.width + ' | height: ' + element.style.height);
    document.querySelector('.gameboard').appendChild(element);
};

function getAreaBorders() {
    let borders = {};
    PLAY_AREA.forEach(vector => {
        borders.minX !== undefined ? borders.minX = Math.min(borders.minX, vector.x) : borders.minX = vector.x;
        borders.maxX !== undefined ? borders.maxX = Math.max(borders.maxX, vector.x) : borders.maxX = vector.x;
        borders.minY !== undefined ? borders.minY = Math.min(borders.minY, vector.y) : borders.minY = vector.y;
        borders.maxY !== undefined ? borders.maxY = Math.max(borders.maxY, vector.y) : borders.maxY = vector.y;
    });
    return borders;
};