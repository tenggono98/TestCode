const router = require("express").Router();
const jwtAuth = require("../../middleware/jwtAuth.middleware");
const controller = require("./products.controller");


router.get("/", jwtAuth, controller.getProducts);

module.exports = router;
