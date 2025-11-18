import { moneyWallet, toggleMoneyWallet, drawMoneyWallet } from "./moneywallet.js";
import { bag, toggleBag, drawBag } from "./bag.js"; 
import { cow } from "./cow.js";

export const menu = {
  visible: false,
  background: new Image(),
  x: 650,
  y: 50,
  width: 600,
  height: 400,
  bagOption: {
    image: new Image(),
    x: 880,
    y: 120,
    width: 150,
    height: 50,
    hovered: false
  },
  walletOption: {
    image: new Image(),
    x: 770,
    y: 190,
    width: 380,
    height: 50,
    hovered: false
  },
  backOption: {
    image: new Image(),
    x: 870,
    y: 380,
    width: 180,
    height: 50,
    hovered: false
  },
  activeSection: null 
};

menu.background.src = "assets/menu/menu.png";
menu.bagOption.image.src = "assets/menu/option_background.png";
menu.walletOption.image.src = "assets/menu/option_background.png";
menu.backOption.image.src = "assets/menu/option_background.png";

export function toggleMenu() {
  menu.visible = !menu.visible;
  if (menu.visible) cow.showMilkOption = false; 
  if (!menu.visible) {
    menu.activeSection = null;
    moneyWallet.visible = false;
    bag.visible = false;
  }
}

export function handleMenuClick(mouseX, mouseY) {
  if (!menu.visible) return;

  if (menu.activeSection === "wallet" || menu.activeSection === "bag") {
    const back = menu.backOption;
    if (
      mouseX >= back.x &&
      mouseX <= back.x + back.width &&
      mouseY >= back.y &&
      mouseY <= back.y + back.height
    ) {
      console.log("↩️ Voltando ao menu principal...");
      menu.activeSection = null;
      moneyWallet.visible = false;
      bag.visible = false;
    }
    return;
  }

  const options = [menu.bagOption, menu.walletOption];
  for (const opt of options) {
    if (
      mouseX >= opt.x &&
      mouseX <= opt.x + opt.width &&
      mouseY >= opt.y &&
      mouseY <= opt.y + opt.height
    ) {
      if (opt === menu.bagOption) {
        console.log("👜 Bag selecionada!");
        bag.visible = true;            
        moneyWallet.visible = false;   
        menu.activeSection = "bag";
      } 
      else if (opt === menu.walletOption) {
        console.log("💰 Money Wallet selecionada!");
        moneyWallet.visible = true;    
        bag.visible = false;          
        menu.activeSection = "wallet";
      }
    }
  }
}

export function handleMenuHover(mouseX, mouseY) {
  if (!menu.visible) return;

  if (menu.activeSection === "wallet" || menu.activeSection === "bag") {
    const back = menu.backOption;
    back.hovered =
      mouseX >= back.x &&
      mouseX <= back.x + back.width &&
      mouseY >= back.y &&
      mouseY <= back.y + back.height;
    return;
  }

  const options = [menu.bagOption, menu.walletOption];
  for (const opt of options) {
    opt.hovered =
      mouseX >= opt.x &&
      mouseX <= opt.x + opt.width &&
      mouseY >= opt.y &&
      mouseY <= opt.y + opt.height;
  }
}

function drawOption(ctx, opt, text) {
  ctx.drawImage(opt.image, opt.x, opt.y, opt.width, opt.height);
  ctx.font = "bold 28px Emulogic";
  ctx.fillStyle = opt.hovered ? "yellow" : "#59321e";
  ctx.textAlign = "center";
  ctx.fillText(text, opt.x + opt.width / 2, opt.y + opt.height / 2 + 10);

  if (opt.hovered) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.strokeRect(opt.x, opt.y, opt.width, opt.height);
  }
}

export function drawMenu(ctx) {
  if (!menu.visible) return;

  ctx.drawImage(menu.background, menu.x, menu.y, menu.width, menu.height);

  if (menu.activeSection === "wallet") {
    drawMoneyWallet(ctx, menu);
    drawOption(ctx, menu.backOption, "Back");
    return;
  }

  if (menu.activeSection === "bag") {
    drawBag(ctx, menu);
    drawOption(ctx, menu.backOption, "Back");
    return;
  }

  drawOption(ctx, menu.bagOption, "Bag");
  drawOption(ctx, menu.walletOption, "Money Wallet");
}
