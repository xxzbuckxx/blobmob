//DEVELOPED BY ZACK TRACZYK ;]

const c = document.getElementById('canvas');
const ctx = c.getContext('2d');
const w = c.width;
const h = c.height;
let HowTo = false;
let randNum = 0;
const colors = ['#ffd6cc', '#ffc2b3', '#ffad99', '#ff9980', '#ff9980']; //Player color strobe
const ecolors = ['#81ea25', '#6bba27', '#96e84e', '#abf966', '#b9f981']; //Enemy color strobe
const ebcolors = ['#f45642', '#e06757', '#f9543e', '#dd351f', '#ed452f']; //Enemy Boss color strobe
var r = 3;
var pause = true;
var ponce = true;
var power = 50;
var cool = 0;
var health = 100;
var dead = false;
var score = 0;
var highscore = localStorage.getItem("highscore"); //Cookie storage
var recent = 'right';
var damaging;
var playerDead = false;
var speed = 1;
var regeneration = false;
var justRegen = false;
var Otime = 0;
var randomColor = '#ffd6cc'; //Set so player doesnt strobe
var background = new Image();
background.src = 'http://www.photos-public-domain.com/wp-content/uploads/2011/02/crumpled-notebook-paper-texture.jpg'; //NOT IN USE

var sessionM;

var at; //Attack id
var ah; //HealthLoss id
var de; //Death id
var pu; //Push id
var he; //heal id

//--------------FUNCTIONS--------------//
function random(a) {
    var rand = Math.random() * 10;
    if (rand - 5 > 0 && a < 60) {
        return a + 1;
    } else if (rand - 5 <= 0 && a > 40) {
        return a - 1;
    } else {
        return a;
    }
}

function srandom(a) {
    var rand = Math.random() * 10;
    if (rand > 5) {
        return a + 1;

    } else {
        return a - 1;
    }
}


function mxrandom(a) {
    var rand = Math.random() * 10;
    if (rand > 5 && a < w - wx - 10) {
        return a + 1;

    } else if (rand <= 5 && a > 10) {
        return a - 1;
    } else {
        return a;
    }
}


function myrandom(a) {
    var rand = Math.random() * 10;
    if (rand > 5 && a > 10) {
        return a - 1;

    } else if (rand <= 5 && a < h - wy - 10) {
        return a + 1;
    } else {
        return a;
    }
}

function randomLocation(a) {
    if (Math.random() * 10 >= 5) {
        if (Math.random() * 10 >= 5) {
            a.esx = Math.random() * w;
            a.esy = -50 * Math.random() - 20;
        } else {
            a.esx = Math.random() * w;
            a.esy = h + 50 * Math.random() + 20;
        }
    } else {
        if (Math.random() * 10 >= 5) {
            a.esx = -50 * Math.random() - 20;
            a.esy = Math.random() * h;
        } else {
            a.esx = w + 50 * Math.random() + 20;
            a.esy = Math.random() * h;
        }
    }

}

//Player and Enemy trackers
function collide() {
    if (sx < 0 || sy < 0 || sx + wx > w || sy + wy > h) {
        return true;
    }
}

function touch(enemy) {
    if (((sx <= enemy.esx && enemy.esx <= sx + wx) && (sy <= enemy.esy && enemy.esy <= sy + wy)) || ((sx <= enemy.esx + enemy.ewx && enemy.esx + enemy.ewx <= sx + wx) && (sy <= enemy.esy + enemy.ewy && enemy.esy + enemy.ewy <= sy + wy))) {
        return true;
    }
}


function inarea(enemy) {
    if (((sx - (wx / 2 + r) <= enemy.esx && enemy.esx <= sx + wx + (wx / 2 + r)) && (sy - (wy / 2 + r) <= enemy.esy && enemy.esy <= sy + wy + (wy / 2 + r))) || ((sx <= enemy.esx + enemy.ewx && enemy.esx + enemy.ewx <= sx + wx + (wx / 2 + r)) && (sy <= enemy.esy + enemy.ewy && enemy.esy + enemy.ewy <= sy + wy - (wy / 2 + r)))) {
        return true;
    }
}

//Cookie Storage
function setHighScore() {
    if (highscore !== null) {
        if (score > highscore) {
            localStorage.setItem("highscore", score);
        }
    } else {
        highscore = 0;
        localStorage.setItem("highscore", score);
    }
}

//Resets variables
function reset(){
    enemies.forEach(function(item, index, arr){
        arr[index].state = 'none';
    });
    
    rDown = false;
    lDown = false;
    uDown = false;
    dDown = false;
    attackb = false;
    attackz = false;
    attackx = false;
    speed = 1;
    regeneration = false;
    Otime = 0;
    power = 50;
    dead = false;
    health = 100;
    damaging = false;
    cool = 0;
}
    
//-----------------------------------//
//--------------ATTACKS--------------//

function enemy(state, type, enemspeed) {

    this.state = state, //Spawn, alive, push, dying, or dead

    this.type = type, //Regular or boss

    this.speed = enemspeed * speed,
    
    this.bossIsAlive = false, //Boss not functional

    this.spawn = function() {
        randomLocation(this);
        this.state = 'alive';
    },

    this.draw = function() {
        ctx.lineWidth = 1;
        randNum = Math.round(Math.random() * 2);
        var erandomColor = ecolors[randNum];
        ctx.fillStyle = erandomColor;
        this.ewx = wx / 2 - 10;
        this.ewy = wy - 10;
        ctx.beginPath();
        
        //Draws Body
        ctx.moveTo(this.esx - this.ewx / 8, this.esy);
        ctx.bezierCurveTo(this.esx - this.ewx / 8, this.esy - this.ewy / 4,
                          this.esx + this.ewx + this.ewx / 8, this.esy - this.ewy / 4,
                          this.esx + this.ewx + this.ewx / 8, this.esy);

        ctx.bezierCurveTo(this.esx + this.ewx * 2, this.esy,
                          this.esx + this.ewx * 2, this.esy + this.ewy,
                          this.esx + this.ewx - this.ewx / 8, this.esy + this.ewy);

        ctx.bezierCurveTo(this.esx + this.ewx - this.ewx / 8, this.esy + this.ewy * 1.75,
                          this.esx - this.ewx * 2, this.esy + this.ewy / 4,
                          this.esx, this.esy + this.ewy / 2);

        ctx.bezierCurveTo(this.esx - this.ewx, this.esy + this.ewy / 2,
                          this.esx - this.ewx / 2, this.esy,
                          this.esx - this.ewx / 8, this.esy);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = 1;

        //Draws Left Eye
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(this.esx + this.ewx / 6, this.esy + this.ewy / 6, (this.ewx / 4 + this.ewy / 4) / 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        //Draws Right Eye
        ctx.beginPath();
        ctx.arc(this.esx + this.ewx - this.ewx / 8, this.esy + this.ewy / 6, (this.ewx / 4 + this.ewy / 4) / 6, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        //Draws Mouth
        ctx.beginPath();
        ctx.moveTo(this.esx + this.ewx / 8, this.esy + this.ewy);
        ctx.bezierCurveTo(this.esx + this.ewy / 8, this.esy + this.ewy - this.ewy /3, this.esx + this.ewx - this.ewy / 8, this.esy + this.ewy - this.ewy /3, this.esx + this.ewx - this.ewy / 8, this.esy + this.ewy);
        ctx.stroke();
        ctx.closePath();
    },

    this.drawBoss = function() {
        ctx.lineWidth = 1;
        randNum = Math.round(Math.random() * 2);
        var ebrandomColor = ebcolors[randNum];
        ctx.fillStyle = ebrandomColor;
        this.ewx = wx - 10;
        this.ewy = wy * 2 - 10;
        ctx.beginPath();

        ctx.moveTo(this.esx - this.esx / 20, this.esy);
        ctx.bezierCurveTo(this.esx - this.esx / 20, this.esy - this.esy / 20, this.esx + this.ewx + this.esx / 20, this.esy - this.esy / 20, this.esx + this.ewx + this.esx / 20, this.esy);

        ctx.bezierCurveTo(this.esx + this.ewx + this.esx / 10, this.esy, this.esx + this.ewx + this.esx / 10, this.esy + this.ewy, this.esx + this.ewx, this.esy + this.ewy);

        ctx.bezierCurveTo(this.esx + this.ewx / 10, this.esy + this.esy / 4, this.esx - this.ewx * 2, this.esy + this.ewy / 4, this.esx - this.esx / 20, this.esy + this.ewy / 2);

        ctx.bezierCurveTo(this.esx - this.ewx / 2, this.esy + this.ewy / 2, this.esx - this.ewx * 2, this.esy + this.ewy / 4, this.esx - this.esx / 20, this.esy);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(this.esx + this.ewx / 6, this.esy + this.ewy / 6, (this.ewx / 4 + this.ewy / 4) / 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.esx + this.ewx - this.ewx / 8, this.esy + this.ewy / 6, (this.ewx / 4 + this.ewy / 4) / 6, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(this.esx + this.ewy / 8, this.esy + this.ewy);
        ctx.bezierCurveTo(this.esx + this.ewx / 8, this.esy + this.ewy - this.ewy / 3, this.esx + this.ewx - this.ewy / 8, this.esy + this.ewy - this.ewy / 3, this.esx + this.ewx - this.ewy / 8, this.esy + this.ewy);
        ctx.stroke();
        ctx.closePath();
    },

    this.move = function() {

        if (this.esx > sx + wx / 10) this.esx -= this.speed;
        if (this.esx < sx + wx / 10) this.esx += this.speed;

        if (this.esy > sy + wy / 10) this.esy -= this.speed;
        if (this.esy < sy + wy / 10) this.esy += this.speed;

        this.esx = random(this.esx);
        this.esy = random(this.esy);
    },

    this.kill = function() {
        this.ewx -= 2;
        this.ewy -= 2;

        //Draws Body
        ctx.moveTo(this.esx - this.ewx / 8, this.esy);
        ctx.bezierCurveTo(this.esx - this.ewx / 8, this.esy - this.ewy / 4,
                          this.esx + this.ewx + this.ewx / 8, this.esy - this.ewy / 4,
                          this.esx + this.ewx + this.ewx / 8, this.esy);

        ctx.bezierCurveTo(this.esx + this.ewx * 2, this.esy,
                          this.esx + this.ewx * 2, this.esy + this.ewy,
                          this.esx + this.ewx - this.ewx / 8, this.esy + this.ewy);

        ctx.bezierCurveTo(this.esx + this.ewx - this.ewx / 8, this.esy + this.ewy * 1.75,
                          this.esx - this.ewx * 2, this.esy + this.ewy / 4,
                          this.esx, this.esy + this.ewy / 2);

        ctx.bezierCurveTo(this.esx - this.ewx, this.esy + this.ewy / 2,
                          this.esx - this.ewx / 2, this.esy,
                          this.esx - this.ewx / 8, this.esy);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        if (this.ewx <= 0 || this.ewy <= 0) {
            effects.stop(ah);
            de = effects.play('death');
            score++;
            if (power < 50) power += 1;
            this.state = 'dead';
            if(this.type == 'boss') this.bossIsAlive = false;
        }
    },

    this.push = function() {
        if(this.type == 'regular')this.draw();
        else if(this.type== 'boss')this.drawBoss();
        if (inarea(this)) {
            if (this.esx > sx + wx / 10) this.esx += 6;
            if (this.esx < sx + wx / 10) this.esx -= 6;

            if (this.esy > sy + wy / 10) this.esy += 6;
            if (this.esy < sy + wy / 10) this.esy -= 6;
        } else {
            this.esx = srandom(this.esx);
            this.esy = srandom(this.esy);
        }
    };


}

function stateDef(a) {
    if (a.type == 'regular') {
        if (a.state == 'spawn' || a.state == 'dead') {
            a.spawn();
        } else if (a.state == 'alive') {
            if(pause === false) a.move();
            a.draw();
        } else if (a.state == 'dying') {
            a.kill();
        } else if (a.state == 'push') {
            a.push();
        }
    } else if (a.type == 'boss') {
        if (a.state == 'spawn') {
            a.spawn();
        } else if (a.state == 'alive') {
            if(pause === false) a.move();
            a.drawBoss();
        } else if (a.state == 'dying') {
            a.kill();
        } else if (a.state == 'push') {
            a.push();
        }
    }
}

function stateDefinition(){
    stateDef(enemy1);
    stateDef(enemy2);
    stateDef(enemy3);
    stateDef(enemy4);
    stateDef(enemy5);
    stateDef(enemy6);
    stateDef(enemy7);
    stateDef(enemy8);
    stateDef(enemy9);
    stateDef(enemy10);
    stateDef(enemy11);
    stateDef(enemy12);
    stateDef(enemy13);
    stateDef(enemy14);
    stateDef(enemy15);
}

function enemySpawn(){
    if (Otime == 20)enemy1.state = 'spawn';

    if (Otime == 100) enemy2.state = 'spawn';

    if (Otime == 300) enemy3.state = 'spawn';

    if (Otime == 500) enemy4.state = 'spawn';

    if (Otime == 800) enemy5.state = 'spawn';

    if (Otime == 1000) enemy6.state = 'spawn';

    if (Otime == 1500) enemy7.state = 'spawn';

    if (Otime == 1800) enemy8.state = 'spawn';

    if (Otime == 2000) enemy9.state = 'spawn';

    if (Otime == 2500) enemy10.state = 'spawn';

    if (Otime == 3000) enemy11.state = 'spawn';

    if (Otime == 3500) enemy12.state = 'spawn';

    if (Otime == 4000){ 
        enemy13.state = 'spawn';
        enemy14.state = 'spawn';
        enemy15.state = 'spawn';
    }
}

function enemeySpeed(){
    if(score >= 20 && score < 40)speed=1.2;
    if(score >= 40 && score < 80)speed=1.25;
    if(score >= 80 && score < 100)speed=1.5;
    if(score >= 100 && score < 200)speed=1.75;
    if(score >= 200 && score < 250)speed=2;
    if(score >= 250 && score < 300)speed=2.5;
    if(score >= 300)speed=3;
}

//-------------------------------//

function pauseMenu() {
    if(ponce){
        if (pause) pause = false;
        else pause = true;
        
        ponce = false;
        effects.play('btn');
    }
    
    if(pause){
        ctx.fillStyle = "rgba(225, 220, 212, 0.4)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "grey";
        ctx.font = "50px monospace";
        ctx.fillText("PAUSE", w / 2 - (ctx.measureText("Pause").width/2), h/2 + 10);
    } 
}

//-----------------------------------//
//--------------SESSION--------------//

function menu() {
    setHighScore();
    sx = 150;
    sy = 150;
    wx = 200;
    wy = 200;
    score = 0;
    highscore = localStorage.getItem("highscore");
    titleTheme.play();
    var sessionME = setInterval(function() {
        ctx.clearRect(0, 0, w, h);
        
        var grd = ctx.createLinearGradient(0, 0, w, 0);
        grd.addColorStop(0, '#ffd6cc');
        grd.addColorStop(0.8, 'grey');
        grd.addColorStop(1, '#fffbf9');
        ctx.fillStyle = '#fffbf9';
        ctx.fillRect(0, 0, w, h);
        drawChar();
        ctx.fillStyle = grd;
        ctx.font = '80px Arial Bold';
        ctx.fillText("BLOB MOB", w / 2 - (ctx.measureText("BLOB MOB").width/2), 100);
        ctx.font = '30px Arial Bold';
        ctx.fillText("START", w / 2 - (ctx.measureText("START").width/2), 400);
        var grd1 = ctx.createLinearGradient(0, 0, w*3, 0);
        grd1.addColorStop(0, 'grey');
        grd1.addColorStop(1, 'white');
        ctx.fillStyle = grd1;
        ctx.font = '15px sans-serif';
        var bottommenu = "  About   -   HOW TO PLAY   -   Traczyk";
        ctx.fillText(bottommenu, w / 2 - (ctx.measureText(bottommenu).width/2), h - 10);
        ctx.fillRect(10, h - 13, w / 2 - (ctx.measureText(bottommenu).width/2) - 10, 1);
        ctx.fillRect(w / 2 + (ctx.measureText(bottommenu).width/2) + 10, h - 13, w / 2 - (ctx.measureText(bottommenu).width/2) - 10, 1);
        
        if(pause === false){
            sx = mxrandom(sx);
            sy = myrandom(sy);
            wx = srandom(wx);
            wy = srandom(wy);
        }
        
        pauseMenu();
        
        listen();

        if(HowTo) HowToPlay();

        canvas.addEventListener("mousedown", getPosition, false);
        //Start Click Area --> ctx.strokeRect(w / 2 - 40, 380, 80, 40);
        //Howto Click Area --> ctx.strokeRect(w / 2 - (ctx.measureText(bottommenu).width/4), h-30, (ctx.measureText(bottommenu).width/2), 30);
        //About Click Area --> ctx.strokeRect(w / 2 - (ctx.measureText(bottommenu).width/2) - 5, h - 30, 60, 30);
        
        if (x >= w / 2 - (ctx.measureText(bottommenu).width/2) - 5 && x <= w / 2 - (ctx.measureText(bottommenu).width/2) + 55 && y >= h - 30 && y <= h && pause === false){
            clearInterval(sessionME);
            canvas.removeEventListener("mousedown", getPosition, false);
            window.location.href = '/about.html';
        }
        
        if (x >= w / 2 - 40 && x <= w / 2 + 40 && y >= 380 && y <= 420 && pause === false) {
            clearInterval(sessionME);
            transition();
            canvas.removeEventListener("mousedown", getPosition, false);
        } else if(x >= w / 2 - (ctx.measureText(bottommenu).width/4) && x <= w / 2 + (ctx.measureText(bottommenu).width/4) && y >= h - 30 && y <= h && HowTo === false && pause === false){
            effects.play('btn');
            HowTo = true;
            x = 0;
            y = 0;
        } else if((x >= w / 2 - (ctx.measureText(bottommenu).width/4) && x <= w / 2 + (ctx.measureText(bottommenu).width/4) && y >= h - 30 && y <= h && HowTo) || (x >= w - 35 - ctx.measureText("X").width && x <=  h - 30 && y >= 30 && y <= 60) && pause === false){
            effects.play('btn');
            HowTo = false;
            x = 0;
            y = 0;
        }
        document.body.style.backgroundColor = '#fffbf9';
    }, 50);
}

function HowToPlay(){
    ctx.fillStyle = '#ffd6cc';
    ctx.fillRect(30,30,w - 60, h - 60);
    ctx.fillStyle = 'black';
    ctx.font = '20px monospace';
    ctx.fillText("X",w - 35 - ctx.measureText("X").width, 50);
    var grd = ctx.createLinearGradient(0, 0, w, 0);
    grd.addColorStop(0, '#ffd6cc');
    grd.addColorStop(0.5, 'grey');
    grd.addColorStop(1, '#fffbf9');
    ctx.fillStyle = grd;
    ctx.font = '50px Arial Bold';
    ctx.fillText("HOW TO PLAY", w / 2 - (ctx.measureText("HOW TO PLAY").width/2), 80);
    ctx.fillStyle = 'grey';
    ctx.font = '15px monospace';
    var instruction1 = "Use the Arrow keys to move,";
    var instruction2 = "And press Space to attack.";
    var instruction3 = "You can only attack if your blue bar is full!";
    var instruction4 = "Try to attack the enemies";
    var instruction5 = "But use Z, your powerup, if you are swarmed.";
    var instruction6 = "You can also hold X to regenerate health.";
    var instruction7 = "Just remember, powerups and regeneration use power!";
    var instruction8 = "Press M to mute and P to pause";
    ctx.fillText(instruction1, w / 2 - (ctx.measureText(instruction1).width/2), 122);
    ctx.fillText(instruction2, w / 2 - (ctx.measureText(instruction2).width/2), 154);
    ctx.fillText(instruction3, w / 2 - (ctx.measureText(instruction3).width/2), 186);
    ctx.fillText(instruction4, w / 2 - (ctx.measureText(instruction4).width/2), 218);
    ctx.fillText(instruction5, w / 2 - (ctx.measureText(instruction5).width/2), 250);
    ctx.fillText(instruction6, w / 2 - (ctx.measureText(instruction6).width/2), 282);
    ctx.fillText(instruction7, w / 2 - (ctx.measureText(instruction7).width/2), 314);
    ctx.fillStyle = 'red';
    ctx.fillText(instruction8, w / 2 -40, 463);

    var esx = 380;
    var esy = 390;
    var ewx = 20;
    var ewy = 40;

    ctx.lineWidth = 1;

    randNum = Math.round(Math.random() * 2);
    var erandomColor = ecolors[randNum];
    ctx.fillStyle = erandomColor;

    ctx.beginPath();

    ctx.moveTo(esx - esx / 20, esy);
    ctx.bezierCurveTo(esx - esx / 20, esy - esy / 20, esx + ewx + esx / 20, esy - esy / 20, esx + ewx + esx / 20, esy);

    ctx.bezierCurveTo(esx + ewx + esx / 10, esy, esx + ewx + esx / 10, esy + ewy, esx + ewx, esy + ewy);

    ctx.bezierCurveTo(esx + ewx / 10, esy + esy / 4, esx - ewx * 2, esy + ewy / 4, esx - esx / 20, esy + ewy / 2);

    ctx.bezierCurveTo(esx - esx / 20, esy + ewy / 2, esx - ewx * 2, esy + ewy / 4, esx - esx / 20, esy);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(esx + ewx / 6, esy + ewy / 6, (ewx / 4 + ewy / 4) / 4, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(esx + ewx - ewx / 8, esy + ewy / 6, (ewx / 4 + ewy / 4) / 6, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(esx + ewx / 8, esy + ewy - ewy / 3);
    ctx.bezierCurveTo(esx + ewy / 8, esy + ewy, esx + ewx - ewy / 8, esy + ewy, esx + ewx - ewy / 8, esy + ewy - ewy / 3);
    ctx.stroke();
    ctx.closePath();

    ctx.font = '15px monospace';

    ctx.fillText("ENEMY", 390 - (ctx.measureText("ENEMY").width/2), 360);

    ctx.fillStyle = 'black';
    ctx.fillRect(w / 2 - 115 / 2 + 5, 395, 115, 20);
    ctx.fillStyle = 'blue';
    ctx.fillRect(w / 2 + 0.5 - 115 / 2 + 5, 396, 113 - (0 / 50) * 113, 18);

    ctx.fillStyle = 'black';
    ctx.fillText("COOL-DOWN BAR", w/2 - (ctx.measureText("COOL-DOWN BAR").width/2)+ 5, 360);

    ctx.fillStyle = 'black';
    ctx.fillRect((w-60) * (1 / 3)-90, 395, 115, 20);
    ctx.fillStyle = '#33cc33';
    ctx.font = "10px monospace";
    ctx.fillText(20 + "/50", (w-60) * (1 / 3)-90 + 52, 409);
    ctx.fillRect((w-60) * (1 / 3)-90 + 1, 396, (20 / 50) * 113, 18);

    ctx.font = '15px monospace';
    ctx.fillStyle = 'black';

    ctx.fillText("POWER", 90, 360);
}

function transition() {
    var gw = 0;
    var time = 0;
    titleTheme.fade(1.0, 0.0, 7000);
    titleTheme.on('fade', function(){
        titleTheme.stop();
    });
    var sessionT = setInterval(function() {
        time++;
        ctx.clearRect(0, 0, w, h);
        var grd = ctx.createLinearGradient(0, 0, w - gw, 0);
        grd.addColorStop(0, '#ffd6cc');
        grd.addColorStop(0.8, 'grey');
        grd.addColorStop(1, '#fffbf9');
        ctx.fillStyle = '#fffbf9';
        ctx.fillRect(0, 0, w, h);
        drawChar();
        ctx.fillStyle = grd;
        ctx.font = '80px Arial Bold';
        ctx.fillText("BLOB MOB", w / 2 - (ctx.measureText("BLOB MOB").width/2), 100);
        ctx.font = '30px Arial Bold';
        ctx.fillStyle = grd;
        ctx.fillText("START", w / 2 - (ctx.measureText("START").width/2), 400);
        var grd1 = ctx.createLinearGradient(0, 0, w*3 - gw*3, 0);
        grd1.addColorStop(0, 'grey');
        grd1.addColorStop(1, 'white');
        ctx.fillStyle = grd1;
        ctx.font = '15px sans-serif';
        var bottommenu = "  About   -   HOW TO PLAY   -   Traczyk";
        ctx.fillText(bottommenu, w / 2 - (ctx.measureText(bottommenu).width/2), h - 10);
        ctx.fillRect(10, h - 13, w / 2 - (ctx.measureText(bottommenu).width/2) - 10, 1);
        ctx.fillRect(w / 2 + (ctx.measureText(bottommenu).width/2) + 10, h - 13, w / 2 - (ctx.measureText(bottommenu).width/2) - 10, 1);
        if (time < 40) {
            titleTheme.rate(1.5);
            if (time % 2 === 0) {
                wx -= 4;
                wy -= 4;
                sx += 2;
                sy += 2;
            } else if (Math.abs(time % 2) == 1) {
                wx += 4;
                wy += 4;
                sx -= 2;
                sy -= 2;
            }
        } else if (time >= 40) {
            titleTheme.rate(0.75);
            if (gw <= w - 50) gw += 25;
            sx += 2;
            sy += 2;
            sx = srandom(sx);
            sy = srandom(sy);
            wx -= 4;
            wy -= 4;
        }
        if (wx <= 50 || wy <= 10) {
            mainTheme.play();
            background.src = 'http://www.photos-public-domain.com/wp-content/uploads/2011/02/crumpled-notebook-paper-texture.jpg';
            ctx.drawImage(background, 0, 0, w, h);
            clearInterval(sessionT);
            main();
        }
    }, 50);
}


var enemy1 = new enemy('none', 'regular', 0.3);
var enemy2 = new enemy('none', 'regular', 1);
var enemy3 = new enemy('none', 'regular', 1.2);
var enemy4 = new enemy('none', 'regular', 0.9);
var enemy5 = new enemy('none', 'regular', 1.4);
var enemy6 = new enemy('none', 'regular', 1.1);
var enemy7 = new enemy('none', 'regular', 1.2);
var enemy8 = new enemy('none', 'regular', 1.3);
var enemy9 = new enemy('none', 'regular', 1.4);
var enemy10 = new enemy('none', 'regular', 1.5);
var enemy11 = new enemy('none', 'regular', 1.5);
var enemy12 = new enemy('none', 'regular', 1.5);
var enemy13 = new enemy('none', 'regular', 1.8);
var enemy14 = new enemy('none', 'regular', 1.8);
var enemy15 = new enemy('none', 'regular', 2.1);
//var enemy1 = new enemy('none', 'boss');

enemies = [enemy1,
           enemy2,
           enemy3,
           enemy4,
           enemy5,
           enemy6,
           enemy7,
           enemy8,
           enemy9,
           enemy10,
           enemy11,
           enemy12,
           enemy13,
           enemy14,
           enemy15 ];

function main() {
    var sx = 100;
    var sy = 100;
    var wx = 50;
    var wy = 50;
    document.body.style.backgroundColor = 'black';
    if(effects.playing(ah) !== true && mainTheme.playing() !== true && muted !== true)
            effects.on('end', function(){
                mainTheme.mute(false);
            }, pu);
    
    ah = effects.play('healthLoss');
    effects.volume(0.6, ah);
    effects.stop(ah);
    sessionM = setInterval(function() {
        if(pause === false) Otime++;
        ctx.clearRect(0, 0, w, h);
        
        //muteSound();

        drawStage();
        
        listen();
        
        stateDefinition();
        
        drawChar();

        drawHealth();

        drawScore();

        drawPower();

        drawCool();
        
        pauseMenu();
        
        if(pause === false){
            
            if(regeneration && damaging === false) regenerate();
            
            moveChar();
            
            enemySpawn();

            enemeySpeed();
            
            if (cool > 0 && regeneration === false) {
                cool--;
                randomColor = '#adedff';
            }
            
            if ((touch(enemy1) && enemy1.state != 'dead') || (touch(enemy2) && enemy2.state != 'dead') || (touch(enemy3) && enemy3.state != 'dead') || (touch(enemy4) && enemy4.state != 'dead') || (touch(enemy5) && enemy5.state != 'dead') || (touch(enemy6) && enemy6.state != 'dead') || (touch(enemy7) && enemy7.state != 'dead') || (touch(enemy8) && enemy8.state != 'dead') || (touch(enemy9) && enemy9.state != 'dead') || (touch(enemy10) && enemy10.state != 'dead') || (touch(enemy11) && enemy11.state != 'dead') || (touch(enemy12) && enemy12.state != 'dead') || (touch(enemy13) && enemy13.state != 'dead') || (touch(enemy14) && enemy14.state != 'dead') || (touch(enemy15) && enemy15.state != 'dead')) {
                health--;
                randomColor = '#ff6d6d';
                damaging = true;
                regeneration = false;
                if(hlSound && muted === false){
                    mainTheme.mute(true);
                    ah = effects.play('healthLoss');
                    hlSound = false;
                }
            } else {
                hlSound = true;
                effects.stop(ah);
                damaging = false;
            }

            if (cool === 0 && damaging === false) {
                if(attackb === false && attackx === false && attackz === false && muted === false) mainTheme.mute(false);
                effects.stop(ah);
                randomColor = '#ffd6cc';
            }
            
            if (collide() || health <= 0) {
                hlSound = true;
                effects.stop(ah);
                playerDead = true;
                clearInterval(sessionM);
                shrink();
            }
        }
        document.body.style.backgroundColor = 'black';
    }, 50);
}


//Developed By ZACK TRACZYK
