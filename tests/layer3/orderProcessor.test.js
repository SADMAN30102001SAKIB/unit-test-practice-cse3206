const {
  validateOrder,
  createOrder,
} = require("../../src/layer3/orderProcessor");
const {
  createCart,
  addItem,
  applyCartDiscount,
} = require("../../src/layer2/cart");
const { resetStock } = require("../../src/layer1/inventory");

describe("Order Processor Module", () => {
  beforeEach(() => {
    resetStock();
  });

  describe("validateOrder", () => {
    test("should return valid for cart with in-stock items", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Laptop", 999.99, 2);
      const result = validateOrder(cart, "BD", "CREDIT_CARD");
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("should return invalid for empty cart", () => {
      const cart = createCart();
      const result = validateOrder(cart, "BD", "CREDIT_CARD");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Cart is empty");
    });

    test("should return invalid for out of stock item", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM003", "Keyboard", 79.99, 1);
      const result = validateOrder(cart, "BD", "CREDIT_CARD");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Insufficient stock for Keyboard");
    });

    test("should return invalid for quantity exceeding stock", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Laptop", 999.99, 15);
      const result = validateOrder(cart, "BD", "CREDIT_CARD");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Insufficient stock for Laptop");
    });
  });

  describe("createOrder", () => {
    test("should create order successfully", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Laptop", 100, 2);
      const order = createOrder(cart, "BD", "CREDIT_CARD");

      expect(order.orderId).toMatch(/^ORD-\d+$/);
      expect(order.items).toHaveLength(1);
      expect(order.subtotal).toBe(200);
      expect(order.cartTotal).toBe(200);
      expect(order.finalAmount).toBe(230);
      expect(order.status).toBe("COMPLETED");
      expect(order.payment.success).toBe(true);
    });

    test("should apply discount correctly", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Laptop", 100, 1);
      cart = applyCartDiscount(cart, 10);
      const order = createOrder(cart, "BD", "CREDIT_CARD");

      expect(order.subtotal).toBe(100);
      expect(order.discount).toBe(10);
      expect(order.cartTotal).toBe(90);
      expect(order.finalAmount).toBe(103.5);
    });

    test("should throw error for empty cart", () => {
      const cart = createCart();
      expect(() => createOrder(cart, "BD", "CREDIT_CARD")).toThrow(
        "Cart is empty",
      );
    });

    test("should throw error for out of stock", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM003", "Keyboard", 79.99, 1);
      expect(() => createOrder(cart, "BD", "CREDIT_CARD")).toThrow(
        "Insufficient stock",
      );
    });

    test("should reduce stock after order", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Laptop", 100, 3);
      createOrder(cart, "BD", "CREDIT_CARD");

      let cart2 = createCart();
      cart2 = addItem(cart2, "ITEM001", "Laptop", 100, 8);
      expect(() => createOrder(cart2, "BD", "CREDIT_CARD")).toThrow(
        "Insufficient stock",
      );
    });

    test("should throw error for invalid payment method", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Laptop", 100, 1);
      expect(() => createOrder(cart, "BD", "CASH")).toThrow(
        "Invalid payment method",
      );
    });
  });
});
