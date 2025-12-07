const readline = require("readline");
const app = require("./app");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function displayProducts() {
  console.log("\n📦 Available Products:");
  console.log("------------------------");
  const products = app.getProducts();
  for (const [id, product] of Object.entries(products)) {
    console.log(
      `${id}: ${product.name} - $${product.price} (Stock: ${product.stock})`,
    );
  }
  console.log("------------------------\n");
}

function displayCart(cart) {
  const formatted = app.formatCart(cart);
  console.log("\n🛒 Your Cart:");
  console.log("------------------------");
  if (formatted.empty) {
    console.log("(empty)");
  } else {
    formatted.items.forEach(item => {
      console.log(
        `[${item.itemId}] ${item.name} x${item.quantity} - $${item.lineTotal}`,
      );
    });
    console.log(`Discount: ${formatted.discount}%`);
    console.log(`Total: $${formatted.total}`);
  }
  console.log("------------------------\n");
}

async function main() {
  console.log("🏪 Welcome to E-Commerce CLI!");
  console.log("================================\n");

  app.resetStock();
  let cart = app.createCart();

  while (true) {
    console.log(
      "Commands: [a]dd, [r]emove, [d]iscount, [c]art, [p]roducts, [o]rder, [q]uit",
    );
    const cmd = await prompt("> ");

    switch (cmd.toLowerCase()) {
      case "a":
      case "add":
        displayProducts();
        const itemId = await prompt("Enter item ID: ");
        const qty = parseInt(await prompt("Enter quantity: "), 10);
        const addResult = app.addToCart(cart, itemId, qty);
        if (addResult.success) {
          cart = addResult.cart;
          console.log(
            `✅ Added ${addResult.quantity}x ${addResult.product.name} to cart`,
          );
        } else {
          console.log(`❌ ${addResult.error}`);
        }
        break;

      case "r":
      case "remove":
        if (cart.items.length === 0) {
          console.log("❌ Cart is empty!");
          break;
        }
        displayCart(cart);
        const removeId = await prompt("Enter item ID to remove: ");
        const removeResult = app.removeFromCart(cart, removeId);
        if (removeResult.success) {
          cart = removeResult.cart;
          console.log(`✅ Removed ${removeResult.removedItem.name} from cart`);
        } else {
          console.log(`❌ ${removeResult.error}`);
        }
        break;

      case "d":
      case "discount":
        const disc = parseInt(await prompt("Enter discount %: "), 10);
        const discResult = app.applyDiscount(cart, disc);
        if (discResult.success) {
          cart = discResult.cart;
          console.log(`✅ Applied ${discResult.discount}% discount`);
        } else {
          console.log(`❌ ${discResult.error}`);
        }
        break;

      case "c":
      case "cart":
        displayCart(cart);
        break;

      case "p":
      case "products":
        displayProducts();
        break;

      case "o":
      case "order":
        if (cart.items.length === 0) {
          console.log("❌ Cart is empty!");
          break;
        }
        const region = await prompt("Enter region (BD/IN/JP/SG): ");
        const payMethod = await prompt(
          "Payment method (CREDIT_CARD/DEBIT_CARD/PAYPAL): ",
        );
        const orderResult = app.processOrder(cart, region, payMethod);
        if (orderResult.success) {
          const order = orderResult.order;
          console.log("\n✅ Order Placed Successfully!");
          console.log("==============================");
          console.log(`Order ID: ${order.orderId}`);
          console.log(`Subtotal: $${order.subtotal}`);
          console.log(`Discount: ${order.discount}%`);
          console.log(`After Discount: $${order.cartTotal}`);
          console.log(`Tax: $${order.tax.toFixed(2)}`);
          console.log(`Final Amount: $${order.finalAmount}`);
          console.log(`Transaction: ${order.payment.transactionId}`);
          console.log("==============================\n");
          cart = orderResult.newCart;
        } else {
          console.log(`❌ Order failed: ${orderResult.error}`);
        }
        break;

      case "q":
      case "quit":
        console.log("👋 Goodbye!");
        rl.close();
        return;

      default:
        console.log("Unknown command");
    }
  }
}

main();
