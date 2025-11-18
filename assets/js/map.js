export const TILE_SIZE = 32;
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 736;

const map1Image = new Image();
map1Image.src = "assets/maps/room_map.png";

const map1Upper = new Image();
map1Upper.src = "assets/maps/room_map upper.png";

const map2Image = new Image();
map2Image.src = "assets/maps/farm_map.png";

const map2Upper = new Image();
map2Upper.src = "assets/maps/farm_map upper.png";

const map3Image = new Image();
map3Image.src = "assets/maps/city_map.png";

const map3Upper = new Image();
map3Upper.src = "assets/maps/city_map upper.png";

const map4Image = new Image();
map4Image.src = "assets/maps/barn_map.png";

const map4Upper = new Image();
map4Upper.src = "assets/maps/barn_map upper.png";

const map1Popup = new Image();
map1Popup.src = "assets/maps/room_map description.png";

const map2Popup = new Image();
map2Popup.src = "assets/maps/farm_map description.png";

const map3Popup = new Image();
map3Popup.src = "assets/maps/city_map description.png";

const map4Popup = new Image();
map4Popup.src = "assets/maps/barn_map description.png";

let popupImage = null;
let popupTimer = 0;
const POPUP_DURATION = 5000; 
const FADE_DURATION = 300;   

export function updateMapPopup(deltaTime) {
  if (popupTimer > 0) {
    popupTimer -= deltaTime;
    if (popupTimer <= 0) {
      popupTimer = 0;
      popupImage = null;
    }
  }
}

export function drawMapPopup(ctx) {
  if (!popupImage || popupTimer <= 0) return;

  let alpha = 1;

  if (popupTimer < FADE_DURATION) {
    alpha = popupTimer / FADE_DURATION;
  }

  const timeSinceStart = POPUP_DURATION - popupTimer;
  if (timeSinceStart < FADE_DURATION) {
    alpha = timeSinceStart / FADE_DURATION;
  }

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(alpha, 1));

  ctx.drawImage(
    popupImage,
    GAME_WIDTH - 400, 
    20,               
    367,              
    120               
  );

  ctx.restore();
}



const blockedTilesMap1 = [
  { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 9 }, { x: 14, y: 10 }, { x: 14, y: 11 }, 
  { x: 14, y: 12 }, { x: 14, y: 13 }, { x: 14, y: 14 }, { x: 15, y: 14 }, { x: 16, y: 14 }, 
  { x: 17, y: 14 }, { x: 18, y: 14 }, { x: 19, y: 14 }, { x: 20, y: 14 }, { x: 23, y: 14 }, 
  { x: 24, y: 14 }, { x: 25, y: 14 }, { x: 25, y: 13 }, { x: 25, y: 12 }, { x: 25, y: 11 },
  { x: 25, y: 10 }, { x: 25, y: 9 }, { x: 24, y: 9 }, { x: 23, y: 9 }, { x: 22, y: 9 }, 
  { x: 21, y: 9 }, { x: 20, y: 9 }, { x: 19, y: 9 }, { x: 18, y: 9 }, { x: 17, y: 9 }, 
  { x: 16, y: 9 }, { x: 15, y: 9 },                 
];

const blockedTilesMap2 = [
 { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
 { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }, { x: 9, y: 1 },
 { x: 10, y: 1 }, { x: 11, y: 1 }, { x: 12, y: 1 }, { x: 13, y: 1 }, { x: 14, y: 1 },
 { x: 15, y: 1 }, { x: 16, y: 1 }, { x: 17, y: 1 }, { x: 18, y: 1 }, { x: 19, y: 1 },
 { x: 20, y: 1 }, { x: 21, y: 1 }, { x: 22, y: 1 }, { x: 23, y: 1 }, { x: 24, y: 1 },
 { x: 25, y: 1 }, { x: 26, y: 1 }, { x: 27, y: 1 }, { x: 28, y: 1 }, { x: 29, y: 1 },
 { x: 30, y: 1 }, { x: 31, y: 1 }, { x: 32, y: 1 }, { x: 33, y: 1 }, { x: 34, y: 1 },
 { x: 35, y: 1 }, { x: 36, y: 1 }, { x: 37, y: 1 }, { x: 38, y: 1 }, { x: 39, y: 1 },
 { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 },
 { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 }, { x: 5, y: 10 }, { x: 5, y: 11 },
 { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 }, { x: 5, y: 15 }, { x: 5, y: 16 },
 { x: 5, y: 17 }, { x: 5, y: 18 },
 { x: 6, y: 18 }, { x: 7, y: 18 }, { x: 8, y: 18 }, { x: 9, y: 18 }, { x: 10, y: 18 },
 { x: 11, y: 18 }, { x: 12, y: 18 }, { x: 13, y: 18 }, { x: 14, y: 18 }, { x: 15, y: 18 },
 { x: 16, y: 18 }, { x: 17, y: 18 }, { x: 18, y: 18 }, { x: 19, y: 18 }, { x: 20, y: 18 },
 { x: 20, y: 19 }, { x: 23, y: 19 }, { x: 23, y: 18 }, { x: 24, y: 18 }, { x: 25, y: 18 },
 { x: 26, y: 18 }, { x: 27, y: 18 }, { x: 28, y: 18 }, { x: 29, y: 18 }, { x: 30, y: 18 },
 { x: 31, y: 18 }, { x: 32, y: 18 }, { x: 33, y: 18 }, { x: 34, y: 18 }, { x: 34, y: 17 }, 
 { x: 34, y: 16 }, { x: 34, y: 15 }, { x: 34, y: 14 }, { x: 34, y: 13 }, { x: 34, y: 12 }, 
 { x: 34, y: 11 }, { x: 34, y: 10 }, { x: 34, y: 9 }, { x: 34, y: 8 }, { x: 34, y: 7 }, 
 { x: 34, y: 6 }, { x: 34, y: 5 }, { x: 34, y: 4 }, { x: 34, y: 3 }, { x: 34, y: 2 }, 
 { x: 31, y: 9 }, { x: 30, y: 9 }, { x: 29, y: 9 }, { x: 28, y: 9 }, { x: 26, y: 9 },
 { x: 25, y: 9 }, { x: 24, y: 9 }, { x: 23, y: 9 }, { x: 23, y: 8 }, { x: 23, y: 7 }, 
 { x: 23, y: 6 }, { x: 24, y: 6 }, { x: 25, y: 6 }, { x: 26, y: 6 }, { x: 27, y: 6 }, 
 { x: 28, y: 6 }, { x: 29, y: 6 }, { x: 30, y: 6 }, { x: 31, y: 6 }, { x: 31, y: 7 }, 
 { x: 31, y: 8 }, 
 { x: 17, y: 8 }, { x: 17, y: 7 }, { x: 17, y: 6 }, { x: 16, y: 6 }, { x: 15, y: 6 },
 { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 14, y: 8 },     
 { x: 26, y: 16 }, { x: 27, y: 16 }, { x: 28, y: 16 }, { x: 29, y: 16 }, { x: 30, y: 16 }, 
 { x: 26, y: 15 }, { x: 27, y: 15 }, { x: 28, y: 15 }, { x: 29, y: 15 }, { x: 30, y: 15 }, 
 { x: 26, y: 14 }, { x: 27, y: 14 }, { x: 28, y: 14 }, { x: 29, y: 14 }, { x: 30, y: 14 },
 { x: 19, y: 7 }, { x: 20, y: 7 }, { x: 21, y: 7 },  
 { x: 13, y: 9 }, { x: 12, y: 9 }, { x: 11, y: 9 }, { x: 10, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 },  
 { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }, { x: 9, y: 2 }, { x: 10, y: 2 }, { x: 11, y: 2 }, { x: 12, y: 2 }, { x: 13, y: 2 }, { x: 14, y: 2 }, { x: 15, y: 2 },
 { x: 19, y: 5 }, { x: 20, y: 5 }, { x: 20, y: 4 }, { x: 21, y: 4 }, { x: 19, y: 4 },
 { x: 20, y: 3 }, { x: 21, y: 3 }, { x: 19, y: 3 }, { x: 20, y: 2 }, { x: 21, y: 2 }, { x: 19, y: 2 },
 { x: 30, y: 12 }, { x: 31, y: 12 }, { x: 30, y: 13 }, { x: 31, y: 13 }, 
 { x: 32, y: 13 }, { x: 32, y: 12 }, { x: 32, y: 11 }, { x: 31, y: 11 }, 
 { x: 21, y: 21 }, { x: 22, y: 21 }, { x: 15, y: 7 }, { x: 16, y: 7 }, { x: 26, y: 8 }, 
 { x: 26, y: 7 }, { x: 27, y: 7 }, { x: 28, y: 7 }, { x: 28, y: 8 },    

];

const blockedTilesMap3 = [
  { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 },
  { x: 4, y: 6 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 },
  { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 4, y: 13 }, { x: 4, y: 14 }, { x: 4, y: 15 },
  { x: 4, y: 16 }, { x: 4, y: 17 }, { x: 4, y: 18 }, { x: 4, y: 19 }, { x: 4, y: 20 },
  { x: 4, y: 21 }, { x: 5, y: 20 }, { x: 6, y: 20 }, { x: 7, y: 20 }, { x: 8, y: 20 },
  { x: 9, y: 20 }, { x: 10, y: 20 }, { x: 11, y: 20 }, { x: 12, y: 20 }, { x: 13, y: 20 },
  { x: 14, y: 20 }, { x: 15, y: 20 }, { x: 16, y: 20 }, { x: 17, y: 20 }, { x: 18, y: 20 },
  { x: 19, y: 20 }, { x: 20, y: 20 }, { x: 21, y: 20 }, { x: 22, y: 20 }, { x: 23, y: 20 },
  { x: 24, y: 20 }, { x: 25, y: 20 }, { x: 26, y: 20 }, { x: 27, y: 20 }, { x: 28, y: 20 },
  { x: 29, y: 20 }, { x: 30, y: 20 }, { x: 31, y: 20 }, { x: 32, y: 20 }, { x: 33, y: 20 },
  { x: 34, y: 20 }, { x: 35, y: 20 }, { x: 35, y: 19 }, { x: 35, y: 18 }, { x: 35, y: 17 },
  { x: 35, y: 16 }, { x: 35, y: 15 }, { x: 35, y: 14 }, { x: 35, y: 13 }, { x: 35, y: 12 },
  { x: 35, y: 11 }, { x: 35, y: 10 }, { x: 35, y: 9 }, { x: 35, y: 8 }, { x: 35, y: 7 },
  { x: 35, y: 6 }, { x: 35, y: 5 }, { x: 35, y: 4 }, { x: 35, y: 3 }, { x: 35, y: 2 },
  { x: 34, y: 2 }, { x: 33, y: 2 }, { x: 32, y: 2 }, { x: 31, y: 2 }, { x: 30, y: 2 },
  { x: 29, y: 2 }, { x: 28, y: 2 }, { x: 27, y: 2 }, { x: 26, y: 2 }, { x: 25, y: 2 },
  { x: 24, y: 2 }, { x: 23, y: 2 }, { x: 22, y: 2 }, { x: 21, y: 2 }, { x: 20, y: 2 },
  { x: 19, y: 2 }, { x: 18, y: 2 }, { x: 17, y: 2 },
  { x: 14, y: 2 }, { x: 14, y: 3 }, { x: 14, y: 4 }, { x: 14, y: 5 }, { x: 14, y: 6 },
  { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 13, y: 8 }, { x: 12, y: 8 }, { x: 11, y: 8 }, 
  { x: 10, y: 8 }, { x: 9, y: 8 }, { x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 },
  { x: 6, y: 7 },  { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 10, y: 7 },
  { x: 10, y: 6 }, { x: 10, y: 5 }, { x: 11, y: 5 }, { x: 12, y: 5 }, { x: 13, y: 5 }, 
  { x: 17, y: 6 }, { x: 18, y: 7 }, { x: 19, y: 7 }, { x: 20, y: 7 }, { x: 21, y: 6 }, 
  { x: 21, y: 5 }, { x: 21, y: 4 }, { x: 20, y: 4 }, { x: 19, y: 4 }, { x: 18, y: 4 },
  { x: 17, y: 4 }, { x: 17, y: 5 }, { x: 23, y: 5 }, { x: 23, y: 6 }, { x: 23, y: 7 },
  { x: 23, y: 8 }, { x: 24, y: 8 }, { x: 25, y: 8 }, { x: 26, y: 8 }, { x: 27, y: 8 },
  { x: 28, y: 7 }, { x: 29, y: 7 }, { x: 30, y: 7 }, { x: 31, y: 7 }, { x: 31, y: 6 },
  { x: 31, y: 5 }, { x: 30, y: 5 }, { x: 29, y: 5 }, { x: 28, y: 5 }, { x: 27, y: 5 },
  { x: 26, y: 5 }, { x: 25, y: 5 }, { x: 24, y: 5 }, 
  { x: 21, y: 12 }, { x: 20, y: 12 }, { x: 19, y: 12 }, { x: 18, y: 12 }, { x: 17, y: 12 },
  { x: 21, y: 11 }, { x: 20, y: 11 }, { x: 19, y: 11 }, { x: 18, y: 11 }, { x: 17, y: 11 }, 
  { x: 21, y: 10 }, { x: 20, y: 10 }, { x: 19, y: 10 }, { x: 18, y: 10 }, { x: 17, y: 10 }, 
  { x: 19, y: 9 }, { x: 23, y: 19 }, { x: 23, y: 18 }, { x: 23, y: 17 }, { x: 24, y: 17 },
  { x: 25, y: 17 }, { x: 26, y: 17 }, { x: 27, y: 17 }, { x: 28, y: 17 }, { x: 28, y: 18 },
  { x: 28, y: 19 }, { x: 28, y: 16 }, { x: 28, y: 15 }, { x: 28, y: 14 }, { x: 28, y: 13 },
  { x: 29, y: 13 }, { x: 30, y: 13 }, { x: 31, y: 13 }, { x: 32, y: 13 }, { x: 33, y: 13 },
  { x: 34, y: 13 }, { x: 14, y: 15 }, { x: 13, y: 15 }, { x: 12, y: 15 }, { x: 11, y: 14 }, 
  { x: 10, y: 14 }, { x: 9, y: 14 }, { x: 8, y: 14 }, { x: 7, y: 14 }, { x: 7, y: 13 },
  { x: 8, y: 13 }, { x: 9, y: 13 }, { x: 10, y: 13 }, { x: 11, y: 13 }, { x: 12, y: 13 },
  { x: 13, y: 13 }, { x: 14, y: 13 }, { x: 14, y: 14 }, { x: 15, y: 1 }, { x: 16, y: 1 },                          
];

const blockedTilesMap4 = [
  { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 },
  { x: 13, y: 13 }, { x: 13, y: 14 }, { x: 14, y: 14 }, { x: 15, y: 14 }, { x: 16, y: 14 },
  { x: 17, y: 14 }, { x: 20, y: 14 }, { x: 21, y: 14 }, { x: 22, y: 14 }, { x: 23, y: 14 }, 
  { x: 24, y: 14 }, { x: 25, y: 14 }, { x: 26, y: 14 }, { x: 26, y: 13 }, { x: 26, y: 12 },
  { x: 26, y: 11 }, { x: 26, y: 10 }, { x: 26, y: 9 }, { x: 26, y: 8 }, { x: 25, y: 9 }, 
  { x: 24, y: 9 }, { x: 23, y: 9 }, { x: 22, y: 9 }, { x: 21, y: 9 }, { x: 20, y: 9 }, 
  { x: 19, y: 9 }, { x: 18, y: 9 }, { x: 17, y: 9 }, { x: 16, y: 9 }, { x: 15, y: 9 },
  { x: 14, y: 9 }, { x: 17, y: 10 }, { x: 18, y: 10 }, { x: 19, y: 10 }, { x: 14, y: 13 },
  { x: 15, y: 13 }, { x: 14, y: 12 }, { x: 15, y: 12 }, { x: 18, y: 16 }, { x: 19, y: 16 }, 
  { x: 17, y: 15 }, { x: 20, y: 15 },                                            
];

const teleportTilesMap1 = [
  { x: 21, y: 15, targetMap: "map2", targetX: 26, targetY: 9 },
  { x: 22, y: 15, targetMap: "map2", targetX: 26, targetY: 9 },
];

const teleportTilesMap2 = [
  { x: 27, y: 8, targetMap: "map1", targetX: 21, targetY: 13 },

  { x: 21, y: 20, targetMap: "map3", targetX: 15, targetY: 3 },
  { x: 22, y: 20, targetMap: "map3", targetX: 15, targetY: 3 },

  { x: 15, y: 8, targetMap: "map4", targetX: 18, targetY: 12 },
  { x: 16, y: 8, targetMap: "map4", targetX: 18, targetY: 12 },
];

const teleportTilesMap3 = [
  { x: 15, y: 2, targetMap: "map2", targetX: 21, targetY: 18 },
  { x: 16, y: 2, targetMap: "map2", targetX: 21, targetY: 18 },
];

const teleportTilesMap4 = [
  { x: 18, y: 15, targetMap: "map2", targetX: 15, targetY: 8 },
  { x: 19, y: 15, targetMap: "map2", targetX: 15, targetY: 8 },
];

export const maps = {
  map1: {
    name: "map1",
    image: map1Image,
    upper: map1Upper,
    blockedTiles: blockedTilesMap1,
    teleportTiles: teleportTilesMap1,
    popup: map1Popup,
    backgroundColor: "#502a1d", 
  },
  map2: {
    name: "map2",
    image: map2Image,
    upper: map2Upper,
    blockedTiles: blockedTilesMap2,
    teleportTiles: teleportTilesMap2,
    popup: map2Popup,
    backgroundColor: "#39b300", 
  },
  map3: {
    name: "map3",
    image: map3Image,
    upper: map3Upper,
    blockedTiles: blockedTilesMap3,
    teleportTiles: teleportTilesMap3,
    popup: map3Popup,
    backgroundColor: "#96aa00", 
  },
  map4: {
    name: "map4",
    image: map4Image,
    upper: map4Upper,
    blockedTiles: blockedTilesMap4,
    teleportTiles: teleportTilesMap4,
    popup: map4Popup,
    backgroundColor: "#502a1d", 
  },
};

let currentMap = maps.map1;
let debugMode = true;

export function setMap(mapName) {
  if (maps[mapName]) {
    currentMap = maps[mapName];

    popupImage = currentMap.popup;
    popupTimer = POPUP_DURATION;

  } else {
    console.warn(`Mapa "${mapName}" não encontrado!`);
  }
}

export function getCurrentMap() {
  return currentMap;
}

export function isMapLoaded() {
  return currentMap.image.complete && currentMap.upper.complete;
}

export function isBlocked(tileX, tileY) {
  if (!currentMap.blockedTiles) return false;
  return currentMap.blockedTiles.some(tile => tile.x === tileX && tile.y === tileY);
}

export function checkTeleport(tileX, tileY) {
  if (!currentMap.teleportTiles) return null;
  return currentMap.teleportTiles.find(tp => tp.x === tileX && tp.y === tileY) || null;
}

export function drawDebug(ctx) {
  if (!debugMode) return;

  ctx.save();
  ctx.globalAlpha = 0.5;

  ctx.fillStyle = "red";
  currentMap.blockedTiles?.forEach(tile => {
    ctx.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  });

  ctx.fillStyle = "blue";
  currentMap.teleportTiles?.forEach(tile => {
    ctx.fillRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  });

  ctx.restore();
}