import { getCurrentMap, setMap, isMapLoaded, drawDebug, updateMapPopup, drawMapPopup } from "./map.js";
import { player, drawPlayer, updatePlayer } from "./player.js";
import { menu, toggleMenu, drawMenu, handleMenuClick, handleMenuHover } from "./menu.js";
import { cow, updateCow, drawCow, drawCowUI } from "./cow.js";
import { chicken, updateChicken, drawChicken, drawChickenUI } from "./chicken.js";
import { mainMenu, drawMainMenu, handleMainMenuClick, handleMainMenuHover, audioUnlocked } from "./mainmenu.js";
import { npc, updateNPC, drawNPC, drawNPCUI } from "./npc.js";


const TILE_SIZE = 32;
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 736;

const canvas = document.getElementById("canvas1");
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
const ctx = canvas.getContext("2d");

setMap("map1");

const keysPressed = {};

window.addEventListener("keydown", (e) => {
  if (mainMenu.visible) return;

  if (e.key === "p" || e.key === "P") {
    toggleMenu();
    return;
  }
  if (menu.visible) return;

  keysPressed[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  if (mainMenu.visible) return;
  keysPressed[e.key] = false;
});

window.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (mainMenu.visible) {
    handleMainMenuClick(mx, my, () => {
      mainMenu.visible = false;  
    });
    return;
  }

  if (menu.visible) {
    handleMenuClick(mx, my);
    return;
  }

  if (getCurrentMap().name === "map3") {
    const worldX = mx / camera.zoom + camera.x;
    const worldY = my / camera.zoom + camera.y;

  }
});

window.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  if (mainMenu.visible) {
    handleMainMenuHover(mx, my);
    return;
  }

  if (menu.visible) {
    handleMenuHover(mx, my);
  }
});

const camera = {
  x: 0,
  y: 0,
  zoom: 1.5,
  smoothSpeed: 0.1,
  targetZoom: 1.5,
};

const mapZoomLevels = {
  map1: 2.0,
  map2: 1.5,
  map3: 1.5,
  map4: 2.0,
};

function updateCamera() {
  const currentMap = getCurrentMap();
  const desiredZoom = mapZoomLevels[currentMap.name] || 1.5;
  camera.targetZoom = desiredZoom;

  camera.zoom += (camera.targetZoom - camera.zoom) * 0.05;

  const targetX =
    player.x + player.width / 2 - GAME_WIDTH / (2 * camera.zoom);
  const targetY =
    player.y + player.height / 2 - GAME_HEIGHT / (2 * camera.zoom);

  camera.x += (targetX - camera.x) * camera.smoothSpeed;
  camera.y += (targetY - camera.y) * camera.smoothSpeed;
}

let transitionAlpha = 0;
let transitioning = false;
let nextMapInfo = null;
let lastMapName = "map1";

export function triggerMapTransition(targetMap, targetX, targetY) {
  if (transitioning) return;

  transitioning = true;
  nextMapInfo = { targetMap, targetX, targetY };
}

function drawTransitionOverlay() {
  if (transitionAlpha > 0) {
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${transitionAlpha})`;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.restore();
  }
}

function updateTransition() {
  if (!transitioning) return;

  if (nextMapInfo && transitionAlpha < 1) {
    transitionAlpha += 0.05;

    if (transitionAlpha >= 1) {
      const targetMap = nextMapInfo.targetMap;

      setMap(targetMap);

      player.x = nextMapInfo.targetX * TILE_SIZE;
      player.y = nextMapInfo.targetY * TILE_SIZE;

      lastMapName = targetMap;
      nextMapInfo = null;
    }
  } else if (!nextMapInfo && transitionAlpha > 0) {
    transitionAlpha -= 0.05;

    if (transitionAlpha <= 0) {
      transitioning = false;
      transitionAlpha = 0;
    }
  }
}

function drawScene() {
  const currentMap = getCurrentMap();
  if (!isMapLoaded()) return;

  ctx.save();
  ctx.fillStyle = currentMap.backgroundColor || "#000";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.restore();

  ctx.save();
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.x, -camera.y);

  ctx.drawImage(currentMap.image, 0, 0);
  //drawDebug(ctx);

  if (currentMap.name === "map4") {
    updateCow();
    drawCow(ctx);
  }

  if (currentMap.name === "map2") {
    updateChicken();
    drawChicken(ctx);
  }

  if (currentMap.name === "map3") {
    updateNPC();
    drawNPC(ctx);
  }

  drawPlayer(ctx);

  if (currentMap.upper) ctx.drawImage(currentMap.upper, 0, 0);

  ctx.restore();
}

function gameLoop() {
  if (mainMenu.visible) {
    drawMainMenu(ctx, GAME_WIDTH, GAME_HEIGHT);
    requestAnimationFrame(gameLoop);
    return;
  }

  const currentMap = getCurrentMap();

  ctx.fillStyle = currentMap.backgroundColor || "#000";
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if (!menu.visible && !transitioning) {
    updatePlayer(keysPressed);
  }

  updateCamera();
  updateTransition();
  updateMapPopup(16.66);

  drawScene();
  drawMapPopup(ctx);

  drawMenu(ctx);
  drawCowUI(ctx);
  drawChickenUI(ctx);

  if (currentMap.name === "map3") {
    drawNPCUI(ctx);

  }

  if (transitionAlpha > 0) {
    drawTransitionOverlay();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
