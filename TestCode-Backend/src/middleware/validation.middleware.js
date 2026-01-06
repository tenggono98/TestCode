const validateOrderInput = (req, res, next) => {
  const { items } = req.body;

  // Check items ada
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Items harus array dan tidak boleh kosong"
    });
  }

  // Validate setiap item
  for (let item of items) {
    if (!item.productId || !item.qty) {
      return res.status(400).json({
        success: false,
        message: "Setiap item harus punya productId dan qty"
      });
    }

    if (typeof item.qty !== 'number' || item.qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity harus angka dan minimal 1"
      });
    }
  }

  next();
};

module.exports = { validateOrderInput };
