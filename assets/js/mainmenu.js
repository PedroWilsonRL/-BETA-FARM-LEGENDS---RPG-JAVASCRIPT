// mainmenu.js
export const mainMenu = {
  visible: true,
  showingControls: false,

  background: new Image(),
  logo: new Image(),
  buttonBg: new Image(),
  controlsImage: new Image(),

  music: new Audio("assets/sounds/menu_theme.mp3"),
  musicStarted: false,

  fontSizes: {
    start: 40,
    controls: 30,
    back: 32
  },

  startBtn: {
    x: 0,
    y: 0,
    width: 260,
    height: 100,
    hover: false
  },

  controlsBtn: {
    x: 0,
    y: 0,
    width: 260,
    height: 100,
    hover: false
  },

  backBtn: {
    x: 0,
    y: 0,
    width: 220,
    height: 80,
    hover: false
  }
};

mainMenu.background.src = "assets/menu/background.png";
mainMenu.logo.src = "assets/menu/Logo.png";
mainMenu.buttonBg.src = "assets/menu/option_background.png";
mainMenu.controlsImage.src = "assets/menu/controls.png";

mainMenu.music.loop = true;
mainMenu.music.volume = 0.6;

export let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  mainMenu.music.play().then(() => {
    mainMenu.music.pause();
    mainMenu.music.currentTime = 0;
    audioUnlocked = true;
  }).catch((err) => {
    console.warn("Audio ainda bloqueado:", err);
  });
}

window.addEventListener("click", unlockAudio, { once: true });
window.addEventListener("keydown", unlockAudio, { once: true });

export function drawMainMenu(ctx, canvasWidth, canvasHeight) {
  if (!mainMenu.visible) return;

  if (!mainMenu.musicStarted && audioUnlocked) {
    mainMenu.music.play().catch(() => {});
    mainMenu.musicStarted = true;
  }

  ctx.drawImage(mainMenu.background, 0, 0, canvasWidth, canvasHeight);

  if (mainMenu.showingControls) {

    const imgW = 800;
    const imgH = 500;
    const imgX = (canvasWidth / 2) - imgW / 2;
    const imgY = 80;

    ctx.drawImage(mainMenu.controlsImage, imgX, imgY, imgW, imgH);

    const back = mainMenu.backBtn;
    back.x = (canvasWidth / 2) - back.width / 2;
    back.y = imgY + imgH + 40;

    ctx.drawImage(mainMenu.buttonBg, back.x, back.y, back.width, back.height);

    ctx.font = `bold ${mainMenu.fontSizes.back}px Emulogic`;
    ctx.textAlign = "center";
    ctx.fillStyle = back.hover ? "#ffff88" : "#59321e";
    ctx.fillText("BACK", back.x + back.width / 2, back.y + back.height / 1.5);

    return;
  }

  const logoW = 411;
  const logoH = 581;
  const logoX = (canvasWidth / 2) - (logoW / 2);
  const logoY = 25;

  ctx.drawImage(mainMenu.logo, logoX, logoY, logoW, logoH);

  const start = mainMenu.startBtn;
  start.x = (canvasWidth / 2) - start.width - 20;
  start.y = 620;

  ctx.drawImage(mainMenu.buttonBg, start.x, start.y, start.width, start.height);

  ctx.font = `bold ${mainMenu.fontSizes.start}px Emulogic`;
  ctx.textAlign = "center";
  ctx.fillStyle = start.hover ? "#ffff88" : "#59321e";
  ctx.fillText("START", start.x + start.width / 2, start.y + start.height / 1.5);

  const ctr = mainMenu.controlsBtn;
  ctr.x = (canvasWidth / 2) + 20;
  ctr.y = 620;

  ctx.drawImage(mainMenu.buttonBg, ctr.x, ctr.y, ctr.width, ctr.height);

  ctx.font = `bold ${mainMenu.fontSizes.controls}px Emulogic`;
  ctx.fillStyle = ctr.hover ? "#ffff88" : "#59321e";
  ctx.fillText("CONTROLS", ctr.x + ctr.width / 2, ctr.y + ctr.height / 1.5);
}

export function handleMainMenuHover(mx, my) {
  if (!mainMenu.visible) return;

  if (mainMenu.showingControls) {
    const back = mainMenu.backBtn;
    back.hover =
      mx >= back.x && mx <= back.x + back.width &&
      my >= back.y && my <= back.y + back.height;
    return;
  }

  const start = mainMenu.startBtn;
  const ctr = mainMenu.controlsBtn;

  start.hover =
    mx >= start.x && mx <= start.x + start.width &&
    my >= start.y && my <= start.y + start.height;

  ctr.hover =
    mx >= ctr.x && mx <= ctr.x + ctr.width &&
    my >= ctr.y && my <= ctr.y + ctr.height;
}

export function handleMainMenuClick(mx, my, startCallback) {
  if (!mainMenu.visible) return;

  if (mainMenu.showingControls) {
    const back = mainMenu.backBtn;

    const clickedBack =
      mx >= back.x && mx <= back.x + back.width &&
      my >= back.y && my <= back.y + back.height;

    if (clickedBack) {
      mainMenu.showingControls = false;
    }

    return;
  }

  const start = mainMenu.startBtn;
  const ctr = mainMenu.controlsBtn;

  const clickedStart =
    mx >= start.x && mx <= start.x + start.width &&
    my >= start.y && my <= start.y + start.height;

  const clickedControls =
    mx >= ctr.x && mx <= ctr.x + ctr.width &&
    my >= ctr.y && my <= ctr.y + ctr.height;

  if (clickedStart) {
    mainMenu.music.pause();
    mainMenu.music.currentTime = 0;

    mainMenu.visible = false;
    if (startCallback) startCallback();
  }

  if (clickedControls) {
    mainMenu.showingControls = true;
  }
}
