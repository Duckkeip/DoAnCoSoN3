const express = require("express");
const router = express.Router();
const connectDB = require("../config/db");

router.get("/user/:userId", async (req, res) => {
  try {
    const db = await connectDB();
    const userId = req.params.userId;

    const orders = await db
      .collection("donhang")
      .find({ user: userId })
      .sort({ createdAt: -1 }) 
      .toArray();

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Lỗi lấy đơn hàng:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;