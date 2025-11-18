export const moneyWallet = {
  visible: false,   
  amount: 0,     
  icon: new Image()
};

moneyWallet.icon.src = "assets/icons/dolar.png";

export function toggleMoneyWallet() {
  moneyWallet.visible = !moneyWallet.visible;
}

export function addMoney(amount) {
  moneyWallet.amount += amount;
  console.log(`💰 +${amount} moedas! Total: ${moneyWallet.amount}`);
}

export function spendMoney(amount) {
  if (moneyWallet.amount >= amount) {
    moneyWallet.amount -= amount;
    console.log(`💸 -${amount} moedas! Total: ${moneyWallet.amount}`);
    return true;
  } else {
    console.log("❌ Dinheiro insuficiente!");
    return false;
  }
}

export function drawMoneyWallet(ctx, menu) {
  if (!moneyWallet.visible) return;

  const x = menu.x + menu.width / 2;
  const y = menu.y + 220;

  if (moneyWallet.icon.complete)
    ctx.drawImage(moneyWallet.icon, x - 160, y - 25, 40, 40);

  ctx.font = "bold 28px Emulogic";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(`Money: ${moneyWallet.amount}`, x + 20, y + 10);
}
