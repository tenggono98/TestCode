const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwt");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "JWT required" });
  }

  try {
    req.user = jwt.verify(auth.split(" ")[1], secret);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
