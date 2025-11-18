import { isBlocked, getCurrentMap, TILE_SIZE } from "./map.js";
import { player } from "./player.js";
import { bag, removeItem } from "./bag.js";
import { addMoney } from "./moneywallet.js";

export const npcImage = new Image();
npcImage.src = "assets/characters/people/npc.png";

const npcShadow = new Image();
npcShadow.src = "assets/characters/shadow.png";

const npcUIBg = new Image();
npcUIBg.src = "assets/menu/menu_background.png";

const yesButtonImg = new Image();
yesButtonImg.src = "assets/menu/option_background.png";

const noButtonImg = new Image();
noButtonImg.src = "assets/menu/option_background.png";

const SPRITE_FRAME_WIDTH = 298;
const SPRITE_FRAME_HEIGHT = 328;

export const NPC_WIDTH = 74;
export const NPC_HEIGHT = 74;
export const NPC_SPEED = 1.2;

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

export const npc = {
  x: 20 * TILE_SIZE,
  y: 12 * TILE_SIZE,
  width: NPC_WIDTH,
  height: NPC_HEIGHT,
  dir: "down",
  moving: false,
  animFrame: 0,
  animCounter: 0,
  moveTimer: 0,
  showOption: false,
  hoverButton: null,
};

export function updateNPC() {
  const map = getCurrentMap();
  if (!map || map.name !== "map3") return;

  if (npc.showOption) return;

  npc.moveTimer++;
  if (npc.moveTimer > 120) {
    npc.moving = Math.random() < 0.6;
    if (npc.moving) {
      const dirs = ["up", "down", "left", "right"];
      npc.dir = dirs[Math.floor(Math.random() * dirs.length)];
    }
    npc.moveTimer = 0;
  }

  if (npc.moving) {
    let nextX = npc.x;
    let nextY = npc.y;

    switch (npc.dir) {
      case "up": nextY -= NPC_SPEED; break;
      case "down": nextY += NPC_SPEED; break;
      case "left": nextX -= NPC_SPEED; break;
      case "right": nextX += NPC_SPEED; break;
    }

    const tileX = Math.floor((nextX + npc.width/2) / TILE_SIZE);
    const tileY = Math.floor((nextY + npc.height/2) / TILE_SIZE);

    if (!isBlocked(tileX, tileY)) {
      npc.x = nextX;
      npc.y = nextY;
    }
  }

  npc.animCounter++;
  if (npc.animCounter >= ANIMATION_SPEED) {
    npc.animCounter = 0;
    npc.animFrame++;
    const anim = getCurrentAnimation();
    if (npc.animFrame >= anim.length) npc.animFrame = 0;
  }
}

function getCurrentAnimation() {
  if (npc.moving) {
    switch (npc.dir) {
      case "up": return animations.walkUp;
      case "down": return animations.walkDown;
      case "left": return animations.walkLeft;
      case "right": return animations.walkRight;
    }
  } else {
    switch (npc.dir) {
      case "up": return animations.idleUp;
      case "down": return animations.idleDown;
      case "left": return animations.idleLeft;
      case "right": return animations.idleRight;
    }
  }
}

export function drawNPC(ctx) {
  const map = getCurrentMap();
  if (!map || map.name !== "map3") return;

  ctx.drawImage(
    npcShadow,
    npc.x + npc.width/2 - 20,
    npc.y + npc.height - 15,
    45,
    20
  );

  const anim = getCurrentAnimation();
  const frame = anim[npc.animFrame];

  ctx.drawImage(
    npcImage,
    frame.x * SPRITE_FRAME_WIDTH,
    frame.y * SPRITE_FRAME_HEIGHT,
    SPRITE_FRAME_WIDTH,
    SPRITE_FRAME_HEIGHT,
    npc.x,
    npc.y,
    NPC_WIDTH,
    NPC_HEIGHT
  );
}

window.addEventListener("click", (e) => {
  const map = getCurrentMap();
  if (!map || map.name !== "map3") return;

  if (npc.showOption && npc._yesRect && npc._noRect) {
    const rect = document.querySelector("canvas").getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

if (
  mx >= npc._yesRect.x && mx <= npc._yesRect.x + npc._yesRect.w &&
  my >= npc._yesRect.y && my <= npc._yesRect.y + npc._yesRect.h
) {
  console.log("Player clicked YES.");

  const eggValue = 25;
  const milkValue = 25;

  const eggsSold = bag.eggs;
  const milkSold = bag.milk;

  const totalMoney =
    eggsSold * eggValue +
    milkSold * milkValue;

  if (totalMoney > 0) {
    addMoney(totalMoney);
  }

  if (eggsSold > 0) removeItem("egg", eggsSold);
  if (milkSold > 0) removeItem("milk", milkSold);

  npc.showOption = false;
  return;
}

    if (
      mx >= npc._noRect.x && mx <= npc._noRect.x + npc._noRect.w &&
      my >= npc._noRect.y && my <= npc._noRect.y + npc._noRect.h
    ) {
      npc.showOption = false;
      console.log("Player clicked NO.");
      return;
    }
  }

  const dx = (player.x + player.width/2) - (npc.x + npc.width/2);
  const dy = (player.y + player.height/2) - (npc.y + npc.height/2);
  const distance = Math.sqrt(dx*dx + dy*dy);

  if (distance < 60 && !npc.showOption) {
    npc.showOption = true;
  }
});

window.addEventListener("mousemove", (e) => {
  if (!npc.showOption || !npc._yesRect || !npc._noRect) return;

  const rect = document.querySelector("canvas").getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  npc.hoverButton = null;

  if (
    mx >= npc._yesRect.x && mx <= npc._yesRect.x + npc._yesRect.w &&
    my >= npc._yesRect.y && my <= npc._yesRect.y + npc._yesRect.h
  ) {
    npc.hoverButton = "yes";
  } else if (
    mx >= npc._noRect.x && mx <= npc._noRect.x + npc._noRect.w &&
    my >= npc._noRect.y && my <= npc._noRect.y + npc._noRect.h
  ) {
    npc.hoverButton = "no";
  }
});

export function drawNPCUI(ctx) {
  if (!npc.showOption) return;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  const canvas = ctx.canvas;
  const uiWidth = 1280;
  const uiHeight = 120;
  const uiX = (canvas.width - uiWidth) / 2;
  const uiY = canvas.height - uiHeight - -1;

  ctx.drawImage(npcUIBg, uiX, uiY, uiWidth, uiHeight);

  ctx.fillStyle = "#502a1d";
  ctx.font = "20px Emulogic";
  ctx.textAlign = "center";
  ctx.fillText("Do you have eggs and milk to sell me?", uiX + uiWidth / 2, uiY + 45);

  const buttonWidth = 90;
  const buttonHeight = 35;
  const spacing = 20;

  const yesX = uiX + uiWidth / 2 - buttonWidth - spacing / 2;
  const noX  = uiX + uiWidth / 2 + spacing / 2;
  const btnY = uiY + 60;

  ctx.drawImage(yesButtonImg, yesX, btnY, buttonWidth, buttonHeight);
  ctx.drawImage(noButtonImg, noX,  btnY, buttonWidth, buttonHeight);

  ctx.font = "16px Emulogic";

  ctx.fillStyle = npc.hoverButton === "yes" ? "limegreen" : "#502a1d";
  ctx.fillText("YES", yesX + buttonWidth/2, btnY + 23);

  ctx.fillStyle = npc.hoverButton === "no" ? "limegreen" : "#502a1d";
  ctx.fillText("NO",  noX + buttonWidth/2, btnY + 23);

  npc._yesRect = { x: yesX, y: btnY, w: buttonWidth, h: buttonHeight };
  npc._noRect  = { x: noX,  y: btnY, w: buttonWidth, h: buttonHeight };

  ctx.restore();
}
