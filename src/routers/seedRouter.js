const express = require("express");
const { seedUser, seedProducts } = require("../controllers/seedController");
const seedRouter = express.Router();

seedRouter.get("/users", seedUser);
seedRouter.get("/products", seedProducts);

module.exports = seedRouter;
