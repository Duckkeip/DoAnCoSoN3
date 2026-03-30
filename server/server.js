require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const payRoutes = require("./routes/pay");
const db = require("./config/db");
const adminRoutes = require("./routes/admin");
const orderRoutes = require("./routes/orders");

const path = require('path');


const app = express();
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(express.json());

db();
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/pay", payRoutes); 
app.use("/api/order", orderRoutes);


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});