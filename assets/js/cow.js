import { isBlocked, getCurrentMap, TILE_SIZE } from "./map.js";
import { player } from "./player.js";
import { addItem } from "./bag.js";

export const cowImage = new Image();
cowImage.src = "assets/characters/animals/cow.png";

const cowShadow = new Image();
cowShadow.src = "assets/characters/shadow.png";

const milkUIBg = new Image();
milkUIBg.src = "assets/menu/menu_background.png";

const yesButtonImg = new Image();
yesButtonImg.src = "assets/menu/option_background.png";

const noButtonImg = new Image();
noButtonImg.src = "assets/menu/option_background.png";

const SPRITE_FRAME_WIDTH = 298;
const SPRITE_FRAME_HEIGHT = 328;

export const COW_WIDTH = 74;
export const COW_HEIGHT = 74;
export const COW_SPEED = 1;

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

export const cow = {
  x: 22 * TILE_SIZE,
  y: 10 * TILE_SIZE,
  width: COW_WIDTH,
  height: COW_HEIGHT,
  dir: "down",
  moving: false,
  animFrame: 0,
  animCounter: 0,
  moveTimer: 0,

  showMilkOption: false,
  collectingMilk: false,
  milkProgress: 0,

  hoverButton: null,
};

export function updateCow() {
  const currentMap = getCurrentMap();
  if (currentMap.name !== "map4") return;

  if (cow.collectingMilk) {
    cow.milkProgress += 0.004;

    if (cow.milkProgress >= 1) {
      cow.milkProgress = 1;
      cow.collectingMilk = false;
      cow.showMilkOption = false;

      addItem("milk", 1);
      console.log("🥛 Coleta concluída! +1 leite adicionado à bolsa.");
    }

    return;
  }

  cow.moveTimer++;
  if (cow.moveTimer > 120) {
    cow.moving = Math.random() < 0.5;
    if (cow.moving) {
      const dirs = ["up", "down", "left", "right"];
      cow.dir = dirs[Math.floor(Math.random() * dirs.length)];
    }
    cow.moveTimer = 0;
  }

  if (cow.moving) {
    let nextX = cow.x;
    let nextY = cow.y;

    switch (cow.dir) {
      case "up": nextY -= COW_SPEED; break;
      case "down": nextY += COW_SPEED; break;
      case "left": nextX -= COW_SPEED; break;
      case "right": nextX += COW_SPEED; break;
    }

    const tileX = Math.floor((nextX + cow.width / 2) / TILE_SIZE);
    const tileY = Math.floor((nextY + cow.height / 2) / TILE_SIZE);

    if (!isBlocked(tileX, tileY)) {
      cow.x = nextX;
      cow.y = nextY;
    }
  }

  cow.animCounter++;
  if (cow.animCounter >= ANIMATION_SPEED) {
    cow.animCounter = 0;
    cow.animFrame++;
    const anim = getCurrentAnimation();
    if (cow.animFrame >= anim.length) cow.animFrame = 0;
  }
}

function getCurrentAnimation() {
  if (cow.moving) {
    switch (cow.dir) {
      case "up": return animations.walkUp;
      case "down": return animations.walkDown;
      case "left": return animations.walkLeft;
      case "right": return animations.walkRight;
    }
  } else {
    switch (cow.dir) {
      case "up": return animations.idleUp;
      case "down": return animations.idleDown;
      case "left": return animations.idleLeft;
      case "right": return animations.idleRight;
    }
  }
}

export function drawCow(ctx) {
  const currentMap = getCurrentMap();
  if (currentMap.name !== "map4") return;

  ctx.drawImage(cowShadow, cow.x + cow.width / 2 - 20, cow.y + cow.height - 15, 45, 20);

  const anim = getCurrentAnimation();
  const frame = anim[cow.animFrame];

  ctx.drawImage(
    cowImage,
    frame.x * SPRITE_FRAME_WIDTH,
    frame.y * SPRITE_FRAME_HEIGHT,
    SPRITE_FRAME_WIDTH,
    SPRITE_FRAME_HEIGHT,
    cow.x,
    cow.y,
    COW_WIDTH,
    COW_HEIGHT
  );

  if (cow.collectingMilk) {
    const barWidth = 50;
    const barHeight = 6;
    const progress = (1 - cow.milkProgress) * barWidth;
    ctx.fillStyle = "lightgray";
    ctx.fillRect(cow.x + 12, cow.y - 12, barWidth, barHeight);
    ctx.fillStyle = "limegreen";
    ctx.fillRect(cow.x + 12, cow.y - 12, progress, barHeight);
    ctx.strokeStyle = "black";
    ctx.strokeRect(cow.x + 12, cow.y - 12, barWidth, barHeight);
  }

}

window.addEventListener("click", (e) => {
  const rect = document.querySelector("canvas").getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (cow.collectingMilk) return;

  const dx = (player.x + player.width / 2) - (cow.x + cow.width / 2);
  const dy = (player.y + player.height / 2) - (cow.y + cow.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 60 && !cow.showMilkOption) {
    cow.showMilkOption = true;
    return;
  }

  if (cow.showMilkOption && cow._yesRect && cow._noRect) {
    if (
      mouseX >= cow._yesRect.x && mouseX <= cow._yesRect.x + cow._yesRect.w &&
      mouseY >= cow._yesRect.y && mouseY <= cow._yesRect.y + cow._yesRect.h
    ) {
      cow.collectingMilk = true;
      cow.milkProgress = 0;
      return;
    }

    if (
      mouseX >= cow._noRect.x && mouseX <= cow._noRect.x + cow._noRect.w &&
      mouseY >= cow._noRect.y && mouseY <= cow._noRect.y + cow._noRect.h
    ) {
      cow.showMilkOption = false;
      return;
    }
  }
});

window.addEventListener("mousemove", (e) => {
  if (!cow.showMilkOption || !cow._yesRect || !cow._noRect) return;

  const rect = document.querySelector("canvas").getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  cow.hoverButton = null;
  if (
    mouseX >= cow._yesRect.x && mouseX <= cow._yesRect.x + cow._yesRect.w &&
    mouseY >= cow._yesRect.y && mouseY <= cow._yesRect.y + cow._yesRect.h
  ) {
    cow.hoverButton = "yes";
  } else if (
    mouseX >= cow._noRect.x && mouseX <= cow._noRect.x + cow._noRect.w &&
    mouseY >= cow._noRect.y && mouseY <= cow._noRect.y + cow._noRect.h
  ) {
    cow.hoverButton = "no";
  }
});

export function drawCowUI(ctx) {
  if (!cow.showMilkOption || cow.collectingMilk) return;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0); 

  const canvas = ctx.canvas;
  const uiWidth = 1280;   
  const uiHeight = 120;
  const uiX = (canvas.width - uiWidth) / 2;
  const uiY = canvas.height - uiHeight - -1; 

  ctx.drawImage(milkUIBg, uiX, uiY, uiWidth, uiHeight);

  ctx.fillStyle = "#502a1d";
  ctx.font = "20px Emulogic";
  ctx.textAlign = "center";
  ctx.fillText("Collect milk?", uiX + uiWidth / 2, uiY + 45);

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
  ctx.fillStyle = cow.hoverButton === "yes" ? "limegreen" : "#502a1d";
  ctx.fillText("YES", yesX + buttonWidth / 2, buttonY + 23);

  ctx.fillStyle = cow.hoverButton === "no" ? "limegreen" : "#502a1d";
  ctx.fillText("NO", noX + buttonWidth / 2, buttonY + 23);

  cow._yesRect = { x: yesX, y: buttonY, w: buttonWidth, h: buttonHeight };
  cow._noRect = { x: noX, y: buttonY, w: buttonWidth, h: buttonHeight };

  ctx.restore();
}

