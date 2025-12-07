const {
  isValidPaymentMethod,
  calculateFinalAmount,
  processPayment,
} = require("../../src/layer2/payment");

describe("Payment Module", () => {
  describe("isValidPaymentMethod", () => {
    test("should return true for CREDIT_CARD", () => {
      expect(isValidPaymentMethod("CREDIT_CARD")).toBe(true);
    });

    test("should return true for DEBIT_CARD", () => {
      expect(isValidPaymentMethod("DEBIT_CARD")).toBe(true);
    });

    test("should return true for PAYPAL", () => {
      expect(isValidPaymentMethod("PAYPAL")).toBe(true);
    });

    test("should return false for invalid method", () => {
      expect(isValidPaymentMethod("CASH")).toBe(false);
      expect(isValidPaymentMethod("BITCOIN")).toBe(false);
    });
  });

  describe("calculateFinalAmount", () => {
    test("should add US tax (8%)", () => {
      expect(calculateFinalAmount(100, "US")).toBe(108);
    });

    test("should add UK tax (20%)", () => {
      expect(calculateFinalAmount(100, "UK")).toBe(120);
    });

    test("should round currency correctly", () => {
      expect(calculateFinalAmount(99.99, "US")).toBe(107.99);
    });
  });

  describe("processPayment", () => {
    test("should process valid payment", () => {
      const result = processPayment(100, "CREDIT_CARD");
      expect(result.success).toBe(true);
      expect(result.amount).toBe(100);
      expect(result.method).toBe("CREDIT_CARD");
      expect(result.transactionId).toMatch(/^TXN-\d+$/);
    });

    test("should throw error for invalid payment method", () => {
      expect(() => processPayment(100, "CASH")).toThrow(
        "Invalid payment method: CASH",
      );
    });

    test("should throw error for zero amount", () => {
      expect(() => processPayment(0, "CREDIT_CARD")).toThrow(
        "Payment amount must be positive",
      );
    });

    test("should throw error for negative amount", () => {
      expect(() => processPayment(-50, "CREDIT_CARD")).toThrow(
        "Payment amount must be positive",
      );
    });
  });
});
