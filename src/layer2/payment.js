const { addTax } = require("../layer1/tax");
const { roundCurrency } = require("../layer1/pricing");

const PAYMENT_METHODS = ["CREDIT_CARD", "DEBIT_CARD", "PAYPAL"];

function isValidPaymentMethod(method) {
  return PAYMENT_METHODS.includes(method);
}

function calculateFinalAmount(cartTotal, region) {
  const withTax = addTax(cartTotal, region);
  return roundCurrency(withTax);
}

function processPayment(amount, method) {
  if (!isValidPaymentMethod(method)) {
    throw new Error(`Invalid payment method: ${method}`);
  }
  if (amount <= 0) {
    throw new Error("Payment amount must be positive");
  }

  return {
    success: true,
    transactionId: `TXN-${Date.now()}`,
    amount,
    method,
  };
}

module.exports = {
  isValidPaymentMethod,
  calculateFinalAmount,
  processPayment,
  PAYMENT_METHODS,
};
