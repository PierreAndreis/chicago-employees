const routes = require("next-routes")();

[
  {
    name: "list",
    pattern: "/",
    page: "index"
  },
  {
    name: "employee",
    pattern: "/employee/:id",
    page: "employee"
  },
  {
    name: "new",
    pattern: "/new",
    page: "new"
  }
].map(r => routes.add(r));

module.exports = routes;
