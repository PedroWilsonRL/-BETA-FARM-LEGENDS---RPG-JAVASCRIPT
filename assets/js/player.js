import { isBlocked, checkTeleport, setMap } from "./map.js";

export const playerImage = new Image();
playerImage.src = "assets/characters/people/hero.png"; 

const playerShadow = new Image();
playerShadow.src = "assets/characters/shadow.png";

const SPRITE_FRAME_WIDTH = 294; 
const SPRITE_FRAME_HEIGHT = 328; 

export const PLAYER_WIDTH = 74;
export const PLAYER_HEIGHT = 74;
export const PLAYER_SPEED = 2.5;
const TILE_SIZE = 32;

const teleportSound = new Audio("assets/sounds/door_sound.mp3");
teleportSound.volume = 0.6;

const animations = {
  idleDown:  [{x:0,y:0},{x:1,y:0},{x:2,y:0}],
  idleRight: [{x:0,y:1},{x:1,y:1},{x:2,y:1}],
  idleLeft:  [{x:0,y:2},{x:1,y:2},{x:2,y:2}],
  idleUp:    [{x:0,y:3},{x:1,y:3},{x:2,y:3}],
  walkDown:  [{x:0,y:4},{x:1,y:4},{x:2,y:4}],
  walkRight: [{x:0,y:5},{x:1,y:5},{x:2,y:5}],
  walkLeft:  [{x:0,y:6},{x:1,y:6},{x:2,y:6}],
  walkUp:    [{x:0,y:7},{x:1,y:7},{x:2,y:7}],
};

const ANIMATION_SPEED = 10;
let isFading = false;
let fadeAlpha = 0;
let fadeDirection = 0; 
let pendingTeleport = null;

export const player = {
  x: 15.8 * TILE_SIZE,
  y: 9.5 * TILE_SIZE,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  dir: "down",
  moving: false,
  animFrame: 0,
  animCounter: 0
};

export function updatePlayer(keysPressed) {
  if (isFading) return; 

  player.moving = false;
  let nextX = player.x;
  let nextY = player.y;

  if (keysPressed["w"] || keysPressed["W"]) { 
    nextY -= PLAYER_SPEED; 
    player.dir = "up";    
    player.moving = true; 
  }
  if (keysPressed["s"] || keysPressed["S"]) { 
    nextY += PLAYER_SPEED; 
    player.dir = "down";  
    player.moving = true; 
  }
  if (keysPressed["a"] || keysPressed["A"]) { 
    nextX -= PLAYER_SPEED; 
    player.dir = "left";  
    player.moving = true; 
  }
  if (keysPressed["d"] || keysPressed["D"]) { 
    nextX += PLAYER_SPEED; 
    player.dir = "right"; 
    player.moving = true; 
  }

  const tileX = Math.floor((nextX + player.width / 2) / TILE_SIZE);
  const tileY = Math.floor((nextY + player.height / 2) / TILE_SIZE);

  if (!isBlocked(tileX, tileY)) {
    player.x = nextX;
    player.y = nextY;

    const teleport = checkTeleport(tileX, tileY);
    if (teleport && !isFading) {
      teleportSound.currentTime = 0;
      teleportSound.play().catch(() => {});
      isFading = true;
      fadeDirection = 1; 
      pendingTeleport = teleport;
    }
  }

  player.animCounter++;
  if (player.animCounter >= ANIMATION_SPEED) {
    player.animCounter = 0;
    player.animFrame++;
    const anim = getCurrentAnimation();
    if (player.animFrame >= anim.length) player.animFrame = 0;
  }
}

function updateFade(ctx) {
  if (!isFading) return;

  fadeAlpha += fadeDirection * 0.05;

  if (fadeAlpha >= 1) {

    fadeAlpha = 1;
    fadeDirection = -1; 

    if (pendingTeleport) {
      setMap(pendingTeleport.targetMap);
      player.x = pendingTeleport.targetX * TILE_SIZE;
      player.y = pendingTeleport.targetY * TILE_SIZE;
      pendingTeleport = null;
    }
  }

  if (fadeAlpha <= 0 && fadeDirection === -1) {
    fadeAlpha = 0;
    isFading = false; 
  }

  ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function getCurrentAnimation() {
  if (player.moving) {
    switch(player.dir) {
      case "up": return animations.walkUp;
      case "down": return animations.walkDown;
      case "left": return animations.walkLeft;
      case "right": return animations.walkRight;
    }
  } else {
    switch(player.dir) {
      case "up": return animations.idleUp;
      case "down": return animations.idleDown;
      case "left": return animations.idleLeft;
      case "right": return animations.idleRight;
    }
  }
}

export function drawPlayer(ctx) {

  ctx.drawImage(
    playerShadow,
    player.x + player.width / 2 - 20,
    player.y + player.height - 15,
    45, 20
  );

  const anim = getCurrentAnimation();
  const frame = anim[player.animFrame];

  ctx.drawImage(
    playerImage,
    frame.x * SPRITE_FRAME_WIDTH,
    frame.y * SPRITE_FRAME_HEIGHT,
    SPRITE_FRAME_WIDTH,
    SPRITE_FRAME_HEIGHT,
    player.x,
    player.y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT
  );

  updateFade(ctx);
}