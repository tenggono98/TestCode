const db = require("./index");
const bcrypt = require("bcryptjs");

const passwordHash = bcrypt.hashSync("password123", 10);

// Buat User
db.prepare(`
INSERT OR IGNORE INTO users (email, password_hash, roles)
VALUES (?, ?, ?)
`).run("alfonso@gmail.com", passwordHash, JSON.stringify(["ADMIN"]));

// Buat Produk
db.prepare(`
INSERT OR IGNORE INTO products (name, price,qty)
VALUES
  ('Laptop', 1500, 10),
  ('Mouse', 20, 20),
  ('Keyboard', 50, 30)
`).run();

// Print Out Message
console.log("Database seeded");
