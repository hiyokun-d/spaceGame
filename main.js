const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const startButton = document.getElementById("start")
const scoreHtml = document.getElementById("scoreHtml")
const menu = document.getElementById("game")
let menu_detection = false
canvas.width = innerWidth;
canvas.height = innerHeight;

//player
class player {
    constructor(x, y, w, h, c) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.c = c
    }

    draw() {
        drawRectMove(this.x, this.y, this.w, this.h, this.c)
    }
}
/** 
 * @param
 * x = xpos
 * y = ypos
 * w = width
 * h = height
 * c = color
 * speed = speed
 */
const player_module = {
    x: 15,
    y: 15,
    w: 15,
    h: 50,
    c: "BLUE",
    speed: 9
}
const user = new player()

//---------------------------------------------------------------------\\

//projectile
let projectile_array = []
class projectile {
    constructor(x, y, w, h, c, v) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.c = c
        this.v = v
    }

    draw() {
        drawRectMove(this.x, this.y, this.w, this.h, this.c)
    }

    uptade() {
        this.draw()
        this.x = this.x + this.v.x
    }
}

//-----------------------------------------------------------------------\\

//enemy
let enemy_array = []
class enemy {
    constructor(x, y, w, h, c, v) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.c = c
        this.v = v
    }

    draw() {
        drawRectMove(this.x, this.y, this.w, this.h, this.c)
    }

    uptade() {
        this.draw()
        this.x = this.x - this.v.x
    }
}

function spawner() {
    setInterval(() => {
        
        let y = Math.random() * canvas.height;
        let speed = Math.random() * (25 - 5) + 5;
        let velocity = {x: speed, y: speed}

        enemy_array.push(new enemy(canvas.width, y, 45, 45, "red", velocity))
    }, 1000);
}
//--------------------------------------------------------------------------\\

//game
let score = 0
function render() {
    text(score, 0, 30, "white")
    //background
    drawRect(0, 0, canvas.width, canvas.height, "RGBA(0, 0, 0, 0.1)")
    //player
    user.x = player_module.x,
    user.y = player_module.y,
    user.h = player_module.h,
    user.w = player_module.w,
    user.c = player_module.c
    user.draw()
    
    //projectile
    projectile_array.forEach((projectile, index) => {
        projectile.uptade()
        
        if(projectile.x > canvas.width) {projectile_array.splice(index, 1)};

    });
    
    //enemy
    enemy_array.forEach((enemy, index) => {
        enemy.uptade();
        if(enemy.x < 0) {enemy_array.splice(index, 1)}
        projectile_array.forEach((projectile, projectileIndex) => {
            if(RectsColliding(enemy, projectile)) {
                setTimeout(() => {
                    enemy_array.splice(index, 1) && projectile_array.splice(projectileIndex, 1)
                    score += 10
                }, 0);
                }

        })
    })
}
function game() {
   const animate = requestAnimationFrame(game)
    render()
    controller()

    enemy_array.forEach(enemy => {
        if(RectsColliding(user, enemy)) {cancelAnimationFrame(animate)
        menu.style.display = "flex"
        scoreHtml.innerHTML = score
        }
    })
}
//-----------------------------------------------------------------------------------\\

//controller
let up = false
let down = false
let click = false
addEventListener("keydown", event => {
    if(event.key === "w" && player_module.y > 0) up = true
    else {
    if(event.key === "s" && canvas.height > player_module.y) down = true
    }

    if(event.key === "/") click = true
},false)

addEventListener("keyup", (event) => {
    if(event.key === "w") up = false
    else {
    if(event.key === "s") down = false
    }

    if(event.key === "/") click = false
}, false)

addEventListener("click", event => {
    projectile_array.push(new projectile(player_module.x, player_module.y + 2, 20, 20, "white", {x: 5}))
})

startButton.addEventListener("click", event => {
    game()
    spawner()
    menu.style.display = "none"
})
function controller() {
    if(up && player_module.y > 0) player_module.y = player_module.y - player_module.speed;
    if(down) player_module.y = player_module.y + player_module.speed;
    if(click) projectile_array.push(new projectile(player_module.x, player_module.y + 2, 20, 20, "white", {x: 5}))
}

//---------------------------------------------------------------------------------------\\

//drawfunction
//!this is for rectangle
//*use this if object is not move
function drawRect(x, y, w, h, c) {
    ctx.fillStyle = c
    ctx.fillRect(x, y, w, h)
}

//*use this if object is block
function drawRectMove(x, y, w, h, c) {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.fillRect(x, y, w, h)
    ctx.closePath()
}
//-------------------------------------\\

//!this is for circle
//*use this if circle is not move
function drawCircle(x, y, r, c) {
    ctx.fillStyle = c
    ctx.arc(x, y, r, 0, Math.PI * 2, false)
    ctx.fill()
}

//*this is if circle is not move
function drawCircleMove(x, y, r, c) {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.closePath()
}
//-----------------------------------------------\\

//!text
//*this is fill text
function text(text, x, y, c) {
    ctx.fillStyle = c
    ctx.font = "30px fantasy"
    ctx.fillText(text, x, y)
}

//*this is stroke text
function textStroke(text, x, y, c) {
    ctx.fillStyle = c
    ctx.font = "30px fantasy"
    ctx.strokeText(text, x, y,)
}

/* --------------------------------------- */

//collision
function RectsColliding(r1,r2){
    return !(r1.x>r2.x+r2.w || r1.x+r1.w<r2.x || r1.y>r2.y+r2.h || r1.y+r1.h<r2.y);
}
//--------------------------------