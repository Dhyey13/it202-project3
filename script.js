//Dhyey Patel
//UIC
//IT 202

const canvas = document.getElementById("canvas");
const contxt = canvas.getContext("2d");
let lefty = false;
let righty = false;
let gameOver = true;
let score = 0;
let lives = 3;
let track = 0;
let badTrack = 0;
let level = 1;


document.addEventListener("keydown", (e) => {
	//when key is pressed down, move
	if(e.keyCode === 68){
		righty = true;
	} 
	else if(e.keyCode === 65){
		lefty = true;
	}
	else if(e.keyCode === 32 && gameOver){
		playAgain();
	}
});
document.addEventListener("keyup", (e) => {
	// when key is released, stop moving
	if(e.keyCode === 68){
		righty = false;
	}
	else if(e.keyCode === 65){
		lefty = false;
	}
});

// player specs
const player = {
	size: 25,
	x: (canvas.width -30)/ 2,
	y: canvas.height - 30,
	color: "green"
};

// specs for balls you want to collect
const scoreObj = {
    x:[], y:[],
    speed: 1,
	color: ["red",
			"blue",
			"yellow"],
	state: []
};
let redNum = 0;

// specs for balls you want to avoid
const harmObj = {
	x:[], y:[],
	speed: 2,
	color: ["black", 
			"purple", 
			"#777c77", 
			"#3f2121", 
			"white"]

};
let blackNum = 0;
const rad = 15;

// adds value to x property of scoreObj
let drawScoreObj = () => {
  if(Math.random() < .05){
      scoreObj.x.push(Math.random() * canvas.width);
      scoreObj.y.push(0);
      scoreObj.state.push(true);

    }
    redNum = scoreObj.x.length;
}

//adds values to x property of harmObj
let drawHarmObj = () => {
	if(score < 30){
		if(Math.random() < .05){
			harmObj.x.push(Math.random() * canvas.width);
			harmObj.y.push(0);
		}
	}
	else if(score < 50){
		if(Math.random() < .1){
			harmObj.x.push(Math.random() * canvas.width);
			harmObj.y.push(0);
		}
	}
	else{
		if(Math.random() < .2){
			harmObj.x.push(Math.random() * canvas.width);
			harmObj.y.push(0);
		}
	}
	blackNum = harmObj.x.length;
};

// draws red and blue balls
let drawRedBall = () => {
	for(let i = 0; i < redNum; i++){
		if(scoreObj.state[i]){
			//Keeps track of position in color array with changing redNum size
			const trackCol = (i + track);
			contxt.beginPath();
			contxt.arc(scoreObj.x[i], scoreObj.y[i], rad, 0, Math.PI * 2);
			contxt.fillStyle = scoreObj.color[trackCol % 3];
			contxt.fill();
			contxt.closePath();
		}
	}
};

// draws black ball to avoid
let drawBlackBall = () => {
	for(let i = 0; i < blackNum; i++){
		//Keeps track of position in color array with changing blackNum size
		const badCol = (i + badTrack);
		contxt.beginPath();
		contxt.arc(harmObj.x[i], harmObj.y[i], rad, 0, Math.PI * 2);
		contxt.fillStyle = harmObj.color[badCol % 5];
		contxt.fill();
		contxt.closePath();
	}
};
// draw player to canvas
let drawPlayer = () => {
	contxt.beginPath();
	contxt.rect(player.x, player.y, 35, 10);
	contxt.fillStyle = player.color;
	contxt.fill();
	contxt.closePath();
};

// moves objects in play
let playUpdate = () => {
	
	if(lefty && player.x > 0){
		player.x -= 7;
	}
	if(righty && (player.x + player.size < canvas.width)) {
		player.x += 7;
	}
	for(let i = 0; i < redNum; i++){
		scoreObj.y[i] += scoreObj.speed;
	}
	for(let i = 0; i < blackNum; i++){
		harmObj.y[i] += harmObj.speed;
	}
	
	// collision detection
	for(let i = 0; i < redNum; i++){
		// Only counts collision once
		if(scoreObj.state[i]){
			if(player.x < scoreObj.x[i] + rad && 
               player.x + 30 + rad> scoreObj.x[i] && 
               player.y < scoreObj.y[i] + rad && 
               player.y + 30 > scoreObj.y[i]){
				score++
				// Cycles through scoreObj's color array
				player.color = scoreObj.color[(i + track) % 3];
				scoreObj.state[i] = false;
			}
		}
		// Removes circles from array that are no longer in play
		if(canvas.height < scoreObj.y[i] + rad){
			scoreObj.x.shift();
			scoreObj.y.shift();
			scoreObj.state.shift();
			track++;
		}
	}
	for(let i = 0; i < blackNum; i++){
		if(player.x < harmObj.x[i] + rad && 
           player.x + 30 + rad > harmObj.x[i] && 
           player.y < harmObj.y[i] + rad && 
           player.y + 30 > harmObj.y[i]){
			lives--;
			player.color = harmObj.color[(i+badTrack)%5];
			harmObj.y[i] = 0;
			if(lives <= 0){
				gamesOver();
			}
		}
		// Removes circles from x and y arrays that are no longer in play
		if(harmObj.y[i] + rad > canvas.height){
			harmObj.x.shift();
			harmObj.y.shift();
			badTrack++;
		}
	}
	switch(score){
		case 5:
			harmObj.speed = 3;
			scoreObj.speed = 2;
			level = 2;
            lives = 4;
			break;
		case 10:
			level = 3;
			break;
		case 20: 
			scoreObj.speed = 4;
			level = 4;
            lives = 5;
			break;
		case 40:
            harmObj.speed = 4;
			level = 5;
            lives = 6;
			break;
	}

};
//signals end of game and resets x, y, and state arrays for arcs
let gamesOver = () => {
	scoreObj.x = [];
	harmObj.x = [];
	scoreObj.y = [];
	harmObj.y = [];
	scoreObj.state = [];
	gameOver = true;
}

//resets game, life, and score counters
let playAgain = () => {
	gameOver = false;
	player.color = "green";
	level = 1;
	score = 0;
	lives = 3;
	harmObj.speed = 2;
	scoreObj.speed = 2;
}

let draw = () => {
	contxt.clearRect(0, 0, canvas.width, canvas.height);
	if(!gameOver){
		drawPlayer();
		drawBlackBall();
		drawRedBall();
		playUpdate();
		drawScoreObj();
		drawHarmObj();
			
		//score
		contxt.fillStyle = "black";
		contxt.font = "20px Helvetica";
		contxt.textAlign = "left";
		contxt.fillText(`Score: ${score}`, 10, 25);
	
		//lives
		contxt.textAlign = "right";
		contxt.fillText(`Lives: ${lives}`, 880, 25);
	}
	else{
		contxt.fillStyle = "black";
		contxt.font = "25px Helvetica";
		contxt.textAlign = "center";
		contxt.fillText("GAME OVER!", canvas.width/2, 175);
		
		contxt.font = "20px Helvetica";
		contxt.fillText("PRESS SPACE TO PLAY", canvas.width/2, 475);
		
		contxt.fillText(`FINAL SCORE: ${score}`, canvas.width/2, 230);
	}
    
    document.getElementById("level").textContent = `Level: ${level}`;
	requestAnimationFrame(draw);
}

draw();