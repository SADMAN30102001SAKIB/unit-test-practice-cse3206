const TAX_RATES = {
  US: 0.08,
  UK: 0.2,
  DE: 0.19,
  JP: 0.1,
  NONE: 0,
};

function getTaxRate(region) {
  const rate = TAX_RATES[region.toUpperCase()];
  if (rate === undefined) {
    throw new Error(`Unknown region: ${region}`);
  }
  return rate;
}

function calculateTax(amount, region) {
  if (amount < 0) {
    throw new Error("Amount must be non-negative");
  }
  const rate = getTaxRate(region);
  return amount * rate;
}

function addTax(amount, region) {
  return amount + calculateTax(amount, region);
}

module.exports = {
  getTaxRate,
  calculateTax,
  addTax,
  TAX_RATES,
};
