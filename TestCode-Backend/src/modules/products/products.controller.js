const db = require("../../database");


exports.getProducts = (req, res) => {
  try {
    const products = db
      .prepare("SELECT id, name, price, qty FROM products")
      .all();
  
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
