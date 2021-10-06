class Ripple{
  static strokeWeight = 5;

  constructor(r){
    // position
    this.x = mouseX;
    this.y = mouseY;
    this.vel = {
      x: (mouseX - pmouseX) / 3,
      y: (mouseY - pmouseY) / 3
    };
    this.friction = 0.05;

    // appearance
    this.r = r; // initial radius
    this.inflation = 4;
    this.frame = 0;
    this.duration = 120;
    this.opacity = 1;
    this.finished = false;
    this.decay = Math.pow(1/255, 1/this.duration);
  }

  incrementVelocity(){
    this.vel.x *= 1 - this.friction;
    this.vel.y *= 1 - this.friction;
  }

  move(){
    this.r += this.inflation;
    this.opacity *= this.decay;
    this.incrementVelocity();
    this.x += max(this.vel.x);
    this.y += max(this.vel.y);

    this.frame += 1;
  }

  direction(){
    return atan(this.vel.y / this.vel.x);
  }

  draw(){
    if(this.frame >= this.duration){
      this.finished = true;
    }
    if(!this.finished){
      push();
      strokeWeight(Ripple.strokeWeight);
      let red = min(207, Math.pow(this.getSpeed()*2, 2));
      let green = 255 - 255 * this.x / windowWidth;
      let blue = 255 - 255 * this.y / windowHeight;
      stroke(red, green, blue, Math.floor(this.opacity * 255));
      noFill();
      translate(this.x, this.y);
      rotate(this.direction());
      let maxR = this.r
      let minR = this.r / 3;
      let xSize = minR + (maxR - minR) / (this.getSpeed() + 1); // trying to smush r/(speed+1) between r and r/2...
      ellipse(0, 0, xSize, this.r);
      pop();
    }
  }

  getSpeed(){
    return Math.pow(this.vel.x*this.vel.x + this.vel.y*this.vel.y, 0.5);
  }

  update(){
    this.move()
    this.draw()
  }
}

class SmoothText{
  constructor(content, x_start_func, y_start_func, x_end_func, y_end_func, size, red_func, green_func, blue_func, doFill = false, doStroke = true){
    // constant properties
    this.content = content;
    this.x_start_func = x_start_func;
    this.y_start_func = y_start_func;
    this.x_end_func = x_end_func;
    this.y_end_func = y_end_func;
    this.size = size;
    this.red_func = red_func;
    this.green_func = green_func;
    this.blue_func = blue_func;
    this.doFill = doFill;
    this.doStroke = doStroke;

    if(!doStroke && !doFill) this.doFill = true;

    // dynamic properties
    this.textX = x_start_func();
    this.textY = y_start_func();
    this.textFrame = 0;
    this.textOpacity = 0;
  }

  draw(){
    push();

    textSize(this.size);
    strokeWeight(textWeight);
    if(!this.doFill) noFill();
    else fill(this.red_func(), this.green_func(), this.blue_func(), 255 * this.textOpacity);
    if(!this.doStroke) noStroke();
    else stroke(this.red_func(), this.green_func(), this.blue_func(), 255 * this.textOpacity);
    textAlign(CENTER);
    textFont("Trebuchet MS");
    text(this.content, this.textX, this.textY);

    let progress = 1 - Math.pow(2, 0 - (this.textFrame / 24));

    // update dynamic properties
    this.textX = lerp(this.x_start_func(), this.x_end_func(), progress);
    this.textY = lerp(this.y_start_func(), this.y_end_func(), progress);
    this.textOpacity = 1 - Math.pow(2, 0 - (this.textFrame / 60));
    this.textFrame++;

    pop();
  }

  reset(){
    this.textFrame = 0;
    this.textX = this.x_start_func();
    this.textY = this.y_start_func();
  }
}

function init(){
  window.addEventListener('keydown', e => {
    if(e.key === "r"){
      texts.forEach(t => {
        t.reset();
      })
    }
  })
}

let drawBackground = true;

// ripple variables
let ripples = [];
let prevRippleSpawn = 0; // the last frame when a ripple spawned
let maxRippleInterval = 90;
let rippling = true;

let textWeight = 2;

let texts = [];

// takes X and Y and outputs total speed
function speed(x, y){
  return Math.pow(x*x + y*y, 0.5);
}

function mouseSpeed(){
  return speed(mouseX - pmouseX, mouseY - pmouseY);
}

function logistic(x){
  return Math.floor(maxRippleInterval * Math.pow(0.5, x / 12))
}

function spawnRipple(){
  if(Math.min(maxRippleInterval, logistic(mouseSpeed())) + prevRippleSpawn <= frameCount && rippling){
    ripples.push(new Ripple(0));
    // console.log(`Diff: ${frameCount - prevRippleSpawn}\nmouse speed: ${mouseSpeed()}\nlogistic: ${logistic(mouseSpeed())}`);
    prevRippleSpawn = frameCount;
  }
}

function updateRipples(){
  for(let i = 0; i < ripples.length; i++){
    ripples[i].update();
  }
}

function cleanupRipples(){
  ripples = ripples.filter(r => !r.finished);
}

function drawCursor(){
  noStroke(); 
  fill('#28283488');
  ellipse(mouseX, mouseY, 16);
}

function drawText(){
  texts.forEach(t => {
    t.draw();
  });
}



/*
* P5 FUNCTIONS
*/

function setup(){
  createCanvas(windowWidth, windowHeight);
  textAnimationIsDone = false;
  noCursor();
  pixelDensity(2);
  texts.push(new SmoothText("ChamberCode", 
                            () => -50, () => -50, 
                            () => windowWidth / 2, () => windowHeight / 2, 128,
                            () => 255 * min(1, 10 / ripples.length),
                            () => 255 - 255 * mouseY / windowHeight,
                            () => 255 * mouseX / windowWidth,
                            false, true));
  texts.push(new SmoothText("by Andy Chamberlain",
                            () => windowWidth + 50, () => windowHeight + 50,
                            () => windowWidth / 2, () => windowHeight / 2 + 64,
                            48,
                            () => 255 - 255 * mouseY / windowHeight,
                            () => 255 * mouseX / windowWidth,
                            () => 255 * min(1, 10 / ripples.length),
                            true, false));
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  rippling = !rippling;
  if(!rippling) cursor(ARROW); 
  else noCursor();
}

function keyPressed(){
  if(keyCode === 32) {
    drawBackground = !drawBackground;
  }
}

function mouseWheel(e){
  Ripple.strokeWeight -= 0.2 * Math.sign(e.delta);
  if(Ripple.strokeWeight > 9) Ripple.strokeWeight = 9; 
  if(Ripple.strokeWeight < 4) Ripple.strokeWeight = 4;
  textWeight -= 0.2 * Math.sign(e.delta);
  if(textWeight > 6) textWeight = 6;
  if(textWeight < 1) textWeight = 1;
}

function draw(){
  if(drawBackground) background('#1D1D21');
  if(rippling && drawBackground) drawCursor();
  spawnRipple();
  updateRipples();
  cleanupRipples();
  drawText();
}
