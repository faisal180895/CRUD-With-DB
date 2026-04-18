const express = require("express");
require("dotenv").config();
const connectDB = require("./src/config/db");


const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const productRoutes = require("./src/routes/productRoute");

const app = express();
connectDB();

app.use(express.json());

app.use("/api/products", productRoutes);

app.listen(6000, () => console.log("Server running on 6000"));

module.exports = app;