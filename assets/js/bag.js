export const bag = {
  visible: false,
  eggs: 0,
  milk: 0,
  icons: {
    egg: new Image(),
    milk: new Image()
  }
};

bag.icons.egg.src = "assets/icons/egg.png";
bag.icons.milk.src = "assets/icons/milk.png";

export function toggleBag() {
  bag.visible = !bag.visible;
}

export function addItem(item, amount = 1) {
  switch (item) {
    case "egg":
      bag.eggs += amount;
      console.log(`🥚 +${amount} ovo(s)! Total: ${bag.eggs}`);
      break;

    case "milk":
      bag.milk += amount;
      console.log(`🥛 +${amount} leite(s)! Total: ${bag.milk}`);
      break;

    default:
      console.warn("⚠️ Item desconhecido:", item);
      break;
  }
}

export function removeItem(item, amount = 1) {
  if (item === "egg") {
    if (bag.eggs >= amount) {
      bag.eggs -= amount;
      console.log(`🥚 -${amount} ovo(s)! Total: ${bag.eggs}`);
      return true;
    }
  }

  if (item === "milk") {
    if (bag.milk >= amount) {
      bag.milk -= amount;
      console.log(`🥛 -${amount} leite(s)! Total: ${bag.milk}`);
      return true;
    }
  }

  console.log("❌ Quantidade insuficiente!");
  return false;
}

export function drawBag(ctx, menu) {
  if (!bag.visible) return;

  const x = menu.x + menu.width / 2;
  const y = menu.y + 170;

  ctx.font = "bold 26px Emulogic";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";

  if (bag.icons.milk.complete)
    ctx.drawImage(bag.icons.milk, x - 160, y - 25, 40, 40);

  ctx.fillText(`Milk: ${bag.milk}`, x + 20, y + 10);

  if (bag.icons.egg.complete)
    ctx.drawImage(bag.icons.egg, x - 160, y + 45, 40, 40);

  ctx.fillText(`Eggs: ${bag.eggs}`, x + 20, y + 80);
}
