const db = require("../../database");

// Buat Order
exports.createOrder = (req, res) => {
  try {
    const { items } = req.body;

    // Validasi stok produk
    for (let item of items) {
      const product = db.prepare("SELECT qty FROM products WHERE id = ?").get(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produk dengan ID ${item.productId} tidak ditemukan`
        });
      }

      if (product.qty < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Stok produk tidak cukup. Tersedia: ${product.qty}, diminta: ${item.qty}`
        });
      }
    }

    // Create order
    const order = db.prepare(`
      INSERT INTO orders (user_id, created_at)
      VALUES (?, ?)
    `).run(req.user.id, new Date().toISOString());

    const orderId = order.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, qty)
      VALUES (?, ?, ?)
    `);

    const updateProduct = db.prepare(`
      UPDATE products SET qty = qty - ? WHERE id = ?
    `);

    const transaction = db.transaction(() => {
      items.forEach(item => {
        insertItem.run(orderId, item.productId, item.qty);
        updateProduct.run(item.qty, item.productId);
      });
    });

    transaction();

    res.status(201).json({
      success: true,
      message: "Order berhasil dibuat",
      data: { orderId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Orders
exports.getOrders = (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.id, o.created_at, u.email
      FROM orders o
      JOIN users u ON u.id = o.user_id
    `).all();

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


