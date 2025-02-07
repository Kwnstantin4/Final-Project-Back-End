const Order = require("../models/order.model");
const Product = require("../models/product.model"); // Βεβαιώσου ότι αυτό το αρχείο υπάρχει

// 📌 GET: Λήψη παραγγελιών χρήστη
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Σφάλμα κατά τη λήψη παραγγελιών.", error });
  }
};

// 📌 POST: Δημιουργία παραγγελίας
const createOrder = async (req, res) => {
  try {
    const { products, address, phone } = req.body;
    console.log("🆕 Νέα παραγγελία:", req.body);

    // ➤ Έλεγχος αν υπάρχει ο χρήστης
    console.log("🔍 User ID από το token:", req.user?.id);
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. No user found." });
    }

    // ➤ Έλεγχος αν η παραγγελία περιέχει προϊόντα
    if (!products || products.length === 0) {
      console.warn("⚠️ Προειδοποίηση: Δεν στάλθηκαν προϊόντα!");
      return res.status(400).json({ message: "Η παραγγελία πρέπει να περιέχει προϊόντα." });
    }

    console.log("🔄 Ανάκτηση προϊόντων από τη βάση...");

    // 📌 **ΣΥΓΧΩΝΕΥΣΗ ΠΡΟΪΟΝΤΩΝ ΜΕ ΙΔΙΟ `productId`**
    const mergedProducts = [];

products.forEach(p => {
  let existingProduct = mergedProducts.find(item => item.productId.toString() === p.productId.toString());
  
  if (existingProduct) {
    // ✅ Αν το προϊόν υπάρχει ήδη, αύξησε το quantity
    existingProduct.quantity += p.quantity;
  } else {
    // ✅ Αν δεν υπάρχει, πρόσθεσέ το κανονικά
    mergedProducts.push({ productId: p.productId, quantity: p.quantity });
  }
});

console.log("📦 Μετά τη συγχώνευση, τα προϊόντα:", mergedProducts);

    

    // 📌 Ανάκτηση των προϊόντων από τη βάση
    const productIds = mergedProducts.map(p => p.productId);
    const orderedProducts = await Product.find({ _id: { $in: productIds } }).select("name category cost");

    if (orderedProducts.length === 0) {
      console.error("❌ Δεν βρέθηκαν προϊόντα με αυτά τα IDs:", productIds);
      return res.status(400).json({ message: "Τα προϊόντα δεν υπάρχουν στη βάση δεδομένων." });
    }

    console.log("🔎 Προϊόντα που ανακτήθηκαν από τη βάση:", orderedProducts);

    // 📌 Δημιουργία αντικειμένων προϊόντων για την αποθήκευση
    const productsToSave = mergedProducts.map(p => {
      const foundProduct = orderedProducts.find(op => op._id.toString() === p.productId.toString());

      console.log(`🔍 Ψάχνω για προϊόν με ID: ${p.productId}`);
      console.log(`✅ Προϊόντα από τη βάση:`, orderedProducts);

      if (!foundProduct) {
        console.error(`❌ Προσοχή: Το προϊόν με ID ${p.productId} δεν βρέθηκε στη βάση!`);
      } else {
        console.log(`✅ Βρέθηκε προϊόν:`, foundProduct);
      }

      return {
        productId: p.productId,
        name: foundProduct?.name ?? "Μη διαθέσιμο προϊόν", // ✅ Χρησιμοποιούμε το σωστό πεδίο
        category: foundProduct?.category ?? "Unknown",
        cost: foundProduct?.cost ?? 0,
        quantity: p.quantity,
      };
    });

    
    console.log("✅ Προϊόντα που θα αποθηκευτούν στη βάση:", JSON.stringify(productsToSave, null, 2));

    // 📌 Υπολογισμός `totalCost`
    const totalCost = productsToSave.reduce((acc, item) => acc + (item.cost * item.quantity), 0);
    console.log("💰 Υπολογισμένο `totalCost`:", totalCost);

    // 📌 Δημιουργία νέας παραγγελίας
    const newOrder = new Order({
      userId: req.user.id,
      products: productsToSave,
      totalCost,
      address,
      phone,
    });

    // 📌 Αποθήκευση παραγγελίας στη βάση
    const savedOrder = await newOrder.save();
    console.log("✅ Παραγγελία αποθηκεύτηκε:", savedOrder);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Σφάλμα κατά την αποθήκευση παραγγελίας:", error);
    res.status(500).json({ message: "Σφάλμα στον διακομιστή", error: error.message });
  }
};

// 📌 Σωστή εξαγωγή
module.exports = {
  getUserOrders,
  createOrder,
};












