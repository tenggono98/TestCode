require("dotenv").config();

// Optional validation - JWT_SECRET and PORT should be in docker-compose
// but we'll provide defaults for flexibility
const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your_secret_key_here_change_in_production"
};

module.exports = config;

