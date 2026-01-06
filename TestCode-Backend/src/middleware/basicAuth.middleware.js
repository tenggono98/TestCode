const bcrypt = require("bcryptjs");
const db = require("../database");

// Untuk Dummy Data
// const user = {
//   id: 1,
//   username: "admin",
//   passwordHash: bcrypt.hashSync("password123", 10),
//   roles: ["ADMIN"]
// };

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Basic ")) {
    res.set("WWW-Authenticate", "Basic");
    return res.status(401).json({ message: "Basic Auth required" });
  }

    //   Untuk Dummy Data
    //   const base64 = auth.split(" ")[1];
    //   const [username, password] = Buffer.from(base64, "base64")
    //     .toString()
    //     .split(":");

    //   if (username !== user.username) {
    //     return res.status(401).json({ message: "Invalid credentials" });
    //   }

    //   const valid = bcrypt.compareSync(password, user.passwordHash);
    //   if (!valid) {
    //     return res.status(401).json({ message: "Invalid credentials" });
    //   }

    // req.user = {
    //     id: user.id,
    //     username: user.username,
    //     roles: user.roles
    //   };
    


    // Untuk Database
    const [email, password] = Buffer.from(
        auth.split(" ")[1],
        "base64"
      ).toString().split(":");
    
      const user = db.prepare(
        "SELECT * FROM users WHERE email = ?"
      ).get(email);
    
      if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    
      req.user = {
        id: user.id,
        email: user.email,
        roles: JSON.parse(user.roles)
      };


  next();
};
