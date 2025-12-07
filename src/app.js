const {
  createCart,
  addItem,
  removeItem,
  applyCartDiscount,
  getTotal,
  getSubtotal,
} = require("./layer2/cart");
const { createOrder } = require("./layer3/orderProcessor");
const { resetStock, checkStock } = require("./layer1/inventory");

const PRODUCTS = {
  ITEM001: { name: "Laptop", price: 999.99 },
  ITEM002: { name: "Mouse", price: 29.99 },
  ITEM003: { name: "Keyboard", price: 79.99 },
};

function getProducts() {
  const result = {};
  for (const [id, product] of Object.entries(PRODUCTS)) {
    result[id] = {
      ...product,
      stock: checkStock(id),
    };
  }
  return result;
}

function isValidProduct(itemId) {
  return itemId in PRODUCTS;
}

function getProduct(itemId) {
  return PRODUCTS[itemId] || null;
}

function formatCart(cart) {
  if (cart.items.length === 0) {
    return { empty: true, items: [], subtotal: 0, discount: 0, total: 0 };
  }
  return {
    empty: false,
    items: cart.items.map(item => ({
      itemId: item.itemId,
      name: item.name,
      quantity: item.quantity,
      lineTotal: item.price * item.quantity,
    })),
    subtotal: getSubtotal(cart),
    discount: cart.discount,
    total: getTotal(cart),
  };
}

function addToCart(cart, itemId, quantity) {
  if (!isValidProduct(itemId)) {
    return { success: false, error: "Invalid product ID", cart };
  }
  if (quantity <= 0) {
    return { success: false, error: "Quantity must be positive", cart };
  }
  const product = getProduct(itemId);
  const updatedCart = addItem(
    cart,
    itemId,
    product.name,
    product.price,
    quantity,
  );
  return { success: true, cart: updatedCart, product, quantity };
}

function removeFromCart(cart, itemId) {
  const item = cart.items.find(i => i.itemId === itemId);
  if (!item) {
    return { success: false, error: "Item not in cart", cart };
  }
  const updatedCart = removeItem(cart, itemId);
  return { success: true, cart: updatedCart, removedItem: item };
}

function applyDiscount(cart, discountPercent) {
  if (discountPercent < 0 || discountPercent > 100) {
    return {
      success: false,
      error: "Discount must be between 0 and 100",
      cart,
    };
  }
  try {
    const updatedCart = applyCartDiscount(cart, discountPercent);
    return { success: true, cart: updatedCart, discount: discountPercent };
  } catch (err) {
    return { success: false, error: err.message, cart };
  }
}

function processOrder(cart, region, paymentMethod) {
  if (cart.items.length === 0) {
    return { success: false, error: "Cart is empty" };
  }
  try {
    const order = createOrder(
      cart,
      region.toUpperCase(),
      paymentMethod.toUpperCase(),
    );
    return { success: true, order, newCart: createCart() };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  PRODUCTS,
  createCart,
  resetStock,
  getProducts,
  isValidProduct,
  getProduct,
  formatCart,
  addToCart,
  removeFromCart,
  applyDiscount,
  processOrder,
};
