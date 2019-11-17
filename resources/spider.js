let BOUNDARY = null;
let PLAY_AREA = [];
const SVGNS = "http://www.w3.org/2000/svg";
const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
let SPEED = 3;
let LIVES = 3;
let LINE_POINTS = [];
let LAST_DIRECTION = null;
let NUM = 0;
let CANVAS_ID = 0;

function start() {
    //createGameBoard();
    BOUNDARY = document.querySelector('.gameboard').getBoundingClientRect();
    createSpider();
    updateInfo();
    setInitialPlayAreaBorders();
    buildPlayArea();

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
    document.querySelector('.spider').remove();
};

function buildPlayArea() {
    let svg = document.getElementById('playArea');
    svg.setAttributeNS(null, 'width', `${Math.ceil(BOUNDARY.width -100)}px`);
    svg.setAttributeNS(null, 'height', `${Math.ceil(BOUNDARY.height -100)}px`);
    let shape = document.createElementNS(SVGNS, "polygon");
    shape.setAttributeNS(null, "points", "0,0 300,0, 300,300 0,300");
    shape.setAttributeNS(null, "fill", "white");
    shape.setAttributeNS(null, "fill", "white");
    svg.appendChild(shape);
}

function buildSafeArae2() {
    var svg2 = document.getElementById('playArea');
    var shape = document.createElementNS(SVGNS, "polygon");
    shape.setAttributeNS(null, "points", "50, 50 100, 100, 100, 50");
    //  shape.setAttributeNS(null, "points", 100, 100);
    // shape.setAttributeNS(null, "points", 100, 50);
    shape.setAttributeNS(null, "fill", "red");
    svg2.appendChild(shape);
}

function updateInfo() {
    let info = document.querySelector('.info');
    info.innerHTML = `LIVES: ${LIVES} ||  SCORE: ${666}`;
};

function setInitialPlayAreaBorders() {
    let playArea = document.querySelector('#playArea').getBoundingClientRect(),
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
    let ENTERED = hasEntered(spiderCoord); // enterPlayArea(spiderCoord);
    console.log(ENTERED);
    setPoints(spiderCoord, code, ENTERED);
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

function setPoints(spiderCoord, code, ENTERED) {
    //continue drawing insie Area
    if (code === LAST_DIRECTION && ENTERED) {
        removeline();
        drawLine(spiderCoord);
        return
        // first time entered
    } else if (ENTERED) {
        LINE_POINTS.push(new Vector(spiderCoord.left + spiderCoord.width / 2, spiderCoord.top + spiderCoord.height / 2));
        NUM++;
        LAST_DIRECTION = code;
        removeline();
        drawLine(spiderCoord);
        console.log(LINE_POINTS);
        // finished drawing
    } else if (!ENTERED && LINE_POINTS.length !== 0) {
        LINE_POINTS.push(new Vector(spiderCoord.left + spiderCoord.width / 2, spiderCoord.top + spiderCoord.height / 2));
        buildOwnedArea();
        LINE_POINTS = [];
        NUM = 0;
    }
    // do nothing when moving in safe area
};

function buildOwnedArea() {
    // Line points add to area points
    PLAY_AREA = PLAY_AREA.concat(LINE_POINTS);
    //should filter out points that are in safe zone
    sortAreaPoints();
    // build cancas
    buildSafeArae2();
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

function hasEntered(spiderCoord) {
    let intersectings = 0;
    let spiderX = spiderCoord.left + spiderCoord.width / 2;
    let spiderY = spiderCoord.bottom - spiderCoord.height / 2
    for (let i = 0; i < PLAY_AREA.length; i++) {
        let p, q;
        if (i === PLAY_AREA.length - 1) {
            p = PLAY_AREA[0];
            q = PLAY_AREA[i];
        } else {
            p = PLAY_AREA[i];
            q = PLAY_AREA[i + 1]
        }
        if (spiderX <= Math.max(p.x, q.x) &&
            spiderY >= Math.min(p.y, q.y) &&
            spiderY < Math.max(p.y, q.y)) {
            intersectings++;
        }
    }
    return !(intersectings % 2 === 0);
};

function sortAreaPoints() {
    //traveling salesman problem
    let left = PLAY_AREA[0];
    let right = PLAY_AREA[0];
    let above = [];
    let below = [];
    PLAY_AREA.forEach(point => {
        if (point.x < left.x) {
            left = point;
        }
        if (point.x > right.x) {
            right = point;
        }
    });
    //cross product
    let vector1 = new Vector(right.x - left.x, right.y - left.y);
    PLAY_AREA.forEach(point => {
        let vector2 = new Vector(right.x - point.x, right.y - point.y);
        (vector1.x * vector2.y) - (vector1.y * vector2.x) <= 0 ? above.push(point) : below.push(point);
    });
    above.sort((a, b) => a.x - b.x);
    above = above.filter(el => (el.x !== left.x && el.y !== left.y) || (el.x !== right.x && el.y !== right.y));
    below.sort((a, b) => b.x - a.x);
    below = below.filter(el => (el.x !== left.x && el.y !== left.y) || (el.x !== right.x && el.y !== right.y));
    PLAY_AREA = [left].concat(above, right, below);
};