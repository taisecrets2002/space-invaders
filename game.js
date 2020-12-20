class Player {
    constructor(x, y, imageSource) {
        this.x = x;
        this.y = y;
        this.ship = new Image();
        this.ship.src = imageSource;
        this.lives = 3;
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Enemy {
    constructor(x, y, imageSource) {
        this.x = x;
        this.y = y;
        this.alive = true;
        this.ship = new Image();
        this.ship.src = imageSource;
    }
}

let canvas;
let ctx;
let buffer;

let player;

let bullets = [];
let enemyBullets = [];
let enemies = [];
let level;
let lives;
let score = 0;

let gamestate = 0; // o- playing, 1 - victory, -1 - lost

//don't fucking touch
function initBackground() {
    //set backround color of canvas to gray
    ctx.fillStyle = 'silver';
}

//don't fucking touch
function initElements() {
    //create canvas element
    canvas = document.createElement("canvas");

    //set canvas size
    canvas.width = 500;
    canvas.height = 500;

    //get context of canvas
    ctx = canvas.getContext("2d");
    buffer = canvas.getContext("2d");

    //append canvas to body
    document.body.appendChild(canvas);
}

function drawBackground() {
    //decorate your background
    //kao slikca,
    //mogl bi delat
    //leave it be
    var background = new Image();
    background.src = "sky.jpg"
    background.onload = function () {
        ctx.drawImage(background, 0, 0);
    }

}

//timer!!!
let oldTime = 0;

function playerInput (e) {
	let time = new Date;
	time= time.getTime();

	enemyInput();
	//check for pressed buttons
	//"a"
	if (e.keyCode == "65") 
		player.x -= 5;

	//"d"
	else if (e.keyCode == "68") 
		player.x += 5;

	//pazi; bullet timer dodaj
	//"space"
	else if (e.keyCode == "32") {
			if(time - oldTime > 500){
				bullets.push(new Bullet(player.x, player.y));
				oldTime = time;
				collisionEnemy();
				updateBullets();
			}
			else{
				return
			}
	}
}


//don't fucking touch
function drawPlayer () {
	buffer.drawImage(player.ship, player.x-20, player.y, 40, 20);

}

//don't fucking touch
function drawPlayer() {
    buffer.drawImage(player.ship, player.x - 20, player.y, 40, 20);
}


//don't fucking touch
function drawBullets() {
    //skips function if no bullets exist
    if (bullets.length == 0)
        return;

    //draw all still existing bullets
    for (let i = 0; i < bullets.length; i++) {
        buffer.beginPath();
        buffer.arc(bullets[i].x, bullets[i].y, 2, 0, 2 * Math.PI);
        buffer.stroke();
    }
    updateBullets();
}


oldTime = 0;
let enemyBulletTime =0; //invader bullets
let heroBulletTime=0; //hero bullets timer


function draw (time) {
	drawBackground();

	let newTime = time - oldTime;
	let newTimeHero = time - heroBulletTime;

	
	if(gamestate == 0){ 
		
		writeScore();

		if(newTimeHero > 10){
			drawPlayer();
			heroBulletTime = time;
		}
		if(newTime > 2000){
			updateEnemy();
			oldTime = time;
		}


		drawPlayer();	
		drawBullets();
		drawEnemies();
		drawEnemyBullets();
		

		if (collisionHero() == false){
			gamestate = -1;
			return
		}
		
		if(gamestate == 1){
			level++;
			levelEnemy();
			gamestate = 0; // create all enemies for that level

			
		}
		window.requestAnimationFrame(draw);
	
	}
	if(gamestate == -1){
		return
	}
	

let oldTime = 0;
let enemyBulletTime = 0; //invader bullets
let heroBulletTime = 0; //hero bullets timer


function draw(time) {
    drawBackground();

    let newTime = time - oldTime;
    let newTimeHero = time - heroBulletTime;


    if (gamestate == 0) {

        if (newTimeHero > 10) {
            drawPlayer();
            heroBulletTime = time;
        }
        if (newTime > 2000) {
            updateEnemy();
            oldTime = time;
        }

        drawPlayer();
        drawBullets();
        drawEnemies();
        drawEnemyBullets();


        if (enemies.length == 0 && gamestate == 1) {
            level++;
            levelEnemy(); // create all enemies for that level
            //level up sequence
        }
        window.requestAnimationFrame(draw);

    }
    if (gamestate == -1) {
        //gameover();
    }


}

//don't fucking touch
function levelEnemy() {
    for (let j = 0; j < level * 2; j++)
        for (let i = 0; i < 6; i++) {
            let enemy = new Enemy(50 * (i + 1) + 20, 30 * (j + 1), "ship.png");
            enemies.push(enemy);
        }
}

let enemyMove = 0;

//don't fucking touch
function updateEnemy() {
    //update all existing enemies
    //move them
    //if they touch the floor it's game over

    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].alive == false) {
            enemies.splice(i, 1);
            continue;
        }
        enemies[i].y += 5;
        if (enemyMove == 0) {
            enemies[i].x += 30;
        } else {
            enemies[i].x -= 30;
        }
    }
    if (enemies.length == 0) {
        gamestate = 1;
    }

    if (enemyMove == 0) {
        enemyMove = 1;
    } else {
        enemyMove = 0;
    }


}

//don't fucking touch

function updateBullets() {
    //update all existing bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= 3;

        //if bullet is off-screen then remove it from array
        if (bullets[i].y <= 0) {
            bullets.splice(i, 1);
            continue;
        }

        if (collisionEnemy(bullets[i].x, bullets[i].y)) {
            bullets.splice(i, 1);
        }

    }

}

function updateENemyBullets(idx) {

    //update all existing bullets
    for (let i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].y += 3;



        if (collisionHero(enemyBullets[i].x, enemyBullets[i].y)) {
            enemyBullets.splice(i, 1);
            continue;
        }

        //if bullet is off-screen then remove it from array
        if (enemyBullets[i].y >= player.y) {
            enemyBullets.splice(i, 1);
        }
    }
    //from a random enemy
    if (idx != -1) {
        enemyBullets.push(new Bullet(enemies[idx].x + 30, enemies[idx].y,));
        updateBullets();
    }


}

//this is also supposed to work
//of course it doesn't

function drawEnemyBullets(){

    //skips function if no bullets exist
    if (enemyBullets.length == 0)
        return;

    //draw all still existing bullets
    for (let i = 0; i < enemyBullets.length; i++) {
        buffer.beginPath();
        buffer.arc(enemyBullets[i].x, enemyBullets[i].y, 2, 0, 2 * Math.PI);
        buffer.stroke();
    }

    updateEnemyBullets(-1);
}

//dela, pusti na miru!
function drawEnemies(){
	for(let i=0; i<enemies.length; i++){
		buffer.drawImage(enemies[i].ship, enemies[i].x, enemies[i].y, 40, 20);
	}
}
 
//random bullet generator
function enemyInput(e) {
	let randint = Math.floor(Math.random() * 3) + 1; //random integer from 1 to 10
	for (i=0; i < enemies.length; i++){
		if (Math.floor(Math.random() * 4) + 1 == 4){
			updateEnemyBullets(i) //implement the func
		}

	}

}
//this should be okay
//don't fucking know. no bullets are spawned
function collisionHero(x,y){
	let height = player.ship.height;
	let width = player.ship.width;

    if (x < (player.x + 70)
        && x > player.x
        && y < (player.y + 50)
        && y > player.y) {
        return false;
    }
}



//mal zjebe y os enemyjev ampak dela
function collisionEnemy(x, y){
	if(enemies.length == 0){
		gamestate = 1;
		return
	}
    for(let j=enemies.length-1; j>-1; j--){


        if (x < (enemies[j].x + 70)
            && x > enemies[j].x
            && y < (enemies[j].y + 50)
			 && y > enemies[j].y
			 && enemies[j].alive){
                 enemies[j].alive = false;
				updateEnemy();
				score+=3;
				return 1;

        }
    }
}

function collisionHero(x, y) {


    if (x < (player.x + 70)
        && x > player.x
        && y < (player.y + 50)
        && y > player.y) {
        player.lives -= 1;
        // lost one life
        if (player.lives <= 0)
            gameover();
        return 1;
    }

}



function enemyInput(e) {
    for (i = 0; i < enemies.length; i++) {
        if (Math.floor(Math.random() * 30) + 1 == 4) {
            enemyBullets.push(new Bullet(enemies[i].x, enemies[i].y));
            updateENemyBullets(i) //implement the func
        }

    }
}

function init() {

    document.addEventListener('keydown', playerInput);
    initElements();
    initBackground();
    player = new Player(canvas.width / 2, canvas.height - 30, "ship.png");//"https://cdn.onlinewebfonts.com/svg/img_3969.png");
    level = 1;
    levelEnemy();
    lives = 3;

    //start game
    //start up sequence
    draw();

}

function writeScore(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Score: " + score, 400, 20);

	ctx.fillText("level: "+level, 10, 20);
}
//function starup(){}
function gameover(){
	var background= new Image();
	background.src = "gameover.jpg"
	background.onload = function(){
		ctx.drawImage(background, 0, 0);
	}
	
}
