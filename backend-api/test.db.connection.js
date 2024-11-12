require("dotenv").config();

let knex = require("./src/database/knex.js");

knex
  .raw("SELECT 1")
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  })
  .finally(() => {
    knex.destroy(); // Close the connection pool when done
  });
