import { isBlocked, getCurrentMap, TILE_SIZE } from "./map.js";
import { player } from "./player.js";
import { addItem } from "./bag.js";

export const chickenImage = new Image();
chickenImage.src = "assets/characters/animals/chicken.png";

const chickenShadow = new Image();
chickenShadow.src = "assets/characters/shadow.png";

const eggUIBg = new Image();
eggUIBg.src = "assets/menu/menu_background.png";

const yesButtonImg = new Image();
yesButtonImg.src = "assets/menu/option_background.png";

const noButtonImg = new Image();
noButtonImg.src = "assets/menu/option_background.png";

const SPRITE_FRAME_WIDTH = 298;
const SPRITE_FRAME_HEIGHT = 328;

export const CHICKEN_WIDTH = 74;
export const CHICKEN_HEIGHT = 74;
export const CHICKEN_SPEED = 1;

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

const ANIMATION_SPEED = 15;

export const chicken = {
  x: 15 * TILE_SIZE,
  y: 12 * TILE_SIZE,
  width: CHICKEN_WIDTH,
  height: CHICKEN_HEIGHT,
  dir: "down",
  moving: false,
  animFrame: 0,
  animCounter: 0,
  moveTimer: 0,

  showEggOption: false,
  collectingEgg: false,
  eggProgress: 0,

  hoverButton: null,
};

export function updateChicken() {
  const currentMap = getCurrentMap();
  if (currentMap.name !== "map2") return;

  if (chicken.collectingEgg) {
    chicken.eggProgress += 0.004;

    if (chicken.eggProgress >= 1) {
      chicken.eggProgress = 1;
      chicken.collectingEgg = false;
      chicken.showEggOption = false;

      addItem("egg", 1);
      console.log("🥚 Coleta concluída! +1 ovo adicionado à bolsa.");
    }
    return;
  }

  chicken.moveTimer++;
  if (chicken.moveTimer > 120) {
    chicken.moving = Math.random() < 0.5;
    if (chicken.moving) {
      const dirs = ["up", "down", "left", "right"];
      chicken.dir = dirs[Math.floor(Math.random() * dirs.length)];
    }
    chicken.moveTimer = 0;
  }

  if (chicken.moving) {
    let nextX = chicken.x;
    let nextY = chicken.y;

    switch (chicken.dir) {
      case "up": nextY -= CHICKEN_SPEED; break;
      case "down": nextY += CHICKEN_SPEED; break;
      case "left": nextX -= CHICKEN_SPEED; break;
      case "right": nextX += CHICKEN_SPEED; break;
    }

    const tileX = Math.floor((nextX + chicken.width / 2) / TILE_SIZE);
    const tileY = Math.floor((nextY + chicken.height / 2) / TILE_SIZE);

    if (!isBlocked(tileX, tileY)) {
      chicken.x = nextX;
      chicken.y = nextY;
    }
  }

  chicken.animCounter++;
  if (chicken.animCounter >= ANIMATION_SPEED) {
    chicken.animCounter = 0;
    chicken.animFrame++;
    const anim = getCurrentAnimation();
    if (chicken.animFrame >= anim.length) chicken.animFrame = 0;
  }
}

function getCurrentAnimation() {
  if (chicken.moving) {
    switch (chicken.dir) {
      case "up": return animations.walkUp;
      case "down": return animations.walkDown;
      case "left": return animations.walkLeft;
      case "right": return animations.walkRight;
    }
  } else {
    switch (chicken.dir) {
      case "up": return animations.idleUp;
      case "down": return animations.idleDown;
      case "left": return animations.idleLeft;
      case "right": return animations.idleRight;
    }
  }
}

export function drawChicken(ctx) {
  const currentMap = getCurrentMap();
  if (currentMap.name !== "map2") return;

  ctx.drawImage(
    chickenShadow,
    chicken.x + chicken.width / 2 - 20,
    chicken.y + chicken.height - 15,
    45,
    20
  );

  const anim = getCurrentAnimation();
  const frame = anim[chicken.animFrame];

  ctx.drawImage(
    chickenImage,
    frame.x * SPRITE_FRAME_WIDTH,
    frame.y * SPRITE_FRAME_HEIGHT,
    SPRITE_FRAME_WIDTH,
    SPRITE_FRAME_HEIGHT,
    chicken.x,
    chicken.y,
    CHICKEN_WIDTH,
    CHICKEN_HEIGHT
  );

  if (chicken.collectingEgg) {
    const barWidth = 50;
    const barHeight = 6;
    const progress = (1 - chicken.eggProgress) * barWidth;
    ctx.fillStyle = "lightgray";
    ctx.fillRect(chicken.x + 12, chicken.y - 12, barWidth, barHeight);
    ctx.fillStyle = "gold";
    ctx.fillRect(chicken.x + 12, chicken.y - 12, progress, barHeight);
    ctx.strokeStyle = "black";
    ctx.strokeRect(chicken.x + 12, chicken.y - 12, barWidth, barHeight);
  }
}

window.addEventListener("click", (e) => {
  const rect = document.querySelector("canvas").getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (chicken.collectingEgg) return;

  const dx = (player.x + player.width / 2) - (chicken.x + chicken.width / 2);
  const dy = (player.y + player.height / 2) - (chicken.y + chicken.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 60 && !chicken.showEggOption) {
    chicken.showEggOption = true;
    return;
  }

  if (chicken.showEggOption && chicken._yesRect && chicken._noRect) {
    if (
      mouseX >= chicken._yesRect.x && mouseX <= chicken._yesRect.x + chicken._yesRect.w &&
      mouseY >= chicken._yesRect.y && mouseY <= chicken._yesRect.y + chicken._yesRect.h
    ) {
      chicken.collectingEgg = true;
      chicken.eggProgress = 0;
      return;
    }

    if (
      mouseX >= chicken._noRect.x && mouseX <= chicken._noRect.x + chicken._noRect.w &&
      mouseY >= chicken._noRect.y && mouseY <= chicken._noRect.y + chicken._noRect.h
    ) {
      chicken.showEggOption = false;
      return;
    }
  }
});

window.addEventListener("mousemove", (e) => {
  if (!chicken.showEggOption || !chicken._yesRect || !chicken._noRect) return;

  const rect = document.querySelector("canvas").getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  chicken.hoverButton = null;
  if (
    mouseX >= chicken._yesRect.x && mouseX <= chicken._yesRect.x + chicken._yesRect.w &&
    mouseY >= chicken._yesRect.y && mouseY <= chicken._yesRect.y + chicken._yesRect.h
  ) {
    chicken.hoverButton = "yes";
  } else if (
    mouseX >= chicken._noRect.x && mouseX <= chicken._noRect.x + chicken._noRect.w &&
    mouseY >= chicken._noRect.y && mouseY <= chicken._noRect.y + chicken._noRect.h
  ) {
    chicken.hoverButton = "no";
  }
});

export function drawChickenUI(ctx) {
  if (!chicken.showEggOption || chicken.collectingEgg) return;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const canvas = ctx.canvas;
  const uiWidth = 1280;
  const uiHeight = 120;
  const uiX = (canvas.width - uiWidth) / 2;
  const uiY = canvas.height - uiHeight - -1;

  ctx.drawImage(eggUIBg, uiX, uiY, uiWidth, uiHeight);

  ctx.fillStyle = "#502a1d";
  ctx.font = "20px Emulogic";
  ctx.textAlign = "center";
  ctx.fillText("Collect egg?", uiX + uiWidth / 2, uiY + 45);

  const buttonWidth = 90;
  const buttonHeight = 35;
  const spacing = 20;

  const yesX = uiX + uiWidth / 2 - buttonWidth - spacing / 2;
  const noX = uiX + uiWidth / 2 + spacing / 2;
  const buttonY = uiY + 60;

  ctx.drawImage(yesButtonImg, yesX, buttonY, buttonWidth, buttonHeight);
  ctx.drawImage(noButtonImg, noX, buttonY, buttonWidth, buttonHeight);

  ctx.font = "16px Emulogic";
  ctx.textAlign = "center";
  ctx.fillStyle = chicken.hoverButton === "yes" ? "limegreen" : "#502a1d";
  ctx.fillText("YES", yesX + buttonWidth / 2, buttonY + 23);

  ctx.fillStyle = chicken.hoverButton === "no" ? "limegreen" : "#502a1d";
  ctx.fillText("NO", noX + buttonWidth / 2, buttonY + 23);

  chicken._yesRect = { x: yesX, y: buttonY, w: buttonWidth, h: buttonHeight };
  chicken._noRect = { x: noX, y: buttonY, w: buttonWidth, h: buttonHeight };

  ctx.restore();
}
