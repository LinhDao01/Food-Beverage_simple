const knex = require("../database/knex");

function userRepository() {
  return knex("users");
}

