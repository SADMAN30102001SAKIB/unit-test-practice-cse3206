const {
  createCart,
  addItem,
  removeItem,
  getSubtotal,
  applyCartDiscount,
  getTotal,
} = require("../../src/layer2/cart");

describe("Cart Module", () => {
  describe("createCart", () => {
    test("should create empty cart", () => {
      const cart = createCart();
      expect(cart.items).toEqual([]);
      expect(cart.discount).toBe(0);
    });
  });

  describe("addItem", () => {
    test("should add item to empty cart", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Laptop", 999.99, 1);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].name).toBe("Laptop");
    });

    test("should increase quantity for existing item", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Laptop", 999.99, 1);
      cart = addItem(cart, "ITEM001", "Laptop", 999.99, 2);
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(3);
    });

    test("should add multiple different items", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Laptop", 999.99, 1);
      cart = addItem(cart, "ITEM002", "Mouse", 29.99, 2);
      expect(cart.items).toHaveLength(2);
    });
  });

  describe("removeItem", () => {
    test("should remove item from cart", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Laptop", 999.99, 1);
      cart = addItem(cart, "ITEM002", "Mouse", 29.99, 2);
      cart = removeItem(cart, "ITEM001");
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].itemId).toBe("ITEM002");
    });

    test("should handle removing non-existing item", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Laptop", 999.99, 1);
      cart = removeItem(cart, "ITEM999");
      expect(cart.items).toHaveLength(1);
    });
  });

  describe("getSubtotal", () => {
    test("should return 0 for empty cart", () => {
      const cart = createCart();
      expect(getSubtotal(cart)).toBe(0);
    });

    test("should calculate subtotal correctly", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Laptop", 100, 2);
      cart = addItem(cart, "ITEM002", "Mouse", 50, 3);
      expect(getSubtotal(cart)).toBe(350);
    });
  });

  describe("applyCartDiscount", () => {
    test("should set discount on cart", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Item", 100, 1);
      cart = applyCartDiscount(cart, 15);
      expect(cart.discount).toBe(15);
    });

    test("should throw error for empty cart", () => {
      const cart = createCart();
      expect(() => applyCartDiscount(cart, 10)).toThrow(
        "Cannot apply discount to empty cart",
      );
    });
  });

  describe("getTotal", () => {
    test("should return subtotal when no discount", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Item", 100, 1);
      expect(getTotal(cart)).toBe(100);
    });

    test("should apply discount to subtotal", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Item", 100, 1);
      cart = applyCartDiscount(cart, 20);
      expect(getTotal(cart)).toBe(80);
    });

    test("should round currency correctly", () => {
      let cart = createCart();
      cart = addItem(cart, "ITEM001", "Item", 33.33, 3);
      cart = applyCartDiscount(cart, 10);
      expect(getTotal(cart)).toBe(89.99);
    });
  });
});
