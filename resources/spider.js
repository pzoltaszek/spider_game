let BOUNDARY = null;
let PLAY_AREA = null;
const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
let SPEED = 3;
let LIVES = 3;
let ENTERED = false;
let POINTS = [];
let LAST_DIRECTION = null;
let NUM = 0;

function start() {
    document.addEventListener('keydown', checkKeys);
    createElement('div', 'playArea');
    createElement('div', 'aaa');
    createSpider();
    updateInfo();
    BOUNDARY = document.querySelector('.gameboard').getBoundingClientRect();
    PLAY_AREA = document.querySelector('.playArea').getBoundingClientRect();
};

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

function createElement(name, className) {
    let element = document.createElement(name);
    element.className = className;
    document.querySelector('.gameboard').appendChild(element);
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
    let horizontalCheck = spiderCoord.left + spiderCoord.width / 2 >= PLAY_AREA.left &&
        spiderCoord.right - spiderCoord.width / 2 <= PLAY_AREA.right;
    let verticalCheck = spiderCoord.bottom - spiderCoord.height / 2 >= PLAY_AREA.top &&
        spiderCoord.bottom - spiderCoord.height / 2 <= PLAY_AREA.bottom;
    if (verticalCheck && horizontalCheck) {
        ENTERED = true;
    } else {
        ENTERED = false
        if (POINTS.length !== 0) {
            POINTS.push(new Vector(spiderCoord.left + spiderCoord.width / 2, spiderCoord.top + spiderCoord.height / 2));
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
        POINTS.push(new Vector(spiderCoord.left + spiderCoord.width / 2, spiderCoord.top + spiderCoord.height / 2));
        NUM++;
        LAST_DIRECTION = code;
        removeline();
        drawLine(spiderCoord);
        console.log(POINTS);
    } else if (!ENTERED && POINTS.length !== 0) {
        buildOwnedArea();
        POINTS = [];
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
}

function drawLine(spiderCoord) {
    let element = document.createElement('div');
    element.id = 'line';
    element.className = `c${NUM}`
    element.style.left = `${POINTS[POINTS.length - 1].x}px`;
    element.style.top = `${POINTS[POINTS.length - 1].y}px`;
    switch (LAST_DIRECTION) {
        case 'ArrowUp':
            element.style.left = `${spiderCoord.left + spiderCoord.width / 2}px`;
            element.style.top = `${spiderCoord.top + spiderCoord.height / 2}px`;
            element.style.height = `${(POINTS[POINTS.length - 1].y) - (spiderCoord.top + spiderCoord.height / 2)}px`;
            element.style.width = '1px';
            break;
        case 'ArrowDown':
            element.style.left = `${POINTS[POINTS.length - 1].x}px`;
            element.style.top = `${POINTS[POINTS.length - 1].y}px`;
            element.style.height = `${(spiderCoord.top + spiderCoord.height / 2) - (POINTS[POINTS.length - 1].y)}px`;
            element.style.width = '1px';
            break;
        case 'ArrowLeft':
            element.style.left = `${spiderCoord.left + spiderCoord.width / 2}px`;
            element.style.top = `${spiderCoord.top + spiderCoord.height / 2}px`;
            element.style.width = `${POINTS[POINTS.length - 1].x - (spiderCoord.left + spiderCoord.width / 2)}px`;
            element.style.height = '1px';
            break;
        case 'ArrowRight':
            element.style.left = `${POINTS[POINTS.length - 1].x}px`;
            element.style.top = `${POINTS[POINTS.length - 1].y}px`;
            element.style.width = `${(spiderCoord.left + spiderCoord.width / 2) - (POINTS[POINTS.length - 1].x)}px`;
            element.style.height = '1px';
            break;
    }
    console.log('width: ' + element.style.width + ' | height: ' + element.style.height);
    document.querySelector('.gameboard').appendChild(element);
};