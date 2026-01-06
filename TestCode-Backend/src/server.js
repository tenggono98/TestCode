require("./config/env"); // MUST be FIRST

const app = require("./app");
const { port } = require("./config/env");

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
