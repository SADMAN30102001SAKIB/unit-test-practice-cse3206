const {
  calculateItemTotal,
  applyDiscount,
  roundCurrency,
} = require("../layer1/pricing");

function createCart() {
  return {
    items: [],
    discount: 0,
  };
}

function addItem(cart, itemId, name, price, quantity) {
  const existing = cart.items.find(item => item.itemId === itemId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ itemId, name, price, quantity });
  }
  return cart;
}

function removeItem(cart, itemId) {
  cart.items = cart.items.filter(item => item.itemId !== itemId);
  return cart;
}

function getSubtotal(cart) {
  const total = cart.items.reduce((sum, item) => {
    return sum + calculateItemTotal(item.price, item.quantity);
  }, 0);
  return roundCurrency(total);
}

function applyCartDiscount(cart, discountPercent) {
  if (cart.items.length === 0) {
    throw new Error("Cannot apply discount to empty cart");
  }
  cart.discount = discountPercent;
  return cart;
}

function getTotal(cart) {
  const subtotal = getSubtotal(cart);
  const total = applyDiscount(subtotal, cart.discount);
  return roundCurrency(total);
}

module.exports = {
  createCart,
  addItem,
  removeItem,
  getSubtotal,
  applyCartDiscount,
  getTotal,
};
