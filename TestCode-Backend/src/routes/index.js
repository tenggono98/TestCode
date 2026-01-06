const router = require("express").Router();

router.use("/products", require("../modules/products/products.routes"));
router.use("/orders", require("../modules/orders/orders.routes"));

module.exports = router;
