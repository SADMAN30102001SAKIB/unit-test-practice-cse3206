const { getTotal, getSubtotal } = require("../layer2/cart");
const { calculateFinalAmount, processPayment } = require("../layer2/payment");
const { isInStock, reserveStock } = require("../layer1/inventory");

function validateOrder(cart) {
  const errors = [];

  if (cart.items.length === 0) {
    errors.push("Cart is empty");
  }

  for (const item of cart.items) {
    if (!isInStock(item.itemId, item.quantity)) {
      errors.push(`Insufficient stock for ${item.name}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function createOrder(cart, region, paymentMethod) {
  const validation = validateOrder(cart);
  if (!validation.valid) {
    throw new Error(`Order validation failed: ${validation.errors.join(", ")}`);
  }

  for (const item of cart.items) {
    reserveStock(item.itemId, item.quantity);
  }

  const subtotal = getSubtotal(cart);
  const cartTotal = getTotal(cart);
  const finalAmount = calculateFinalAmount(cartTotal, region);

  const paymentResult = processPayment(finalAmount, paymentMethod);

  return {
    orderId: `ORD-${Date.now()}`,
    items: [...cart.items],
    subtotal,
    discount: cart.discount,
    cartTotal,
    tax: finalAmount - cartTotal,
    finalAmount,
    payment: paymentResult,
    status: "COMPLETED",
  };
}

module.exports = {
  validateOrder,
  createOrder,
};
