const {
  checkStock,
  isInStock,
  reserveStock,
  releaseStock,
  resetStock,
} = require("../../src/layer1/inventory");

describe("Inventory Module", () => {
  // Reset stock before each test to ensure isolation
  beforeEach(() => {
    resetStock();
  });

  describe("checkStock", () => {
    test("should return stock for existing item", () => {
      expect(checkStock("ITEM001")).toBe(10);
    });

    test("should return 0 for non-existing item", () => {
      expect(checkStock("ITEM999")).toBe(0);
    });
  });

  describe("isInStock", () => {
    test("should return true when enough stock", () => {
      expect(isInStock("ITEM001", 5)).toBe(true);
    });

    test("should return true when exact stock", () => {
      expect(isInStock("ITEM001", 10)).toBe(true);
    });

    test("should return false when not enough stock", () => {
      expect(isInStock("ITEM001", 15)).toBe(false);
    });

    test("should return false for out of stock item", () => {
      expect(isInStock("ITEM003", 1)).toBe(false);
    });
  });

  describe("reserveStock", () => {
    test("should reduce stock when reserved", () => {
      reserveStock("ITEM001", 3);
      expect(checkStock("ITEM001")).toBe(7);
    });

    test("should throw error when insufficient stock", () => {
      expect(() => reserveStock("ITEM001", 15)).toThrow(
        "Insufficient stock for ITEM001",
      );
    });

    test("should throw error for out of stock item", () => {
      expect(() => reserveStock("ITEM003", 1)).toThrow(
        "Insufficient stock for ITEM003",
      );
    });
  });

  describe("releaseStock", () => {
    test("should increase stock when released", () => {
      releaseStock("ITEM001", 5);
      expect(checkStock("ITEM001")).toBe(15);
    });

    test("should add stock for new item", () => {
      releaseStock("ITEM999", 10);
      expect(checkStock("ITEM999")).toBe(10);
    });
  });
});
