const express = require("express");
const { ObjectId } = require("mongodb");
const db = require("../config/db");

const router = express.Router();
/* ========== USER ========== */

// Lấy danh sách user
router.get("/users", async (req, res) => {
    const database = await db();
    const users = await database.collection("users").find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  });
  // Cập nhật trạng thái user
router.put("/users/:id/status", async (req, res) => {
    const { status } = req.body; // active | block
    await db.collection("users").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } }
    );
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
  
/* ===== PRODUCT ===== */

router.get("/products", async (req, res) => {
  const database = await db();
  const products = await database.collection("products").find().toArray();
  res.json(products);
});

router.post("/products", async (req, res) => {
  const database = await db();
  await database.collection("products").insertOne({
    ...req.body,
    createdAt: new Date()
  });
  res.json({ message: "Thêm sản phẩm thành công" });
});

router.put("/products/:id", async (req, res) => {
  const database = await db();
  await database.collection("products").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.json({ message: "Cập nhật sản phẩm thành công" });
});

router.delete("/products/:id", async (req, res) => {
  const database = await db();
  await database.collection("products").deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ message: "Xóa sản phẩm thành công" });
});

module.exports = router;
