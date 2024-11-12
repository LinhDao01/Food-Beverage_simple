require("dotenv").config();
const app = require("./src/app");
// Start server
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
