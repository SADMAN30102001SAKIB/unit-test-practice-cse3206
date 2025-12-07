const { getTaxRate, calculateTax, addTax } = require("../../src/layer1/tax");

describe("Tax Module", () => {
  describe("getTaxRate", () => {
    test("should return correct rate for BD", () => {
      expect(getTaxRate("BD")).toBe(0.15);
    });

    test("should return correct rate for IN", () => {
      expect(getTaxRate("IN")).toBe(0.18);
    });

    test("should be case insensitive", () => {
      expect(getTaxRate("bd")).toBe(0.15);
      expect(getTaxRate("In")).toBe(0.18);
    });

    test("should throw error for unknown region", () => {
      expect(() => getTaxRate("XYZ")).toThrow("Unknown region: XYZ");
    });
  });

  describe("calculateTax", () => {
    test("should calculate 15% tax for BD", () => {
      expect(calculateTax(100, "BD")).toBe(15);
    });

    test("should calculate 18% tax for IN", () => {
      expect(calculateTax(100, "IN")).toBe(18);
    });

    test("should throw error for negative amount", () => {
      expect(() => calculateTax(-100, "BD")).toThrow(
        "Amount must be non-negative",
      );
    });
  });

  describe("addTax", () => {
    test("should add 15% tax for BD", () => {
      expect(addTax(100, "BD")).toBe(115);
    });

    test("should add 18% tax for IN", () => {
      expect(addTax(100, "IN")).toBe(118);
    });
  });
});
