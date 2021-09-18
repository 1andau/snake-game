let scoreBlock; //отображение на странице очков
let score = 0; //очки внутри игры

const config = { //содержание настроек игры
	step: 0,    //пропускать игровой цикл
	maxStep: 6,
	sizeCell: 16, //размер тодной ячейки
	sizeBerry: 16 / 4  //размер ягодки
}

const snake = { //все параметры змейки 
	x: 160,  //координаты
	y: 160,
	dx: config.sizeCell, //скорость по вертикали 
	dy: 0,           //скорость по горизонтали
	tails: [],  //массив ячеек под контроем нашей змейки 
	maxTails: 3  //кол-во ячеек
}

let berry = {  //координаты ягоды
	x: 0,
	y: 0
} 


let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
scoreBlock = document.querySelector(".game-score .score-count"); //пишем игровой цикл
drawScore();

function gameLoop() {

	requestAnimationFrame( gameLoop ); //передаем игровой цикл и в нее передаем функцию gameLoop которая будет вызываться вечно
	if ( ++config.step < config.maxStep) { //если значение из конфига степ меньше чем максстеп, то мы пропускаем дальнейшую работу ф-ии, 
		return; //проверка
	}
	config.step = 0;

	context.clearRect(0, 0, canvas.width, canvas.height); //если значение из конфига степ меньше чем максстеп, то мы пропускаем дальнейшую работу ф-ии, 

	drawBerry();  //обнуление 
	drawSnake();
}
requestAnimationFrame( gameLoop ); 

function drawSnake() {  //отображаем змейку 
	snake.x += snake.dx; //меняем координаты змейки согласно скорости 
	snake.y += snake.dy;

	collisionBorder();

	// todo бордер
	snake.tails.unshift( { x: snake.x, y: snake.y } ); //добавляем в начало массива объект с x и y координатами 

	if ( snake.tails.length > snake.maxTails ) { //условие, если кл-во дочерних элементов у змейки больше чем разрешено, то мы удаляем последний элемент 
		snake.tails.pop();
	}

	snake.tails.forEach( function(el, index){ //с помощью метода forEach мы перебираем все дочерние методы у змейки 
		if (index == 0) {
			context.fillStyle = "#FA0556"; //тут мы красим голову
		} else {
			context.fillStyle = "#A00034"; //тут туловище
		}
		context.fillRect( el.x, el.y, config.sizeCell, config.sizeCell ); 

		if ( el.x === berry.x && el.y === berry.y ) { //проверяем координаты змейки  и у ягоды, если они совпадают то увеличиваем хаост у змейки
			snake.maxTails++; //увеличиваем очки 
			incScore();
			randomPositionBerry();
		}

		for( let i = index + 1; i < snake.tails.length; i++ ) { //соприкосновение змейки с хвостом 

			if ( el.x == snake.tails[i].x && el.y == snake.tails[i].y ) { //если координаты совпали, запускаем игру заново
				refreshGame();
			}

		}

	} );
}

function collisionBorder() { //проверка координат хмейки, если она не выходит ха границу canvas, то меняем координаты 
	if (snake.x < 0) {
		snake.x = canvas.width - config.sizeCell;
	} else if ( snake.x >= canvas.width ) {
		snake.x = 0;
	}

	if (snake.y < 0) {
		snake.y = canvas.height - config.sizeCell;
	} else if ( snake.y >= canvas.height ) {
		snake.y = 0;
	}
}
function refreshGame() {
	score = 0;
	drawScore();

	snake.x = 160;
	snake.y = 160;
	snake.tails = [];
	snake.maxTails = 3;
	snake.dx = config.sizeCell;
	snake.dy = 0;

	randomPositionBerry();
}

function drawBerry() { //ф-я ответа за ягоду 
	context.beginPath();
	context.fillStyle = "#A00034"; //цвет 
	context.arc( berry.x + (config.sizeCell / 2 ), berry.y + (config.sizeCell / 2 ), config.sizeBerry, 0, 2 * Math.PI ); //окружность на основне координат от ягоды 
	context.fill();
}

function randomPositionBerry() {  //функция для назначения координат для яягоды 
	berry.x = getRandomInt( 0, canvas.width / config.sizeCell ) * config.sizeCell; //координат 0
	berry.y = getRandomInt( 0, canvas.height / config.sizeCell ) * config.sizeCell;
}

function incScore() { //увеличение очков на 1
	score++; 
	drawScore();
}

function drawScore() {  //отображение очков на страницк
	scoreBlock.innerHTML = score;
}

function getRandomInt(min, max) { //принимает иапозон чисел и возвращает рандомное значение в заданном диапозоне 
	return Math.floor( Math.random() * (max - min) + min );
}

document.addEventListener("keydown", function (e) { //управление змейкой, клавиши 
	if ( e.code == "KeyW" ) {
		snake.dy = -config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyA" ) {
		snake.dx = -config.sizeCell;
		snake.dy = 0;
	} else if ( e.code == "KeyS" ) {
		snake.dy = config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyD" ) {
		snake.dx = config.sizeCell;
		snake.dy = 0;
	}
});