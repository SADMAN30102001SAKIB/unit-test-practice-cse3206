function calculateItemTotal(price, quantity) {
  if (price < 0 || quantity < 0) {
    throw new Error("Price and quantity must be non-negative");
  }
  return price * quantity;
}

function applyDiscount(amount, discountPercent) {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  return amount - (amount * discountPercent) / 100;
}

function roundCurrency(amount) {
  return Math.round(amount * 100) / 100;
}

module.exports = {
  calculateItemTotal,
  applyDiscount,
  roundCurrency,
};
