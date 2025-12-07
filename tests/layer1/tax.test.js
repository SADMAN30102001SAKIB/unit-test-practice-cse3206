const { getTaxRate, calculateTax, addTax } = require("../../src/layer1/tax");

describe("Tax Module", () => {
  describe("getTaxRate", () => {
    test("should return correct rate for US", () => {
      expect(getTaxRate("US")).toBe(0.08);
    });

    test("should return correct rate for UK", () => {
      expect(getTaxRate("UK")).toBe(0.2);
    });

    test("should be case insensitive", () => {
      expect(getTaxRate("us")).toBe(0.08);
      expect(getTaxRate("Uk")).toBe(0.2);
    });

    test("should throw error for unknown region", () => {
      expect(() => getTaxRate("XYZ")).toThrow("Unknown region: XYZ");
    });
  });

  describe("calculateTax", () => {
    test("should calculate 8% tax for US", () => {
      expect(calculateTax(100, "US")).toBe(8);
    });

    test("should calculate 20% tax for UK", () => {
      expect(calculateTax(100, "UK")).toBe(20);
    });

    test("should return 0 for NONE region", () => {
      expect(calculateTax(100, "NONE")).toBe(0);
    });

    test("should throw error for negative amount", () => {
      expect(() => calculateTax(-100, "US")).toThrow(
        "Amount must be non-negative",
      );
    });
  });

  describe("addTax", () => {
    test("should add 8% tax for US", () => {
      expect(addTax(100, "US")).toBe(108);
    });

    test("should add 20% tax for UK", () => {
      expect(addTax(100, "UK")).toBe(120);
    });

    test("should return same amount for NONE region", () => {
      expect(addTax(100, "NONE")).toBe(100);
    });
  });
});
