var board;
const human = 'O';
const bot = 'X';
var currentPlayer = human;
var gameFinished;
const winCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[2,4,6]
];

const cells = document.querySelectorAll('.cell');
start();

function start(){
	board=[];
	gameFinished = false;
	for(var i=0;i<9;i++){
		board.push(i);
	}
	
	document.querySelector(".gameover").style.display = "none";
	
	
	for(var i=0;i<cells.length;i++){
		cells[i].addEventListener('click', turnClick);
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
	}
}

function turnClick(cell){
	if(typeof board[cell.target.id]==="number"){
		turn(cell.target.id, human);
		if(!gameFinished){
			if(!isTie()) console.table(minimax(board, bot));turn(minimax(board, bot).id, bot);
		}
	}
}

function turn(id, player){
	board[id] = player;
	document.getElementById(id).innerText = player;
	var temp = checkWin(board, player); //temp is an object/null not a boolean.
	if(temp) gameOver(temp);
}

function checkWin(gameBoard, player){
		for(var i=0; i<winCombos.length; i++){
			var combo = winCombos[i]
			var winCounter = 0;
			for(var j=0; j<combo.length; j++){
				
				if(board[combo[j]] === player){
					winCounter++;
				}
				
				if(winCounter === 3){
					return {index: i, player: player};
				}
		}
	}
	return null;	
	/*
	Simpler way to do it:
	var plays = board.reduce((acc, ele, ind)=>
	(e === player) ? a.concat(i) : a, []);	//get array of all the positions in which the player has played.
	
	var gameWon = null;
	for(var [index, win] of winCombos.entries()){
		if(win.every(elem => plays.indexOf(elem)>-1)){
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
	*/
}
function isTie(gameBoard){
	if(board.every(e => typeof e !== "number")){
		gameFinished = true;
		for(var i=0; i<cells.length;i++){
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick);
		}
		document.querySelector(".gameover").style.display = "unset";
		document.querySelector(".text").innerText = "Tie";
		return true;
	}
	return false;
}

function gameOver(win){
	gameFinished = true;
	for(var id of winCombos[win.index]){
		document.getElementById(id).style.backgroundColor = win.player === human ? "blue" : "red";
	}
	for(var i=0; i<cells.length;i++){
		cells[i].removeEventListener('click', turnClick);
	}
	document.querySelector(".gameover").style.display = "unset";
	document.querySelector(".text").innerText = win.player === human ? "You won!" : "You lost";
}

function minimax(gameBoard, player){
	if(checkWin(gameBoard, bot)) return {score: 10};
	if(checkWin(gameBoard, human)) return {score: -10};
	
	var emptyCells = gameBoard.filter(e => typeof e === "number");
	
	if(emptyCells.length===0) return {score: 0};
	
	var possibleMoves = [];
	
	for(var i=0;i<emptyCells.length;i++){
		var move = {};
		move.id = gameBoard[emptyCells[i]];
		
		gameBoard[emptyCells[i]] = player;
		
		if(player === bot){
			if(checkWin(gameBoard, bot)){
				move.score = 10;
				gameBoard[emptyCells[i]] = move.id;
				return move;
			}
			move.score = minimax(gameBoard, human).score;
		}else{
			move.score = minimax(gameBoard, bot).score;
		}
		
		gameBoard[emptyCells[i]] = move.id;
		possibleMoves.push(move);
	}
	var bestMove;
	if(player === bot){
		var bestScore = -100;
		for(var i=0;i<possibleMoves.length;i++){
			if(possibleMoves[i].score>bestScore){
				bestScore = possibleMoves[i].score;
				bestMove = i;
			}
		}
	}
	else{
		var bestScore = 100;
		for(var i=0;i<possibleMoves.length;i++){
			if(possibleMoves[i].score<bestScore){
				bestScore = possibleMoves[i].score;
				bestMove = i;
			}
		}
	}
	return possibleMoves[bestMove];
}