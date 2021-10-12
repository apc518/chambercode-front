/*

CONTEXT COLLAPSE by Andy Chamberlain

TODO:
  - explosion animations?
*/

// dev
let debugSprites = false;

// game state stuff
const STARTING = 0;
const PLAYING = 1;
const PAUSED = 2;

const gameStateFuncs = {
  0: () => frameRate(20),
  1: () => { pauseScreen = false; frameRate(60); },
  2: () => frameRate(20)
};

const FRAMERATE = 60;

// canvas
const canvasHeight = 800;
const canvasWidth = canvasHeight;

const globalFont = "Trebuchet MS";

// player stuff
const playerWidth = 64;
const playerHeight = 64;

const playerMoveForce = 0.8;
const playerFriction = 0.1;
const playerStrength = 20;

const playerArrowSpeed = 15;

const playerHealthMax = 100;

// health pack item constants
const healthPackEmbargo = 10 * FRAMERATE;
const healthPackSpawnPeriodAverage = 10 * FRAMERATE;
const healthPackSpawnVariance = 3 * FRAMERATE;
const healthBarWidth = 200;

// arrow item constants
const arrowBunchSize = 8;
const arrowSpawnPeriodDefault = 4;
const arrowSpawnPeriodAfterBossRateMultiplier = 3;

// killall powerup constants
const killallEmbargo = 120 * FRAMERATE; // frames before we start spawning killall powerups
const killallSpawnPeriodAvg = 80 * FRAMERATE;
const killallSpawnVariance = 20 * FRAMERATE;

// freeze powerup constants
const freezeSpawnPeriodAvg = 50 * FRAMERATE;
const freezeSpawnVariance = 10 * FRAMERATE;

let difficultyData;
let difficultyString;
let difficultyColor;

let enemyGroup;
let enemyBossGroup;

let enemySpawnPeriodMin;
let enemySpawnPeriodMax;
let enemySpawnPeriod;
let enemySpawnAcceleration; // enemySpawnPeriod gets multiplied by this on every spawn
let enemyBossRate;
const enemyBossHealthMax = 80;
const enemyHealthMax = 20;

// chance that a boss DOESN'T spawn is multiplied by this every time a monster spawns
const enemyBossRateMultiplier = 0.998; // this will only activate after the enemySpawnPeriod has reached its minimum.

const serverURLBase = "https://chambercode-back.herokuapp.com";
let leaderboardError = false;
let networkError = false;
let authToken;

let sweetAlerting = false;

let sfxOn = true;
let useLegacySfx = false;

class MetaObj{
  constructor(health=0, strength=10, value=1, boss=false){
    this.health = health;
    this.strength = strength;
    this.value = value;
    this.isBoss = boss;
  }
}

// real modulo
function mod(n, m){
  return ((n % m) + m) % m;
}

// initialize gameplay-related variables that are independent of difficulty
function initAgnosticGlobalVars(){
  setGameState(STARTING);
  gameIsStarting = true;
  gameIsOver = false;
  gameFrame = 0;
  
  showingSettings = false;
  showingLeaderboard = false;
  pauseScreen = false;
  
  score = 0;

  playerSpeedX = 0;
  playerSpeedY = 0;
  playerHealth = playerHealthMax;

  healthPackSpawnPeriod = healthPackSpawnPeriodAverage;
  healthPackPrevSpawn = 0;
  healthPackSpawnFrame = 0;

  arrowSpawnPeriod = arrowSpawnPeriodDefault;
  arrowBunchSpawnFrame = 0;
  playerArrows = arrowBunchSize;
  
  killallEquipped = false;
  killallAbilitySpawnPeriod = killallSpawnPeriodAvg;
  killallAbilityPrevSpawn = 0; // seconds that a killall ability is available for before it disappears

  freezeEquipped = false;
  freezing = false; // whether or not it is currently active.
  freezeTimer = 0;
  freezePrevSpawn = 0;
  freezeSpawnPeriod = freezeSpawnPeriodAvg;

  enemySpawnFrame = 0;
  enemyBossRateMultiplierIsActive = false;

  leaderboard = null;
}

/**
 * P5 FUNCTIONS
 */
function preload(){
  playerImage = loadImage("images/character-head-128.png");
  playerDeadImage = loadImage("images/character-head-dead-128.png");
  backgroundImage = loadImage("images/twinkling_night_v3_1600px.png");
  enemyImage = loadImage("images/enemy-1.png");
  arrowImage = loadImage("images/mc_arrow.png");
  arrowBunchImage = loadImage("images/mc_arrow_bunch.png");
  pauseIconImage = loadImage("images/pause_icon_64.png");
  healthPackImage = loadImage("images/health_pack.png");
  killallAbilityImage = loadImage("images/killall-1.png");
  freezeAbilityImage = loadImage("images/freeze-1.png");
  crosshairImage = loadImage("images/crosshair_4.png");
  settingsImage = loadImage("images/gear-1.png");
  sfxOnIcon = loadImage("images/volume_on.png");
  sfxOffIcon = loadImage("images/volume_off.png");

  bossDamageImages = [];
  for(let i = 4; i >= 0; i--) bossDamageImages.push(loadImage("images/enemy-boss-" + i + ".png"));

  monsterFreezeImages = [];
  for(let i = 0; i < 5; i++) monsterFreezeImages.push(loadImage("images/enemy-1-freeze" + i + ".png"));

  bossFreezeImages = [];
  for(let i = 0; i < 5; i++) bossFreezeImages.push(loadImage("images/enemy-boss-freeze" + i + ".png"));
}

function loadSound(path, vol=1){
  return new Howl({
    src: [path],
    volume: vol
  });
}

function setup(){
  createCanvas(canvasWidth, canvasHeight);

  initAgnosticGlobalVars();

  enemyGroup = new Group();
  enemyBossGroup = new Group();
  arrows = new Group();
  arrowBunches = new Group();
  healthPacks = new Group();
  killallAbilities = new Group();
  freezeAbilities = new Group();
  hotbarItems = new Group();
  
  twangSfx = loadSound("audio/arrow_shot_1.wav", 0.2);
  hitSfx = loadSound("audio/hit_1.wav");
  iceClinkSfx = loadSound("audio/ice_clink_1.wav");
  iceBreakSfx = loadSound("audio/ice_break_1.wav");
  monsterDeathSfx = loadSound("audio/monster_death_1.wav", 0.5);
  chainSfx = loadSound("audio/chain_rattle.wav", 0.2);
  killallSfx = loadSound("audio/fire_impact_1.wav");
  killallEquipSfx = loadSound("audio/snow_punch_2.wav");
  freezeSfx = loadSound("audio/snow_punch_1.wav");
  playerDamageSfx = loadSound("audio/heavy_sound_1.wav", 0.2);
  playerDeathSfx = loadSound("audio/death_2.wav");
  healthPackSfx = loadSound("audio/health_bottle_3.wav");
  menuClickSfx = loadSound("audio/ma-scissors-02.wav", 0.5);

  $.getJSON("./difficulty.json", function(data){
    difficultyData = data;
  }).fail(function (){
    console.log("Error loading difficulty settings.");
  });

  noCursor();

  setupSettingsIcon();
  setupSettingsMenu();
  setupFreezeTimer();
  setupStartScreen();
  setupLeaderboard();
  setupGameOverScreen();

  // set up listeners for the page losing focus. If it does lose focus, pause the game.
  let visibilityChange;
  if (typeof document.hidden !== "undefined")
      visibilityChange = "visibilitychange";
  else if (typeof document.mozHidden !== "undefined")
      visibilityChange = "mozvisibilitychange";
  else if (typeof document.msHidden !== "undefined") 
      visibilityChange = "msvisibilitychange";
  else if (typeof document.webkitHidden !== "undefined")
      visibilityChange = "webkitvisibilitychange";
  const pause = () => {
    if(gameState === PLAYING){
      pauseScreen = true;
      setGameState(PAUSED);
    }
  }
  document.addEventListener(visibilityChange, pause);
  window.addEventListener("blur", pause);

  // check in with the server every 30 seconds to keep our game token alive
  checkinInterval = setInterval(() => {
    if(authToken){
        fetch(`${serverURLBase}/context-collapse-checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: authToken
        })
      }).catch(e => console.error(e));
    }
  }, 30 * 1000);
}

function draw(){
  background(backgroundImage);
  if(gameState === STARTING){
    cursor(ARROW, mouseX, mouseY);
    if(showingSettings) drawSettingsMenu();
    else if(showingLeaderboard) drawLeaderboard();
    else drawStartScreen();
  }
  else if(gameState === PLAYING){
    spawnMonster();
    spawnArrowBunch();
    spawnHealthPack();
    spawnKillallAbility();
    spawnFreezeAbility();
    playerControls();
    collisions();
    attractMonsters();
    drawSprites();
    assignImages();
    drawPowerups();
    drawStats();
    noCursor();
    drawCursor();
    cleanup();
    if(freezeTimer === 0) freezing = false;
    gameFrame++;
  }
  else if(gameState === PAUSED){ // includes game over
    // pause monsters
    pauseMonsters();
    cursor(ARROW, mouseX, mouseY);
    drawSprites();
    drawPowerups();
    drawStats();
    if(gameIsOver && showingSettings){
      drawSettingsMenu();
    }
    else if (gameIsOver){
      drawGameOverScreen();
    }
    else if(showingSettings){
      drawSettingsMenu();
    }
    else{
      drawPauseScreen();
    }
  }
  else{
    push();
    textSize(24);
    fill("white");
    noStroke();
    textFont(globalFont);
    text("Unknown game state.", canvasWidth / 2, canvasHeight / 2)
    pop();
  }

  drawSettingsIcon();
}

/**
 * SPECIFIC SETUP FUNCTIONS
 */
function setupSettingsIcon(){
  settingsButton = new Clickable();
  settingsButton.locate(canvasWidth - 52, canvasHeight - 52);
  settingsButton.resize(48, 48);
  settingsButton.image = settingsImage;
  settingsButton.color = "#00000000";
  settingsButton.strokeWeight = 0;
  settingsButton.text = "";
  settingsButton.onPress = () => {
    if(sfxOn) menuClickSfx.play();
    showingSettings = true;
    if(gameState === PLAYING) {
      setGameState(PAUSED);
      // since an arrow will be shot
      if(arrows.length > 0){
        while(arrows.length > 0) arrows[0].remove();
        playerArrows += 1;
      }
    }
  }
  settingsButton.onHover = () => {
    settingsButton.color = "#ffffff33";
  }
  settingsButton.onOutside = () => {
    settingsButton.color = "#00000000";
  }
}

function setupSettingsMenu(){
  sfxToggleBtnSize = 64;
  sfxToggleBtn = new Clickable();
  sfxToggleBtn.text = "";
  sfxToggleBtn.locate(canvasWidth / 2 - sfxToggleBtnSize / 2, canvasHeight / 2 - sfxToggleBtnSize / 2);
  sfxToggleBtn.resize(sfxToggleBtnSize, sfxToggleBtnSize);
  sfxToggleBtn.onPress = () => {
    sfxOn = !sfxOn;
    if(sfxOn) menuClickSfx.play();
  }
  sfxToggleBtn.onHover = () => {
    sfxToggleBtn.color = "#ffc";
  }
  sfxToggleBtn.onOutside = () => {
    sfxToggleBtn.color = "#fff";
  }

  // okay button
  okayButtonSize = 64;
  okayButton = new Clickable();
  okayButton.text = "Okay";
  okayButton.textFont = globalFont;
  okayButton.textSize = 20;
  okayButton.locate(canvasWidth / 2 - okayButtonSize / 2, canvasHeight / 2 - okayButtonSize / 2 + sfxToggleBtnSize + 10);
  okayButton.resize(64,64);
  okayButton.onPress = () => {
    if(sfxOn) menuClickSfx.play();
    showingSettings = false;
    if(gameState === PAUSED && !gameIsOver && !pauseScreen){
      setGameState(PLAYING);
    }
  }
  okayButton.onHover = () => {
    okayButton.color = "#ffc";
  }
  okayButton.onOutside = () => {
    okayButton.color = "#fff";
  }
}

function setupFreezeTimer(){
  freezeTimerInterval = setInterval(() => {
    freezeTimer = max(0, freezeTimer - 1);
    // console.log(`freezeTimer: ${freezeTimer}`);
  }, 1000);
}

function setupStartScreen(){
  frameRate(20);

  easyBtn = new Clickable();
  easyBtn.locate(canvasWidth / 2 - 150, canvasHeight / 2);
  easyBtn.resize(100, 40);
  easyBtn.text = "Easy";
  easyBtn.textSize = 20;
  easyBtn.textFont = globalFont;
  easyBtn.onPress = () => {
    if(sfxOn) menuClickSfx.play();
    registerGame("easy", difficultyData);
  }
  easyBtn.onHover = () => {
    easyBtn.color = "#ffc";
  }
  easyBtn.onOutside = () => {
    easyBtn.color = "#fff";
  }
  
  normBtn = new Clickable();
  normBtn.locate(canvasWidth / 2 - 50, canvasHeight / 2);
  normBtn.resize(100, 40);
  normBtn.text = "Normal";
  normBtn.textSize = 20;
  normBtn.textFont = globalFont;
  normBtn.onPress = () => {
    if(sfxOn) menuClickSfx.play();
    registerGame("normal", difficultyData);
  }
  normBtn.onHover = () => {
    normBtn.color = "#ffc";
  }
  normBtn.onOutside = () => {
    normBtn.color = "#fff";
  }
  
  hardBtn = new Clickable();
  hardBtn.locate(canvasWidth / 2 + 50, canvasHeight / 2);
  hardBtn.resize(100, 40);
  hardBtn.text = "Hard";
  hardBtn.textSize = 20;
  hardBtn.textFont = globalFont;
  hardBtn.onPress = () => {
    if(sfxOn) menuClickSfx.play();
    registerGame("hard", difficultyData);
  }
  hardBtn.onHover = () => {
    hardBtn.color = "#ffc";
  }
  hardBtn.onOutside = () => {
    hardBtn.color = "#fff";
  }

  leaderboardBtn = new Clickable();
  leaderboardBtn.resize(170, 60);
  leaderboardBtn.locate(canvasWidth / 2 - leaderboardBtn.width / 2, canvasHeight / 2 + 100);
  leaderboardBtn.text = "Leaderboard";
  leaderboardBtn.textSize = 24;
  leaderboardBtn.textFont = globalFont;
  leaderboardBtn.onPress = () => {
    if(sfxOn) menuClickSfx.play();
    fetchLeaderboard();
  }
  leaderboardBtn.onHover = () => {
    leaderboardBtn.color = "#ffc";
  }
  leaderboardBtn.onOutside = () => {
    leaderboardBtn.color = "#fff";
  }

  helpBtn = new Clickable();
  helpBtn.resize(170, 60);
  helpBtn.locate(canvasWidth / 2 - helpBtn.width / 2, canvasHeight / 2 + 210);
  helpBtn.text = "How To Play";
  helpBtn.textSize = 24;
  helpBtn.textFont = globalFont;
  helpBtn.onPress = () => {
    if(sfxOn) menuClickSfx.play();
    clickablesDisabled = true;
    Swal.fire({
      title: "How To Play",
      html: `
      Move with WASD, shoot by clicking.<br/><br/>
      There are two powerup slots which can be activated by the Q and E keys respectively.<br/>
      1 and 2, F and G, and X and C also work.
      `
    }).then(() => {
      clickablesDisabled = false;
    }).catch(e => {
      console.error(e);
      clickablesDisabled = false;
    })
  }
  helpBtn.onHover = () => {
    helpBtn.color = "#ffc";
  }
  helpBtn.onOutside = () => {
    helpBtn.color = "#fff";
  }
}

function setupLeaderboard(){
  backBtn = new Clickable();
  backBtn.resize(170, 60);
  backBtn.locate(canvasWidth / 2 - backBtn.width / 2, canvasHeight / 2 + 100);
  backBtn.text = "Back";
  backBtn.textSize = 24;
  backBtn.textFont = globalFont;
  backBtn.onPress = () => {
    if(sfxOn) menuClickSfx.play();
    showingLeaderboard = false;
  }
  backBtn.onHover = () => {
    backBtn.color = "#ffc";
  }
  backBtn.onOutside = () => {
    backBtn.color = "#fff";
  }
}

function setupGameOverScreen(){
  submitScoreBtn = new Clickable();
  submitScoreBtn.locate(canvasWidth / 2 - 120, canvasHeight / 2 + 40);
  submitScoreBtn.resize(240, 60);
  submitScoreBtn.text = "Submit High Score";
  submitScoreBtn.textSize = 24;
  submitScoreBtn.textFont = globalFont;
  submitScoreBtn.onPress = () => {
    if(sfxOn) menuClickSfx.play();
    submitHighScore();
  }
  submitScoreBtn.onHover = () => {
    submitScoreBtn.color = "#ffc";
  }
  submitScoreBtn.onOutside = () => {
    submitScoreBtn.color = "#fff";
  }

  submitScoreBtnDisabled = new Clickable();
  submitScoreBtnDisabled.locate(submitScoreBtn.x, submitScoreBtn.y);
  submitScoreBtnDisabled.resize(submitScoreBtn.width, submitScoreBtn.height);
  submitScoreBtnDisabled.text = submitScoreBtn.text;
  submitScoreBtnDisabled.textSize = submitScoreBtn.textSize;
  submitScoreBtnDisabled.textFont = submitScoreBtn.textFont;
  submitScoreBtnDisabled.color = "#666"; // grayed out

  restartBtn = new Clickable();
  restartBtn.locate(canvasWidth / 2 - 80, canvasHeight / 2 + 130);
  restartBtn.resize(160, 60);
  restartBtn.text = "Restart";
  restartBtn.textSize = 24;
  restartBtn.textFont = globalFont;
  restartBtn.onPress = () => {
    if(sfxOn) menuClickSfx.play();
    resetLevel();
  }
  restartBtn.onHover = () => {
    restartBtn.color = "#ffc";
  }
  restartBtn.onOutside = () => {
    restartBtn.color = "#fff";
  }
}

/**
 * DRAWING FUNCTIONS
 */
function drawStartScreen(){
  textSize(72);
  fill("#ffff88");
  textAlign(CENTER);
  textFont(globalFont);
  text("CONTEXT COLLAPSE", canvasWidth / 2, canvasHeight / 2 - 140);

  textSize(32);
  fill("#aaa");
  text("Select difficulty", canvasWidth / 2, canvasHeight / 2 - 30);

  fill("white");
  easyBtn.draw();
  normBtn.draw();
  hardBtn.draw();
  leaderboardBtn.draw();
  helpBtn.draw();
}

function drawPowerups(){
  let offset = 36;
  let size = 48;
  let spacing = 5;

  // empty powerup slots
  push();
  stroke(60);
  textAlign(CENTER, CENTER);
  textSize(offset);
  textFont(globalFont);
  fill(60, 127);
  ellipse(offset, canvasHeight - offset, size);
  fill(140);
  text("1", offset, canvasHeight - offset);
  for (let i = 1; i < 2; i++) {
    fill(60, 127);
    ellipse(offset + i*(size + spacing), canvasHeight - offset, size);
    fill(140);
    text(i+1, offset + i*(size + spacing), canvasHeight - offset);
  }
  pop();

  // killall powerup
  if(freezeEquipped){
    push();
    imageMode(CENTER);
    translate(offset, canvasHeight - offset);
    image(freezeAbilityImage, 0, 0, size, size);
    pop();
  }

  // freeze powerup
  if(killallEquipped){
    push();
    imageMode(CENTER);
    translate(offset + size + spacing, canvasHeight - offset);
    image(killallAbilityImage, 0, 0, size, size);
    pop();
  }
}

function drawStats(){
  // Score
  textFont(globalFont);
  textSize(32);
  fill("white");
  textAlign(LEFT)
  text("Score: " + score, 8, 32);

  // Arrow Count
  textAlign(CENTER);
  text("Arrows: " + playerArrows, canvasWidth / 2, 32);

  // Difficulty
  push();
  fill(difficultyColor);
  textAlign(RIGHT);
  text(difficultyString, canvasWidth - 8, 32);
  pop();
 
  // health bar
  stroke(0);
  strokeWeight(4);
  noFill();
  rect(canvasWidth / 2 - (healthBarWidth / 2) - 2, canvasHeight - 30 - 2, healthBarWidth + 4, 20 + 4);
  noStroke();
  let healthFraction = playerHealth / playerHealthMax;
  let colorBalance = max(0, (healthFraction - 0.2) / 0.8); // color fades from green to red as player loses health. At or below 20% health it is completely red.
  fill(lerp(0, 255, 1 - colorBalance), lerp(0, 255, colorBalance), 0, 127);
  rect(canvasWidth / 2 - (healthBarWidth / 2), canvasHeight - 30, healthBarWidth * healthFraction, 20);
}

function drawGameOverScreen(){
    push();  
    fill(0, 0, 0, 127);
    rect(0, 0, canvasWidth, canvasHeight);
    fill("white");
    textSize(48);
    textAlign(CENTER);
    text("Final score: " + score, canvasWidth / 2, canvasHeight / 2);
    if(!networkError) submitScoreBtn.draw();
    else submitScoreBtnDisabled.draw();
    restartBtn.draw();
    pop();
}

function drawPauseScreen(){
  fill(0, 0, 0, 127);
  rect(0, 0, canvasWidth, canvasHeight);
  image(pauseIconImage, canvasWidth / 2 - 32, canvasWidth / 2 - 32);
  fill("white");
  textSize(32);
  textFont(globalFont);
  textAlign(CENTER);
  text("Press space to pause/unpause", canvasWidth / 2, canvasHeight / 2 + 72);
  restartBtn.draw();
}

function drawCursor(){
  push();
  imageMode(CENTER);
  image(crosshairImage, mouseX, mouseY, 48, 48);
  pop();
}

function drawSettingsIcon(){
  push();
  if(gameState === PLAYING) drawingContext.globalAlpha = 0.5;
  else drawingContext.globalAlpha = 1;
  settingsButton.draw();
  drawingContext.globalAlpha = 1;
  pop();
}

function drawSettingsMenu(){
  push();
  // darken behind
  fill(0, 0, 0, 127);
  rect(0, 0, canvasWidth, canvasHeight);

  sfxToggleBtn.draw();
  imageMode(CORNER);
  image(sfxOn ? sfxOnIcon : sfxOffIcon, canvasWidth / 2 - sfxToggleBtnSize / 2, canvasHeight / 2 - sfxToggleBtnSize / 2, 64, 64);

  okayButton.draw();
  pop();
}

function drawLeaderboard(){
  push();
  // darken behind
  fill(0, 0, 0, 127);
  rect(0, 0, canvasWidth, canvasHeight);

  textAlign(CENTER);
  textSize(24);
  
  try{
    easyLeaderboardString = "EASY:\n";
    for(let i = 0; i < leaderboard.easy.length && i < 10; i++){
      easyLeaderboardString += `${leaderboard.easy[i].name}: ${leaderboard.easy[i].score}\n`
    }
    
    normalLeaderboardString = "NORMAL:\n";
    for(let i = 0; i < leaderboard.normal.length && i < 10; i++){
      normalLeaderboardString += `${leaderboard.normal[i].name}: ${leaderboard.normal[i].score}\n`
    }
    
    hardLeaderboardString = "HARD:\n";
    for(let i = 0; i < leaderboard.hard.length && i < 10; i++){
      hardLeaderboardString += `${leaderboard.hard[i].name}: ${leaderboard.hard[i].score}\n`
    }
    
    fill(difficultyData.easy.color);
    text(easyLeaderboardString, canvasWidth / 6, 80);
    fill(difficultyData.normal.color);
    text(normalLeaderboardString, canvasWidth / 2, 80);
    fill(difficultyData.hard.color);
    text(hardLeaderboardString, canvasWidth - canvasWidth / 6, 80);
  }
  catch(e){
    if(leaderboardError){
      fill(255, 127, 127);
      text("Error loading leaderboard. Try again later.", canvasWidth / 2, 280);
    }
    else{
      fill(255);
      text("Loading...", canvasWidth / 2, 280);
    }
  }

  backBtn.draw();
  pop();
}

function assignImages(){
  // normal enemies
  for(let i = 0; i < enemyGroup.length; i++){
    if(freezeTimer >= 1){
      // console.log(`adding image ${freezeTimer-1}`);
      enemyGroup[i].addImage(monsterFreezeImages[5 - freezeTimer]);
    }
    else{
      enemyGroup[i].addImage(enemyImage);
      freezing = false;
    }
  }
  // boss enemies
  for(let i = 0; i < enemyBossGroup.length; i++){
    let enemy = enemyBossGroup[i];
    if(freezeTimer >= 1){
      enemy.addImage(bossFreezeImages[5 - freezeTimer]);
    }
    else{
      freezing = false;
      // console.log(`index: ${Math.floor(4 * enemy.tag.health / enemyBossHealthMax)}`);
      enemy.addImage(bossDamageImages[Math.floor(4 * enemy.tag.health / enemyBossHealthMax)]);
    }
  }
}

/**
 * PLAYER CONTROLS
 */
function incrementVelocity(){
  let x = 0;
  let y = 0;
  // create a unit vector from pressed keys
  if(keyIsDown(UP_ARROW) || keyIsDown(87)){
    y -= 1;
  }
  if(keyIsDown(DOWN_ARROW) || keyIsDown(83)){
    y += 1;
  }
  if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
    x += 1;
  }
  if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
    x -= 1;
  }

  // (x,y) is now a unit vector representing the appropriate direction

  if(Math.abs(x) + Math.abs(y) > 0){
    x /= Math.sqrt(x*x + y*y);
    y /= Math.sqrt(x*x + y*y);

    playerSpeedX += x * playerMoveForce;
    playerSpeedY += y * playerMoveForce;
  }

  // apply friction
  // calculate friction force (opposite direction of movement * speed)
  playerSpeedX -= playerFriction * playerSpeedX;
  playerSpeedY -= playerFriction * playerSpeedY;
}

function playerControls(){
  // this functions handles the players movement
  // handle border
  if(player.position.y > canvasHeight - playerWidth/2){
    player.position.y = canvasHeight - playerWidth/2;
  }
  if(player.position.y < 0 + playerWidth/2){
    player.position.y = playerWidth/2;
  }
  if(player.position.x < 0 + playerWidth/2){
    player.position.x = playerWidth/2;
  }
  if(player.position.x > canvasWidth - playerWidth/2){
    player.position.x = canvasWidth - playerWidth/2;
  }

  incrementVelocity();

  player.position.x += playerSpeedX;
  player.position.y += playerSpeedY;
}

/**
 * UTILITY
 */
function wrangleCoords(x, y){
  // returns coordinates that are always inside of the canvas
  return [mod(x, canvasWidth), mod(y, canvasHeight)];
}

function fetchLeaderboard(){
  showingLeaderboard = true;
  leaderboardError = false;
  fetch(`${serverURLBase}/leaderboard`)
    .then(res => {
      res.json().then(data => {
        leaderboard = data;
        leaderboardError = false;
      });
    })
    .catch(e => {
      console.error("Error loading leaderboard");
      console.error(e);
      leaderboardError = true;
    });
}

function submitHighScore(){
  clickablesDisabled = true;
  Swal.fire({
    title: `Enter your name and submit your score of ${score}`,
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Submit Score',
    showLoaderOnConfirm: true,
    preConfirm: name => {
      return fetch(`${serverURLBase}/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          score: score,
          difficulty: difficultyString.toLowerCase(),
          token: authToken
        })
      })
      .then(res => {
        if (!res.ok){
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .catch(err => {
        Swal.showValidationMessage(
          `Error: ${err.message}`
        )
      })
    }
  }).then((res) => {
    if(res.isConfirmed){
      clickablesDisabled = true;
      Swal.fire({
        title: 'Successfully submitted high score!'
      }).then(() => {
        clickablesDisabled = false;
        resetLevel();
      })
    }
    else{
      clickablesDisabled = false;
    }
  });
}

function toggleLegacySfx(){
  useLegacySfx = !useLegacySfx;
  if(useLegacySfx){
    twangSfx = loadSound("audio/twang.wav", 3);
    playerDamageSfx = loadSound("audio/ow.wav");
    playerDeathSfx = loadSound("audio/aww.wav");
    monsterDeathSfx = loadSound("audio/fwoo.wav");
  }
  else{
    twangSfx = loadSound("audio/arrow_shot_1.wav", 0.2);
    playerDamageSfx = loadSound("audio/heavy_sound_1.wav", 0.2);
    playerDeathSfx = loadSound("audio/death_2.wav");
    monsterDeathSfx = loadSound("audio/monster_death_1.wav", 0.5);
  }
}

/**
 * SPAWNING
 */
function spawnKillallAbility(){
  if(killallAbilityPrevSpawn + killallAbilitySpawnPeriod <= gameFrame && killallEmbargo < gameFrame){
    var killallAbility = createSprite(Math.random() * canvasWidth, Math.random() * canvasHeight);
    killallAbility.addImage(killallAbilityImage);
    killallAbility.setCollider("rectangle", 0, 0, 96, 96);
    killallAbility.debug = debugSprites;
    killallAbility.scale = 0.7;
    killallAbilities.add(killallAbility);

    killallAbilityPrevSpawn = gameFrame;
    killallAbilitySpawnPeriod = killallSpawnPeriodAvg + Math.random() * 2 * killallSpawnVariance - killallSpawnVariance
  }
}

function spawnFreezeAbility(){
  // console.log(`freezePrevSpawn: ${freezePrevSpawn}, freezeSpawnPeriod: ${freezeSpawnPeriod}, gameFrame: ${gameFrame}`)
  if(freezePrevSpawn + freezeSpawnPeriod <= gameFrame){
    var freeze = createSprite(Math.random() * canvasWidth, Math.random() * canvasHeight);
    freeze.addImage(freezeAbilityImage);
    freeze.setCollider("rectangle", 0, 0, 96, 96);
    freeze.debug = debugSprites;
    freeze.scale = 0.7;
    freezeAbilities.add(freeze);

    freezePrevSpawn = gameFrame;
    freezeSpawnPeriod = freezeSpawnPeriodAvg + Math.random() * 2 * freezeSpawnVariance - freezeSpawnVariance;
  }
}

function spawnHealthPack(){
  if(healthPackPrevSpawn + healthPackSpawnPeriod <= gameFrame && healthPackEmbargo <= gameFrame){
    var healthPack = createSprite(Math.random() * canvasWidth, Math.random() * canvasHeight);
    healthPack.addImage(healthPackImage);
    healthPack.setCollider("rectangle", 0, 0, 128, 128);
    healthPack.debug = debugSprites;
    healthPack.scale = 0.3;
    healthPacks.add(healthPack);

    healthPackPrevSpawn = gameFrame;
    healthPackSpawnPeriod = healthPackSpawnPeriodAverage + Math.random() * 2 * healthPackSpawnVariance + healthPackSpawnVariance;
  }
}

function spawnArrowBunch(){
  if(gameFrame === arrowBunchSpawnFrame){
    if(arrowBunches.length < 6){
      var arrowBunch = createSprite(Math.random() * canvasWidth, Math.random() * canvasHeight);
      arrowBunch.addImage(arrowBunchImage);
      arrowBunch.setCollider("rectangle", 0, 0, 64, 64);
      arrowBunch.debug = debugSprites;
      arrowBunch.scale = 0.35;
      arrowBunches.add(arrowBunch);
      arrowBunch.depth = 1;
    }
    arrowBunchSpawnFrame += Math.round(arrowSpawnPeriod * FRAMERATE);
  }
}

function spawnMonster(){
  if(enemySpawnFrame <= gameFrame && !freezing){
    // create a random vector pointing out from the player, length half of the canvasWidth
    var safeRadius = 256; // monsters dont spawn immediately on or next to the player
    var length = Math.random() * canvasWidth / 2 + safeRadius; // hypotenuse
    var theta = Math.random() * 2 * Math.PI;

    var x_ = Math.cos(theta) * length;
    var y_ = Math.sin(theta) * length;
    
    var coords = wrangleCoords(player.position.x + x_, player.position.y + y_);

    createMonster(coords[0], coords[1]);
    
    enemySpawnPeriod = max(enemySpawnPeriodMin, enemySpawnPeriod * enemySpawnAcceleration);

    if(enemySpawnPeriod === enemySpawnPeriodMin){
      enemyBossRateMultiplierIsActive = true;
      arrowSpawnPeriod = arrowSpawnPeriodAfterBossRateMultiplier;
    }

    if(enemyBossRateMultiplierIsActive){
      enemyBossRate = 1 - (enemyBossRateMultiplier * (1 - enemyBossRate));
    }

    enemySpawnFrame = gameFrame + FRAMERATE * enemySpawnPeriod;
  }
}

function createMonster(x, y){
  var monster = createSprite(x, y);
  monster.debug = debugSprites;
  if(Math.random() > enemyBossRate){
    monster.addImage(enemyImage);
    monster.setCollider("rectangle", 0, 0, 42, 54);
    monster.tag = new MetaObj(health=enemyHealthMax, strength=10);
    enemyGroup.add(monster);
  }
  else{
    monster.addImage(bossDamageImages[0]);
    monster.scale = 0.5;
    monster.setCollider("rectangle", 0, 0, 180, 200);
    monster.tag = new MetaObj(health=enemyBossHealthMax, strength=40, value=3, boss=true);
    enemyBossGroup.add(monster);
  }
}

/**
 * MONSTER MOVEMENT
 */
function attractMonsters(){
  if(!freezing){
    for(var i = 0; i < enemyGroup.length; i++){
      monster = enemyGroup[i];
      monster.attractionPoint(1, player.position.x, player.position.y);
      monster.maxSpeed = 3;
    }
    for(var i = 0; i < enemyBossGroup.length; i++){
      monster = enemyBossGroup[i];
      monster.attractionPoint(0.15, player.position.x, player.position.y);
      monster.maxSpeed = 2;
    }
  }
}

function pauseMonsters(){
  for(var i = 0; i < enemyGroup.length; i++){
    enemyGroup[i].maxSpeed = 0;
  }
  for(var i = 0; i < enemyBossGroup.length; i++){
    enemyBossGroup[i].maxSpeed = 0;
  }
}

/**
 * COLLISIONS AND COLLISION HANDLERS
 */
function collisions(){
  enemyGroup.overlap(arrows, damageEnemy);
  enemyBossGroup.overlap(arrows, damageEnemy);
  enemyGroup.collide(player, damagePlayer);
  enemyBossGroup.collide(player, damagePlayer);
  arrowBunches.overlap(player, stockArrows);
  healthPacks.overlap(player, healPlayer);
  killallAbilities.overlap(player, equipKillall);
  freezeAbilities.overlap(player, equipFreeze);
}

function damageEnemy(enemy, arrow){
  var ret = null;
  enemy.tag.health = max(0, enemy.tag.health - (playerStrength * (freezing ? 0.8 : 1)));
  if(enemy.tag.health <= 0){
    enemy.remove();
    if(!gameIsOver) score += enemy.tag.value;
    if(sfxOn) {
      if(freezing) iceBreakSfx.play();
      else monsterDeathSfx.play();
      
    }
    ret = 0;
  }
  else if(enemy.tag.isBoss){
    var idx = Math.floor(4 * enemy.tag.health / enemyBossHealthMax);
    enemy.addImage(bossDamageImages[idx]);
  }

  if(arrow != null){
    arrows.remove(arrow);
    arrow.remove();
    if(sfxOn){
      if(freezing) iceClinkSfx.play();
      else hitSfx.play();
    }
  }

  return ret;
}

function damagePlayer(enemy){
  if(sfxOn) playerDamageSfx.play();
  enemy.remove();
  playerHealth -= enemy.tag.strength + (Math.round(Math.random() * 6) - 3);
  if(playerHealth <= 0){
    playerHealth = 0;
    gameOver();
  }
}

function stockArrows(arrowBunch){
  playerArrows += arrowBunchSize;
  arrowBunch.remove();
  if(sfxOn) chainSfx.play();
}

function healPlayer(healthPack){
  if(sfxOn) healthPackSfx.play();
  healthPack.remove();
  playerHealth = min(playerHealthMax, playerHealth + 10);
}

function equipKillall(killallAbility){
  killallAbility.remove();
  if(sfxOn) killallEquipSfx.play();
  killallEquipped = true;
}

function equipFreeze(freeze){
  freeze.remove();
  if(sfxOn) killallEquipSfx.play();
  freezeEquipped = true;
}

/**
 * POWERUP EXECUTION
 */
function doKillall(){
  if(killallEquipped){
    if(sfxOn) killallSfx.play();
    score += Math.floor((enemyGroup.length) / 2);
    while(enemyGroup.length > 0) enemyGroup[0].remove();
    for(var i = 0; i < enemyBossGroup.length; i++) {
      for(var k = 0; k < Math.floor(enemyBossHealthMax / playerStrength) - 1; k++){
        if(damageEnemy(enemyBossGroup[i], null) != null) break;
      }
    }
    killallEquipped = false;
  }
}

function doFreeze(){
  if(freezeEquipped){
    if(sfxOn) freezeSfx.play();
    freezing = true;
    pauseMonsters();
    freezeTimer = 5;
    freezeEquipped = false;
  }
}

/**
 * GAMESTATE FUNCTIONS
 */
function gameOver(){
  if(gameIsOver){
    return;
  }
  setGameState(PAUSED)
  playerHealth = 0;
  gameIsOver = true;
  player.addImage(playerDeadImage);
  if(sfxOn) playerDeathSfx.play();
}

function resetLevel(){
  // intialize agnostic globals again
  initAgnosticGlobalVars();

  // reset player
  player.position.x = canvasWidth / 2;
  player.position.y = canvasHeight / 2;
  player.addImage(playerImage);

  enemySpawnPeriod = enemySpawnPeriodMax;

  // destroy all sprites
  while(allSprites.length > 0) allSprites[0].remove();
}

function registerGame(difficulty, data){
  fetch(`${serverURLBase}/context-collapse-token`)
    .then(res => {
      res.json().then(d => {
        networkError = false;
        authToken = d["token"];
        startGame(difficulty, data);
      });
    })
    .catch(e => {
      networkError = true;
      console.log("Playing offline: will not be able to submit highscore.");
      clickablesDisabled = true;
      Swal.fire({
        title: "Playing in offline mode.\nYou will not be able to submit a high score.",
        imageUrl: "images/wifi-off.png",
        imageWidth: 96,
        imageHeight: 96,
        backdrop: false,
      }).then(() => {
        clickablesDisabled = false;
        startGame(difficulty, data)
      })
    });
}

function startGame(difficulty, data){
  player = createSprite(canvasWidth / 2, canvasHeight / 2, playerWidth, playerHeight); 
  player.addImage(playerImage);
  player.setCollider("rectangle", 0, 0, playerWidth, playerHeight);
  player.debug = debugSprites;
  player.depth = 2;

  var settings = data[difficulty];
  difficultyString = settings["name"];
  difficultyColor = settings["color"];
  enemySpawnPeriodMax = settings["enemySpawnPeriodMax"];
  enemySpawnPeriodMin = settings["enemySpawnPeriodMin"];
  enemySpawnAcceleration = settings["enemySpawnAcceleration"];
  enemySpawnPeriod = enemySpawnPeriodMax;
  enemyBossRate = settings["enemyBossRate"];

  gameIsStarting = false;

  setGameState(PLAYING);
}

function setGameState(state){
  gameState = state;
  gameStateFuncs[state]();
}

/**
 * CLEANUP (prevent memory leaks from arrows flying off the screen)
 */
function cleanup(){
  for(var i = 0; i < allSprites.length; i++){
    var x = allSprites[i].position.x;
    var y = allSprites[i].position.y;
    if(x > canvasWidth || x < 0 || y > canvasHeight || y < 0){
      allSprites[i].remove();
    }
  }
}

/**
 * EVENTS
 */
function mousePressed(){
  if(gameState === PLAYING && playerArrows > 0){
    var arrow = createSprite(player.position.x, player.position.y);
    arrow.addImage(arrowImage);
    arrow.scale = 0.35;
    
    // calculate rotation, default points NE
    var x_diff = mouseX - player.position.x;
    var y_diff = mouseY - player.position.y;
    var true_theta = Math.atan(y_diff / x_diff);
    var theta = 45 + true_theta * 180 / Math.PI;
    if(mouseX < player.position.x){
      theta += 180;
    }
    arrow.rotation = theta;
    
    arrow.attractionPoint(playerArrowSpeed, mouseX, mouseY);
    arrow.debug = debugSprites;
    arrow.setCollider("rectangle", 0, 0, 20, 20);
    arrows.add(arrow);
    playerArrows--;
    if(sfxOn) twangSfx.play();
  }
}

function keyPressed(){
  // Space
  if(keyCode === 32 && !gameIsOver){
    if(gameState === STARTING){
    }
    else if(gameState === PAUSED){
      if(showingSettings){
        showingSettings = false;
      }
      else{
        setGameState(PLAYING);
      }
    }
    else if(gameState === PLAYING){
      pauseScreen = true;
      setGameState(PAUSED);
    }
  }
  // escape key
  if(keyCode === 27){
    if(showingSettings) showingSettings = false;
    if(gameState === STARTING){
    }
    else if(gameState === PLAYING){
      pauseScreen = true;
      setGameState(PAUSED);
    }
    else if(gameState === PAUSED){
    }
  }
  // press 1, Q, F, or X to activate hotbar item 1
  if([49, 81, 70, 88].indexOf(keyCode) >= 0){
    doFreeze();
  }
  // press 2, E, G, or C to activate hotbar item 2
  if([50, 69, 71, 67].indexOf(keyCode) >= 0){
    doKillall();
  }
  // H to toggle showing hitboxes
  if(keyCode === 72){
    debugSprites = !debugSprites;
    allSprites.forEach(s => {
      s.debug = debugSprites;
    });
  }
  // period toggles legacy sfx (easter egg)
  if(keyCode == 190){
    toggleLegacySfx();
  }
}