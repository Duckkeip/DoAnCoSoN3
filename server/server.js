const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const payRoutes = require("./routes/pay");
const db = require("./config/db");
const adminRoutes = require("./routes/admin");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(express.json());

db();
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes); // 🔹 mount route giỏ hàng
app.use("/api/pay", payRoutes); // 🔹 mount route thanh toán

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});