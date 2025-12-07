const PRODUCTS = {
  ITEM001: { name: "Laptop", price: 999.99 },
  ITEM002: { name: "Mouse", price: 29.99 },
  ITEM003: { name: "Keyboard", price: 79.99 },
};

const stock = {
  ITEM001: 10,
  ITEM002: 5,
  ITEM003: 0,
};

function checkStock(itemId) {
  if (stock[itemId] === undefined) {
    return 0;
  }
  return stock[itemId];
}

function isInStock(itemId, quantity) {
  return checkStock(itemId) >= quantity;
}

function reserveStock(itemId, quantity) {
  if (!isInStock(itemId, quantity)) {
    throw new Error(`Insufficient stock for ${itemId}`);
  }
  stock[itemId] -= quantity;
  return true;
}

function releaseStock(itemId, quantity) {
  if (stock[itemId] === undefined) {
    stock[itemId] = 0;
  }
  stock[itemId] = stock[itemId] + quantity;
  return true;
}

function resetStock() {
  stock.ITEM001 = 10;
  stock.ITEM002 = 5;
  stock.ITEM003 = 0;
}

module.exports = {
  PRODUCTS,
  checkStock,
  isInStock,
  reserveStock,
  releaseStock,
  resetStock,
};
