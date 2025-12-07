const {
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
} = require("../src/app");

describe("App Module", () => {
  beforeEach(() => {
    resetStock();
  });

  describe("getProducts", () => {
    test("should return all products with stock", () => {
      const products = getProducts();
      expect(products.ITEM001).toBeDefined();
      expect(products.ITEM001.name).toBe("Laptop");
      expect(products.ITEM001.price).toBe(999.99);
      expect(products.ITEM001.stock).toBe(10);
    });

    test("should show correct stock for out-of-stock item", () => {
      const products = getProducts();
      expect(products.ITEM003.stock).toBe(0);
    });
  });

  describe("isValidProduct", () => {
    test("should return true for existing product", () => {
      expect(isValidProduct("ITEM001")).toBe(true);
      expect(isValidProduct("ITEM002")).toBe(true);
    });

    test("should return false for non-existing product", () => {
      expect(isValidProduct("ITEM999")).toBe(false);
      expect(isValidProduct("")).toBe(false);
    });
  });

  describe("getProduct", () => {
    test("should return product details", () => {
      const product = getProduct("ITEM001");
      expect(product.name).toBe("Laptop");
      expect(product.price).toBe(999.99);
    });

    test("should return null for invalid product", () => {
      expect(getProduct("ITEM999")).toBeNull();
    });
  });

  describe("formatCart", () => {
    test("should format empty cart", () => {
      const cart = createCart();
      const formatted = formatCart(cart);
      expect(formatted.empty).toBe(true);
      expect(formatted.items).toHaveLength(0);
      expect(formatted.total).toBe(0);
    });

    test("should format cart with items", () => {
      let cart = createCart();
      const result = addToCart(cart, "ITEM001", 2);
      const formatted = formatCart(result.cart);

      expect(formatted.empty).toBe(false);
      expect(formatted.items).toHaveLength(1);
      expect(formatted.items[0].itemId).toBe("ITEM001");
      expect(formatted.items[0].name).toBe("Laptop");
      expect(formatted.items[0].quantity).toBe(2);
      expect(formatted.items[0].lineTotal).toBe(1999.98);
    });
  });

  describe("addToCart", () => {
    test("should add valid product to cart", () => {
      const cart = createCart();
      const result = addToCart(cart, "ITEM001", 2);

      expect(result.success).toBe(true);
      expect(result.cart.items).toHaveLength(1);
      expect(result.product.name).toBe("Laptop");
      expect(result.quantity).toBe(2);
    });

    test("should fail for invalid product", () => {
      const cart = createCart();
      const result = addToCart(cart, "ITEM999", 1);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid product ID");
    });

    test("should fail for zero quantity", () => {
      const cart = createCart();
      const result = addToCart(cart, "ITEM001", 0);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Quantity must be positive");
    });

    test("should fail for negative quantity", () => {
      const cart = createCart();
      const result = addToCart(cart, "ITEM001", -1);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Quantity must be positive");
    });
  });

  describe("removeFromCart", () => {
    test("should remove existing item from cart", () => {
      let cart = createCart();
      cart = addToCart(cart, "ITEM001", 1).cart;
      cart = addToCart(cart, "ITEM002", 2).cart;

      const result = removeFromCart(cart, "ITEM001");

      expect(result.success).toBe(true);
      expect(result.cart.items).toHaveLength(1);
      expect(result.removedItem.name).toBe("Laptop");
    });

    test("should fail for item not in cart", () => {
      let cart = createCart();
      cart = addToCart(cart, "ITEM001", 1).cart;

      const result = removeFromCart(cart, "ITEM002");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Item not in cart");
    });
  });

  describe("applyDiscount", () => {
    test("should apply valid discount", () => {
      let cart = createCart();
      cart = addToCart(cart, "ITEM001", 1).cart;

      const result = applyDiscount(cart, 10);

      expect(result.success).toBe(true);
      expect(result.cart.discount).toBe(10);
      expect(result.discount).toBe(10);
    });

    test("should fail for discount over 100", () => {
      let cart = createCart();
      cart = addToCart(cart, "ITEM001", 1).cart;

      const result = applyDiscount(cart, 150);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Discount must be between 0 and 100");
    });

    test("should fail for negative discount", () => {
      let cart = createCart();
      cart = addToCart(cart, "ITEM001", 1).cart;

      const result = applyDiscount(cart, -10);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Discount must be between 0 and 100");
    });

    test("should fail for empty cart", () => {
      const cart = createCart();
      const result = applyDiscount(cart, 10);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Cannot apply discount to empty cart");
    });
  });

  describe("processOrder", () => {
    test("should process valid order", () => {
      let cart = createCart();
      cart = addToCart(cart, "ITEM001", 1).cart;

      const result = processOrder(cart, "BD", "CREDIT_CARD");

      expect(result.success).toBe(true);
      expect(result.order.orderId).toMatch(/^ORD-\d+$/);
      expect(result.order.status).toBe("COMPLETED");
      expect(result.newCart.items).toHaveLength(0);
    });

    test("should fail for empty cart", () => {
      const cart = createCart();
      const result = processOrder(cart, "BD", "CREDIT_CARD");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Cart is empty");
    });

    test("should fail for invalid region", () => {
      let cart = createCart();
      cart = addToCart(cart, "ITEM001", 1).cart;

      const result = processOrder(cart, "INVALID", "CREDIT_CARD");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Unknown region");
    });

    test("should fail for invalid payment method", () => {
      let cart = createCart();
      cart = addToCart(cart, "ITEM001", 1).cart;

      const result = processOrder(cart, "BD", "CASH");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid payment method");
    });

    test("should fail for out of stock item", () => {
      let cart = createCart();
      cart = addToCart(cart, "ITEM003", 1).cart;

      const result = processOrder(cart, "BD", "CREDIT_CARD");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Insufficient stock");
    });
  });
});
