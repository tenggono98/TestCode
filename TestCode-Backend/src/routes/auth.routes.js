const router = require("express").Router();
const basicAuth = require("../middleware/basicAuth.middleware");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

router.post("/login", basicAuth, (req, res) => {
  const token = jwt.sign(
    {
      userId: req.user.id,
      roles: req.user.roles
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

  res.json({
    accessToken: token,
    tokenType: "Bearer",
    expiresIn: jwtConfig.expiresIn
  });
});

module.exports = router;
