var helicopter;
var lightbeams = [];
var buildings = [];
var buildingImgs = ["images/building.gif", "images/building2.gif", "images/building3.gif", "images/building4.gif"];
var score;
var endtext;
var finalscore;
var themeSong;
var pilotlevel;
var pilottext;

// starting page
function loadthedamngame() {
    createCanvas.onload();
    onloadtext = new component("20px", "Consolas", "white", 25, 120, "text");
    onloadtext.text = ".:: Press any key to start the game ::.";
    onloadtext.update();
    addEventListener("keydown", function () {
        startGame();
        themeSong = new audio("TBiisi.wav");
        themeSong.play();
    });
}

// creating game area
var createCanvas = {
    canvas: document.createElement("canvas"),
    onload: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}

// game start
function startGame() {
    helicopter = new component(50, 30, "images/kopterigifu2.gif", 10, 120, "image");
    helicopter.gravity = 0.05;
    score = new component("20px", "Consolas", "white", 340, 20, "text");
    gameArea.start();
}

// gamearea controls
var gameArea = {
    start: function () {
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        createCanvas.context.clearRect(0, 0, createCanvas.canvas.width, createCanvas.canvas.height);
    }
}

// sound function
function audio(src) {
    this.audio = document.createElement("audio");
    this.audio.src = src;
    this.audio.setAttribute("preload", "auto");
    this.audio.setAttribute("controls", "none");
    this.audio.style.display = "none";
    document.body.appendChild(this.audio);
    this.play = function () {
        this.audio.play();
    }
    this.stop = function () {
        this.audio.pause();
    }
}

// component attributes
function component(width, height, color, x, y, type) {
    this.type = type;
    if (this.type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function () {
        ctx = createCanvas.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        if (this.type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    // updating the helicopter position
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
    }
    // how to crash into objects
    this.crashWith = function (otherobj) {
        var copterleft = this.x;
        var copterright = this.x + (this.width);
        var coptertop = this.y;
        var copterbottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((copterbottom < othertop) || (coptertop > otherbottom) || (copterright < otherleft) || (copterleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

// updating the game area
function updateGameArea() {
    var x, height, minHeight, maxHeight;
    for (i = 0; i < lightbeams.length; i += 1) {
        if (helicopter.crashWith(lightbeams[i])) {
            endgame();
            return;
        }
    }
    for (i = 0; i < buildings.length; i += 1) {
        if (helicopter.crashWith(buildings[i])) {
            endgame();
            return;
        }
    }
    if ((helicopter.y > (createCanvas.canvas.height - helicopter.height)) || (helicopter.y <= 0)) {
        endgame();
        return;
    }

    gameArea.clear();
    gameArea.frameNo += 1;

    // deathrays!!!
    if (gameArea.frameNo == 1 || everyinterval(130)) {
        x = createCanvas.canvas.width;
        minHeight = 60;
        maxHeight = 105;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        lightbeams.push(new component(15, height, "images/deathray.gif", x, 0, "image"));
    }
    for (i = 0; i < lightbeams.length; i += 1) {
        lightbeams[i].x += -1;
        lightbeams[i].update();
    }

    // buildings
    if (gameArea.frameNo == 1 || everyinterval(60)) {
        x = createCanvas.canvas.width;
        minHeight = 60;
        maxHeight = 120;
        image = buildingImgs[Math.floor(Math.random() * buildingImgs.length)];
        width = Math.floor(Math.random() * 11) + 30;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        buildings.push(new component(width, height, image, x, 270 - height, "image"));
    }
    for (i = 0; i < buildings.length; i += 1) {
        buildings[i].x += -1;
        buildings[i].update();
    }

    // score
    score.text = "SCORE: " + gameArea.frameNo;
    score.update();
    helicopter.newPos();
    helicopter.update();
}

// counting intervals
function everyinterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

// flying
function accelerate(n) {
    helicopter.gravity = n;
}

// game over screen
function endgame() {
    themeSong.stop();
    gameArea.clear();
    endtext = new component("40px", "Consolas", "white", 135, 105, "text");
    finalscore = new component("25px", "Consolas", "white", 125, 155, "text");
    endtext.text = "GAME OVER";
    endtext.update();
    finalscore.text = "YOUR " + score.text;
    finalscore.update();

    if (gameArea.frameNo <= 400) {
        pilotlevel = "Chicken";
    } else if (gameArea.frameNo <= 1000) {
        pilotlevel = "Zapp Brannigan";
    } else if (gameArea.frameNo <= 1900) {
        pilotlevel = "Dumbo";
    } else if (gameArea.frameNo <= 2500) {
        pilotlevel = "Porco Rosso";
    } else if (gameArea.frameNo <= 3200) {
        pilotlevel = "Amelia Earhart";
    } else if (gameArea.frameNo <= 4000) {
        pilotlevel = "Topper Harley";
    } else if (gameArea.frameNo <= 4700) {
        pilotlevel = "Maverick";
    } else if (gameArea.frameNo <= 6000) {
        pilotlevel = "Sulu";
    } else {
        pilotlevel = "Han Solo";
    }

    pilottext = new component("20px", "Consolas", "white", 110, 220, "text");
    pilottext.text = "Pilot level: " + pilotlevel;
    pilottext.update();

}