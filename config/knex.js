const knex = require("knex");

const conn = knex({
  client: "mysql2",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "portfolio_edu",
  },
});

module.exports = conn;
