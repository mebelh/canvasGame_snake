// Генератор случайных чисел от min до max (нужно для генерации мемтоположения еды для змейки)

function randomInteger(min, max, banNum) {
    let rand = min + Math.random() * (max - min);
    if (Math.round(rand) + 1 == banNum + 1) {
        return randomInteger(min, max, banNum);
    }
    return Math.abs(Math.round(rand));
}

// Меняем координаты всех блоков змеи на координыты впереди едущего блока.
let dir = 0;
function cordUpdate(dir, player) {
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
        // snake[i].color = snake[i - 1].color;
    }
    if (dir == 0) {
        player.y++;
    } else if (dir == 1) {
        player.x++;
    } else if (dir == 2) {
        player.x--;
    } else if (dir == 3) {
        player.y--;
    }
}

// Главные переменные

let canv = document.getElementById("canvas"),
    ctx = canv.getContext("2d"),
    score = document.querySelector(".score"),
    scoreVol = 1;

// Ширина высота поля

canv.width =
    window.innerHeight < window.innerWidth
        ? window.innerHeight
        : window.innerWidth - 3;
canv.height =
    window.innerHeight < window.innerWidth
        ? window.innerHeight
        : window.innerWidth - 3;

// Поле

function SnakeRect(x, y, color = "#155682") {
    this.color = color;
    this.x = x;
    this.y = y;
}

let snake, snakeSecPlayer;
function restart() {
    snake = [];
    snake.push(new SnakeRect(0, 2, "#0D3E57"));
    snake.push(new SnakeRect(0, 1));
    snake.push(new SnakeRect(0, 0));
    dir = 0;
    scoreVol = 1;
    score.textContent = "00";
}
restart();

function Rect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

// В этом блоке будут переменные
let rectVal = 15,
    rectStandart = {
        width:
            (window.innerHeight < window.innerWidth
                ? window.innerHeight
                : window.innerWidth) /
                rectVal -
            3,
        height:
            (window.innerHeight < window.innerWidth
                ? window.innerHeight
                : window.innerWidth) /
                rectVal -
            3,
        color: "#EDF3FC"
    };

// Отрисовываем графику
let poligonRects = [],
    eat = {
        x: randomInteger(0, rectVal - 1, snake[0].x),
        y: randomInteger(0, rectVal - 1, snake[0].x),
        color: "#BA0643"
    },
    goVal = 0;

function updateEatCords(banNum) {
    eat.x = randomInteger(0, rectVal - 1, banNum);
    eat.y = randomInteger(0, rectVal - 1, banNum);
}

function loop() {
    {
        // rectStandart = {
        //     width :  (window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth)/rectVal - 3,
        //     height : (window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth)/rectVal - 3,
        //     color : '#EDF3FC'
        // };
        // canv.width = window.innerWidth;
        // canv.height = window.innerHeight;
    }
    let line = 0,
        snakedro = 0;
    for (let i = 0; i < rectVal; i++) {
        let col = -rectStandart.width;
        poligonRects[i] = [];
        for (let j = 0; j < rectVal; j++) {
            for (let snI = snakedro; snI < snake.length; snI++) {
                // Первый игрок
                if (
                    i == Math.floor(snake[snI].y) &&
                    j == Math.floor(snake[snI].x)
                ) {
                    ctx.fillStyle = snake[snI].color;
                    snakedro++;
                    // snake[snI].y += 0.03;
                    goVal += 0.014;
                }
                if (goVal > 1) {
                    cordUpdate(dir, snake[0]);
                    goVal = 0;

                    if (snake[0].y == eat.y && snake[0].x == eat.x) {
                        ctx.fillStyle = eat.color;
                        snake.push(
                            new SnakeRect(
                                snake[snake.length - 1].x,
                                snake[snake.length - 1].y
                            )
                        );
                        updateEatCords(snake[0].x);
                        score.textContent = ("0" + scoreVol++).slice(-2);
                    }
                }
                if (i == eat.y && j == eat.x) {
                    ctx.fillStyle = eat.color;
                }

                if (snake[snI].x == eat.x && snake[snI].y == eat.y) {
                    updateEatCords(snake[snI].x);
                }
            }
            if (
                snake[0].x > rectVal - 1 ||
                snake[0].y > rectVal - 1 ||
                snake[0].x < 0 ||
                snake[0].y < 0
            ) {
                alert(--scoreVol);
                restart();
                window.location.reload();
            }

            // Второй игрок

            poligonRects[i][j] = new Rect(
                (col += rectStandart.width + 2),
                line + 10,
                rectStandart.width,
                rectStandart.height
            );
            ctx.fillRect(
                poligonRects[i][j].x,
                poligonRects[i][j].y,
                poligonRects[i][j].width,
                poligonRects[i][j].height
            );
            ctx.fillStyle = "#F9F9FF";
            snakedro = 0;
        }
        col = -rectStandart.width;
        line += rectStandart.height + 2;
    }

    window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);

// Слушаем нажатия клавиш для управления змейкой

document.addEventListener("keydown", () => {
    //Первый игрок

    if (event.code == "Space" && scoreVol == 1) {
        window.requestAnimationFrame(loop);
    } else if (event.code == "ArrowRight") {
        dir = 1;
    } else if (event.code == "ArrowLeft") {
        dir = 2;
    } else if (event.code == "ArrowUp") {
        dir = 3;
    } else if (event.code == "ArrowDown") {
        dir = 0;
    }

    // Второй игрок
});
