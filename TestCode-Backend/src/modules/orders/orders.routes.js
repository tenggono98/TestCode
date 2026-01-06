const router = require("express").Router();
const jwtAuth = require("../../middleware/jwtAuth.middleware");
const { validateOrderInput } = require("../../middleware/validation.middleware");
const controller = require("./orders.controller");

router.post("/", jwtAuth, validateOrderInput, controller.createOrder);
router.get("/", jwtAuth, controller.getOrders);

module.exports = router;
