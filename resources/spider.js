let BOUNDARY = {};
let PLAY_AREA = [];
const SVGNS = "http://www.w3.org/2000/svg";
const KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
let SPEED = 1;
let LIVES = 3;
let LINE_POINTS = [];
let LAST_DIRECTION = null;
let NUM = 0;
let CANVAS_ID = 0;
let ENTERED = false;

function start() {
    createBoundaryPoints();
    createSpider();
    updateInfo();
    buildInitialPlayArea();
    setInitialPlayAreaBorders();

    asd();
    document.addEventListener('keydown', checkKeys);
};

function createBoundaryPoints() {
    let boundary = document.querySelector('.gameboard').getBoundingClientRect();
    BOUNDARY.left = Math.floor(boundary.left);
    BOUNDARY.top = Math.floor(boundary.top);
    BOUNDARY.left = Math.ceil(boundary.left);
    BOUNDARY.right = Math.ceil(boundary.right);
    BOUNDARY.width = Math.ceil(boundary.width);
    BOUNDARY.height = Math.ceil(boundary.height);
};

function asd() {
    for (let i = 0; i < PLAY_AREA.length; i++) {
        let a = document.createElement('div');
        let p = PLAY_AREA[i];
        a.className = 'dot';
        a.style.left = `${p.x}px`;
        a.style.top = `${p.y}px`;
        document.body.appendChild(a);
    }
}

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
    newSpider.style.width = '9px';
    newSpider.style.height = '9px';
    if (!x && !y) {
        newSpider.style.left = '20px';
        newSpider.style.top = '100px'
    } else {
        newSpider.style.left = `${x - 5}px`; //half of the width
        newSpider.style.top = `${y - 5}px`;
    }
    document.body.appendChild(newSpider);
};

function removeSpider() {
    document.querySelector('.spider').remove();
};

function buildInitialPlayArea() {
    let svg = document.getElementById('playArea');
    svg.setAttributeNS(null, 'width', `${BOUNDARY.width - 100}px`);
    svg.setAttributeNS(null, 'height', `${BOUNDARY.height - 100}px`);
    let shape = document.createElementNS(SVGNS, "polygon");
    shape.setAttributeNS(null, "points", "0,0 300,0, 300,300 0,300");
    shape.setAttributeNS(null, "fill", "white");
    shape.setAttributeNS(null, "stroke", "black");
    svg.appendChild(shape);
}

function buildSafeArea() {
    var svg2 = document.getElementById('playArea');
    var shape = document.createElementNS(SVGNS, "polygon");
    shape.setAttributeNS(null, "points", createPolygonPoints());
    shape.setAttributeNS(null, "fill", "red");
    svg2.appendChild(shape);
};

function createPolygonPoints() {
    let tempPlayPoints = LINE_POINTS;
    return tempPlayPoints.map(el => `${el.x - 70},${el.y - 100} `).reduce((acc, el) => acc + el);
};

function updateInfo() {
    let info = document.querySelector('.info');
    info.innerHTML = `LIVES: ${LIVES} ||  SCORE: ${666}`;
};

function setInitialPlayAreaBorders() {
    let playArea = document.querySelector('#playArea').getBoundingClientRect(),
        minX = Math.ceil(playArea.left),
        maxX = Math.ceil(playArea.right - 2),
        minY = Math.ceil(playArea.top),
        maxY = Math.ceil(playArea.bottom - 2);
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
    const spiderCoord = getSpiderCoord();
    const spiderNextCoord = getSpiderNextCoord(spiderCoord, code);
    ENTERED = hasEntered(spiderCoord, spiderNextCoord);
    console.log(ENTERED);
    setPoints(spiderCoord, spiderNextCoord, code);
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

function getSpiderCoord() {
    let spiderStyle = document.querySelector('.spider').style;
    let left = Number(spiderStyle.left.slice(0, spiderStyle.left.indexOf('p')));
    let top = Number(spiderStyle.top.slice(0, spiderStyle.top.indexOf('p')));
    let halfWidth = Math.ceil(Number(spiderStyle.width.slice(0, spiderStyle.width.indexOf('p'))) / 2);
    return new Vector(left + halfWidth, top + halfWidth);
};

function getSpiderNextCoord(spiderCoord, code) {
    let nextCoord;
    switch (code) {
        case 'ArrowUp':
            return nextCoord = new Vector(spiderCoord.x, spiderCoord.y - SPEED);
        case 'ArrowDown':
            return nextCoord = new Vector(spiderCoord.x, spiderCoord.y + SPEED);
        case 'ArrowLeft':
            return nextCoord = new Vector(spiderCoord.x - SPEED, spiderCoord.y);
        case 'ArrowRight':
            return nextCoord = new Vector(spiderCoord.x + SPEED, spiderCoord.y);
    }
};

function checkMoveUp(spiderCoord) {
    if (spiderCoord.y <= BOUNDARY.top) {
        return;
    }
    removeSpider();
    createSpider(spiderCoord.x, spiderCoord.y - SPEED);
};

function checkMoveDown(spiderCoord) {
    if (spiderCoord.y >= BOUNDARY.bottom) {
        return;
    }
    removeSpider();
    createSpider(spiderCoord.x, spiderCoord.y + SPEED);
};


function checkMoveLeft(spiderCoord) {
    if (spiderCoord.x <= BOUNDARY.left) {
        return;
    }
    removeSpider();
    createSpider(spiderCoord.x - SPEED, spiderCoord.y);
};

function checkMoveRight(spiderCoord) {
    if (spiderCoord.x >= BOUNDARY.right) {
        return;
    }
    removeSpider();
    createSpider(spiderCoord.x + SPEED, spiderCoord.y);
};

function setPoints(spiderCoord, spiderNextCoord, code) {
    //continue drawing insie Area
    if (code === LAST_DIRECTION && ENTERED) {
        removeline();
        drawLine(spiderNextCoord);
        return
        // first time entered or changed direction
    } else if (ENTERED) {
        LINE_POINTS.push(spiderCoord);
        NUM++;
        LAST_DIRECTION = code;
        removeline();
        drawLine(spiderCoord);
        console.log(LINE_POINTS);
        // finished drawing
    } else if (!ENTERED && LINE_POINTS.length !== 0) {
        LINE_POINTS.push(spiderCoord);
        buildOwnedArea();
        LINE_POINTS = [];
        NUM = 0;
    }
    // do nothing when moving in safe area
};

function buildOwnedArea() {
    calculateNewAreaPoints();
    sortAreaPoints();
    buildSafeArea();
    console.log('budowaniediva');
};

function calculateNewAreaPoints() {
    let pointsToRemove = [];
    if (isPossibleBuildArea(LINE_POINTS)) {
        PLAY_AREA = PLAY_AREA.concat(LINE_POINTS);
    } else {
        //ten else nie uwzglednia 2 pktowo !!!!
        PLAY_AREA.forEach(point => {
            let tempLinePoints = LINE_POINTS;
            if (isPossibleBuildArea(tempLinePoints.concat(point))) {
                pointsToRemove.push(point);
                return;
            }
        });
        //PLAY_AREA = PLAY_AREA.concat(LINE_POINTS);
        //PLAY_AREA = PLAY_AREA.filter(p => p.x === pointsToRemove[0].x && p.y === pointsToRemove[0].y);
    }
};

function isPossibleBuildArea(points) {
    let minX = points[0].x;
    let maxX = points[0].x;
    let minY = points[0].y;
    let maxY = points[0].y;
    let sumX = 0,
        sumY = 0;
    points.forEach(p => {
        if (p.x < minX) { minX = p.x }
        if (p.x > maxX) { maxX = p.x }
        if (p.y < minY) { minY = p.y }
        if (p.y > maxY) { maxY = p.y }
        sumX += p.x;
        sumY += p.y;
    });
    return sumX - ((maxX + minX) * 2) === 0 && sumY - ((maxY + minY) * 2) === 0;
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
    switch (LAST_DIRECTION) {
        case 'ArrowUp':
            element.style.left = `${spiderCoord.x}px`;
            element.style.top = `${spiderCoord.y}px`;
            element.style.height = `${(LINE_POINTS[LINE_POINTS.length - 1].y) - (spiderCoord.y)}px`;
            element.style.width = '1px';
            break;
        case 'ArrowDown':
            element.style.left = `${LINE_POINTS[LINE_POINTS.length - 1].x}px`;
            element.style.top = `${LINE_POINTS[LINE_POINTS.length - 1].y}px`;
            element.style.height = `${(spiderCoord.y) - (LINE_POINTS[LINE_POINTS.length - 1].y)}px`;
            element.style.width = '1px';
            break;
        case 'ArrowLeft':
            element.style.left = `${spiderCoord.x}px`;
            element.style.top = `${spiderCoord.y}px`;
            element.style.width = `${LINE_POINTS[LINE_POINTS.length - 1].x - (spiderCoord.x)}px`;
            element.style.height = '1px';
            break;
        case 'ArrowRight':
            element.style.left = `${LINE_POINTS[LINE_POINTS.length - 1].x}px`;
            element.style.top = `${LINE_POINTS[LINE_POINTS.length - 1].y}px`;
            element.style.width = `${(spiderCoord.x) - (LINE_POINTS[LINE_POINTS.length - 1].x)}px`;
            element.style.height = '1px';
            break;
    }
    console.log('width: ' + element.style.width + ' | height: ' + element.style.height);
    document.body.appendChild(element);
};

function hasEntered(spiderCoord, spiderNextCoord) {
    let poitsToCheck = ENTERED ? spiderCoord : spiderNextCoord;
    let intersectings = 0;
    for (let i = 0; i < PLAY_AREA.length; i++) {
        let p, q;
        if (i === PLAY_AREA.length - 1) {
            p = PLAY_AREA[0];
            q = PLAY_AREA[i];
        } else {
            p = PLAY_AREA[i];
            q = PLAY_AREA[i + 1]
        }
        if (poitsToCheck.x <= Math.max(p.x, q.x) &&
            poitsToCheck.y >= Math.min(p.y, q.y) &&
            poitsToCheck.y < Math.max(p.y, q.y)) {
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