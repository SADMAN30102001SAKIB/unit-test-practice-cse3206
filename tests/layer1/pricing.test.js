const {
  calculateItemTotal,
  applyDiscount,
  roundCurrency,
} = require("../../src/layer1/pricing");

describe("Pricing Module", () => {
  describe("calculateItemTotal", () => {
    test("should calculate total for price and quantity", () => {
      expect(calculateItemTotal(10, 5)).toBe(50);
    });

    test("should return 0 when quantity is 0", () => {
      expect(calculateItemTotal(100, 0)).toBe(0);
    });

    test("should handle decimal prices", () => {
      expect(calculateItemTotal(9.99, 3)).toBeCloseTo(29.97);
    });

    test("should throw error for negative price", () => {
      expect(() => calculateItemTotal(-10, 5)).toThrow(
        "Price and quantity must be non-negative",
      );
    });

    test("should throw error for negative quantity", () => {
      expect(() => calculateItemTotal(10, -5)).toThrow(
        "Price and quantity must be non-negative",
      );
    });
  });

  describe("applyDiscount", () => {
    test("should apply 20% discount correctly", () => {
      expect(applyDiscount(100, 20)).toBe(80);
    });

    test("should return same amount for 0% discount", () => {
      expect(applyDiscount(100, 0)).toBe(100);
    });

    test("should return 0 for 100% discount", () => {
      expect(applyDiscount(100, 100)).toBe(0);
    });

    test("should throw error for discount over 100", () => {
      expect(() => applyDiscount(100, 150)).toThrow(
        "Discount must be between 0 and 100",
      );
    });

    test("should throw error for negative discount", () => {
      expect(() => applyDiscount(100, -10)).toThrow(
        "Discount must be between 0 and 100",
      );
    });
  });

  describe("roundCurrency", () => {
    test("should round to 2 decimal places", () => {
      expect(roundCurrency(10.456)).toBe(10.46);
    });

    test("should round down correctly", () => {
      expect(roundCurrency(10.454)).toBe(10.45);
    });

    test("should handle whole numbers", () => {
      expect(roundCurrency(100)).toBe(100);
    });
  });
});
